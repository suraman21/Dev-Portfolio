# PHP 8.1+ & MySQL 8 Backend for Dev-Portfolio Admin Panel

This folder becomes **`/app`** when built for cPanel (`npm run build:cpanel`), sitting cleanly beside **`/public`** (your website DocumentRoot).

## Zero `.env` Required — Configure in `config.php`

Edit **`config.php`** directly (deployed at `app/config.php` on cPanel):

```php
return [
    'db_host' => 'localhost',
    'db_port' => '3306',
    'db_name' => 'cpaneluser_portfolio',
    'db_user' => 'cpaneluser_portfolio_admin',
    'db_pass' => 'your_mysql_password',

    'admin_email' => 'admin@yourdomain.com',
    'admin_password' => 'your_strong_admin_password',

    'public_base_url' => '',
    'cors_origin' => '',
    'upload_dir' => '',
    'app_debug' => false,
];
```

## Quick Local Start (Docker)

```bash
cd php-backend
docker compose up -d
```

For full cPanel main-domain and subdomain deployment instructions, see **`docs/CPANEL_DEPLOYMENT_GUIDE.md`**.
