# Sanity → Custom CMS Migration: Phase 1 Analysis

Date: 2026-08-07. Scope: complete replacement of Sanity CMS with a custom Supabase-backed CMS, frontend to remain pixel-identical.

## 1. Sanity content types (4 documents, 22 object types)

| Document | Key fields | Relationships |
|---|---|---|
| `university` | name, slug, logo{url,alt}, featured, studyMode (enum), duration, eligibility, startingFee, emi, placementSupport, rating, reviewCount, approvals[] (enum tags), rankings[]{source,value}, brochureUrl, websiteUrl | referenced by `landingPage.universities[]` |
| `landingPage` | title, slug, category (enum), region (enum), hero, universitySection, universities[]→university (min 1), compareSection, whyChoose, stats, specializations, benefits, careerScope, highlightBanner, faq, testimonialsHeading, testimonials[]→testimonial, cta, seo | references university (many), testimonial (many) |
| `blogPost` | title, h1, slug, featuredImage{url,alt}, excerpt, content (Portable Text: blocks/tableBlock/image, `link` mark), author, publishedDate, category (free text), tags[], faqs[], relatedPosts[]→blogPost (max 6), seo | self-referencing (relatedPosts) |
| `testimonial` | name, designation, university (free text), image{url,alt}, review, rating (1-5) | none (referenced by landingPage) |

All embedded object types (hero, cta, seo, faqSection, compareSection, whyChooseSection, statsSection, specializationSection, benefitsSection, careerScopeSection, highlightBanner, universitySection, ranking, faq, tableBlock) are nested structs with no independent identity — they map to JSONB columns on their parent row, not separate tables.

## 2. Data-access seam (the thing that must stay identical)

`src/data/registry.ts` exports exactly 8 things, each with a fixed TS return shape (`src/types/landing.ts`, `src/types/blog.ts`): `staticPages`, `getAllLandingSlugs`, `getLandingPageBySlug`, `getLandingPagesForHub`, `getDefaultTestimonials`, `getAllBlogSlugs`, `getBlogPostBySlug`, `getBlogPostsByDate`. Every consumer (`app/(site)/**`, `app/sitemap.ts`) imports only from this file. **Reimplementing these 8 exports against Supabase with identical signatures/shapes is the entire frontend-compatibility strategy** — no consuming component needs to change.

## 3. SEO fallback chains (currently baked into GROQ, must be replicated in code)

- `title`: `metaTitle` → document `title` → document `h1`
- `description`: `metaDescription` → document `excerpt` (blog only)
- `robots`: `noIndex` → `"noindex"` else `"index,follow"`
- `canonical`/`ogImage`: no fallback at the query level; app-level fallbacks exist per-route (landing pages fall back to `SITE.url + slug`; blog falls back to hero image for OG)

## 4. Image handling

Sanity images are pre-resolved to `{src, alt}` (or a bare URL string) at the GROQ layer — components never touch Sanity's image API directly except one inline-content-image case in `portable-text-content.tsx`. Replacement: media stored in Supabase Storage, URLs resolved at write time (media library upload returns a public URL immediately, stored directly on the content row — no runtime URL-building step needed, which is actually simpler than Sanity's asset-reference indirection).

## 5. Non-Sanity structural content (explicitly requested as CMS-manageable, currently hardcoded)

Header nav (`src/constants/navigation.ts`), footer (`src/components/layout/footer/footer.tsx` — About blurb, Quick Links, contact info, copyright), and site-wide constants (`src/constants/site.ts`) are plain hardcoded TS/JSX today — never touched Sanity. These get new tables (`navigation_items`, `site_settings`) and their two consuming components get a minimal, behavior-preserving swap from hardcoded arrays to a DB read.

**Explicitly out of scope for this pass**: the homepage's Hero/TrustedUniversities/Specializations/WhyOMC/Comparison/FAQ/CTA sections and the fully-static pages (`about`, `about-us`, `contact`, `privacy-policy`, `terms-and-conditions`, `thank-you`) are hardcoded React with zero data layer today — they were never Sanity content, so "migrate all existing Sanity content" doesn't reach them, and rewiring currently-stable hardcoded marketing sections onto a new content source is a materially different, riskier change than a content-source swap. Flagged here rather than silently expanded in scope.

## 6. Content volume (from `docs/sanity-cms-migration-report.md`, to be re-verified against live data at migration time)

99 universities, 27 landing pages, 5 blog posts, 9 testimonials.

## 7. Recommended database design

Hybrid model: **dedicated typed tables** for the 4 known content types (query efficiency, type safety, direct shape-matching to existing TS types) + **junction tables** for the 2 real many-to-many relationships (`landing_page_universities`, `landing_page_testimonials`, plus `blog_post_related` for self-referencing related posts) + a **generic `content_blocks` table** (arbitrary `content_type` + JSONB `data`) so future content types never require a schema migration, satisfying "scalable, not page-specific." Embedded structs (hero, cta, sections, seo) become JSONB columns rather than normalized tables — they have no independent identity or reuse pattern in the source schema, and forcing them into separate tables would only add join complexity with no benefit.

Full entity list, SQL, indexes, FKs, RLS and migration scripts follow in `supabase/migrations/0001_cms_schema.sql` and `scripts/migrate-sanity-to-supabase.mjs`.

## 8. Migration complexity assessment

- **Low risk**: university, testimonial (flat documents, no nested rich content).
- **Medium risk**: landingPage (many embedded JSONB sections + 2 reference arrays to resolve and re-link by slug).
- **Medium-high risk**: blogPost (Portable Text `content` must round-trip through a new rich-text representation without breaking `PortableTextContent`'s existing renderer, which is a **hard constraint** — the renderer is not being touched, so the new CMS must keep writing to the exact same Portable-Text-shaped JSON it already reads).
- **Structural (not content) risk**: swapping `registry.ts`'s internals is mechanical if the new functions' output types are exactly right; the real risk is subtle shape mismatches (e.g. an optional field returned as `null` instead of `undefined`, or an empty array instead of `undefined` where a component does `if (!x)`) — verified against each TS interface in `src/types/` during implementation.

## 9. One hard environment constraint, disclosed up front

This session has Supabase **data-plane** API access only (anon key, service-role key) — no Postgres connection string, no Supabase personal access token, no Management API access, and `exec_sql`-style RPC does not exist on this project. **Raw DDL (`CREATE TABLE` etc.) cannot be executed from this environment.** The complete, ready-to-run SQL migration is provided; running it via the Supabase SQL Editor (a single paste-and-run, ~10 seconds) is the one manual step required before the CMS becomes live. Every other deliverable (schema design, application code, migration script, admin dashboard) is completed end-to-end in this session.
