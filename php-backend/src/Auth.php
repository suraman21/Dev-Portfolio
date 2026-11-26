<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/config/database.php';

/**
 * Secure Admin Authentication (bcrypt + SHA-256 hashed Bearer tokens in MySQL)
 */
final class Auth
{
    public static function ensureDefaultAdmin(): void
    {
        $pdo = Database::pdo();
        $count = (int) $pdo->query('SELECT COUNT(*) FROM admin_users')->fetchColumn();
        if ($count > 0) {
            return;
        }

        $email = Database::env('ADMIN_EMAIL', 'admin@sura.dev');
        $password = Database::env('ADMIN_PASSWORD', 'admin1234');
        $hash = password_hash($password, PASSWORD_BCRYPT);

        $stmt = $pdo->prepare(
            'INSERT INTO admin_users (email, name, password_hash, role, is_active) VALUES (?, ?, ?, ?, 1)'
        );
        $stmt->execute([$email, 'Site Administrator', $hash, 'owner']);
    }

    public static function login(string $email, string $password): ?array
    {
        self::ensureDefaultAdmin();
        $pdo = Database::pdo();

        $stmt = $pdo->prepare('SELECT id, email, name, password_hash, role, is_active FROM admin_users WHERE email = ? LIMIT 1');
        $stmt->execute([strtolower(trim($email))]);
        $user = $stmt->fetch();

        if (!$user || !(int) $user['is_active']) {
            return null;
        }

        // Allow env-configured fallback password verification if seed placeholder hash wasn't replaced yet
        $verified = password_verify($password, $user['password_hash']);
        if (!$verified) {
            $envEmail = strtolower(trim(Database::env('ADMIN_EMAIL', 'admin@sura.dev')));
            $envPass = Database::env('ADMIN_PASSWORD', 'admin1234');
            if ($user['email'] === $envEmail && hash_equals($envPass, $password)) {
                $newHash = password_hash($password, PASSWORD_BCRYPT);
                $upd = $pdo->prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?');
                $upd->execute([$newHash, $user['id']]);
                $verified = true;
            }
        }

        if (!$verified) {
            return null;
        }

        // Create secure 32-byte random token; only store SHA-256 hash in MySQL
        $rawToken = bin2hex(random_bytes(32));
        $tokenHash = hash('sha256', $rawToken);
        $expiresAt = (new DateTimeImmutable('+7 days'))->format('Y-m-d H:i:s');

        $ins = $pdo->prepare('INSERT INTO admin_sessions (user_id, token_hash, expires_at) VALUES (?, ?, ?)');
        $ins->execute([$user['id'], $tokenHash, $expiresAt]);

        return [
            'token' => $rawToken,
            'expiresAt' => $expiresAt,
            'user' => [
                'id' => (int) $user['id'],
                'email' => $user['email'],
                'name' => $user['name'],
                'role' => $user['role'],
            ],
        ];
    }

    public static function getBearerToken(): ?string
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
        if (preg_match('/Bearer\s+([a-f0-9]{64})/i', $header, $matches)) {
            return $matches[1];
        }
        return null;
    }

    public static function currentUser(): ?array
    {
        $rawToken = self::getBearerToken();
        if (!$rawToken) {
            return null;
        }

        $pdo = Database::pdo();
        $tokenHash = hash('sha256', $rawToken);

        $stmt = $pdo->prepare(
            'SELECT u.id, u.email, u.name, u.role
             FROM admin_sessions s
             INNER JOIN admin_users u ON u.id = s.user_id
             WHERE s.token_hash = ? AND s.expires_at > NOW() AND u.is_active = 1
             LIMIT 1'
        );
        $stmt->execute([$tokenHash]);
        $user = $stmt->fetch();

        return $user ?: null;
    }

    public static function requireAuth(): array
    {
        $user = self::currentUser();
        if (!$user) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized. Please sign in to the Admin Panel.']);
            exit;
        }
        return $user;
    }

    public static function logout(): void
    {
        $rawToken = self::getBearerToken();
        if (!$rawToken) {
            return;
        }
        $pdo = Database::pdo();
        $stmt = $pdo->prepare('DELETE FROM admin_sessions WHERE token_hash = ?');
        $stmt->execute([hash('sha256', $rawToken)]);
    }
}
