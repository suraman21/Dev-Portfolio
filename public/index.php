<?php
declare(strict_types=1);

/**
 * Server-Side Live MySQL CMS Front Controller for cPanel Shared Hosting
 *
 * Because public HTML templates live in /public/_templates/ (and there is NO
 * /public/index.html), Apache & LiteSpeed are 100% guaranteed to execute this
 * script on every visit, reload, and hard refresh:
 *   1. Reads the clean zero-demo-data shell template from /public/_templates/
 *   2. Queries live MySQL via ../app/config.php + CmsRepository::getFullCms()
 *   3. Rewrites <title>, <meta name="description">, <link rel="icon">, and preloads
 *      your real uploaded profile image right in <head>
 *   4. Injects window.__PORTFOLIO_CMS__ synchronously so React paints your real
 *      Admin Panel data on frame 1 with ZERO flash of default demo data or images.
 */

$rawPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$cleanPath = rtrim($rawPath, '/') ?: '/';
if ($cleanPath === '/index.php' || $cleanPath === '/index.html') {
    $cleanPath = '/';
} elseif (str_ends_with($cleanPath, '/index.html')) {
    $cleanPath = substr($cleanPath, 0, -11) ?: '/';
}

$templatesDir = __DIR__ . '/_templates';
$statusCode = 200;
$htmlFile = null;
$matchedSlug = null;

if ($cleanPath === '/') {
    $htmlFile = $templatesDir . '/index.html';
} elseif ($cleanPath === '/about') {
    $htmlFile = $templatesDir . '/about/index.html';
} elseif ($cleanPath === '/work') {
    $htmlFile = $templatesDir . '/work/index.html';
} elseif ($cleanPath === '/contact') {
    $htmlFile = $templatesDir . '/contact/index.html';
} elseif (preg_match('#^/work/([^/]+)$#', $cleanPath, $m)) {
    $slug = rawurldecode($m[1]);
    if ($slug !== '' && !str_contains($slug, '..') && !str_contains($slug, '/') && !str_contains($slug, '\\')) {
        $matchedSlug = $slug;
        $exact = $templatesDir . '/work/' . $slug . '/index.html';
        $fallback = $templatesDir . '/work/_fallback/index.html';
        $htmlFile = is_file($exact) ? $exact : $fallback;
    }
}

if ($htmlFile === null || !is_file($htmlFile)) {
    $statusCode = 404;
    $htmlFile = is_file($templatesDir . '/404.html')
        ? ($templatesDir . '/404.html')
        : ($templatesDir . '/index.html');
}

$html = @file_get_contents($htmlFile);
if ($html === false) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Unable to read site template.';
    exit;
}

// Load live CMS data directly from MySQL via ../app (graceful fallback if DB not configured yet)
$cms = null;
$cmsHeaderStatus = 'fallback';
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
            $cmsHeaderStatus = 'mysql-injected';
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
    $profileImg = trim((string) ($site['profileImage'] ?? ''));
    $faviconUrl = trim((string) ($site['faviconUrl'] ?? '/images/favicons/code-brackets.svg'));
    if ($faviconUrl === '') {
        $faviconUrl = '/images/favicons/code-brackets.svg';
    }

    // Rewrite <title> & <meta name="description"> server-side from live MySQL data
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

    // Preload real user profile image + inject live MySQL CMS synchronously into <head>
    $headInject = '';
    if ($profileImg !== '') {
        $safeProfile = htmlspecialchars($profileImg, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $headInject .= '<link rel="preload" as="image" href="' . $safeProfile . '"/>';
    }

    $encodedCms = json_encode(
        $cms,
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT
    );
    if (is_string($encodedCms)) {
        $headInject .= '<script id="__portfolio_cms_bootstrap__">window.__PORTFOLIO_CMS__=' . $encodedCms . ';window.__PORTFOLIO_BACKEND__="php-mysql";</script>';
    }

    if ($headInject !== '') {
        $headEndPos = stripos($html, '</head>');
        if ($headEndPos !== false) {
            $html = substr_replace($html, $headInject, $headEndPos, 0);
        } else {
            $html = $headInject . $html;
        }
    }
}

http_response_code($statusCode);
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('X-LiteSpeed-Cache-Control: no-cache');
header('X-Portfolio-CMS: ' . $cmsHeaderStatus);
echo $html;
