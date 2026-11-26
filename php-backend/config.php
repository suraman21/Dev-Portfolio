<?php
/**
 * ============================================================================
 * Dev-Portfolio Admin Panel & Database Configuration (NO .env FILE NEEDED!)
 *
 * Edit this file directly in cPanel File Manager (`app/config.php`) with your
 * cPanel MySQL database credentials and your chosen Admin Panel login.
 *
 * Security: Because your domain/subdomain DocumentRoot points to `/public`,
 * this `/app/config.php` file sits safely outside the public webroot.
 * ============================================================================
 */

return [
    // 1. MySQL Database Connection (from cPanel -> MySQL Database Wizard)
    'db_host' => 'localhost',
    'db_port' => '3306',
    'db_name' => 'cpaneluser_portfolio',
    'db_user' => 'cpaneluser_portfolio_admin',
    'db_pass' => 'CHANGE_TO_YOUR_MYSQL_PASSWORD',

    // 2. Admin Panel Login Credentials (for https://your-domain-or-subdomain/app)
    // Automatically bcrypt-hashed into MySQL on first sign-in.
    'admin_email' => 'admin@sura.dev',
    'admin_password' => 'CHANGE_TO_A_STRONG_PASSWORD',

    // 3. Domain-Agnostic Defaults (leave blank so both main domains & subdomains work!)
    'public_base_url' => '',
    'cors_origin' => '',

    // 4. Uploads directory (auto-detects `../public/uploads` when empty)
    'upload_dir' => '',

    // 5. Set to true temporarily ONLY if debugging a DB connection error
    'app_debug' => false,
];
