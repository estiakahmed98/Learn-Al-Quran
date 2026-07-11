# Learn Al Quran Online BD — Full Stack Website

A full-stack **Next.js 14 (App Router) + TypeScript + Tailwind CSS + Prisma (PostgreSQL)**
website for an online Quran madrasa, including:

- Public website (Home, Courses, Books, About Us, Blog, Contact Us, Free Trial Class / Admission form)
- Admin panel to manage Courses, Enrollments, and Content (Teachers, Reviews, FAQ, Blog, Books)
- Google Analytics 4 (GA4) integration
- Full technical SEO: metadata, Open Graph, JSON-LD structured data, sitemap.xml, robots.txt, web manifest
- Enrollment / lead form connected to a PostgreSQL database via Prisma

---

## 1. Requirements

- Node.js 18.18+ (Node 20 recommended)
- A PostgreSQL database (e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com), Railway, or your own server)

## 2. Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy the environment file and fill in your own values
cp .env.example .env

# 3. Push the Prisma schema to your database
npm run db:push

# 4. Seed the database with starter content
#    (creates 6 courses, sample teachers/reviews/FAQ, an admin user, and site settings)
npm run db:seed

# 5. Run the development server
npm run dev
```

Visit `http://localhost:3000` for the website.

### Default Admin Login
After seeding, log in to the admin panel at `http://localhost:3000/admin/login`:

- **Email:** `admin@learnalquranonlinebd.com`
- **Password:** `Admin@12345`

⚠️ **Change this password immediately** by updating the `User` row in your database
(hash a new password with bcrypt), since this is a public default.

---

## 3. Environment Variables (`.env`)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_URL` | Your site URL (e.g. `http://localhost:3000` or your production domain) |
| `NEXTAUTH_SECRET` | Random secret for session encryption — generate with `openssl rand -base64 32` |
| `NEXT_PUBLIC_SITE_URL` | Public site URL, used for sitemap/SEO metadata |
| `NEXT_PUBLIC_GA4_ID` | Your Google Analytics 4 Measurement ID (e.g. `G-XXXXXXXXXX`) |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console verification code (optional) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` / `NEXT_PUBLIC_PHONE_NUMBER` | Fallback contact numbers shown across the site |

You can also manage most of these (phone, WhatsApp, bKash/Nagad numbers, social links, GA4 ID,
etc.) directly in the `SiteSetting` table via Prisma Studio (`npm run db:studio`) without
redeploying — the site reads them at request time.

---

## 4. Google Analytics 4 Setup

1. Create a GA4 property at [analytics.google.com](https://analytics.google.com) and copy your
   Measurement ID (`G-XXXXXXXXXX`).
2. Set `NEXT_PUBLIC_GA4_ID` in `.env`, **or** set the `ga4Id` field on the `SiteSetting` row —
   the site prefers the database value if present.
3. The `GoogleAnalytics` component (`src/components/shared/GoogleAnalytics.tsx`) loads the
   `gtag.js` script site-wide and auto-tracks page views.
4. Key conversion events are already wired up with `trackEvent(...)`:
   - `call_click` — Header, Hero, and phone links
   - `free_trial_click` — Free Trial / Enroll Now buttons
   - `whatsapp_click` — floating WhatsApp button
   - `generate_lead` — successful Admission form submission

   You can mark `generate_lead` as a **Key Event / Conversion** inside GA4 Admin.

---

## 5. SEO Features Included

- Per-page `<title>`, meta description, canonical URLs, and Open Graph/Twitter cards
  (`generateMetadata` on dynamic Course and Blog pages)
- `EducationalOrganization`, `Course`, and `Article` JSON-LD structured data
- Auto-generated `sitemap.xml` (`src/app/sitemap.ts`) that includes every course and blog post
  from the database
- `robots.txt` (`src/app/robots.ts`) that disallows `/admin` and `/api`
- `manifest.json` (PWA/mobile metadata)
- Fast, mostly server-rendered pages (ISR via `revalidate`) for good Core Web Vitals
- Semantic headings, descriptive alt text placeholders, and accessible form labels throughout

**Before launch:**
- Replace the placeholder images in `/public/images` (hero banner, about photo, teacher photos,
  OG image, logo) with real photography.
- Submit your sitemap (`/sitemap.xml`) in Google Search Console.
- Update the Google Map embed URL in `SiteSetting.googleMapUrl` to your real location.

---

## 6. Admin Panel

Visit `/admin` (redirects to `/admin/login` if not signed in). Includes:

- **Dashboard** — quick stats (courses, enrollments, pending/verified payments)
- **Courses** — toggle active/hidden, update fee, delete
- **Enrollments** — view every Admission form submission (student, WhatsApp, payment method,
  transaction ID) and update payment/enrollment status
- **Content** — manage Teachers, Reviews, FAQ, Blog posts, and Books shown on the public site

---

## 7. Project Structure

```
src/
  app/                # Next.js App Router pages & API routes
    (public pages: /, /courses, /courses/[slug], /books, /about-us,
     /blog, /blog/[slug], /contact-us, /free-trial-class,
     /privacy-policy, /terms-and-conditions)
    admin/             # Admin panel (protected by middleware.ts)
    api/               # /api/enroll, /api/auth, /api/admin/*
    sitemap.ts, robots.ts, manifest.ts
  components/
    layout/            # Header, Footer
    home/               # Hero, About, Courses, Teachers, Reviews, FAQ, LeadForm, Map
    shared/             # GoogleAnalytics, JsonLd, WhatsAppFloat
    admin/              # Admin panel client components
  lib/                 # prisma client, auth config, site settings, utils
  types/               # Shared TS types + NextAuth type augmentation
prisma/
  schema.prisma        # Database schema (User, Course, Enrollment, Content, SiteSetting)
  seed.ts              # Seed script (courses, teachers, reviews, FAQ, admin user, settings)
```

---

## 8. Deployment

This project deploys cleanly to **Vercel**:

1. Push this project to a GitHub/GitLab repository.
2. Import it into Vercel.
3. Add all variables from `.env.example` to the Vercel project's Environment Variables.
4. Set the Build Command to `npm run build` (already runs `prisma generate` via `postinstall`
   and `build` script).
5. After the first deploy, run `npm run db:push` and `npm run db:seed` locally (pointed at your
   production `DATABASE_URL`) to initialize the database, or connect Prisma Studio directly.

---

## 9. Notes on the Admission (Lead) Form

The homepage and Free Trial Class page both include the **Admission Now** form, matching the
required flow:

- Course fee: **৳1500** (editable per-course in the admin panel; shown fee is read from the
  selected course)
- Payment instructions show bKash, Nagad, and Bank Account numbers pulled from `SiteSetting`
- Fields: Student Name, WhatsApp Number, Email (optional), Payment Plan (বিকাশ / নগদ / রকেট /
  Western Union / Bank Transfer), Transaction ID, Contact Number
- On submit, data is saved to the `Enrollment` table and visible immediately in
  `/admin/enrollments`
