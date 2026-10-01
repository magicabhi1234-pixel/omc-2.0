# Custom CMS — Deployment & Setup

Follow these steps in order. Steps 1-2 are the only ones that can't be run from this session (no database credentials capable of DDL/schema changes were available) — everything else has already been run and verified during development.

## 1. Apply the database schema

1. Open the Supabase Dashboard for this project → **SQL Editor** → **New query**.
2. Paste the entire contents of `supabase/migrations/0001_cms_schema.sql`.
3. Click **Run**. It's idempotent (safe to re-run).

This creates all tables, indexes, foreign keys, RLS policies, and seeds the 4 `roles` rows (`super_admin`, `admin`, `editor`, `author`).

Then run `supabase/migrations/0002_security_leads.sql` the same way. It adds:
- the lead-management columns on `leads` (`lead_type`, `source`, `page_path`, `status`, `notes`). It only adds columns, so it is safe on the existing live table.
- the `newsletter_subscribers` table
- `profiles.username`, used for username login at `/omc-adminlogin`
- the `rate_limits` table and `check_rate_limit()` function, which together give one shared rate limiter across all serverless instances

The site works before 0002 is applied, with reduced functionality:
- new leads are saved without the tracking columns
- the rate limiter falls back to a per-instance in-memory limit
- username login doesn't work (email login still does)
- the Leads page shows a "please apply migration 0002" notice

Then run `supabase/migrations/0003_fix_legacy_not_null.sql`. It makes two legacy columns optional:
- `leads.city`: it was required, but City is optional on the form, so leads without a city were never saved
- `media.public_url`: it was required, but the dashboard writes `url`, so Media Library uploads failed

It also keeps `url` and `public_url` in sync with a trigger. **Required before using the Media Library.**

Then run `supabase/migrations/0004_dashboard_modules.sql`. It adds:
- the `faqs` table, seeded with the current homepage FAQs, for the FAQ Manager
- the `media.folder` column, used for Media Library categories
- `cms_sync_runs`, the Sanity import history
- `cms_tombstones`, which stops the Sanity fallback from reviving content deleted in the dashboard

Until 0004 is applied, the homepage shows its built-in FAQs and the FAQ Manager shows a notice.

The admin Dashboard's **System Health** card shows which of these are applied.

## 2. Create the Storage bucket

Already done from this session (bucket `media`, public, 10MB file size limit) — confirm it still exists under **Storage** in the dashboard. If it's ever missing, recreate it:
```
Name: media
Public: yes
File size limit: 10MB
```

## 3. Migrate existing Sanity content

```bash
npm run migrate:cms
```

Reads every `university`, `testimonial`, `blogPost`, and `landingPage` document out of Sanity (using the existing `NEXT_PUBLIC_SANITY_PROJECT_ID`/`NEXT_PUBLIC_SANITY_DATASET` env vars — Sanity itself doesn't need to still be "the CMS," just reachable one more time for this read) and writes it into the new Supabase tables, preserving all references (landing-page ↔ university/testimonial links, blog post ↔ related-post links). Safe to re-run — every write is an upsert keyed by slug.

## 4. Create the first Super Admin

```bash
ADMIN_PASSWORD='a-strong-password' node scripts/create-super-admin.mjs you@example.com --username yourname --name "Your Name"
```

The password is read from `ADMIN_PASSWORD`, never from argv, so it stays out of shell history. It must be at least 12 characters and mix upper case, lower case and digits. If an account with that email already exists, the script updates its password, username and role in place. `--username` requires migration 0002. Users can then sign in at `/omc-adminlogin` with either the username or the email.

Requires step 1 to have run first (needs the `roles` table seeded).

## 5. Configure navigation & site settings (optional, has safe fallbacks)

Log in at `/omc-adminlogin` and open:
- **Global Settings**, which has four tabs:
  - **General:** name, contact details, WhatsApp, address, hours
  - **Branding:** logo, favicon, default share image
  - **Social Links**
  - **Analytics & Verification:** GA4, GTM, Meta Pixel and Clarity IDs, plus the Google, Bing and Meta verification codes
- **Menus:** Header, Mobile and Footer menus
- **FAQs:** homepage, contact and about FAQs

Until these are configured, the site renders its current built-in content exactly as before, so nothing breaks if you skip this step. Analytics is configured by ID only, and the site renders the official snippets itself.

## 5b. Sanity (hybrid CMS)

Sanity stays connected, read-only, as a fallback and import source. The dashboard is the primary CMS.
- **Fallback:** if Supabase is unreachable, or a slug has never existed in the dashboard, the page is served from the published Sanity document.
- **What the fallback never does:** it never revives anything that is a draft, or was deleted, in the dashboard.
- **Import:** **Sanity Sync** (`/admin/sync`) previews and imports *new* Sanity documents. It is insert-only, matched on slug, so it can't create duplicates and never overwrites dashboard edits. Imported images are copied into the Media Library.
- **Automatic import:** in Sanity, go to **API → Webhooks**. Create a webhook to `https://<domain>/api/sanity-sync`, method `POST`, triggered on create and update. Add the header `Authorization: Bearer <SANITY_WEBHOOK_SECRET>`.

## 6. Environment variables

All of these already exist in `.env.local` (already used by the pre-existing lead-capture form) except `NEXT_PUBLIC_SUPABASE_ANON_KEY`'s new consumers (auth) — no new variables were introduced by this migration:

| Variable | Used by |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Everything (data + auth) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Auth (login/session, both `proxy.ts` and `src/lib/supabase/server.ts`) |
| `SUPABASE_SERVICE_ROLE_KEY` | All CMS reads/writes (`src/lib/db/client.ts`), migration script, super-admin script |

| `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` | Sanity fallback + Sanity Sync |
| `SANITY_API_TOKEN` | Optional, Viewer token: only needed if the dataset is private |
| `SANITY_WEBHOOK_SECRET` | **New**. Authenticates `POST /api/sanity-sync`. Generate it with `openssl rand -hex 32` |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ADMIN_NOTIFICATION_EMAIL` | Lead emails |
| `REVALIDATE_SECRET` | `POST /api/revalidate` (send it as a Bearer token) |

Ensure all of these are set in Vercel's Project Settings → Environment Variables.

## 7. Removed dependencies

No longer installed: `sanity`, `next-sanity`, `@sanity/client`, `@sanity/icons`, `@sanity/image-url`, `@sanity/vision` (734 packages removed). `@portabletext/react` was **kept** — it's a generic Portable-Text renderer, not Sanity-specific, and the new CMS still stores rich text in that same block-array shape so the existing frontend renderer needs zero changes.

## 8. URLs

- Dashboard: `/admin/dashboard`
- Login: `/omc-adminlogin`
- Leads (super admin and admin only): `/admin/leads`, with CSV and Excel export.
- The legacy `/admin/login` permanently redirects to `/omc-adminlogin`.
- New: `/admin/faqs`, `/admin/menus`, `/admin/sync`. `/admin/settings` is now **Global Settings**.
- All other routes are unchanged: `/admin/pages`, `/admin/blogs`, `/admin/content` (+ `/universities`, `/testimonials`, `/blocks`), `/admin/media`, `/admin/seo`, `/admin/users`, `/admin/activity-logs`.
- Public: `/llms.txt` gives AI answer engines a map of the site. `/top-colleges-university-in-north-zone` now 308-redirects to `/top-10-distance-mba-universities-colleges-north-zone`.

## 9. What happens if you skip straight to deploying without steps 1-4

The frontend degrades gracefully rather than erroring: every Supabase query is wrapped in `dbFetch()` (`src/lib/db/client.ts`), which catches failures and returns an empty result instead of throwing. Landing pages and blog posts would show as 404/empty until the schema exists and the migration has run - the site would not crash, but it also would not show any CMS content until steps 1-3 are complete. **Do not deploy this to production before running steps 1-3.**
