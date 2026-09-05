# Custom CMS — Deployment & Setup

Follow these steps in order. Steps 1-2 are the only ones that can't be run from this session (no database credentials capable of DDL/schema changes were available) — everything else has already been run and verified during development.

## 1. Apply the database schema

1. Open the Supabase Dashboard for this project → **SQL Editor** → **New query**.
2. Paste the entire contents of `supabase/migrations/0001_cms_schema.sql`.
3. Click **Run**. It's idempotent (safe to re-run).

This creates all tables, indexes, foreign keys, RLS policies, and seeds the 4 `roles` rows (`super_admin`, `admin`, `editor`, `author`).

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
node scripts/create-super-admin.mjs you@example.com "a-strong-password-here" "Your Name"
```

Requires step 1 to have run first (needs the `roles` table seeded).

## 5. Configure navigation & site settings (optional, has safe fallbacks)

Log in at `/admin/login`, go to **Settings**, and fill in:
- Site Information (name, tagline, contact email/phone, footer about text, footer hours)
- Header Navigation
- Footer Quick Links

Until these are configured, the header/footer render their original hardcoded content exactly as before — nothing breaks if you skip this step.

## 6. Environment variables

All of these already exist in `.env.local` (already used by the pre-existing lead-capture form) except `NEXT_PUBLIC_SUPABASE_ANON_KEY`'s new consumers (auth) — no new variables were introduced by this migration:

| Variable | Used by |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Everything (data + auth) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Auth (login/session, both `proxy.ts` and `src/lib/supabase/server.ts`) |
| `SUPABASE_SERVICE_ROLE_KEY` | All CMS reads/writes (`src/lib/db/client.ts`), migration script, super-admin script |

Ensure all three are set in Vercel's Project Settings → Environment Variables (they should already be, since `SUPABASE_SERVICE_ROLE_KEY` was already required by `/api/leads`).

## 7. Removed dependencies

No longer installed: `sanity`, `next-sanity`, `@sanity/client`, `@sanity/icons`, `@sanity/image-url`, `@sanity/vision` (734 packages removed). `@portabletext/react` was **kept** — it's a generic Portable-Text renderer, not Sanity-specific, and the new CMS still stores rich text in that same block-array shape so the existing frontend renderer needs zero changes.

## 8. URLs

- Dashboard: `/admin/dashboard`
- Login: `/admin/login`
- All other routes are unchanged: `/admin/pages`, `/admin/blogs`, `/admin/content` (+ `/universities`, `/testimonials`, `/blocks`), `/admin/media`, `/admin/seo`, `/admin/users`, `/admin/settings`, `/admin/activity-logs`.

## 9. What happens if you skip straight to deploying without steps 1-4

The frontend degrades gracefully rather than erroring: every Supabase query is wrapped in `dbFetch()` (`src/lib/db/client.ts`), which catches failures and returns an empty result instead of throwing. Landing pages and blog posts would show as 404/empty until the schema exists and the migration has run - the site would not crash, but it also would not show any CMS content until steps 1-3 are complete. **Do not deploy this to production before running steps 1-3.**
