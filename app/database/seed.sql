-- ============================================================================
-- Dev-Portfolio CMS — Initial Seed Data (cPanel phpMyAdmin Safe)
-- Default Admin Login: admin@sura.dev / admin1234
-- IMPORTANT: Change the admin password in api/.env immediately after deploy!
-- ============================================================================

SET NAMES utf8mb4;

-- Bcrypt hash for "admin1234"
INSERT INTO `admin_users` (`email`, `name`, `password_hash`, `role`, `is_active`)
VALUES (
  'admin@sura.dev',
  'Sura Aman',
  '$2y$10$wH8Z4.E9jR9k1F1x0S2Z6eP8P2kH8s3b3y3cV1Y8vM9Z6uV1d4b9S',
  'owner',
  1
)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

INSERT INTO `site_settings` (`id`, `site_json`, `about_json`)
VALUES (
  1,
  JSON_OBJECT(
    'name', 'Sura Aman',
    'monogram', 'SA',
    'role', 'Senior Software Engineer & Web Developer',
    'location', 'Addis Ababa · Working Worldwide',
    'availability', 'Available for Senior Roles & Select Projects',
    'email', 'hello@sura.dev',
    'github', 'https://github.com/suraman21',
    'linkedin', 'https://linkedin.com',
    'heroTitle', 'I build fast SaaS products &',
    'heroHighlight', 'luxury websites.',
    'heroDescription', 'I help startups and growing companies turn complex ideas into fast, reliable software and memorable web experiences that feel effortless on every screen.',
    'heroStats', JSON_ARRAY(
      JSON_OBJECT('value', '8+ Years', 'label', 'Building Production Software'),
      JSON_OBJECT('value', '99.99%', 'label', 'Uptime on Mission-Critical Apps'),
      JSON_OBJECT('value', '40+ Launches', 'label', 'SaaS Products & Luxury Websites')
    ),
    'ctaHeadline', 'Have a product or role in mind?',
    'ctaHighlight', 'Let''s build it right.',
    'ctaDescription', 'Whether you''re hiring a senior engineer or launching a new flagship SaaS or website, I''d love to hear what you''re working on.',
    'footerHeadline', 'Building products with',
    'footerHighlight', 'clarity & speed.',
    'footerBio', 'Designing and engineering fast, reliable SaaS platforms and modern luxury websites for ambitious teams worldwide.',
    'contactHeadline', 'Let''s work',
    'contactHighlight', 'together.',
    'contactDescription', 'Share a quick overview of your product, service needs, or timeline. I reply personally to every message within 24 hours.',
    'contactReplyNote', 'Usually replies within 24 hours'
  ),
  JSON_OBJECT(
    'eyebrow', 'About Me',
    'headline', 'Senior engineering rigor with an eye for',
    'highlight', 'luxury craft.',
    'bio', 'I''m Sura Aman, a Senior Software Engineer and Web Developer with over 8 years of experience building scalable SaaS products and high-converting websites. I enjoy bridging the gap between backend reliability and smooth, intuitive design so products feel great for real people.'
  )
)
ON DUPLICATE KEY UPDATE `site_json` = VALUES(`site_json`), `about_json` = VALUES(`about_json`);

INSERT INTO `services` (`id`, `name`, `short_description`, `timeline`, `starting_price`, `accent`, `active`, `sort_order`) VALUES
('svc-saas', 'SaaS Product & Dashboard Engineering', 'End-to-end full-stack web apps, fast dashboards, APIs, and real-time analytics built for scale.', '6–12 Weeks', 'Custom Scope', 'teal', 1, 1),
('svc-website', 'Luxury Website & Brand Flagship', 'High-converting marketing websites, editorial storytelling, smooth scroll motion, and CMS setup.', '4–8 Weeks', 'Custom Scope', 'orange', 1, 2),
('svc-design-system', 'Design System & UI Architecture', 'Accessible React + Tailwind component libraries, responsive tokens, and multi-device parity.', '3–6 Weeks', 'Custom Scope', 'teal', 1, 3),
('svc-role', 'Full-Time Senior / Staff Engineering Role', 'Joining your core engineering team remotely to lead frontend architecture and product craft.', 'Ongoing', 'Full-Time', 'orange', 1, 4),
('svc-advisory', 'Technical Advisory & Performance Audit', 'Deep performance profiling, UX clarity audit, and actionable engineering roadmap for existing apps.', '1–2 Weeks', 'Fixed Sprint', 'teal', 1, 5)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

INSERT INTO `contact_messages` (`id`, `name`, `email`, `service_id`, `service_name`, `budget`, `message`, `status`) VALUES
('msg-welcome-1', 'Elena Rostova', 'elena@aethersystems.io', 'svc-saas', 'SaaS Product & Dashboard Engineering', '$25k – $50k', 'Hi Sura — we''re expanding Aether Cloud''s observability suite for Q1 and would love to discuss partnering on the new real-time telemetry workspace.', 'new')
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`);

INSERT INTO `media_assets` (`id`, `filename`, `url`, `alt`, `mime_type`) VALUES
('media-1', 'aether-cloud.png', '/images/projects/aether-cloud.png', 'Aether Cloud dark-mode analytics dashboard', 'image/png'),
('media-2', 'solstice-treasury.png', '/images/projects/solstice-treasury.png', 'Solstice Treasury light-mode fintech banking interface', 'image/png'),
('media-3', 'velour-maison.png', '/images/projects/velour-maison.png', 'Maison Velour Parisian ceramic and brass editorial lookbook', 'image/png'),
('media-4', 'kinetix-workspace.png', '/images/projects/kinetix-workspace.png', 'Kinetix Studio multiplayer design system canvas', 'image/png')
ON DUPLICATE KEY UPDATE `url` = VALUES(`url`);
