-- ============================================================================
-- Dev-Portfolio CMS — Production MySQL 8+ Relational Schema
-- Charset: utf8mb4 / Engine: InnoDB
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `dev_portfolio_cms`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `dev_portfolio_cms`;

-- 1. Admin Users
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(190) NOT NULL UNIQUE,
  `name` VARCHAR(120) NOT NULL DEFAULT 'Site Administrator',
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('owner', 'editor') NOT NULL DEFAULT 'owner',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Admin Auth Sessions (SHA-256 hashed bearer tokens)
CREATE TABLE IF NOT EXISTS `admin_sessions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `token_hash` CHAR(64) NOT NULL UNIQUE,
  `expires_at` DATETIME NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_sessions_user` (`user_id`),
  INDEX `idx_sessions_expires` (`expires_at`),
  CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_id`)
    REFERENCES `admin_users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Global Site Settings & About Content (Singleton row id = 1)
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `site_json` JSON NOT NULL,
  `about_json` JSON NOT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Services (Powers Contact Form Dropdown & About/Footer listings)
CREATE TABLE IF NOT EXISTS `services` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(180) NOT NULL,
  `short_description` TEXT NOT NULL,
  `timeline` VARCHAR(80) NOT NULL DEFAULT '',
  `starting_price` VARCHAR(80) NOT NULL DEFAULT '',
  `accent` ENUM('teal', 'orange') NOT NULL DEFAULT 'teal',
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_services_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Portfolio Projects (Full CMS media + dynamic color/tone theme + case study)
CREATE TABLE IF NOT EXISTS `projects` (
  `id` VARCHAR(64) NOT NULL,
  `slug` VARCHAR(140) NOT NULL UNIQUE,
  `number` VARCHAR(16) NOT NULL DEFAULT '01',
  `title` VARCHAR(180) NOT NULL,
  `client` VARCHAR(180) NOT NULL DEFAULT '',
  `year` VARCHAR(16) NOT NULL DEFAULT '2026',
  `role` VARCHAR(180) NOT NULL DEFAULT '',
  `timeline` VARCHAR(80) NOT NULL DEFAULT '',
  `category` ENUM('SaaS Products', 'Web Platforms', 'Design Systems') NOT NULL DEFAULT 'SaaS Products',
  `media_json` JSON NOT NULL,
  `theme_json` JSON NOT NULL,
  `tagline` TEXT NOT NULL,
  `key_result` VARCHAR(255) NOT NULL DEFAULT '',
  `overview` TEXT NOT NULL,
  `stack_json` JSON NOT NULL,
  `metrics_json` JSON NOT NULL,
  `challenge_json` JSON NOT NULL,
  `solution_json` JSON NOT NULL,
  `outcome_json` JSON NOT NULL,
  `featured` TINYINT(1) NOT NULL DEFAULT 1,
  `published` TINYINT(1) NOT NULL DEFAULT 1,
  `live_url` VARCHAR(512) NULL DEFAULT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_projects_sort` (`sort_order`),
  INDEX `idx_projects_published` (`published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. How I Build Slides (Sticky Full-Screen Deck)
CREATE TABLE IF NOT EXISTS `build_steps` (
  `id` VARCHAR(64) NOT NULL,
  `number` VARCHAR(16) NOT NULL,
  `label` VARCHAR(140) NOT NULL,
  `title` VARCHAR(220) NOT NULL,
  `highlight` VARCHAR(140) NOT NULL,
  `description` TEXT NOT NULL,
  `accent` ENUM('teal', 'orange', 'cobalt') NOT NULL DEFAULT 'teal',
  `points_json` JSON NOT NULL,
  `stat_value` VARCHAR(60) NOT NULL DEFAULT '',
  `stat_label` VARCHAR(160) NOT NULL DEFAULT '',
  `visual_type` ENUM('strategy', 'engineering', 'craft') NOT NULL DEFAULT 'strategy',
  `sort_order` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `idx_steps_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Client Testimonials
CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` VARCHAR(64) NOT NULL,
  `quote` TEXT NOT NULL,
  `author` VARCHAR(140) NOT NULL,
  `role` VARCHAR(140) NOT NULL,
  `company` VARCHAR(140) NOT NULL,
  `result` VARCHAR(180) NOT NULL DEFAULT '',
  `sort_order` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `idx_testimonials_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Career Experience Timeline
CREATE TABLE IF NOT EXISTS `experiences` (
  `id` VARCHAR(64) NOT NULL,
  `period` VARCHAR(80) NOT NULL,
  `role` VARCHAR(180) NOT NULL,
  `company` VARCHAR(180) NOT NULL,
  `location` VARCHAR(140) NOT NULL DEFAULT '',
  `summary` TEXT NOT NULL,
  `highlights_json` JSON NOT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `idx_experiences_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Core Skill Groups
CREATE TABLE IF NOT EXISTS `skill_groups` (
  `id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(140) NOT NULL,
  `accent` ENUM('teal', 'orange') NOT NULL DEFAULT 'teal',
  `skills_json` JSON NOT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `idx_skills_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Contact Form Submissions Inbox
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(160) NOT NULL,
  `email` VARCHAR(190) NOT NULL,
  `service_id` VARCHAR(64) NULL DEFAULT NULL,
  `service_name` VARCHAR(180) NOT NULL,
  `budget` VARCHAR(80) NULL DEFAULT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('new', 'read', 'replied', 'archived') NOT NULL DEFAULT 'new',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_messages_status` (`status`),
  INDEX `idx_messages_created` (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Media Library (Uploaded Product & Brand Images)
CREATE TABLE IF NOT EXISTS `media_assets` (
  `id` VARCHAR(64) NOT NULL,
  `filename` VARCHAR(255) NOT NULL,
  `url` VARCHAR(512) NOT NULL,
  `alt` VARCHAR(255) NOT NULL DEFAULT '',
  `mime_type` VARCHAR(80) NOT NULL DEFAULT 'image/png',
  `size_bytes` INT UNSIGNED NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_media_created` (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
