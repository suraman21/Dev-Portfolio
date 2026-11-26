# cPanel Shared Hosting Deployment Guide (`/public` + `/app` · `git clone` / `git pull` Ready)

Deploy the entire **Dev-Portfolio website + `/app` Admin Panel + PHP & MySQL backend** on **any cPanel main domain or subdomain** — with **zero Node.js on cPanel**, **zero `.env` files**, and **1-command `git pull` updates** right inside cPanel Terminal!

Every push to `main` automatically builds your production `/public` and `/app` folders on **GitHub Actions (Node.js 22)** and publishes them to the **`cpanel-deploy`** branch (plus a downloadable `cpanel-deploy.zip` artifact).

---

## Direct Folder & URL Structure

```text
/home/cpaneluser/portfolio/      <-- Put this anywhere (main domain OR subdomain!)
├── .gitignore                   <-- Protects app/config.php & public/uploads/* on every git pull!
├── app/                         <-- Admin Panel PHP + MySQL backend (safely OUTSIDE webroot!)
│   ├── config.example.php       <-- Template tracked in Git
│   ├── config.php               <-- YOUR MySQL DB + Admin login (untracked, zero .env needed!)
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

---

## Step 1 — Set PHP 8.1+ & Create MySQL Database in cPanel (3 minutes)

1. In cPanel → **MultiPHP Manager**, set your domain or subdomain to **PHP 8.1, 8.2, or 8.3** (recommended: **8.2+**).
2. In cPanel → **MySQL® Database Wizard**, create a database (e.g. `cpaneluser_portfolio`), a user (e.g. `cpaneluser_portfolio_admin`), and grant **ALL PRIVILEGES**.

---

## Step 2 — Deploy Files to cPanel (Choose Method A, B, or C)

### Method A: cPanel Terminal `git clone` & `git pull` (Fastest & Recommended!)

Because GitHub Actions builds Next.js and pushes the ready-to-serve `/public` + `/app` output to the **`cpanel-deploy`** branch, you never run `npm` or `next build` on cPanel!

#### First-Time Setup (run in cPanel → **Terminal**):
```bash
# Clone ONLY the pre-built cpanel-deploy branch into any folder (works for main domain or subdomain)
git clone -b cpanel-deploy --single-branch https://github.com/suraman21/Dev-Portfolio.git ~/portfolio

cd ~/portfolio

# Create your local config.php (ignored by Git so future git pulls never overwrite it!)
cp app/config.example.php app/config.php

# Ensure uploads folder is writable
chmod 755 public/uploads
```

> **If your GitHub repository is Private:**
> Run `ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N ""` in cPanel Terminal, copy `cat ~/.ssh/id_ed25519.pub` into GitHub → **Repo Settings → Deploy keys → Add deploy key** (read-only), and clone with SSH:
> `git clone -b cpanel-deploy --single-branch git@github.com:suraman21/Dev-Portfolio.git ~/portfolio`

#### Updating Later (1 Command, 2 Seconds, Zero Merge Conflicts!):
Whenever you merge changes into `main` on GitHub (wait ~50 seconds for the GitHub Action to finish), just run:
```bash
cd ~/portfolio && git pull
```
Your `app/config.php` database credentials and all uploaded images inside `public/uploads/` are protected by `.gitignore` and will **never** be overwritten or cause merge conflicts!

---

### Method B: Manual 1-Click ZIP Upload
1. Open GitHub → **Actions** → latest **Build & Deploy to cPanel Shared Hosting** run → download **`cpanel-deploy-zip`**.
2. Upload `cpanel-deploy.zip` into `/home/cpaneluser/portfolio/` via cPanel **File Manager**, click **Extract**, and delete the `.zip`.

### Method C: Automatic Deploy via GitHub Actions FTPS
1. Add GitHub Actions secrets `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, and optional `FTP_SERVER_DIR` (e.g. `/portfolio/`).
2. Every push to `main` syncs `/public` and `/app` automatically while excluding `app/config.php` and `public/uploads/**`.

---

## Step 3 — Point Your Domain or Subdomain Root to `/public`

1. In cPanel, open **Domains**.
2. Create your subdomain (e.g. `portfolio.yourdomain.com`) OR click **Manage** on an existing domain/subdomain.
3. Set **Document Root** directly to **`portfolio/public`** (`/home/cpaneluser/portfolio/public`) and save.

---

## Step 4 — Import MySQL Tables via phpMyAdmin (2 minutes)

1. Open cPanel → **phpMyAdmin** and select your database (`cpaneluser_portfolio`).
2. Open the **Import** tab:
   - First import **`app/database/schema.sql`** (creates all 11 tables — 100% cPanel safe, no `CREATE DATABASE`).
   - Second import **`app/database/seed.sql`** (or an exported `.sql` dump from `/app → PHP & MySQL`).

---

## Step 5 — Set Your Database & Admin Login in `app/config.php` (No `.env` Needed!)

Edit `~/portfolio/app/config.php` (using cPanel File Manager or `nano ~/portfolio/app/config.php`):

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

---

## Step 6 — Verify Everything Live!

1. **`https://your-domain-or-sub/api/health`** → `{"ok":true,"engine":"PHP 8.x + MySQL",...}`
2. **`https://your-domain-or-sub/`** → Live portfolio website!
3. **`https://your-domain-or-sub/contact/`** → Test the service dropdown & inquiry form.
4. **`https://your-domain-or-sub/app`** → Sign into your **Admin Panel** with your `app/config.php` login!

---

## Troubleshooting

| Issue | Likely Cause | Fix |
| --- | --- | --- |
| `/api/health` returns `500` | Missing or wrong `app/config.php` | Confirm `app/config.php` exists (`cp app/config.example.php app/config.php`), check DB credentials, or temporarily set `'app_debug' => true` to view the exact error. |
| `/api/health` returns `404` | `.htaccess` missing inside `public/` | Verify `public/.htaccess` and `public/api.php` exist (`ls -la ~/portfolio/public`). |
| `git pull` complains about local changes | An accidentally edited tracked file | Run `git status`; only `app/config.php` and `public/uploads/*` should differ (both are ignored). Run `git checkout -- . && git pull` to sync cleanly without touching `app/config.php` or uploads. |
| Image upload fails | `public/uploads/` permissions or `fileinfo` disabled | Run `chmod 755 ~/portfolio/public/uploads` and enable PHP `fileinfo` in cPanel. |
