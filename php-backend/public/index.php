<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/config/database.php';
require_once dirname(__DIR__) . '/src/Auth.php';
require_once dirname(__DIR__) . '/src/CmsRepository.php';

Database::loadEnv();

// Strict JSON + CORS headers (supports both same-domain cPanel and decoupled origins)
$allowedOrigin = Database::env('CORS_ORIGIN', '');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
if ($allowedOrigin !== '') {
    header("Access-Control-Allow-Origin: {$allowedOrigin}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function jsonResponse(array $data, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function readJsonBody(): array
{
    $raw = file_get_contents('php://input');
    if (!$raw) {
        return [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function resolveUploadDir(): string
{
    $configured = Database::env('UPLOAD_DIR', '');
    if ($configured !== '') {
        return rtrim($configured, '/');
    }
    // Primary cPanel layout: `/app` sibling to `/public` -> save images to `/public/uploads`
    $siblingPublicUploads = dirname(__DIR__, 2) . '/public/uploads';
    if (is_dir($siblingPublicUploads) || is_dir(dirname(__DIR__, 2) . '/public')) {
        return $siblingPublicUploads;
    }
    // Fallback layout if API lives inside webroot
    $rootUploads = dirname(__DIR__, 2) . '/uploads';
    if (is_dir($rootUploads)) {
        return $rootUploads;
    }
    return __DIR__ . '/uploads';
}

$method = $_SERVER['REQUEST_METHOD'];
$uriPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$uriPath = rtrim($uriPath, '/') ?: '/';

try {
    // 1. Health Check (Verifies live PHP + MySQL connection)
    if ($method === 'GET' && $uriPath === '/api/health') {
        Database::pdo()->query('SELECT 1');
        jsonResponse([
            'ok' => true,
            'engine' => 'PHP ' . PHP_VERSION . ' + MySQL',
            'timestamp' => gmdate('c'),
        ]);
    }

    // 2. Public Full CMS Read
    if ($method === 'GET' && $uriPath === '/api/cms') {
        jsonResponse(['data' => CmsRepository::getFullCms(), 'backend' => 'php-mysql']);
    }

    // 3. Public Contact Form Submission -> Stored in MySQL `contact_messages`
    if ($method === 'POST' && $uriPath === '/api/contact') {
        $body = readJsonBody();
        $name = trim((string) ($body['name'] ?? ''));
        $email = trim((string) ($body['email'] ?? ''));
        $serviceName = trim((string) ($body['serviceName'] ?? ''));

        if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            jsonResponse(['error' => 'Please enter a valid name and email address.'], 422);
        }
        if ($serviceName === '') {
            jsonResponse(['error' => 'Please select a service from the dropdown.'], 422);
        }

        $saved = CmsRepository::createMessage($body);
        jsonResponse(['ok' => true, 'message' => $saved], 201);
    }

    // 4. Admin Auth Endpoints
    if ($method === 'POST' && $uriPath === '/api/admin/login') {
        $body = readJsonBody();
        $result = Auth::login((string) ($body['email'] ?? ''), (string) ($body['password'] ?? ''));
        if (!$result) {
            jsonResponse(['error' => 'Invalid email or password.'], 401);
        }
        jsonResponse($result);
    }

    if ($method === 'POST' && $uriPath === '/api/admin/logout') {
        Auth::logout();
        jsonResponse(['ok' => true]);
    }

    if ($method === 'GET' && $uriPath === '/api/admin/me') {
        $user = Auth::currentUser();
        if (!$user) {
            jsonResponse(['authenticated' => false, 'backend' => 'php-mysql'], 401);
        }
        jsonResponse(['authenticated' => true, 'user' => $user, 'backend' => 'php-mysql']);
    }

    // 5. Protected CMS Save (Site, About, Services, Projects, Slides, Testimonials, Experience, Skills)
    if (($method === 'PUT' || $method === 'POST') && $uriPath === '/api/admin/cms') {
        Auth::requireAuth();
        $body = readJsonBody();
        $updated = CmsRepository::saveCms($body);
        jsonResponse(['ok' => true, 'data' => $updated, 'backend' => 'php-mysql']);
    }

    // 6. Protected Contact Inbox CRUD
    if ($method === 'GET' && $uriPath === '/api/admin/messages') {
        Auth::requireAuth();
        jsonResponse(['messages' => CmsRepository::listMessages()]);
    }

    if (preg_match('#^/api/admin/messages/([^/]+)$#', $uriPath, $m)) {
        Auth::requireAuth();
        $msgId = urldecode($m[1]);
        if ($method === 'PATCH') {
            $body = readJsonBody();
            $ok = CmsRepository::updateMessageStatus($msgId, (string) ($body['status'] ?? 'read'));
            jsonResponse(['ok' => $ok], $ok ? 200 : 404);
        }
        if ($method === 'DELETE') {
            $ok = CmsRepository::deleteMessage($msgId);
            jsonResponse(['ok' => $ok], $ok ? 200 : 404);
        }
    }

    // 7. Protected Multipart Real Image Upload -> Saved to /uploads/ + MySQL media_assets
    if ($method === 'POST' && $uriPath === '/api/admin/upload') {
        Auth::requireAuth();

        if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            jsonResponse(['error' => 'No valid image file received.'], 400);
        }

        $file = $_FILES['file'];
        $maxBytes = 8 * 1024 * 1024; // 8 MB
        if ($file['size'] > $maxBytes) {
            jsonResponse(['error' => 'Image exceeds 8MB limit.'], 413);
        }

        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($file['tmp_name']) ?: '';
        $origExt = strtolower((string) pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowedMimes = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            'image/gif' => 'gif',
            'image/avif' => 'avif',
            'image/svg+xml' => 'svg',
            'image/svg' => 'svg',
            'image/x-icon' => 'ico',
            'image/vnd.microsoft.icon' => 'ico',
        ];

        $ext = $allowedMimes[$mime] ?? null;
        if ($ext === null && $origExt === 'svg' && in_array($mime, ['text/plain', 'text/xml', 'application/xml', 'text/html'], true)) {
            $ext = 'svg';
            $mime = 'image/svg+xml';
        } elseif ($ext === null && $origExt === 'ico' && $mime === 'application/octet-stream') {
            $ext = 'ico';
            $mime = 'image/x-icon';
        }

        if ($ext === null) {
            jsonResponse(['error' => 'Unsupported image format. Use PNG, SVG, ICO, JPG, WebP, GIF, or AVIF.'], 415);
        }

        $uploadDir = resolveUploadDir();
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $safeBase = preg_replace('/[^a-zA-Z0-9_-]/', '-', pathinfo($file['name'], PATHINFO_FILENAME));
        $safeBase = trim((string) $safeBase, '-') ?: 'product-image';
        $filename = $safeBase . '-' . bin2hex(random_bytes(4)) . '.' . $ext;
        $destPath = $uploadDir . '/' . $filename;

        if ($ext === 'svg') {
            $rawSvg = file_get_contents($file['tmp_name']);
            if ($rawSvg === false || !preg_match('/<svg[\s>]/i', $rawSvg)) {
                jsonResponse(['error' => 'Invalid SVG file.'], 422);
            }
            $sanitizedSvg = preg_replace('/<script[\s\S]*?<\/script>/i', '', $rawSvg) ?? '';
            $sanitizedSvg = preg_replace('/<foreignObject[\s\S]*?<\/foreignObject>/i', '', $sanitizedSvg) ?? '';
            $sanitizedSvg = preg_replace('/\son[a-z]+\s*=\s*(?:"[^"]*"|\'[^\']*\'|[^\s>]+)/i', '', $sanitizedSvg) ?? '';
            $sanitizedSvg = preg_replace('/javascript:/i', '', $sanitizedSvg) ?? '';
            if (file_put_contents($destPath, $sanitizedSvg) === false) {
                jsonResponse(['error' => 'Failed to save uploaded SVG. Check uploads/ folder permissions.'], 500);
            }
            $savedSize = strlen($sanitizedSvg);
        } else {
            if (!move_uploaded_file($file['tmp_name'], $destPath)) {
                jsonResponse(['error' => 'Failed to save uploaded image. Check uploads/ folder permissions.'], 500);
            }
            $savedSize = (int) $file['size'];
        }

        $publicBase = rtrim(Database::env('PUBLIC_BASE_URL', ''), '/');
        $url = ($publicBase !== '' ? $publicBase : '') . '/uploads/' . $filename;

        $asset = CmsRepository::addMediaAsset([
            'id' => 'media-' . bin2hex(random_bytes(5)),
            'filename' => $filename,
            'url' => $url,
            'alt' => trim((string) ($_POST['alt'] ?? $safeBase)),
            'mimeType' => $mime,
            'sizeBytes' => $savedSize,
            'createdAt' => gmdate('c'),
        ]);

        jsonResponse(['ok' => true, 'asset' => $asset], 201);
    }

    if ($method === 'DELETE' && preg_match('#^/api/admin/media/([^/]+)$#', $uriPath, $m)) {
        Auth::requireAuth();
        $ok = CmsRepository::deleteMediaAsset(urldecode($m[1]));
        jsonResponse(['ok' => $ok], $ok ? 200 : 404);
    }

    jsonResponse(['error' => 'Endpoint not found.'], 404);
} catch (Throwable $e) {
    jsonResponse([
        'error' => 'Server error occurred.',
        'detail' => Database::env('APP_DEBUG', 'false') === 'true' ? $e->getMessage() : null,
    ], 500);
}
