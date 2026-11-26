<?php
declare(strict_types=1);

/**
 * Lightweight .env loader + PDO MySQL 8 singleton connection.
 */
final class Database
{
    private static ?PDO $instance = null;
    private static bool $envLoaded = false;

    public static function loadEnv(?string $path = null): void
    {
        if (self::$envLoaded) {
            return;
        }
        $envFile = $path ?? dirname(__DIR__) . '/.env';
        if (is_file($envFile) && is_readable($envFile)) {
            $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            if ($lines !== false) {
                foreach ($lines as $line) {
                    $trimmed = trim($line);
                    if ($trimmed === '' || str_starts_with($trimmed, '#')) {
                        continue;
                    }
                    $parts = explode('=', $trimmed, 2);
                    if (count($parts) === 2) {
                        $key = trim($parts[0]);
                        $value = trim($parts[1], " \t\n\r\0\x0B\"'");
                        if (getenv($key) === false) {
                            putenv("$key=$value");
                            $_ENV[$key] = $value;
                        }
                    }
                }
            }
        }
        self::$envLoaded = true;
    }

    public static function env(string $key, string $default = ''): string
    {
        self::loadEnv();
        $val = getenv($key);
        return $val === false ? $default : (string) $val;
    }

    public static function pdo(): PDO
    {
        if (self::$instance instanceof PDO) {
            return self::$instance;
        }

        self::loadEnv();

        $host = self::env('DB_HOST', '127.0.0.1');
        $port = self::env('DB_PORT', '3306');
        $name = self::env('DB_NAME', 'dev_portfolio_cms');
        $user = self::env('DB_USER', 'root');
        $pass = self::env('DB_PASS', '');

        $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4', $host, $port, $name);

        self::$instance = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);

        return self::$instance;
    }
}
