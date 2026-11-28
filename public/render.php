<?php
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
    if ($slug !== '' && !str_contains($slug, '..') && !str_contains($slug, '/') && !str_contains($slug, '\\')) {
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
            '#<meta\s+name="description"\s+content="[^"]*"\s*/?>#i',
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
        '#<link\s+rel="(?:shortcut\s+)?icon"[^>]*>#i',
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
