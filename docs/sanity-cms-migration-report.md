# Sanity CMS Migration — Audit & Implementation Report

**Date:** 2026-07-30 – 2026-07-31
**Scope:** Full audit, fix, and CMS migration of landing pages, blog posts, universities, testimonials and SEO onto Sanity, per the original brief's 11-section spec.
**Status:** Migration complete and live.

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

## 9. Remaining recommendations (not done — lower priority / explicitly deferred)

1. **`top-colleges-university-in-north-zone`** is a bespoke static page (`app/(site)/top-colleges-university-in-north-zone/page.tsx`) that renders the same components with no data (all defaults) — its original real content (`src/constants/north-zone-universities.ts`) was already dead/deleted before this session. Recommend migrating it into Sanity as a 28th `landingPage` document and deleting the static route so the dynamic `[slug]` route serves it like the other 27.
2. **No testimonial content exists yet** — someone will need to add real student testimonials through Studio.
3. **Populate real `brochureUrl`/`websiteUrl`** for the 30 universities currently missing them.
4. **`npm audit`** currently reports 37 vulnerabilities (9 moderate, 28 high) in the dependency tree — pre-existing, unrelated to this work, flagged here since `npm install` surfaced it; worth a separate look.
5. Consider adding a **Sanity webhook** (Settings → API → Webhooks in manage.sanity.io) pointed at `/api/send-email/revalidate?secret=...` so Studio publishes automatically trigger revalidation, if that isn't already configured.
6. **Rotate the API token** used for this migration if it was only intended for one-time use, or keep it scoped/labeled clearly (e.g. "migration-script") if it stays in `.env.local` for future content operations.
