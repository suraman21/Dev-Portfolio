# cPanel Shared Hosting Deployment Guide (GitHub Actions Build + PHP & MySQL)

This guide explains how to deploy the **entire Dev-Portfolio website + Admin Panel + PHP/MySQL backend** onto standard **cPanel Shared Hosting** — **without installing or running Node.js on cPanel**.

All Next.js compilation runs automatically on **GitHub Actions (Node.js 22)**, producing a clean static frontend merged with `php-backend/` and cPanel `.htaccess` rules. On cPanel, Apache serves your pre-built site and routes `/api/*` directly to **PHP 8.1+ & MySQL**.

---

## Architecture on cPanel (`public_html/`)

```text
public_html/
├── .htaccess                  # Routes /api/* -> PHP, protects api/.env, handles dynamic /work/<slug>
├── index.html                 # Pre-built Home page
├── work/                      # Pre-built Work index + Case Studies + _fallback shell
├── about/                     # Pre-built About page
├── contact/                   # Pre-built Contact page (submits to /api/contact -> MySQL)
├── admin/                     # Pre-built Full Admin Panel (reads/writes via /api/admin/* -> MySQL)
├── _next/                     # Static JS, CSS, self-hosted fonts
├── images/projects/           # Default product images
├── uploads/                   # Writable folder for real images uploaded in Admin Panel
└── api/                       # PHP 8.1+ & MySQL backend (from php-backend/)
    ├── .env                   # Created once on cPanel (never overwritten by GitHub Actions!)
    ├── config/database.php
    ├── src/Auth.php
    ├── src/CmsRepository.php
    ├── database/schema.sql
    ├── database/seed.sql
    └── public/index.php
```

---

## Step 1 — Check PHP Version in cPanel (2 minutes)

1. Log into **cPanel**.
2. Open **MultiPHP Manager** (or **Select PHP Version**).
3. Select your domain and set PHP to **PHP 8.1, 8.2, or 8.3** (recommended: **PHP 8.2+**).
4. In **Select PHP Version → Extensions**, make sure these standard extensions are enabled (almost always on by default):
   - `pdo`
   - `pdo_mysql`
   - `fileinfo` (used for secure image upload MIME validation)
   - `json`

---

## Step 2 — Create MySQL Database & User in cPanel (2 minutes)

1. In cPanel, open **MySQL® Database Wizard** (under *Databases*).
2. **Create a Database**: Enter a name like `portfolio` → cPanel creates `cpaneluser_portfolio`. Copy this exact name.
3. **Create Database User**: Enter a username like `portfolio_admin` (creates `cpaneluser_portfolio_admin`) and generate a strong password. Copy both!
4. **Add User to Database**: Check **ALL PRIVILEGES** and click **Next Step**.

---

## Step 3 — Build on GitHub & Deploy to cPanel (Choose Method A or B)

Every time you push to `main` (or click **Actions → Build & Deploy to cPanel Shared Hosting → Run workflow**), GitHub runs Node.js 22 and builds the complete cPanel bundle (`npm run build:cpanel`).

### Method A (Recommended): Automatic Deploy via GitHub Actions FTPS
Every push to `main` automatically builds on GitHub and uploads to your cPanel `public_html/` without touching your `api/.env` or `uploads/` folder!

1. In cPanel, open **FTP Accounts** and create an FTP account (or use your main cPanel FTP credentials). Note:
   - **FTP Server:** `ftp.yourdomain.com` (or your cPanel server IP/hostname)
   - **FTP Username:** e.g. `deploy@yourdomain.com` (or your cPanel username)
   - **FTP Password:** your FTP password
   - **Directory:** `/public_html/` (or `/` if the FTP account is already jailed to `public_html`)
2. In your GitHub repository, go to **Settings → Secrets and variables → Actions → New repository secret** and add:
   - `FTP_SERVER` → `ftp.yourdomain.com`
   - `FTP_USERNAME` → your FTP username
   - `FTP_PASSWORD` → your FTP password
   - `FTP_SERVER_DIR` *(optional)* → `/public_html/` (or `/` if FTP user root is already `public_html`)
3. Go to the **Actions** tab in GitHub → select **Build & Deploy to cPanel Shared Hosting** → click **Run workflow**.
4. Wait ~1–2 minutes for the green checkmark!

> **Safe Updates:** The workflow explicitly excludes `api/.env` and `uploads/**`, so future deployments will **never overwrite** your MySQL credentials or uploaded product images!

### Method B: Manual 1-Click ZIP Upload (Zero FTP Credentials Needed)
If you prefer uploading manually via cPanel File Manager:

1. In GitHub, open the **Actions** tab → click the latest **Build & Deploy to cPanel Shared Hosting** run.
2. Scroll down to **Artifacts** and download **`cpanel-deploy-zip`** (contains `cpanel-deploy.zip`).
3. In cPanel, open **File Manager** → open **`public_html/`**.
   - Click **Settings** (top right) and check **Show Hidden Files (dotfiles)** so you can see `.htaccess`.
4. Click **Upload** → upload `cpanel-deploy.zip`.
5. Right-click `cpanel-deploy.zip` → **Extract** into `public_html/` → delete `cpanel-deploy.zip`.

---

## Step 4 — Import MySQL Tables via phpMyAdmin (2 minutes)

1. In cPanel, open **phpMyAdmin**.
2. In the left sidebar, click your new database (e.g. `cpaneluser_portfolio`).
3. Click the **Import** tab at the top.
4. First, import **`php-backend/database/schema.sql`** (creates all 11 relational tables cleanly — no `CREATE DATABASE` statements, 100% cPanel safe).
5. Second, import **`php-backend/database/seed.sql`** (or import the `.sql` export file you downloaded from `/admin → PHP & MySQL → Export Live MySQL (.sql)`!).

---

## Step 5 — Configure `public_html/api/.env` on cPanel (2 minutes)

1. In cPanel **File Manager**, navigate to **`public_html/api/`**.
2. Create a new file named **`.env`** (make sure *Show Hidden Files* is enabled in File Manager Settings).
3. Right-click `.env` → **Edit** and paste your real cPanel MySQL & Admin credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cpaneluser_portfolio
DB_USER=cpaneluser_portfolio_admin
DB_PASS=your_strong_mysql_password_here

# Change these to your real Admin Panel login email & strong password!
ADMIN_EMAIL=you@yourdomain.com
ADMIN_PASSWORD=Use_A_Strong_Unique_Password_2026!

# Leave blank on same-domain cPanel hosting so uploaded images use `/uploads/...`
PUBLIC_BASE_URL=
CORS_ORIGIN=
APP_DEBUG=false
```

4. Click **Save Changes**.
5. Verify permissions on **`public_html/uploads/`** are **`0755`** (right-click → Change Permissions) so the Admin Panel can save uploaded product images.

> **Security Note:** The root `.htaccess` automatically blocks all external web requests to `api/.env`, `api/config/`, `api/src/`, and `api/database/` with HTTP `403 Forbidden`.

---

## Step 6 — Verify Everything Live!

Open these URLs in your browser:

1. **`https://yourdomain.com/api/health`**
   - Should return: `{"ok":true,"engine":"PHP 8.x + MySQL","timestamp":"..."}`
   - If you see `"ok": true`, PHP + MySQL are connected cleanly!
2. **`https://yourdomain.com/`**
   - Your full portfolio website loads with the 24 FPS 3D Hero, color-coded sticky slides, vertical-to-horizontal work showcase, and matching luxury footer.
3. **`https://yourdomain.com/contact/`**
   - Pick a service from the dropdown and send a test inquiry.
4. **`https://yourdomain.com/admin/`**
   - Log in with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `api/.env`.
   - Confirm the top badge shows **`PHP + MySQL Live`**, check your test message in **Contact Inbox**, and click **Save Changes** once to persist all initial projects/slides/testimonials into MySQL!
5. **Enable HTTPS Redirect**: Once cPanel **SSL/TLS Status (AutoSSL)** is active for your domain, uncomment the 2 HTTPS lines at the top of `public_html/.htaccess`.

---

## Troubleshooting Common cPanel Issues

| Issue | Likely Cause | Fix |
| --- | --- | --- |
| `/api/health` returns `500 Server error` | Wrong DB credentials in `api/.env` or `DB_HOST` | Temporarily set `APP_DEBUG=true` in `api/.env` to see the exact PDO message (remember to set back to `false`!). Most cPanel hosts use `DB_HOST=localhost` or `127.0.0.1`. |
| `/api/health` returns `404 Not Found` | `.htaccess` missing in `public_html/` | Enable *Show Hidden Files* in File Manager and confirm `.htaccess` was extracted directly inside `public_html/`. |
| phpMyAdmin `#1044 Access denied` | Trying to run `CREATE DATABASE` on shared hosting | Click your cPanel database in the left sidebar first, then import `schema.sql` and `seed.sql` (neither contains `CREATE DATABASE`). |
| Admin login fails after changing `api/.env` | Old seed row email differs from `ADMIN_EMAIL` | Either delete the old row in phpMyAdmin `admin_users` (PHP recreates it from `.env` on next login) or log in with `ADMIN_EMAIL`/`ADMIN_PASSWORD` matching `.env`. |
| Image upload fails in Admin Panel | `public_html/uploads/` not writable or `fileinfo` off | Set `public_html/uploads/` permissions to `0755` and enable `fileinfo` in cPanel *Select PHP Version*. |
