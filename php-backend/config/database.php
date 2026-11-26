<?php
declare(strict_types=1);

/**
 * Config Loader + PDO MySQL 8 / MariaDB Singleton Connection.
 * Reads directly from `app/config.php` (zero .env file required!).
 * Also honors OS environment variables if running inside Docker.
 */
final class Database
{
    private static ?PDO $instance = null;
    private static ?array $config = null;

    public static function loadConfig(): array
    {
        if (self::$config !== null) {
            return self::$config;
        }

        $configFile = dirname(__DIR__) . '/config.php';
        $loaded = [];
        if (is_file($configFile) && is_readable($configFile)) {
            $data = require $configFile;
            if (is_array($data)) {
                $loaded = $data;
            }
        }

        self::$config = $loaded;
        return self::$config;
    }

    public static function hasConfigFile(): bool
    {
        return is_file(dirname(__DIR__) . '/config.php');
    }

    /** Backwards-compatible alias kept for callers */
    public static function loadEnv(?string $path = null): void
    {
        self::loadConfig();
    }

    /**
     * Reads a setting from `config.php` first (lowercase key like `db_host`),
     * with fallback to OS environment variables (uppercase like `DB_HOST`) for Docker.
     */
    public static function env(string $key, string $default = ''): string
    {
        $cfg = self::loadConfig();
        $lowerKey = strtolower($key);

        // Allow Docker OS environment variables to override placeholder config values
        $osVal = getenv($key);
        if ($osVal !== false && $osVal !== '') {
            return (string) $osVal;
        }

        if (array_key_exists($lowerKey, $cfg)) {
            $val = $cfg[$lowerKey];
            if (is_bool($val)) {
                return $val ? 'true' : 'false';
            }
            return (string) $val;
        }

        return $default;
    }

    public static function pdo(): PDO
    {
        if (self::$instance instanceof PDO) {
            return self::$instance;
        }

        if (!self::hasConfigFile() && getenv('DB_HOST') === false) {
            throw new RuntimeException(
                'Missing app/config.php. Run `cp app/config.example.php app/config.php` and enter your cPanel MySQL credentials.'
            );
        }

        $host = self::env('DB_HOST', 'localhost');
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
