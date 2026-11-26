# PHP 8.2+ & MySQL 8 Backend for Dev-Portfolio Admin Panel

This folder contains the complete, production-ready **PHP + MySQL** REST API and relational database powering the `/admin` dashboard, contact form inbox, image uploads, and dynamic website CMS.

## Quick Local Start (Docker)

```bash
cd php-backend
docker compose up -d
```

Then set `PHP_API_URL=http://localhost:8080` in your Next.js `.env.local` and restart Next.js. The entire website and `/admin` dashboard will immediately read/write directly against **PHP + MySQL**.

## Shared Hosting / cPanel / VPS Deployment

1. Create a MySQL 8 database (e.g. `dev_portfolio_cms`).
2. Import `database/schema.sql`, then import `database/seed.sql`.
3. Copy `.env.example` to `.env` and fill in your `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `PUBLIC_BASE_URL`.
4. Point your web server document root to `php-backend/public/` (ensure `public/uploads/` is writable: `chmod 755 public/uploads`).
5. Set `PHP_API_URL=https://api.yourdomain.com` in your Next.js deployment environment.

## Endpoints

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Public | Verify live PHP + MySQL connection |
| `GET` | `/api/cms` | Public | Fetch full site content (site, about, services, projects, slides, testimonials, experience, skills, media) |
| `POST` | `/api/contact` | Public | Submit contact form inquiry into MySQL `contact_messages` |
| `POST` | `/api/admin/login` | Public | Authenticate admin (`bcrypt`) and issue 7-day Bearer token |
| `POST` | `/api/admin/logout` | Bearer | Revoke session token |
| `GET` | `/api/admin/me` | Bearer | Verify active admin session |
| `PUT` | `/api/admin/cms` | Bearer | Transactional update across all CMS MySQL tables |
| `GET` | `/api/admin/messages` | Bearer | List contact form submissions |
| `PATCH` | `/api/admin/messages/{id}` | Bearer | Update status (`new`, `read`, `replied`, `archived`) |
| `DELETE` | `/api/admin/messages/{id}` | Bearer | Permanently delete contact message |
| `POST` | `/api/admin/upload` | Bearer | Upload real product/brand image (JPG/PNG/WebP/GIF/AVIF up to 8MB) |
| `DELETE` | `/api/admin/media/{id}` | Bearer | Delete media asset & file |
