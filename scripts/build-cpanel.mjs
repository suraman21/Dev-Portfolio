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

const PUBLIC_RENDER_BRIDGE = `<?php
declare(strict_types=1);

/**
 * Server-Side Live MySQL CMS Bootstrapper for cPanel Shared Hosting
 *
 * Serves every public page (/, /about, /work, /work/*, /contact) with:
 * 1. Live MySQL CMS JSON injected synchronously into window.__PORTFOLIO_CMS__
 * 2. Live <title>, <meta name="description">, and <link rel="icon"> rewritten server-side
 * 3. Cache-Control: no-store so reload / hard refresh ALWAYS shows your real Admin Panel data
 *    with ZERO flash of default demo text or default images.
 */

$rawPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$cleanPath = rtrim($rawPath, '/') ?: '/';
if ($cleanPath === '/index.html') {
    $cleanPath = '/';
} elseif (str_ends_with($cleanPath, '/index.html')) {
    $cleanPath = substr($cleanPath, 0, -11) ?: '/';
}

// Resolve static Next.js export HTML file safely (no path traversal)
$statusCode = 200;
$htmlFile = null;
$matchedSlug = null;

if ($cleanPath === '/') {
    $htmlFile = __DIR__ . '/index.html';
} elseif ($cleanPath === '/about') {
    $htmlFile = __DIR__ . '/about/index.html';
} elseif ($cleanPath === '/work') {
    $htmlFile = __DIR__ . '/work/index.html';
} elseif ($cleanPath === '/contact') {
    $htmlFile = __DIR__ . '/contact/index.html';
} elseif (preg_match('#^/work/([^/]+)$#', $cleanPath, $m)) {
    $slug = rawurldecode($m[1]);
    if ($slug !== '' && !str_contains($slug, '..') && !str_contains($slug, '/') && !str_contains($slug, '\\\\')) {
        $matchedSlug = $slug;
        $exact = __DIR__ . '/work/' . $slug . '/index.html';
        $fallback = __DIR__ . '/work/_fallback/index.html';
        $htmlFile = is_file($exact) ? $exact : $fallback;
    }
}

if ($htmlFile === null || !is_file($htmlFile)) {
    $statusCode = 404;
    $htmlFile = is_file(__DIR__ . '/404.html') ? __DIR__ . '/404.html' : (__DIR__ . '/index.html');
}

$html = @file_get_contents($htmlFile);
if ($html === false) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Unable to read site page.';
    exit;
}

// Load live CMS data directly from MySQL via ../app (graceful fallback if DB not configured yet)
$cms = null;
$appDir = dirname(__DIR__) . '/app';
if (
    is_file($appDir . '/config.php') &&
    is_file($appDir . '/config/database.php') &&
    is_file($appDir . '/src/CmsRepository.php')
) {
    try {
        require_once $appDir . '/config/database.php';
        require_once $appDir . '/src/CmsRepository.php';
        Database::loadEnv();
        $loaded = CmsRepository::getFullCms();
        if (is_array($loaded) && (!empty($loaded['site']) || !empty($loaded['projects']))) {
            $cms = $loaded;
        }
    } catch (Throwable $e) {
        $cms = null;
    }
}

if (is_array($cms)) {
    $site = is_array($cms['site'] ?? null) ? $cms['site'] : [];
    $projects = is_array($cms['projects'] ?? null) ? $cms['projects'] : [];

    $siteName = trim((string) ($site['name'] ?? ''));
    $siteRole = trim((string) ($site['role'] ?? ''));
    $heroDesc = trim((string) ($site['heroDescription'] ?? ''));
    $workEyebrow = trim((string) ($site['workPageEyebrow'] ?? 'Selected Work'));
    $faviconUrl = trim((string) ($site['faviconUrl'] ?? '/images/favicons/code-brackets.svg'));
    if ($faviconUrl === '') {
        $faviconUrl = '/images/favicons/code-brackets.svg';
    }

    // Rewrite <title> server-side so browser tabs, bookmarks, and link previews show live identity
    if ($siteName !== '') {
        $pageTitle = $siteRole !== '' ? ($siteName . ' — ' . $siteRole) : $siteName;
        if ($cleanPath === '/about') {
            $pageTitle = 'About · ' . $siteName;
        } elseif ($cleanPath === '/work') {
            $pageTitle = ($workEyebrow !== '' ? $workEyebrow : 'Selected Work') . ' · ' . $siteName;
        } elseif ($matchedSlug !== null) {
            $projTitle = 'Case Study';
            foreach ($projects as $proj) {
                if (is_array($proj) && ($proj['slug'] ?? '') === $matchedSlug && !empty($proj['title'])) {
                    $projTitle = (string) $proj['title'];
                    break;
                }
            }
            $pageTitle = $projTitle . ' · ' . $siteName;
        } elseif ($cleanPath === '/contact') {
            $pageTitle = 'Contact · ' . $siteName;
        }

        $safeTitle = htmlspecialchars($pageTitle, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $html = preg_replace_callback(
            '#<title>.*?</title>#is',
            static fn (): string => '<title>' . $safeTitle . '</title>',
            $html,
            1
        ) ?? $html;

        $metaDesc = trim(($siteRole !== '' ? ($siteName . ' — ' . $siteRole . '. ') : ($siteName . '. ')) . $heroDesc);
        $safeDesc = htmlspecialchars($metaDesc, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $html = preg_replace_callback(
            '#<meta\\s+name="description"\\s+content="[^"]*"\\s*/?>#i',
            static fn (): string => '<meta name="description" content="' . $safeDesc . '"/>',
            $html,
            1
        ) ?? $html;
    }

    // Rewrite <link rel="icon"> & <link rel="shortcut icon"> to live Admin Panel favicon
    $safeFavicon = htmlspecialchars($faviconUrl, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $lowerIcon = strtolower(preg_replace('/[?#].*$/', '', $faviconUrl) ?? '');
    $iconTypeAttr = '';
    if (str_ends_with($lowerIcon, '.svg')) {
        $iconTypeAttr = ' type="image/svg+xml"';
    } elseif (str_ends_with($lowerIcon, '.png')) {
        $iconTypeAttr = ' type="image/png"';
    } elseif (str_ends_with($lowerIcon, '.webp')) {
        $iconTypeAttr = ' type="image/webp"';
    } elseif (str_ends_with($lowerIcon, '.ico')) {
        $iconTypeAttr = ' type="image/x-icon"';
    }
    $html = preg_replace_callback(
        '#<link\\s+rel="(?:shortcut\\s+)?icon"[^>]*>#i',
        static fn (): string => '<link rel="icon" href="' . $safeFavicon . '"' . $iconTypeAttr . '/>',
        $html
    ) ?? $html;

    // Inject live MySQL CMS payload synchronously BEFORE React boots (0ms network wait!)
    // Uses substr_replace (NOT preg_replace) so "$" amounts like "$5,000" in JSON are never mangled.
    $encodedCms = json_encode(
        $cms,
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT
    );
    if (is_string($encodedCms)) {
        $bootstrapScript = '<script id="__portfolio_cms_bootstrap__">window.__PORTFOLIO_CMS__=' . $encodedCms . ';window.__PORTFOLIO_BACKEND__="php-mysql";</script>';
        $headEndPos = stripos($html, '</head>');
        if ($headEndPos !== false) {
            $html = substr_replace($html, $bootstrapScript, $headEndPos, 0);
        } else {
            $html = $bootstrapScript . $html;
        }
    }
}

http_response_code($statusCode);
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
echo $html;
`;

const PUBLIC_HTACCESS = `# ============================================================================
# Dev-Portfolio — Direct cPanel Main Domain & Subdomain Apache Rules
# Point your domain OR subdomain DocumentRoot directly to this /public folder!
#   - Website URL      : https://your-domain-or-subdomain/ (server-injected live MySQL CMS)
#   - Admin Panel URL  : https://your-domain-or-subdomain/app
#   - PHP + MySQL API  : /api/* -> api.php -> ../app/index.php (uses ../app/config.php)
# ============================================================================

Options -Indexes
DirectoryIndex render.php index.html
RewriteEngine On

# 1. Enforce HTTPS automatically (uncomment once AutoSSL is active in cPanel)
# RewriteCond %{HTTPS} !=on
# RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# 2. Never loop on PHP entrypoints
RewriteRule ^(render|api)\\.php$ - [L]

# 3. Route all /api/* requests to ../app/index.php via public/api.php bridge
RewriteRule ^api(/.*)?$ api.php [QSA,L]

# 4. Serve /app (Admin Panel), /admin, /uploads/*, /_next/*, /images/*, and non-HTML assets directly
RewriteRule ^(app|admin|uploads|_next|images)(/.*)?$ - [L]
RewriteCond %{REQUEST_FILENAME} -f
RewriteCond %{REQUEST_URI} !\\.(html?)$ [NC]
RewriteRule ^ - [L]

# 5. Route ALL public HTML pages (/, /about, /work, /work/*, /contact) through render.php
#    so live MySQL CMS data, <title>, <meta>, and favicon are injected SERVER-SIDE
#    (ZERO flash of default demo data on first visit, reload, or hard refresh!)
RewriteRule ^ render.php [QSA,L]

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

const CPANEL_GITIGNORE = `# Keep server-specific database credentials and uploaded media untouched by git pull
app/config.php
public/uploads/*
!public/uploads/.htaccess
.DS_Store
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

  // 1. `/public` = Complete Website + `/app` Admin Panel UI + Server-Side Live CMS Renderer
  copyRecursive(OUT_DIR, DIST_PUBLIC_DIR);
  fs.writeFileSync(path.join(DIST_PUBLIC_DIR, "api.php"), PUBLIC_API_BRIDGE, "utf8");
  fs.writeFileSync(path.join(DIST_PUBLIC_DIR, "render.php"), PUBLIC_RENDER_BRIDGE, "utf8");
  fs.writeFileSync(path.join(DIST_PUBLIC_DIR, ".htaccess"), PUBLIC_HTACCESS, "utf8");

  // 2. `/public/uploads` = Writable media upload directory with hardened .htaccess
  const uploadsDir = path.join(DIST_PUBLIC_DIR, "uploads");
  fs.mkdirSync(uploadsDir, { recursive: true });
  fs.writeFileSync(path.join(uploadsDir, ".htaccess"), UPLOADS_HTACCESS, "utf8");

  // 3. `/app` = Admin Panel PHP + MySQL Backend + `config.php` & `config.example.php` (NO .env needed!)
  copyRecursive(PHP_BACKEND_DIR, DIST_APP_DIR);
  const configSrc = path.join(DIST_APP_DIR, "config.php");
  if (fs.existsSync(configSrc)) {
    fs.copyFileSync(configSrc, path.join(DIST_APP_DIR, "config.example.php"));
  }

  // 4. `.gitignore` so `git pull` on cPanel never overwrites `app/config.php` or `public/uploads/*`
  fs.writeFileSync(path.join(DIST_DIR, ".gitignore"), CPANEL_GITIGNORE, "utf8");

  console.log("\n✅ cPanel bundle ready at ./cpanel-dist/");
  console.log("   - ./cpanel-dist/public/  -> Point your domain or subdomain DocumentRoot here!");
  console.log("   - ./cpanel-dist/public/render.php -> Server-side live MySQL CMS bootstrapper (0ms default flash!)");
  console.log("   - ./cpanel-dist/app/     -> Admin Panel PHP/MySQL backend + app/config.example.php");
} finally {
  if (movedApi && fs.existsSync(TEMP_API_DIR)) {
    fs.renameSync(TEMP_API_DIR, APP_API_DIR);
  }
}
