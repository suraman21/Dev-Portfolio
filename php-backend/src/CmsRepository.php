<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/config/database.php';

/**
 * Full PDO Prepared-Statement MySQL Repository for Dev-Portfolio CMS
 */
final class CmsRepository
{
    public static function getFullCms(): array
    {
        $pdo = Database::pdo();

        $settingsRow = $pdo->query('SELECT site_json, about_json FROM site_settings WHERE id = 1 LIMIT 1')->fetch();
        $site = $settingsRow ? json_decode($settingsRow['site_json'], true) : [];
        $about = $settingsRow ? json_decode($settingsRow['about_json'], true) : [];

        $services = array_map(static function (array $r): array {
            return [
                'id' => $r['id'],
                'name' => $r['name'],
                'shortDescription' => $r['short_description'],
                'timeline' => $r['timeline'],
                'startingPrice' => $r['starting_price'],
                'accent' => $r['accent'],
                'active' => (bool) $r['active'],
            ];
        }, $pdo->query('SELECT * FROM services ORDER BY sort_order ASC, created_at ASC')->fetchAll());

        $projects = array_map(static function (array $r): array {
            return [
                'id' => $r['id'],
                'slug' => $r['slug'],
                'number' => $r['number'],
                'title' => $r['title'],
                'client' => $r['client'],
                'year' => $r['year'],
                'role' => $r['role'],
                'timeline' => $r['timeline'],
                'category' => $r['category'],
                'media' => json_decode($r['media_json'], true),
                'theme' => json_decode($r['theme_json'], true),
                'tagline' => $r['tagline'],
                'keyResult' => $r['key_result'],
                'overview' => $r['overview'],
                'stack' => json_decode($r['stack_json'], true),
                'metrics' => json_decode($r['metrics_json'], true),
                'challenge' => json_decode($r['challenge_json'], true),
                'solution' => json_decode($r['solution_json'], true),
                'outcome' => json_decode($r['outcome_json'], true),
                'featured' => (bool) $r['featured'],
                'published' => (bool) $r['published'],
                'liveUrl' => $r['live_url'] ?? '',
            ];
        }, $pdo->query('SELECT * FROM projects ORDER BY sort_order ASC, created_at ASC')->fetchAll());

        $buildSteps = array_map(static function (array $r): array {
            return [
                'id' => $r['id'],
                'number' => $r['number'],
                'label' => $r['label'],
                'title' => $r['title'],
                'highlight' => $r['highlight'],
                'description' => $r['description'],
                'accent' => $r['accent'],
                'points' => json_decode($r['points_json'], true),
                'statValue' => $r['stat_value'],
                'statLabel' => $r['stat_label'],
                'visualType' => $r['visual_type'],
            ];
        }, $pdo->query('SELECT * FROM build_steps ORDER BY sort_order ASC')->fetchAll());

        $testimonials = array_map(static function (array $r): array {
            return [
                'id' => $r['id'],
                'quote' => $r['quote'],
                'author' => $r['author'],
                'role' => $r['role'],
                'company' => $r['company'],
                'result' => $r['result'],
            ];
        }, $pdo->query('SELECT * FROM testimonials ORDER BY sort_order ASC')->fetchAll());

        $experiences = array_map(static function (array $r): array {
            return [
                'id' => $r['id'],
                'period' => $r['period'],
                'role' => $r['role'],
                'company' => $r['company'],
                'location' => $r['location'],
                'summary' => $r['summary'],
                'highlights' => json_decode($r['highlights_json'], true),
            ];
        }, $pdo->query('SELECT * FROM experiences ORDER BY sort_order ASC')->fetchAll());

        $skillGroups = array_map(static function (array $r): array {
            return [
                'id' => $r['id'],
                'title' => $r['title'],
                'accent' => $r['accent'],
                'skills' => json_decode($r['skills_json'], true),
            ];
        }, $pdo->query('SELECT * FROM skill_groups ORDER BY sort_order ASC')->fetchAll());

        $mediaLibrary = array_map(static function (array $r): array {
            return [
                'id' => $r['id'],
                'filename' => $r['filename'],
                'url' => $r['url'],
                'alt' => $r['alt'],
                'mimeType' => $r['mime_type'],
                'sizeBytes' => $r['size_bytes'] !== null ? (int) $r['size_bytes'] : null,
                'createdAt' => $r['created_at'],
            ];
        }, $pdo->query('SELECT * FROM media_assets ORDER BY created_at DESC')->fetchAll());

        return [
            'site' => $site,
            'about' => $about,
            'services' => $services,
            'projects' => $projects,
            'buildSteps' => $buildSteps,
            'testimonials' => $testimonials,
            'experiences' => $experiences,
            'skillGroups' => $skillGroups,
            'mediaLibrary' => $mediaLibrary,
        ];
    }

    /**
     * Atomically updates any provided CMS sections inside a MySQL transaction.
     */
    public static function saveCms(array $payload): array
    {
        $pdo = Database::pdo();
        $pdo->beginTransaction();

        try {
            if (isset($payload['site']) || isset($payload['about'])) {
                $existing = $pdo->query('SELECT site_json, about_json FROM site_settings WHERE id = 1 LIMIT 1')->fetch();
                $siteJson = json_encode($payload['site'] ?? ($existing ? json_decode($existing['site_json'], true) : []), JSON_UNESCAPED_UNICODE);
                $aboutJson = json_encode($payload['about'] ?? ($existing ? json_decode($existing['about_json'], true) : []), JSON_UNESCAPED_UNICODE);

                $stmt = $pdo->prepare(
                    'INSERT INTO site_settings (id, site_json, about_json) VALUES (1, ?, ?)
                     ON DUPLICATE KEY UPDATE site_json = VALUES(site_json), about_json = VALUES(about_json)'
                );
                $stmt->execute([$siteJson, $aboutJson]);
            }

            if (isset($payload['services']) && is_array($payload['services'])) {
                $pdo->exec('DELETE FROM services');
                $stmt = $pdo->prepare(
                    'INSERT INTO services (id, name, short_description, timeline, starting_price, accent, active, sort_order)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
                );
                foreach ($payload['services'] as $i => $s) {
                    $stmt->execute([
                        $s['id'] ?? ('svc-' . ($i + 1)),
                        $s['name'] ?? '',
                        $s['shortDescription'] ?? '',
                        $s['timeline'] ?? '',
                        $s['startingPrice'] ?? '',
                        in_array($s['accent'] ?? 'teal', ['teal', 'orange'], true) ? $s['accent'] : 'teal',
                        !empty($s['active']) ? 1 : 0,
                        $i,
                    ]);
                }
            }

            if (isset($payload['projects']) && is_array($payload['projects'])) {
                $pdo->exec('DELETE FROM projects');
                $stmt = $pdo->prepare(
                    'INSERT INTO projects (
                        id, slug, number, title, client, year, role, timeline, category,
                        media_json, theme_json, tagline, key_result, overview,
                        stack_json, metrics_json, challenge_json, solution_json, outcome_json,
                        featured, published, live_url, sort_order
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
                );
                foreach ($payload['projects'] as $i => $p) {
                    $stmt->execute([
                        $p['id'] ?? ('proj-' . ($i + 1)),
                        $p['slug'] ?? ('project-' . ($i + 1)),
                        $p['number'] ?? str_pad((string) ($i + 1), 2, '0', STR_PAD_LEFT),
                        $p['title'] ?? 'Untitled Project',
                        $p['client'] ?? '',
                        $p['year'] ?? date('Y'),
                        $p['role'] ?? '',
                        $p['timeline'] ?? '',
                        $p['category'] ?? 'SaaS Products',
                        json_encode($p['media'] ?? [], JSON_UNESCAPED_UNICODE),
                        json_encode($p['theme'] ?? [], JSON_UNESCAPED_UNICODE),
                        $p['tagline'] ?? '',
                        $p['keyResult'] ?? '',
                        $p['overview'] ?? '',
                        json_encode($p['stack'] ?? [], JSON_UNESCAPED_UNICODE),
                        json_encode($p['metrics'] ?? [], JSON_UNESCAPED_UNICODE),
                        json_encode($p['challenge'] ?? [], JSON_UNESCAPED_UNICODE),
                        json_encode($p['solution'] ?? [], JSON_UNESCAPED_UNICODE),
                        json_encode($p['outcome'] ?? [], JSON_UNESCAPED_UNICODE),
                        !empty($p['featured']) ? 1 : 0,
                        ($p['published'] ?? true) ? 1 : 0,
                        $p['liveUrl'] ?: null,
                        $i,
                    ]);
                }
            }

            if (isset($payload['buildSteps']) && is_array($payload['buildSteps'])) {
                $pdo->exec('DELETE FROM build_steps');
                $stmt = $pdo->prepare(
                    'INSERT INTO build_steps (id, number, label, title, highlight, description, accent, points_json, stat_value, stat_label, visual_type, sort_order)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
                );
                foreach ($payload['buildSteps'] as $i => $st) {
                    $stmt->execute([
                        $st['id'] ?? ('step-' . ($i + 1)),
                        $st['number'] ?? str_pad((string) ($i + 1), 2, '0', STR_PAD_LEFT),
                        $st['label'] ?? '',
                        $st['title'] ?? '',
                        $st['highlight'] ?? '',
                        $st['description'] ?? '',
                        $st['accent'] ?? 'teal',
                        json_encode($st['points'] ?? [], JSON_UNESCAPED_UNICODE),
                        $st['statValue'] ?? '',
                        $st['statLabel'] ?? '',
                        $st['visualType'] ?? 'strategy',
                        $i,
                    ]);
                }
            }

            if (isset($payload['testimonials']) && is_array($payload['testimonials'])) {
                $pdo->exec('DELETE FROM testimonials');
                $stmt = $pdo->prepare(
                    'INSERT INTO testimonials (id, quote, author, role, company, result, sort_order)
                     VALUES (?, ?, ?, ?, ?, ?, ?)'
                );
                foreach ($payload['testimonials'] as $i => $t) {
                    $stmt->execute([
                        $t['id'] ?? ('test-' . ($i + 1)),
                        $t['quote'] ?? '',
                        $t['author'] ?? '',
                        $t['role'] ?? '',
                        $t['company'] ?? '',
                        $t['result'] ?? '',
                        $i,
                    ]);
                }
            }

            if (isset($payload['experiences']) && is_array($payload['experiences'])) {
                $pdo->exec('DELETE FROM experiences');
                $stmt = $pdo->prepare(
                    'INSERT INTO experiences (id, period, role, company, location, summary, highlights_json, sort_order)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
                );
                foreach ($payload['experiences'] as $i => $e) {
                    $stmt->execute([
                        $e['id'] ?? ('exp-' . ($i + 1)),
                        $e['period'] ?? '',
                        $e['role'] ?? '',
                        $e['company'] ?? '',
                        $e['location'] ?? '',
                        $e['summary'] ?? '',
                        json_encode($e['highlights'] ?? [], JSON_UNESCAPED_UNICODE),
                        $i,
                    ]);
                }
            }

            if (isset($payload['skillGroups']) && is_array($payload['skillGroups'])) {
                $pdo->exec('DELETE FROM skill_groups');
                $stmt = $pdo->prepare(
                    'INSERT INTO skill_groups (id, title, accent, skills_json, sort_order)
                     VALUES (?, ?, ?, ?, ?)'
                );
                foreach ($payload['skillGroups'] as $i => $g) {
                    $stmt->execute([
                        $g['id'] ?? ('skill-' . ($i + 1)),
                        $g['title'] ?? '',
                        $g['accent'] ?? 'teal',
                        json_encode($g['skills'] ?? [], JSON_UNESCAPED_UNICODE),
                        $i,
                    ]);
                }
            }

            $pdo->commit();
            return self::getFullCms();
        } catch (Throwable $e) {
            $pdo->rollBack();
            throw $e;
        }
    }

    public static function listMessages(): array
    {
        $pdo = Database::pdo();
        return array_map(static function (array $r): array {
            return [
                'id' => $r['id'],
                'name' => $r['name'],
                'email' => $r['email'],
                'serviceId' => $r['service_id'],
                'serviceName' => $r['service_name'],
                'budget' => $r['budget'] ?? '',
                'message' => $r['message'],
                'status' => $r['status'],
                'createdAt' => $r['created_at'],
            ];
        }, $pdo->query('SELECT * FROM contact_messages ORDER BY created_at DESC')->fetchAll());
    }

    public static function createMessage(array $data): array
    {
        $pdo = Database::pdo();
        $id = 'msg-' . bin2hex(random_bytes(6));

        $stmt = $pdo->prepare(
            'INSERT INTO contact_messages (id, name, email, service_id, service_name, budget, message, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $id,
            trim((string) ($data['name'] ?? '')),
            trim((string) ($data['email'] ?? '')),
            $data['serviceId'] ?? null,
            trim((string) ($data['serviceName'] ?? 'General Inquiry')),
            trim((string) ($data['budget'] ?? '')),
            trim((string) ($data['message'] ?? '')),
            'new',
        ]);

        return [
            'id' => $id,
            'name' => trim((string) ($data['name'] ?? '')),
            'email' => trim((string) ($data['email'] ?? '')),
            'serviceId' => $data['serviceId'] ?? null,
            'serviceName' => trim((string) ($data['serviceName'] ?? 'General Inquiry')),
            'budget' => trim((string) ($data['budget'] ?? '')),
            'message' => trim((string) ($data['message'] ?? '')),
            'status' => 'new',
            'createdAt' => gmdate('c'),
        ];
    }

    public static function updateMessageStatus(string $id, string $status): bool
    {
        if (!in_array($status, ['new', 'read', 'replied', 'archived'], true)) {
            return false;
        }
        $pdo = Database::pdo();
        $stmt = $pdo->prepare('UPDATE contact_messages SET status = ? WHERE id = ?');
        $stmt->execute([$status, $id]);
        return $stmt->rowCount() > 0;
    }

    public static function deleteMessage(string $id): bool
    {
        $pdo = Database::pdo();
        $stmt = $pdo->prepare('DELETE FROM contact_messages WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->rowCount() > 0;
    }

    public static function addMediaAsset(array $asset): array
    {
        $pdo = Database::pdo();
        $stmt = $pdo->prepare(
            'INSERT INTO media_assets (id, filename, url, alt, mime_type, size_bytes)
             VALUES (?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $asset['id'],
            $asset['filename'],
            $asset['url'],
            $asset['alt'],
            $asset['mimeType'],
            $asset['sizeBytes'] ?? null,
        ]);
        return $asset;
    }

    public static function deleteMediaAsset(string $id): bool
    {
        $pdo = Database::pdo();
        $stmt = $pdo->prepare('SELECT filename FROM media_assets WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $row = $stmt->fetch();

        if ($row && !empty($row['filename'])) {
            $uploadPath = dirname(__DIR__) . '/public/uploads/' . basename($row['filename']);
            if (is_file($uploadPath)) {
                @unlink($uploadPath);
            }
        }

        $del = $pdo->prepare('DELETE FROM media_assets WHERE id = ?');
        $del->execute([$id]);
        return $del->rowCount() > 0;
    }
}
