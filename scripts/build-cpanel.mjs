import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = process.cwd();
const APP_API_DIR = path.join(ROOT, "src", "app", "api");
const TEMP_API_DIR = path.join(ROOT, ".tmp-next-api-backup");
const OUT_DIR = path.join(ROOT, "out");
const PHP_BACKEND_DIR = path.join(ROOT, "php-backend");
const DIST_DIR = path.join(ROOT, "cpanel-dist");
const DIST_PUBLIC_DIR = path.join(DIST_DIR, "public");
const DIST_APP_DIR = path.join(DIST_DIR, "app");

const PUBLIC_API_BRIDGE = `<?php
declare(strict_types=1);

/**
 * Thin bridge inside /public that invokes the PHP + MySQL backend stored
 * securely outside webroot in ../app/index.php (using ../app/config.php).
 */
require_once dirname(__DIR__) . '/app/index.php';
`;

const PUBLIC_HTACCESS = `# ============================================================================
# Dev-Portfolio — Direct cPanel Main Domain & Subdomain Apache Rules
# Point your domain OR subdomain DocumentRoot directly to this /public folder!
#   - Website URL      : https://your-domain-or-subdomain/
#   - Admin Panel URL  : https://your-domain-or-subdomain/app
#   - PHP + MySQL API  : /api/* -> api.php -> ../app/index.php (uses ../app/config.php)
# ============================================================================

Options -Indexes
RewriteEngine On

# 1. Enforce HTTPS automatically (uncomment once AutoSSL is active in cPanel)
# RewriteCond %{HTTPS} !=on
# RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# 2. Route all /api/* requests to ../app/index.php via public/api.php bridge
RewriteRule ^api(/.*)?$ api.php [QSA,L]

# 3. Serve existing files, directories (including /app Admin UI), and /uploads/* directly
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# 4. Dynamic Case Studies created later in Admin Panel -> serve static fallback shell
RewriteRule ^work/([^/]+)/?$ /work/_fallback/index.html [L]

# 5. Clean fallback to static 404 page
ErrorDocument 404 /404.html

# 6. Performance caching for immutable Next.js static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType image/png "access plus 1 month"
  ExpiresByType image/jpeg "access plus 1 month"
  ExpiresByType image/webp "access plus 1 month"
  ExpiresByType image/svg+xml "access plus 1 month"
</IfModule>

<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
`;

const UPLOADS_HTACCESS = `# Security: Never allow PHP execution inside user-uploaded media folder
<FilesMatch "\\.(php|phtml|php3|php4|php5|php7|php8|phar)$">
  Require all denied
</FilesMatch>
Options -Indexes
`;

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      if (entry === ".DS_Store" || entry === ".env" || entry === ".env.example") continue;
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

console.log("==> Building cPanel /public (website) + /app (admin panel & PHP/MySQL) bundle...");

let movedApi = false;
try {
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
  fs.rmSync(path.join(ROOT, ".next"), { recursive: true, force: true });

  // Temporarily move Next.js API route handlers aside during static export
  // (On cPanel, Apache routes `/api/*` via `/public/api.php` -> `../app/index.php`!)
  if (fs.existsSync(APP_API_DIR)) {
    fs.rmSync(TEMP_API_DIR, { recursive: true, force: true });
    fs.renameSync(APP_API_DIR, TEMP_API_DIR);
    movedApi = true;
  }

  execSync("npx next build", {
    cwd: ROOT,
    stdio: "inherit",
    env: {
      ...process.env,
      NEXT_OUTPUT_EXPORT: "true",
    },
  });

  if (!fs.existsSync(OUT_DIR)) {
    throw new Error("Expected Next.js static export directory `out/` was not created.");
  }

  // 1. `/public` = Complete Website + `/app` Admin Panel UI
  copyRecursive(OUT_DIR, DIST_PUBLIC_DIR);
  fs.writeFileSync(path.join(DIST_PUBLIC_DIR, "api.php"), PUBLIC_API_BRIDGE, "utf8");
  fs.writeFileSync(path.join(DIST_PUBLIC_DIR, ".htaccess"), PUBLIC_HTACCESS, "utf8");

  // 2. `/public/uploads` = Writable media upload directory with hardened .htaccess
  const uploadsDir = path.join(DIST_PUBLIC_DIR, "uploads");
  fs.mkdirSync(uploadsDir, { recursive: true });
  fs.writeFileSync(path.join(uploadsDir, ".htaccess"), UPLOADS_HTACCESS, "utf8");

  // 3. `/app` = Admin Panel PHP + MySQL Backend + `config.php` (NO .env needed!)
  copyRecursive(PHP_BACKEND_DIR, DIST_APP_DIR);

  console.log("\n✅ cPanel bundle ready at ./cpanel-dist/");
  console.log("   - ./cpanel-dist/public/  -> Point your domain or subdomain DocumentRoot here!");
  console.log("   - ./cpanel-dist/app/     -> Admin Panel PHP/MySQL backend + app/config.php");
} finally {
  if (movedApi && fs.existsSync(TEMP_API_DIR)) {
    fs.renameSync(TEMP_API_DIR, APP_API_DIR);
  }
}
