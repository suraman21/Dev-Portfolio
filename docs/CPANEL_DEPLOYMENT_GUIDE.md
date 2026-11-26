# cPanel Shared Hosting Deployment Guide (`/public` + `/app` · Main Domain & Subdomain Ready)

Deploy the entire **Dev-Portfolio website + `/app` Admin Panel + PHP & MySQL backend** on **any cPanel main domain or subdomain** — with **zero Node.js on cPanel** and **zero `.env` files**.

All Next.js building happens automatically on **GitHub Actions (Node.js 22)**.

---

## Direct Folder & URL Structure

Upload the two built folders (`public/` and `app/`) into **any folder** on your cPanel account — for example `/home/cpaneluser/portfolio/` or `/home/cpaneluser/sub.yourdomain.com/`:

```text
/home/cpaneluser/portfolio/      <-- Put this anywhere (main domain OR subdomain!)
├── app/                         <-- Admin Panel PHP + MySQL backend (safely OUTSIDE webroot!)
│   ├── config.php               <-- Set MySQL DB + Admin login right here (NO .env file needed!)
│   ├── config/database.php
│   ├── src/Auth.php
│   ├── src/CmsRepository.php
│   ├── database/schema.sql
│   ├── database/seed.sql
│   ├── public/index.php
│   └── index.php
└── public/                      <-- Point your cPanel Domain OR Subdomain DocumentRoot directly here!
    ├── .htaccess                <-- Routes /api/* -> api.php -> ../app/index.php
    ├── api.php                  <-- 3-line bridge to ../app/index.php
    ├── index.html               <-- Website Home        (https://your-domain-or-sub/)
    ├── work/                    <-- Portfolio & Studies (https://your-domain-or-sub/work)
    ├── about/                   <-- About & Services    (https://your-domain-or-sub/about)
    ├── contact/                 <-- Contact Dropdown    (https://your-domain-or-sub/contact)
    ├── app/                     <-- Admin Panel UI      (https://your-domain-or-sub/app)
    ├── _next/                   <-- Static JS, CSS, self-hosted fonts
    ├── images/projects/         <-- Default product visuals
    └── uploads/                 <-- Writable folder for real images uploaded via /app
```

### Why This Structure Works Perfectly for Subdomains & Main Domains
- **Domain-agnostic**: All API (`/api/*`), media (`/uploads/*`), and Admin (`/app`) URLs are 100% relative — move between a subdomain (`portfolio.yourdomain.com`) and a main domain (`yourdomain.com`) with zero code changes!
- **Secure by default**: Because your domain/subdomain DocumentRoot points to `/public`, your database credentials in `app/config.php` are completely unreachable from the public internet.
- **No hidden `.env` files**: Edit `app/config.php` visibly right inside cPanel File Manager.

---

## Step 1 — Set PHP 8.1+ in cPanel (1 minute)

1. Log into **cPanel** → open **MultiPHP Manager** (or **Select PHP Version**).
2. Select your domain or subdomain and choose **PHP 8.1, 8.2, or 8.3** (recommended: **PHP 8.2+**).
3. Ensure standard extensions `pdo`, `pdo_mysql`, `fileinfo`, and `json` are enabled.

---

## Step 2 — Create Your MySQL Database in cPanel (2 minutes)

1. In cPanel, open **MySQL® Database Wizard**.
2. Create a database (e.g. `portfolio` → cPanel creates `cpaneluser_portfolio`).
3. Create a database user & strong password (e.g. `cpaneluser_portfolio_admin`).
4. Check **ALL PRIVILEGES** and click **Next Step**.

---

## Step 3 — Build on GitHub & Upload `/public` + `/app` (Choose Method A or B)

Every push to `main` (or manual click on **GitHub → Actions → Build & Deploy to cPanel Shared Hosting → Run workflow**) builds `public/` and `app/` automatically on GitHub using Node.js 22.

### Method A: Manual 1-Click ZIP Upload (Fastest for Subdomains)
1. Open your GitHub repo → **Actions** tab → click the latest **Build & Deploy to cPanel Shared Hosting** run.
2. Scroll to **Artifacts** and download **`cpanel-deploy-zip`** (gives you `cpanel-deploy.zip`).
3. In cPanel **File Manager**, create or open your project folder (for example `/home/cpaneluser/portfolio/`).
4. Upload `cpanel-deploy.zip` into that folder and click **Extract** → delete the `.zip` file.
   - You will now see two clean folders inside: **`public/`** and **`app/`**.

### Method B: Automatic Deploy via GitHub Actions FTPS
1. In GitHub → **Settings → Secrets and variables → Actions**, add:
   - `FTP_SERVER` → `ftp.yourdomain.com`
   - `FTP_USERNAME` → your cPanel FTP username
   - `FTP_PASSWORD` → your cPanel FTP password
   - `FTP_SERVER_DIR` → the parent folder on cPanel where `public/` and `app/` live (e.g. `/portfolio/` or `/subdomains/dev/`)
2. Every push to `main` will automatically build and sync `/public` and `/app` **without ever overwriting `app/config.php` or `public/uploads/`**!

---

## Step 4 — Point Your Domain or Subdomain Root to `/public`

1. In cPanel, open **Domains** (under *Domains*).
2. Click **Create A New Domain** (for a subdomain like `portfolio.yourdomain.com`) OR click **Manage** on your existing domain/subdomain.
3. Set **Document Root** directly to your **`/public`** folder — for example:
   - `portfolio/public` (full path `/home/cpaneluser/portfolio/public`)
4. Save!

> **Note for Main Domain (`public_html`):** If your hosting plan locks the primary domain strictly to `public_html` and won't let you change DocumentRoot, simply extract `public/` contents into `public_html/` and place `app/` directly inside `/home/cpaneluser/app/` (one level above `public_html/`) — `public_html/api.php` (`dirname(__DIR__) . '/app/index.php'`) will find `/home/cpaneluser/app/` automatically!

---

## Step 5 — Import MySQL Tables via phpMyAdmin (2 minutes)

1. In cPanel, open **phpMyAdmin**.
2. Click your database (e.g. `cpaneluser_portfolio`) in the left sidebar.
3. Open the **Import** tab:
   - First import **`app/database/schema.sql`** (creates all 11 tables — no `CREATE DATABASE` statements, 100% cPanel safe).
   - Second import **`app/database/seed.sql`** (or an exported `.sql` file downloaded from `/app → PHP & MySQL`).

---

## Step 6 — Set Your Database & Admin Login in `app/config.php` (No `.env` Needed!)

1. In cPanel **File Manager**, open **`app/config.php`** and click **Edit**.
2. Enter your cPanel MySQL credentials and your desired Admin Panel login:

```php
return [
    'db_host' => 'localhost',
    'db_port' => '3306',
    'db_name' => 'cpaneluser_portfolio',
    'db_user' => 'cpaneluser_portfolio_admin',
    'db_pass' => 'YOUR_MYSQL_PASSWORD',

    'admin_email' => 'you@yourdomain.com',
    'admin_password' => 'YOUR_STRONG_ADMIN_PASSWORD',

    'public_base_url' => '',
    'cors_origin' => '',
    'upload_dir' => '',
    'app_debug' => false,
];
```

3. Click **Save Changes**.
4. Confirm **`public/uploads/`** has permission **`0755`** so image uploads from `/app` save cleanly.

---

## Step 7 — Verify Everything Live!

Test these URLs on your domain or subdomain (e.g. `https://portfolio.yourdomain.com`):

1. **`https://your-domain-or-sub/api/health`**
   - Expected: `{"ok":true,"engine":"PHP 8.x + MySQL","timestamp":"..."}`
2. **`https://your-domain-or-sub/`**
   - Full live portfolio website!
3. **`https://your-domain-or-sub/contact/`**
   - Choose a service from the dropdown and send a test inquiry.
4. **`https://your-domain-or-sub/app`**
   - Opens your **Admin Panel**! Sign in with the `admin_email` and `admin_password` you set in `app/config.php`.
   - Confirm the badge reads **`PHP + MySQL Live`**, view your test contact submission in **Contact Inbox**, and click **Save Changes** once to persist all default projects, services, slides, and testimonials into MySQL.

---

## Troubleshooting

| Issue | Likely Cause | Fix |
| --- | --- | --- |
| `/api/health` returns `500` | Wrong DB credentials in `app/config.php` | Temporarily change `'app_debug' => true` in `app/config.php` to see the exact error message (set back to `false` afterward!). |
| `/api/health` returns `404` | `.htaccess` missing inside `public/` | Enable *Show Hidden Files* in File Manager Settings and verify `public/.htaccess` and `public/api.php` exist. |
| `/app` shows 404 | DocumentRoot not pointing to `/public` | Check **cPanel → Domains** and confirm DocumentRoot ends with `/public` (where `public/app/index.html` lives). |
| Image upload fails | `public/uploads/` permissions or `fileinfo` disabled | Set `public/uploads/` to `0755` and enable PHP `fileinfo` extension in cPanel. |
