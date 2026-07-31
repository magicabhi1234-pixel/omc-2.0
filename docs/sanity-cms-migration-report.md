# Sanity CMS Migration — Audit & Implementation Report

**Date:** 2026-07-30 – 2026-07-31
**Scope:** Full audit, fix, and CMS migration of landing pages, blog posts, universities, testimonials and SEO onto Sanity, per the original brief's 11-section spec.
**Status:** Migration complete and live. See §11 for a follow-up production incident (Studio crash + empty blog listing) and its resolution.

---

## 1. Audit findings

The project already had a partial Sanity integration, but it was not usable as a real CMS:

- **Schema mismatch with the app**: `university`, `landingPage`, `blogPost` schemas didn't match the shapes the React components actually consumed (e.g. an `approval` object type with a free-text `name` field instead of a fixed list of strings; a fake `status` draft/published string field duplicating Sanity's native draft system).
- **Orphaned schema objects**: `fee.ts`, `course.ts`, `placement.ts`, `approval.ts` were defined but never referenced by any document — dead schema code.
- **No query/fetch layer**: there was no GROQ query file, no image URL helper, no resilient fetch wrapper. `src/lib/sanity.ts` only exported a bare client.
- **Everything was still static**: all 27 landing pages, all 5 blog posts, and the ~99-university catalog lived in hardcoded `src/data/*.ts` files. Sanity was wired up but nothing in the app actually read from it.
- **Blog content was markdown-in-a-string**, rendered by a hand-rolled parser (`blog-content.tsx`), not Portable Text — not CMS-editable as rich text.
- **Live dataset had stale/legacy content**: 31 university documents and 1 landing page (`south-online-mba`) already existed in the Sanity dataset from an earlier partial attempt, with schema drift (one university had `approvals` in an old `{_type:"approval", name}` shape; another had `approvals: null`). This is what caused a real production build crash once the app started reading from Sanity (see §2).
- **`@portabletext/react` and `@sanity/image-url`** were used in code but only resolved as *transitive* dependencies (via `sanity`/`next-sanity`), not declared in `package.json` — a latent risk of the exact version drifting silently.
- **Sanity Studio** used the bare default `structureTool()` — a flat, undifferentiated document list, not friendly for non-technical editors.

---

## 2. Issues fixed

| Issue | Fix |
|---|---|
| Production build crashed prerendering `/south-online-mba`: `TypeError: Cannot read properties of null (reading 'startsWith')` | Root cause: one live university document had `approvals` in a stale pre-schema-rewrite shape, another had `approvals: null`. Hardened `university-grid.tsx`'s badge helpers to filter out malformed/missing entries defensively — appropriate here since Sanity content is an external, non-technical-editor-writable boundary, not internal-only data. |
| `@sanity/image-url` "default export deprecated" build warning | Switched `src/lib/sanity/image.ts` to the named `createImageUrlBuilder` export. |
| `@portabletext/react` / `@sanity/image-url` only transitively resolved | Added both as explicit `package.json` dependencies, pinned to the versions already in use (avoided an accidental downgrade caught during verification — see §7). |
| Orphaned schema objects (`fee`, `course`, `placement`, `approval`) | Deleted; `ranking` rewired to the `{source, value}` shape the app actually uses. |
| `revalidateTag(tag, "max")` flagged during audit | Checked against this project's vendored Next.js docs (`node_modules/next/dist/docs/`, per `AGENTS.md`) since this fork has non-standard cache APIs. Confirmed the two-argument form is correct and required in this version — **not a bug**. However, since this route is a CMS webhook where editors expect a just-published change to be live immediately (not eventually-consistent), switched the profile from `"max"` (stale-while-revalidate) to `{ expire: 0 }` (immediate), per the docs' own guidance for exactly this use case. Also removed `universities`/`seo`/`header`/`footer` tags from the revalidation list since nothing was ever tagged with them (dead code) and added the now-real `testimonial` tag. |
| Homepage testimonials were 100% hardcoded, disconnected from the new `testimonial` document type | Added `getDefaultTestimonials()` to the registry and wired `src/components/home/testimonials.tsx` to fetch from Sanity, falling back to the existing copy if no testimonial documents exist yet. |
| SEO fields (`metaTitle`/`metaDescription`) were optional at the schema level | Made both `Rule.required()` — the parent `seo` object being required didn't stop an editor from leaving them blank, which is a real content-safety gap on a lead-gen SEO site. |

---

## 3. Schema (Sanity Studio)

**Documents** (`sanity/schemaTypes/documents/`):
- `university.ts` — name, slug, logo (required), featured, studyMode (radio), duration, eligibility, startingFee, emi, placementSupport, rating, reviewCount, approvals (fixed list: UGC/AICTE/DEB/AIU/AMBA/NAAC A++/NAAC A+/NAAC A), rankings, brochureUrl/websiteUrl (URL-validated).
- `landingPage.ts` — title, slug, category (6-option list), region (north/south/east/west/none, optional), hero, universitySection (badge/heading/description), universities (array of refs, min 1), compareSection, whyChoose, stats, specializations, scholarshipBanner, testimonialsHeading + testimonials (refs — empty means "use sitewide default"), faq, cta, seo.
- `blogPost.ts` — title, h1, slug, featuredImage (required), excerpt, content (Portable Text: headings h2–h6, bullet/numbered lists, bold/italic, link annotations, a custom table block, inline images), author, publishedDate, category, tags, faqs, relatedPosts (max 6), seo.
- `testimonial.ts` (new) — name, designation, university (free text), image, review, rating (1–5).

**Objects** — new: `compareSection`/`compareFeature`, `whyChooseSection`/`whyChooseItem`, `statsSection`/`statCard`, `specializationSection`/`specializationItem`, `scholarshipBanner`, `faqSection`, `tableBlock`/`tableRow`. Modified: `ranking`, `faq`, `hero`, `cta`, `seo` (tightened validation). Removed: `fee`, `course`, `placement`, `approval`.

**Studio structure** (`sanity/structure.tsx`, new): custom desk grouping — Landing Pages (sub-grouped by category, plus an "All" view), Universities, Blog Posts, Testimonials, each with sensible default sort order and icons. Any future document type not in this curated list still appears automatically below a divider, so the structure doesn't need code changes to stay complete as the schema grows.

---

## 4. Query & data layer (`src/lib/sanity/`, new)

- **`client.ts`** — read client (CDN-enabled) + write client (migration-only) + `sanityFetch()`, a resilient wrapper that returns a caller-supplied fallback instead of throwing on a Sanity outage.
- **`image.ts`** — `urlForImage()` / `resolveImage()` via `@sanity/image-url`.
- **`queries.ts`** — all GROQ, including the projections that reshape flat Studio-friendly fields (e.g. `primaryButtonText`, `stat1Value`) into the object/array shapes the React components expect (e.g. `primaryButton: {label, variant}`, `stats: [...]`). This keeps Studio editing simple (flat fields) while the app's component API stays unchanged.
- **`mappers.ts`** — `mapLandingPage()` composes the GROQ result into the exact `LandingPageData` shape components already use.

`src/data/registry.ts` now exposes async, Sanity-backed accessors (`getAllLandingSlugs`, `getLandingPageBySlug`, `getLandingPagesForHub`, `getAllBlogSlugs`, `getBlogPostBySlug`, `getBlogPostsByDate`, `getDefaultTestimonials`) — all `sitemap.ts`, the `[slug]` and `blog/[slug]` routes, the `/landing-pages` hub, and the homepage now read through this layer instead of static files.

Blog rich content now renders via `src/components/blog/portable-text-content.tsx` (new), matching the old design's exact Tailwind classes — headings, lists, marks, custom link annotations, table blocks, and inline images.

---

## 5. Dead code removed

`src/data/landing-pages/`, `src/data/blog-posts/`, `src/data/universities/`, plus the always-empty scaffolding directories (`compare`, `faqs`, `stats`, `testimonials`, `navigation`) and `src/data/index.ts`. The old markdown blog parser `src/components/blog/blog-content.tsx` and the old `src/lib/sanity.ts` were also removed, fully superseded by the new layer.

---

## 6. Migration — executed

The migration script (`scripts/_migrate-source/migrate.ts` + a hand-written `portable-text.ts` converter, both temporary and now deleted post-run) pushed the real content into Sanity, then was removed from the repo:

- **Source data recovered from git history** — the static files this migration deprecated were deleted as part of this work; their last-committed versions were the real 99 universities / 27 landing pages / 5 blog posts from earlier this session, fully intact in git history at the time.
- **Image uploads**: every university logo, hero image, and blog featured image was uploaded as a real Sanity asset, cached so a shared image (e.g. the default hero image reused across pages) was only uploaded once.
- **Markdown → Portable Text conversion**: headings (h2–h6), bullet lists, bold, links (including bold-nested-inside-a-link), and the one post with a raw HTML `<table>` (converted to the custom `tableBlock` type).
- **Placeholder data handled explicitly, not guessed**: 30 of 99 universities had literal `"#"` placeholders for `brochureUrl`/`websiteUrl` — these fields were omitted for those records rather than writing an invalid URL.
- **Idempotent**: every document used a deterministic `_id` (e.g. `university-amity-online`) and `createOrReplace`.

### What actually happened during the run

1. **Token issue**: the initial `SANITY_API_TOKEN` was a session/cookie value, not a real API token (`Unauthorized - Session does not match project host`). Fixed by generating a proper Editor-permission token at manage.sanity.io.
2. **Stale-document delete initially failed**: the pre-existing dataset had a **draft** landing page and a **draft** university (2 documents) that the read-only audit hadn't surfaced, because the CDN-backed client never returns drafts. One draft referenced the other, so the first delete attempt hit a `documentHasExistingReferencesError`. Fixed by re-querying with the write client at `perspective: "raw"` (34 stale documents total, not 32) and deleting referencing documents (landing pages/testimonials) in a separate, earlier transaction from the referenced documents (universities).
3. **One transient `ECONNRESET`** partway through university creation — a network blip, not a data issue. Because the script is idempotent, it was simply re-run from the top; already-created documents were harmlessly overwritten with identical data via `createOrReplace`, and the run completed cleanly the second time.
4. **A leaked-secret near-miss**: the first failed run's error object (piped to a log file for debugging) included the raw `Authorization: Bearer sk...` header in plaintext. Caught immediately — the log file was deleted before being read or shared further, and all subsequent runs avoided writing raw error dumps to disk.

## 7. Verification performed

- `npx tsc --noEmit` — clean.
- `npx eslint . --ext .ts,.tsx` — clean (0 errors, 0 warnings).
- `npx next build` — clean. **49 pages generated** (up from 18 before migration): all 27 landing pages and all 5 blog posts now individually statically generated from live Sanity content, plus the static/dynamic routes.
- **Reference integrity** (queried directly against the live dataset after migration): 0 landing pages with dangling university references; 0 universities missing logo/slug; 0 landing pages missing SEO or universities; 0 blog posts missing required fields (featured image, SEO, content). Total of 607 university references across all 27 pages, matching the pre-migration dry-run exactly.
- **Image assets**: spot-checked a university logo and a blog featured image — both resolve to real, working `cdn.sanity.io` URLs.
- **Content fidelity**: spot-checked the blog post with the HTML table and inline links — the table, headings, and link structure all came through correctly in Portable Text.
- **Live rendering**: started the production server and confirmed real content on a landing page (`top-distance-mba-in-digital-marketing` — correct `<title>`, real university names like Amity/LPU/NMIMS rendering as cards), a blog post (`symbiosis-online-mba` — correct title), the `/landing-pages` hub (34 real links), and `/sitemap.xml` (39 URLs: 6 static + 27 landing + 5 blog + 1 hub).
- **Caught and fixed a stale-sitemap issue post-migration**: the very first `next build` immediately after the migration ran before Sanity's CDN had fully propagated the new content, so `sitemap.ts`'s tagged fetch was cached by Next.js's persistent Data Cache with a stale result (old `south-online-mba` slug, missing the 27 new pages). A subsequent rebuild reused that same stale cache (nothing had invalidated the tag). Fixed with a clean rebuild (`rm -rf .next`) once the CDN had caught up — confirmed via a direct, non-CDN query that the dataset itself was correct throughout; this was purely a build-cache timing artifact, not a data or code bug.
- Also caught and corrected a real mistake earlier in this work: installing `@portabletext/react`/`@sanity/image-url` without pinning first silently downgraded them, breaking `tsc` — caught immediately, fixed by reinstalling at the versions already in use.

---

## 8. Final migration results

| Content type | Created | Updated | Skipped | Notes |
|---|---|---|---|---|
| Universities | 99 | 0 | 0 | All 99 from the source catalog; all have logos, all reference fields resolved |
| Landing pages | 27 | 0 | 0 | All 27 registry pages; 607 total university references, 0 dangling |
| Blog posts | 5 | 0 | 0 | Full Portable Text content, including 1 table and multiple link/bold cases |
| Testimonials | 0 | 0 | 0 | None existed in the source data to migrate — see recommendation below |
| Stale/legacy documents removed | — | — | 34 deleted | 32 published + 2 drafts from the pre-existing partial Sanity setup |

**Content requiring manual review:**
- **30 universities** have no `brochureUrl`/`websiteUrl` (source data only ever had `"#"` placeholders for these) — cosmetic in the UI (buttons/links using these fields just won't render), but worth populating with real URLs through Studio when available.
- **No testimonials exist** — the schema and Studio UI are ready; add real student testimonials through Studio to replace the homepage's hardcoded fallback copy.
- **`top-colleges-university-in-north-zone`** remains a separate static page outside the CMS (see recommendation below) — everything else asked for is now live and CMS-driven.

---

## 9. Vercel build failure — root cause and fix

**Symptom:** `Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET environment variables` during the Vercel build.

**Root cause:** `.gitignore` has a blanket `.env*` rule, which excludes *every* env file — including `.env` (which locally holds `NEXT_PUBLIC_SANITY_PROJECT_ID`/`DATASET`/`API_VERSION`) and `.env.local`. Neither file is committed to git, so Vercel's build — which only has access to what's in the repository plus whatever is configured in its own dashboard — never had these variables at all. Locally the build always worked because both files happen to exist on disk with the same values, masking the gap.

Compounding this: `src/lib/sanity/client.ts` threw synchronously at module scope if these vars were missing. Since that module is imported (transitively, via the registry) by nearly every route — `sitemap.ts`, `[slug]`, `blog/[slug]`, `blog`, `landing-pages`, the homepage — the very first route Next.js touched during "Collecting page data" crashed the *entire* build. `sitemap.xml` happened to be the one named in the error, but the same throw would have fired for any of them; it wasn't sitemap-specific.

**Fixes applied:**
1. **`src/lib/sanity/client.ts`** no longer throws. Missing config now logs a clear `console.error` and falls back to a placeholder string for `createClient` (which requires non-empty values but does not validate they're real) — any resulting fetch fails at request time and is caught by `sanityFetch`'s existing try/catch, degrading to the caller's `fallback` (e.g. an empty page list) instead of crashing the build or the page. Verified locally by building with the Sanity vars stripped from the environment — build succeeded with 0 errors.
2. **`.env.example`** now documents every Sanity variable the project actually uses (grepped the full codebase to confirm), so this gap is visible to anyone setting up a new environment.

**What you still need to do:** add the variables to Vercel itself (Project → Settings → Environment Variables) — code-level resilience means a missing var won't crash the build anymore, but the deployed site still needs real values to actually serve CMS content instead of empty fallbacks. See the next section for the exact variables and values.

---

## 10. Remaining recommendations (not done — lower priority / explicitly deferred)

1. **`top-colleges-university-in-north-zone`** is a bespoke static page (`app/(site)/top-colleges-university-in-north-zone/page.tsx`) that renders the same components with no data (all defaults) — its original real content (`src/constants/north-zone-universities.ts`) was already dead/deleted before this session. Recommend migrating it into Sanity as a 28th `landingPage` document and deleting the static route so the dynamic `[slug]` route serves it like the other 27.
2. **No testimonial content exists yet** — someone will need to add real student testimonials through Studio.
3. **Populate real `brochureUrl`/`websiteUrl`** for the 30 universities currently missing them.
4. **`npm audit`** currently reports 37 vulnerabilities (9 moderate, 28 high) in the dependency tree — pre-existing, unrelated to this work, flagged here since `npm install` surfaced it; worth a separate look.
5. Consider adding a **Sanity webhook** (Settings → API → Webhooks in manage.sanity.io) pointed at `/api/send-email/revalidate?secret=...` so Studio publishes automatically trigger revalidation, if that isn't already configured.
6. **Rotate the API token** used for this migration if it was only intended for one-time use, or keep it scoped/labeled clearly (e.g. "migration-script") if it stays in `.env.local` for future content operations.

---

## 11. Production incident: Studio crash + empty blog listing (2026-07-31, post-migration)

**Reported symptoms:** `https://omc-2-0.vercel.app/studio` crashed; `/blog` loaded successfully but showed "No articles found"; the migration itself was already confirmed complete (99 universities / 27 landing pages / 5 blog posts in the dataset).

Everything below was verified directly against the codebase and live production configuration — nothing here is assumed.

### 1. Root cause of Studio crash

`sanity.config.ts` read `projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!` and `dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!` with non-null assertions and no fallback. Checked Vercel's actual configured environment variables directly via `vercel env ls` (authenticated CLI, project linked): **the omc-2-0 Vercel project had zero Sanity-related environment variables in Production or Preview.** `NEXT_PUBLIC_*` variables are inlined into the client JavaScript bundle at *build* time, not read at runtime - so the deployed Studio bundle had `projectId: undefined` baked directly into it. When the Studio single-page app booted in the browser, Sanity's own client initialization throws `Configuration must contain \`projectId\`` (reproduced this exact throw locally against `@sanity/client`) - crashing the app.

### 2. Root cause of missing blogs

Same underlying gap (missing env vars), different symptom because of a fix already in place: `src/lib/sanity/client.ts` (hardened in the previous session) doesn't throw on missing config - it falls back to a placeholder value so `createClient` can construct, and lets the resulting fetch fail at request time, caught by `sanityFetch`'s try/catch, returning the caller's `fallback` (an empty array for the blog listing). So the page rendered successfully with zero posts instead of crashing - "loads successfully, No articles found" is exactly what that resilience mechanism looks like when its root cause (missing env vars) is never fixed. This also meant landing pages, universities, and testimonials were silently degraded in production the same way, not just blog - confirmed once the fix was deployed (see §5-6 below).

**How this happened, reconstructed from Vercel's own deployment history** (`vercel ls` / `vercel inspect`):
- The very first deploy of the full migration work (6h before this incident, commit `f76461d`) **hard-failed the build** with the exact "Missing NEXT_PUBLIC_SANITY_PROJECT_ID..." error - because the env vars were never in Vercel and `client.ts` still threw at module scope at that point.
- A later deploy (`57d827d`, the `client.ts` resilience fix from the previous session) **succeeded** - but only because it stopped the crash, not because the env vars were added. Studio was still crashing (its config never got the same treatment) and all Sanity-backed content was silently empty.

### 3. Verification of the full data flow (all checked directly, not assumed)

| Check | Result |
|---|---|
| Same `projectId`/`dataset` in migration script, `src/lib/sanity/client.ts`, `sanity.config.ts`, `sanity.cli.ts` | Yes - all read `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET`, no hardcoded divergent values anywhere in this project |
| Vercel Production env vars (`vercel env ls`) | 0 Sanity vars before fix; all 5 present after |
| Vercel Preview env vars | Same gap, same fix applied |
| Document types created by migration vs. expected by queries | Match (`university`, `landingPage`, `blogPost` - verified in the original migration report, §7-8) |
| Published vs. draft state of migrated content | All migration-created documents are published (not drafts) - `createOrReplace` targets real document IDs directly |
| GROQ query filters / slug generation / references | Unchanged since the original migration - already verified with 0 dangling references, 607 university refs across 27 pages |
| ISR/static generation | `next build` produces 49 static pages (27 landing + 5 blog + others) from live data once env vars were present |
| Sanity token permissions | Editor-level token, confirmed via successful `sanityWriteClient` write test in the original migration |

### 4. Files modified this incident

- `sanity.config.ts` - removed the non-null assertions; added a `console.error` diagnostic and safe empty-string fallback so a future misconfiguration logs clearly instead of crashing opaquely (Studio still can't function without real values - there's no meaningful "degraded mode" for an editor tool, unlike the public site).
- `tsconfig.json`, `eslint.config.mjs`, `.gitignore` - removed the `omc-test` exclusions/ignores, now dead since it's been moved out of the project (see §7).
- Vercel project configuration (via CLI, not a file in this repo): added `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `NEXT_PUBLIC_SANITY_USE_CDN`, `SANITY_API_TOKEN` to both Production and Preview environments, using the same values already in `.env.local`.

### 5. Fixes implemented

1. Added all 5 Sanity environment variables to Vercel Production + Preview (verified present via `vercel env ls` afterward).
2. Hardened `sanity.config.ts` against missing config (defense in depth, matching the pattern already used in `client.ts`).
3. Committed and pushed both fixes, confirmed each resulting Vercel deployment reached `Ready` status (polled via `vercel ls`).

### 6. Confirmation Studio works on production

`https://omc-2-0.vercel.app/studio` returns HTTP 200 and serves a normal-sized Studio application shell (no server-side error page, no baked-in "Configuration must contain" text). **Caveat, stated plainly:** no browser/headless-browser tool was available to open dev tools and confirm the client-side app fully hydrates and an editor can click through documents - this verification is as far as available tooling could go. The specific failure mode reproduced and fixed (undefined `projectId` at build time) is resolved because the variables are now genuinely present in the build; if anything else is wrong with Studio specifically, it would be a new, different issue.

### 7. Confirmation blogs render correctly on production

Verified directly (not assumed) via live HTTP fetches, both before and after the fix, and again after the follow-up cleanup deploy:
- `/blog`: no longer shows "No articles found" - all 5 real post titles render (LPU Online MBA Colleges, Symbiosis Online MBA, Sikkim Manipal University Online MBA, Lucrative Career in Data Science..., Online MBA in International Business).
- `/blog/symbiosis-online-mba`: HTTP 200, correct SEO `<title>`, the post's HTML table block renders, 24 real `cdn.sanity.io` image references present.
- `/sitemap.xml`: 39 URLs (6 static + 27 landing + 5 blog + 1 hub), no stale slugs.

### 8. Confirmation landing pages, universities, and blogs use the same Sanity source

`/top-distance-mba-in-digital-marketing` (a landing page) serves 40 real `cdn.sanity.io/images/9net5r17/production/...` image references - same project ID (`9net5r17`) and dataset (`production`) as the blog posts and the migration itself. `/landing-pages` hub returns 34 real links. This is the same single dataset end-to-end: Studio, the website's read client, the migration script, and now Vercel's environment all point at `9net5r17` / `production` - confirmed by direct inspection of each, not inferred.

### 9. `omc-test` cleanup

Found: `omc-test` was a separate git repository (own `.git`, own `.vercel` project called "omc-test-studio", a *different* Vercel project ID from omc-2-0) that had been sitting inside the omc-2.0 project folder. Its `sanity.config.ts` was hardcoded to the exact same `projectId: '9net5r17', dataset: 'production'` as this project - a duplicate Studio pointed at the same live content, though deployed independently and not the cause of this incident (different Vercel project entirely).

Before touching it, checked its git state directly: clean working tree, but **no git remote configured at all** - its history existed only on this local machine, and deleting it would have destroyed 2 commits' worth of history with no backup anywhere (its separate Vercel deployment only has the built output, not the source). Flagged this to the user before acting.

**Resolution:** moved (not deleted) to `C:\Users\sudhi\Documents\omc-test-archived`, fully preserving its git history. Removed the now-dead `omc-test` carve-outs from `tsconfig.json`, `eslint.config.mjs`, and `.gitignore`. The separate "omc-test-studio" Vercel project and its deployment were left untouched, per the user's choice - only the local folder was archived out of this repo.

### 10. Final production-ready Sanity architecture

One single Sanity project (`9net5r17`) and dataset (`production`), used consistently by:
- **Studio** (`sanity.config.ts`, served at `/studio` on the omc-2-0 Vercel deployment) - now correctly configured in production.
- **The website** (`src/lib/sanity/client.ts` → `queries.ts` → `mappers.ts` → `src/data/registry.ts` → pages) - resilient to transient Sanity outages by design, now actually configured in production too.
- **No other Sanity project or dataset exists anywhere in the active codebase.** The one duplicate config (`omc-test`) has been archived outside the project entirely.

Environment variables are the single source of truth for project/dataset identity, consistently named (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`) across the app, Studio, the CLI config, and the (now-deleted) migration script - and are now present in every environment that needs them: local `.env`/`.env.local`, and Vercel Production + Preview.
