# Learn Al Quran API

Laravel 11 + MySQL REST API for the Learn-Al-Quran static Next.js frontend.

## Architecture

- `database/migrations`: tables, indexes, and foreign-key rules converted from Prisma.
- `app/Models`: Eloquent models, casts, and relationships.
- `app/Http/Requests/Api`: validation before controller logic runs.
- `app/Http/Controllers/Api`: API use cases and persistence.
- `app/Http/Resources`: consistent JSON serialization.
- `routes/api.php`: versioned `/api/v1` endpoints.

String primary keys are intentional. The PostgreSQL schema used Prisma CUID strings, so
Laravel's default BIGINT `foreignId` would prevent existing data from being imported.
New records receive UUID strings while columns remain compatible with legacy CUIDs.

## Local setup

Requirements: PHP 8.2+, Composer 2, MySQL 8+.

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

Set `FRONTEND_URLS` to a comma-separated list of allowed frontend origins. Never commit
the production `.env`.

## Authentication

Login returns a Laravel Sanctum bearer token. Send it on protected requests:

```http
Authorization: Bearer YOUR_TOKEN
Accept: application/json
```

## Main endpoints

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/courses`
- `GET /api/v1/courses/slug/{slug}`
- `GET /api/v1/blogs`
- `GET /api/v1/books`
- `GET /api/v1/reviews`
- `POST /api/v1/enrollments`
- `POST /api/v1/trial-applications`
- `GET|POST /api/v1/class-reports` (teacher/admin)
- `POST /api/v1/analytics/collect`
- `POST /api/v1/newsletter/subscribe`
- `GET|POST /api/v1/newsletter/unsubscribe`

Admin resources under `/api/v1/admin`:

- `users`, `courses`, `blogs`
- `class-schedules`, `notes`, `results`
- `settings`, `enrollments`, `trial-applications`
- `analytics/summary`
- `newsletters`, `newsletter-subscribers`
- `uploads/{folder?}`

Image uploads use Laravel's `public` disk. Run this once after deployment:

```bash
php artisan storage:link
```

For real newsletter delivery, replace the default `MAIL_MAILER=log` values with the
Hostinger SMTP credentials. Keep `ANALYTICS_GEO_LOOKUP=false` unless sending visitor IPs
to the configured Geo-IP provider is an explicit privacy decision.
