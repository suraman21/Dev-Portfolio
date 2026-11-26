import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = process.cwd();
const APP_API_DIR = path.join(ROOT, "src", "app", "api");
const TEMP_API_DIR = path.join(ROOT, ".tmp-next-api-backup");
const OUT_DIR = path.join(ROOT, "out");
const PHP_BACKEND_DIR = path.join(ROOT, "php-backend");
const DIST_DIR = path.join(ROOT, "cpanel-dist");

const ROOT_HTACCESS = `# ============================================================================
# Dev-Portfolio — cPanel Shared Hosting Apache Rules (Zero Node.js Required!)
# Frontend: Pre-built Next.js Static Bundle (built via GitHub Actions)
# Backend : PHP 8.1+ & MySQL 8/MariaDB in /api/
# ============================================================================

Options -Indexes
RewriteEngine On

# 1. Enforce HTTPS automatically (uncomment once AutoSSL is active in cPanel)
# RewriteCond %{HTTPS} !=on
# RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# 2. Block direct web access to PHP secrets, config, source, and SQL files
RewriteRule ^api/(\\.env|config|src|database|docker-compose\\.yml|README\\.md) - [F,L]
RewriteRule ^\\.env - [F,L]

# 3. Route all /api/* requests to the PHP + MySQL router
RewriteRule ^api(/.*)?$ api/public/index.php [QSA,L]

# 4. Serve existing files, directories, and uploaded images directly
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# 5. Dynamic Case Studies created in Admin Panel -> serve static fallback shell
RewriteRule ^work/([^/]+)/?$ /work/_fallback/index.html [L]

# 6. Clean fallback to static 404 page
ErrorDocument 404 /404.html

# 7. Performance caching for immutable Next.js static assets
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
      if (entry === ".DS_Store" || entry === ".env") continue;
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

console.log("==> Building static Next.js frontend + PHP/MySQL bundle for cPanel...");

let movedApi = false;
try {
  // Clean previous outputs
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
  fs.rmSync(path.join(ROOT, ".next"), { recursive: true, force: true });

  // Temporarily hide Next.js API route handlers so `output: "export"` succeeds cleanly
  // (On cPanel, Apache routes `/api/*` straight to `php-backend/public/index.php`!)
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

  // 1. Copy static Next.js export into cpanel-dist/
  copyRecursive(OUT_DIR, DIST_DIR);

  // 2. Copy PHP + MySQL backend into cpanel-dist/api/
  copyRecursive(PHP_BACKEND_DIR, path.join(DIST_DIR, "api"));

  // 3. Create writable uploads/ folder with hardened .htaccess
  const uploadsDir = path.join(DIST_DIR, "uploads");
  fs.mkdirSync(uploadsDir, { recursive: true });
  fs.writeFileSync(path.join(uploadsDir, ".htaccess"), UPLOADS_HTACCESS, "utf8");

  // 4. Write root cPanel .htaccess
  fs.writeFileSync(path.join(DIST_DIR, ".htaccess"), ROOT_HTACCESS, "utf8");

  console.log("\n✅ cPanel bundle ready at ./cpanel-dist/");
  console.log("   Upload the contents of ./cpanel-dist/ into your cPanel public_html/ folder.");
} finally {
  // Always restore Next.js API routes even if build fails
  if (movedApi && fs.existsSync(TEMP_API_DIR)) {
    fs.renameSync(TEMP_API_DIR, APP_API_DIR);
  }
}
