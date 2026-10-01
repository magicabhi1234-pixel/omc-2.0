# OMC 2.0: Production Hardening Report (October 2026)

Branch: `feature/omc-production-hardening` (7 commits on top of `main` @ `8bfb7a6`).
Scope: 169 files changed (47 added, 114 modified, 8 deleted). 8,026 lines added and 2,400 removed.

**Status:** code-complete and verified locally on a production build. You must take 4 manual steps before deploying (see §9).

---

## 1. Full audit summary

| Area | Before | After |
|---|---|---|
| TypeScript / ESLint / build | Passing | Passing: 0 errors, 0 warnings, 83 pages generated |
| Production dependencies (`npm audit`) | 12 vulnerabilities, including a **critical** Next.js proxy bypass | **0** (Next 16.2.9 → 16.3.8) |
| Public routes | 45 live routes; one orphaned thin page | 45 routes return 200; the thin page 308-redirects to its CMS equivalent |
| Lighthouse desktop (4 templates) | (not measured) | **100 / 100 / 100 / 100** on every template |
| Lighthouse mobile accessibility | 94–96 | **100** |
| Lighthouse mobile SEO / Best Practices | 100 / 100 | 100 / 100 |
| Lighthouse mobile performance | 86–93 | 86–98 (see §8) |
| Admin auth end-to-end (31 checks) | n/a | **31 / 31 pass** |

The audit was run by:
- reading the code (public site and dashboard)
- crawling the local production build: every sitemap URL plus aliases, checking status, title, description, canonical, OG and Twitter tags, h1 count, `<main>` count, image alt text and JSON-LD
- Lighthouse 12 (median of 3 runs) on the homepage, a landing page, a blog post and the contact page
- a scripted admin login and permission test against the production build

## 2. Bugs fixed

### Critical
1. **Next.js proxy-bypass CVE.** The proxy is the admin auth gate. Fixed by upgrading to 16.3.8.
2. **Leads without a city were never saved.** The production `leads.city` column was NOT NULL, but the field is optional. Fixed by migration 0003. Resend email history is the only record of the affected leads.
3. **The landing-page editor could never save.** Inactive tabs unmounted, so their fields were missing on submit. Fixed with `keepMounted`.
4. **Uploads over 1MB always failed,** and Vercel caps request bodies at about 4.5MB. Files now upload straight to Storage through signed URLs.
5. **Media Library catalog inserts failed** on the legacy `media.public_url` column. Fixed by migration 0003.
6. **Hero images and blog inline images would have been lost in the Sanity migration,** and drafts could have overwritten published pages. The migration was rewritten and verified.

### High
7. **Authors could edit, publish or unpublish other people's content.** Ownership checks now run on every update and toggle.
8. **The dashboard showed the audit trail to every role.** It's now gated by `canViewActivityLogs`.
9. **Deactivated users looped between the login page and the dashboard.** Fixed. A live session is also locked out the moment an account is deactivated.
10. **User actions didn't guard against self-demotion or deleting the last Super Admin.** Both are now enforced server-side.
11. **SVG uploads with scripts were allowed for any role.** SVG is now admin-only and checked for active content. Every upload's bytes are checked against its declared type.
12. **CMS text was put into JSON-LD unescaped.** A `</script>` sequence could have broken out of the tag. It's now escaped.

### Medium
13. Server-action error messages were redacted in production, so users only saw generic failures. Errors are now returned explicitly.
14. Forms wiped what the user had typed when validation failed (React 19 resets forms). Fixed.
15. Activity-log insert failures were silently swallowed. They're now logged.
16. Every page dropped the default OG image and `og:site_name`, because Next replaces nested metadata objects rather than merging them.
17. The canonical URL was undefined for most blog posts.
18. Landing-page FAQ answers were missing from the HTML even though the FAQPage schema claimed them.
19. Landing pages and the hub had nested `<main>` elements, and the hub's JSON-LD had conflicting `@id`s.
20. The sitemap listed non-canonical URLs (`/about`, `/category/learning`) and gave every page today's date.
21. The "AI match" finder showed fixed fake "92% match" results. It now filters real data.
22. The "Last updated" date was always today. Real CMS dates are used now.
23. The lead popup opened 2 seconds into every page view, an intrusive interstitial. It now opens once per session, after 12 seconds or 50% scroll.
24. White-on-orange text (`#F47C45`) had 2.7:1 contrast. Changed to `#C2410C` (5.2:1).
25. Heading-order issues: stat numbers were marked up as headings, and CMS heading levels could skip.
26. Fee ranges were parsed as one concatenated number, and per-semester fees were compared against full-programme totals.
27. Blog reading time counted JSON characters instead of words.
28. Admin dates rendered in UTC instead of IST.
29. Invalid blog dates crashed the editor. `/path` images were rejected. A blank university rating was stored as 0.
30. Deep unknown URLs got Next's default 404 page without the site layout.
31. Menu saves ignored insert errors, so a failed save could wipe the menu while the toast said "Saved".

## 3. SEO report

**Implemented:**
- **Metadata on every page:** title, description, canonical, robots, Open Graph (siteName, locale, 1200×630 image, article times), and Twitter card with image.
  - The share image is set in Global Settings, with `/og-default.jpg` as the fallback.
  - Homepage title de-duplicated.
- **Root metadata:** Google, Bing and Meta verification codes; configurable favicon; theme color; `max-image-preview:large`.
- **Structured data:** one entity graph with stable `@id`s.

| Schema | Where |
|---|---|
| Organization (logo, contactPoint, sameAs from social links, knowsAbout) | Every page |
| WebSite + SearchAction (`/blog?q=`) | Every page |
| BreadcrumbList (with visible breadcrumbs) | All pages except home and thank-you |
| CollectionPage + ItemList of CollegeOrUniversity → offers → Course / CourseInstance | 28 landing pages |
| FAQPage, only where FAQs are visible | Landing pages, homepage, contact, about, blogs with FAQs |
| BlogPosting (author, dates, publisher, image, keywords) | 5 blog posts and their aliases |
| ContactPage, AboutPage, CollectionPage | Contact, about, blog, hub |

- **Crawlability:**
  - The sitemap lists only canonical URLs: 40 URLs, 36 with real `lastmod` dates.
  - robots.txt blocks `/admin`, `/omc-adminlogin` and `/api/`.
  - Search-result pages (`/blog?q=`) are noindexed.
  - `/category/learning` now canonicalizes to `/blog`.
  - A global 404 page keeps the site navigation.
  - The thin north-zone page 308-redirects.
- **Internal linking:** breadcrumbs on every page, a Programs hub link, and descriptive "Read article" links.
- **Editor tooling:** the SEO page shows title and description lengths, duplicate titles, missing share images, noindexed published pages, and FAQ coverage.

**Remaining (editorial):** 5 CMS titles are over 60 characters, for example `/lucrative-career-…` at 82. The SEO page's "Needs work" filter lists them.

## 4. GEO report (AI engines: ChatGPT, Gemini, Claude, Perplexity, Copilot)

- **Entity clarity:** one Organization entity with a consistent name, contact details, area served, `knowsAbout` topics, and `sameAs` profiles once social links are entered. Contact details now come from one source, Global Settings, and are reused across the footer, contact page and schema. A stray personal Gmail address was removed.
- **`/llms.txt`:** generated from live CMS content. It covers what OMC is, its key pages, every comparison page by category, the guides, and quotable FAQ answers.
- **Citation-friendly facts:** every landing page has an "at a glance" summary computed from its own university data: count, full-programme fee range, the cheapest listed university, UGC and NAAC counts, and duration. It sits next to a crawlable `<table>` comparison, so the figures can't drift from the listings.
- **Semantic HTML:** one `<main>` and one `<h1>` per page, sequential headings, `<details>` FAQs, captioned tables with `th` and `scope`, `<time datetime>`, `<address>`, and a skip link.
- **Freshness signals:** real "Last updated" dates on landing pages and the hub, "Published" and "Updated" dates on blogs, and `dateModified` in the schema.

## 5. AEO report (AI Overviews, featured snippets, voice)

- **Question-phrased FAQ headings with direct answers.** The FAQ Manager tells editors to "start with a one-sentence answer".
- **All FAQ answers are server-rendered,** and the FAQPage schema now matches the visible content.
- **Answer-first summaries and comparison tables** on all 28 landing pages, the format featured snippets favour.
- **A real, explainable university finder:** it filters by budget and mode, then ranks by NAAC grade and fee. It no longer invents match scores.

## 6. Dashboard report

New or rebuilt modules (all responsive, with a drawer navigation below 1024px):

| Module | Capabilities |
|---|---|
| Dashboard | Lead stats, content counts, quick actions, System Health (DB, migrations, rate limiter, storage, email config), recent activity in IST |
| Leads | Inquiry, contact and newsletter tabs; search, status and date filters; status and notes; pagination; CSV and Excel export (formula-injection-safe) |
| FAQ Manager | Per-page placements, add and edit, drag or arrow reorder, drafts |
| Menus | Header, mobile and footer menus; drag or arrow reorder; open-in-new-tab; validated links; rollback on failed save |
| Global Settings | General, Branding (logo, favicon, share image), Social Links, Analytics & Verification (GA4, GTM, Pixel, Clarity, Google, Bing, Meta), all validated per field |
| Media Library | Direct-to-Storage uploads, multi-file drag-and-drop, auto-resize and WebP compression, categories, search, alt text and rename, copy URL, **Replace** (updates every page using the file), usage warning on delete |
| Media picker | Used for hero, blog featured image, share images, university logos and testimonial photos |
| SEO | Page-by-page search-engine view with issue filter |
| Users | Usernames, role and active status, password reset (12+ characters with mixed case and digits), protection for self and the last Super Admin |
| Sanity Sync | Preview and import, run history, webhook setup |

**Hybrid CMS:**
- The dashboard is primary. Sanity is a read-only fallback, used when Supabase is down or a slug has never existed in the dashboard.
- The import from Sanity is insert-only, so it can't create duplicates and dashboard edits always win.
- Tombstones stop deleted content from being revived.
- Sanity content is never modified. This was verified by a before-and-after fingerprint during the migration.

**Not built:**
- Live preview and per-field content-history diffs. Activity logs do keep the previous and new values.
- Bulk lead actions.
- Leads export is capped at 10,000 rows per file.

## 7. Security report

| Control | Implementation |
|---|---|
| Authentication | Supabase Auth; username or email login at `/omc-adminlogin`; credentials live only in Supabase, never in code |
| Brute force | Shared Postgres rate limiter: 20 attempts per 15 minutes per IP, 5 per account (plus Supabase's own limits) |
| Authorization | Proxy gate, plus a `requirePermission` check in every Server Action, route handler and page; ownership checks for authors; leads restricted to admins |
| Sessions | httpOnly Supabase cookies; deactivation revokes access immediately and signs the user out |
| CSRF | Next's Server Action origin check; same-origin and content-type checks on JSON APIs |
| Forms | zod validation, honeypots, 5 submissions per 10 minutes per IP, HTML-escaped emails |
| Uploads | Signed one-time URLs, magic-byte and decode checks, 10MB cap, safe-SVG check (admins only), random storage paths |
| Headers | HSTS, frame-ancestors, nosniff, Referrer-Policy, Permissions-Policy, no `x-powered-by`; admin pages `no-store` and `noindex` |
| Secrets | Constant-time comparison for revalidate and webhook secrets; Bearer authentication; seeding scripts read passwords from the environment |
| Data | Row-level security enabled on every table; the service-role key is server-only; analytics accepts IDs only, never raw HTML |
| Dependencies | 0 production vulnerabilities |

**Residual:**
- Analytics tags are allowed by design, so there is no script-src CSP (frame-ancestors only).
- Abandoned uploads can leave small files under `incoming/` in Storage.

## 8. Performance report

Lighthouse 12 on a local production build, median of 3 runs. `main` is the baseline at `8bfb7a6`.

| Page | Mobile perf (main → branch) | Mobile accessibility | Desktop (all categories) |
|---|---|---|---|
| Home | 86 → 86–89 | 96 → 100 | 100 |
| Landing page | 90 → 87–91 | 96 → 100 | 100 |
| Blog post | 90 → 93–96 | 94 → 100 | 100 |
| Contact | 93 → 97–98 | 95 → 100 | 100 |

CLS is 0.000 everywhere and TBT is 36–200ms.

**Changes:**
- removed the 20+ `blur-3xl` and `backdrop-blur` effects, which were costly to paint on throttled CPUs
- no new client JavaScript on public pages beyond the newsletter form
- analytics loads `afterInteractive` or `lazyOnload`
- image sizes are set, and uploads are compressed to WebP

**What I tested that didn't help:**
- `font-display: optional`: no change
- `content-visibility` on below-the-fold sections: no improvement, reverted

**Why mobile LCP is still around 3.3–3.5s:** the LCP element is hero text, and the time comes from simulated "render delay" (style and layout of the initial document plus hydration under 4× CPU throttling). This was already the case on `main`; it isn't a regression. Observed (unthrottled) LCP equals FCP at about 1.5s.

**Mobile 95+ on home and landing pages is not yet met.** The next steps, in order:
1. Make the header a server component, so only the mobile menu ships JavaScript.
2. Make `university-grid` and `landing/specializations` server components (they're client components only for click handlers).
3. Trim the homepage to fewer sections above 2 screens.
4. Measure field data (CrUX or Vercel Speed Insights) before further tuning, because lab scores on this machine vary ±3–5.

## 9. Production readiness

**Before deploying, you must:**
1. **Apply migration 0003** (`supabase/migrations/0003_fix_legacy_not_null.sql`) in the Supabase SQL Editor. Until then, leads without a city aren't saved and Media Library uploads fail. I couldn't apply it myself because the `SUPABASE_ACCESS_TOKEN` in `.env.local` was rejected (401).
2. **Apply migration 0004** (`0004_dashboard_modules.sql`) for FAQs, media categories, sync history and tombstones. Then run `npm run migrate:cms` once to catalog the 88 migrated images in the Media Library.
3. **Create the real admin account** (it doesn't exist yet: 0 profiles):
   `ADMIN_PASSWORD='…' node scripts/create-super-admin.mjs <email> --username abhiadmin`
   then check it with `ADMIN_PASSWORD='…' node scripts/verify-admin.mjs abhiadmin` (expected: "All checks passed.").
4. **In Vercel:** add `SANITY_WEBHOOK_SECRET` and confirm the other variables listed in `docs/cms-deployment.md` §6. Optionally create the Sanity webhook (§5b).

**Then verify on a preview deploy:**
- submit one real enquiry, with and without a city, and confirm the lead row is saved and both emails arrive (not tested locally, to avoid production writes and emails)
- upload an image in the Media Library
- the dashboard's System Health card should be all green

**Verified locally:** build, types, lint, dependencies, all public routes, metadata and schema crawl, Lighthouse, and the 31-check admin authentication and permission end-to-end run (using temporary accounts, which were deleted afterwards).

**Known minor items:**
- The floating "Select University" bubble overlaps content at the bottom left on phones. This predates the branch.
- Hardcoded homepage marketing figures disagree: "5000+ students" vs "10,000+" on landing pages. This needs an editorial decision.
- 5 CMS titles are over 60 characters.
