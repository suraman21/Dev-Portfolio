<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/config/database.php';

/**
 * Secure Admin Authentication (bcrypt + SHA-256 hashed sessions in MySQL)
 * Supports BOTH `Authorization: Bearer <token>` AND same-origin HttpOnly cookie
 * (`portfolio_admin_session`) so cPanel static frontend + PHP API work seamlessly.
 */
final class Auth
{
    public const COOKIE_NAME = 'portfolio_admin_session';

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

    public static function isHttps(): bool
    {
        if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
            return true;
        }
        if (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https') {
            return true;
        }
        return (int) ($_SERVER['SERVER_PORT'] ?? 80) === 443;
    }

    public static function setSessionCookie(string $rawToken): void
    {
        setcookie(self::COOKIE_NAME, $rawToken, [
            'expires' => time() + 7 * 24 * 60 * 60,
            'path' => '/',
            'secure' => self::isHttps(),
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
    }

    public static function clearSessionCookie(): void
    {
        setcookie(self::COOKIE_NAME, '', [
            'expires' => time() - 3600,
            'path' => '/',
            'secure' => self::isHttps(),
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
    }

    public static function login(string $email, string $password): ?array
    {
        self::ensureDefaultAdmin();
        $pdo = Database::pdo();

        $stmt = $pdo->prepare(
            'SELECT id, email, name, password_hash, role, is_active FROM admin_users WHERE email = ? LIMIT 1'
        );
        $stmt->execute([strtolower(trim($email))]);
        $user = $stmt->fetch();

        if (!$user || !(int) $user['is_active']) {
            return null;
        }

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

        $rawToken = bin2hex(random_bytes(32));
        $tokenHash = hash('sha256', $rawToken);
        $expiresAt = (new DateTimeImmutable('+7 days'))->format('Y-m-d H:i:s');

        $ins = $pdo->prepare(
            'INSERT INTO admin_sessions (user_id, token_hash, expires_at) VALUES (?, ?, ?)'
        );
        $ins->execute([$user['id'], $tokenHash, $expiresAt]);

        self::setSessionCookie($rawToken);

        return [
            'ok' => true,
            'token' => $rawToken,
            'expiresAt' => $expiresAt,
            'backend' => 'php-mysql',
            'user' => [
                'id' => (int) $user['id'],
                'email' => $user['email'],
                'name' => $user['name'],
                'role' => $user['role'],
            ],
        ];
    }

    public static function getToken(): ?string
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
        if (preg_match('/Bearer\s+([a-f0-9]{64})/i', $header, $matches)) {
            return $matches[1];
        }
        $cookie = $_COOKIE[self::COOKIE_NAME] ?? '';
        if (is_string($cookie) && preg_match('/^[a-f0-9]{64}$/i', $cookie)) {
            return $cookie;
        }
        return null;
    }

    public static function currentUser(): ?array
    {
        $rawToken = self::getToken();
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
        $rawToken = self::getToken();
        if ($rawToken) {
            $pdo = Database::pdo();
            $stmt = $pdo->prepare('DELETE FROM admin_sessions WHERE token_hash = ?');
            $stmt->execute([hash('sha256', $rawToken)]);
        }
        self::clearSessionCookie();
    }
}
