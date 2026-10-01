/**
 * Sanity -> Supabase CMS migration (read-only against Sanity).
 *
 *   npm run migrate:cms -- --dry-run           # preflight + source counts, writes nothing
 *   npm run migrate:cms                        # insert anything missing, never overwrite
 *   npm run migrate:cms -- --update-existing   # also overwrite rows that already exist
 *   npm run migrate:cms -- --verify            # read-only: counts, links, image + catalog checks
 *
 * Idempotent by default: rows are matched on their natural key (slug, or
 * name+review for testimonials) and existing rows are SKIPPED, so a re-run
 * never duplicates content or clobbers edits made in the admin dashboard.
 *
 * - Only *published* Sanity documents are read (drafts are excluded - with a
 *   token Sanity returns both, and a draft would otherwise win the slug).
 * - Every cdn.sanity.io image is copied into the Supabase `media` bucket
 *   (path sanity/<asset-file>), catalogued in the `media` table, and the URL
 *   rewritten - the site no longer depends on the Sanity CDN, and the images
 *   appear in the dashboard's Media Library.
 * - Navigation + site settings were never in Sanity; they're seeded from the
 *   exact values the header/footer currently fall back to, only if empty.
 * - Sanity is only ever queried (never mutated); its document count and
 *   latest _updatedAt are compared before/after to prove it's untouched.
 *
 * Requires supabase/migrations/0001 + 0002 to be applied.
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const DRY_RUN = process.argv.includes("--dry-run");
const UPDATE_EXISTING = process.argv.includes("--update-existing");
const VERIFY_ONLY = process.argv.includes("--verify");

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const SANITY_API_VERSION = "2024-01-01";
const SANITY_TOKEN = process.env.SANITY_API_TOKEN;
const MEDIA_BUCKET = "media";
const PUBLISHED = `!(_id in path("drafts.**"))`;

const LANDING_CATEGORIES = [
  "Online MBA",
  "Distance MBA",
  "MBA Specializations",
  "Executive MBA",
  "University Pages",
  "Bachelor Programs",
];

// Mirrors the hardcoded fallbacks in src/constants/navigation.ts and
// src/components/layout/footer/footer.tsx, so seeding changes nothing visible.
const SEED_NAVIGATION = {
  header: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about-us" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  "footer-quick-links": [
    { label: "About Us", href: "/about-us" },
    { label: "Contact Us", href: "/contact" },
    { label: "Blog", href: "/blog" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
    { label: "All Landing Pages", href: "/landing-pages" },
  ],
};
const SEED_SITE_INFO = {
  site_name: "Online MBA Colleges",
  tagline: "Find Your Perfect Online MBA Program",
  email: "info@onlinembacolleges.com",
  phone: "+91 8421903846",
  footer_about:
    "India's AI-powered platform to compare online MBA universities, fees, rankings, placements and specializations.",
  footer_hours: "Mon - Sat | 9:00 AM - 7:00 PM",
};

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------
const report = {};
const warnings = [];
function tally(entity) {
  return (report[entity] ??= { source: 0, created: 0, updated: 0, skipped: 0, failed: 0, failures: [] });
}
function fail(entity, label, reason) {
  const t = tally(entity);
  t.failed += 1;
  t.failures.push(`${label}: ${reason}`);
}
function warn(message) {
  warnings.push(message);
}

// ---------------------------------------------------------------------------
// Clients
// ---------------------------------------------------------------------------
const sanity = {
  async fetch(query, perspective = "published") {
    const url = new URL(
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`
    );
    url.searchParams.set("perspective", perspective);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(SANITY_TOKEN ? { Authorization: `Bearer ${SANITY_TOKEN}` } : {}),
      },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) throw new Error(`Sanity query failed (${res.status}): ${await res.text()}`);
    return (await res.json()).result;
  },
};

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ---------------------------------------------------------------------------
// Preflight
// ---------------------------------------------------------------------------
async function preflight() {
  const required = [
    "NEXT_PUBLIC_SANITY_PROJECT_ID",
    "NEXT_PUBLIC_SANITY_DATASET",
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
  ];
  const missing = required.filter((k) => !process.env[k]);
  console.log("Environment:");
  for (const k of [...required, "SANITY_API_TOKEN"]) {
    console.log(`  ${process.env[k] ? "✓" : k === "SANITY_API_TOKEN" ? "-" : "✗"} ${k}${k === "SANITY_API_TOKEN" && !process.env[k] ? " (optional for public datasets)" : ""}`);
  }
  if (missing.length) throw new Error(`Missing env vars: ${missing.join(", ")}`);

  const tables = [
    "universities", "testimonials", "blog_posts", "blog_post_related", "landing_pages",
    "landing_page_universities", "landing_page_testimonials", "categories", "tags",
    "media", "navigation_items", "site_settings",
  ];
  console.log("Supabase tables:");
  for (const table of tables) {
    const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
    if (error) throw new Error(`Table "${table}" not reachable (${error.message}) - apply migration 0001 first.`);
    console.log(`  ✓ ${table.padEnd(26)} ${count} existing rows`);
  }
  const { data: bucket, error: bucketError } = await supabase.storage.getBucket(MEDIA_BUCKET);
  if (bucketError || !bucket) throw new Error(`Storage bucket "${MEDIA_BUCKET}" missing: ${bucketError?.message}`);
  console.log(`  ✓ storage bucket "${MEDIA_BUCKET}" (public: ${bucket.public})`);
}

async function sanityFingerprint() {
  return sanity.fetch(`{
    "total": count(*[!(_id in path("_.**"))]),
    "lastUpdated": *[!(_id in path("_.**"))] | order(_updatedAt desc)[0]._updatedAt,
    "university": count(*[_type == "university" && ${PUBLISHED}]),
    "testimonial": count(*[_type == "testimonial" && ${PUBLISHED}]),
    "blogPost": count(*[_type == "blogPost" && ${PUBLISHED}]),
    "landingPage": count(*[_type == "landingPage" && ${PUBLISHED}]),
    "drafts": count(*[_id in path("drafts.**")]),
    "otherTypes": array::unique(*[!(_type in ["university","testimonial","blogPost","landingPage"]) && !(_type match "sanity.*") && !(_type match "system.*") && !(_id in path("_.**"))]._type)
  }`, "raw"); // raw: see drafts too, and detect any change at all
}

// ---------------------------------------------------------------------------
// Image re-hosting: cdn.sanity.io -> Supabase Storage + media table
// ---------------------------------------------------------------------------
const SANITY_CDN = /^https:\/\/cdn\.sanity\.io\/(images|files)\//;
const rehosted = new Map(); // clean sanity url -> supabase url
const imageStats = { copied: 0, reused: 0, failed: 0 };

async function rehost(rawUrl, altText) {
  const cleanUrl = rawUrl.split("?")[0];
  if (rehosted.has(cleanUrl)) return rehosted.get(cleanUrl);
  if (DRY_RUN) {
    rehosted.set(cleanUrl, rawUrl);
    return rawUrl;
  }

  const fileName = cleanUrl.split("/").pop();
  const storagePath = `sanity/${fileName}`;
  const { data: existing } = await supabase.from("media").select("url").eq("storage_path", storagePath).limit(1);
  if (existing?.[0]?.url) {
    imageStats.reused += 1;
    rehosted.set(cleanUrl, existing[0].url);
    return existing[0].url;
  }

  try {
    const res = await fetch(cleanUrl);
    if (!res.ok) throw new Error(`download ${res.status}`);
    const contentType = res.headers.get("content-type") || "application/octet-stream";
    const bytes = Buffer.from(await res.arrayBuffer());
    const { error: uploadError } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(storagePath, bytes, { contentType, upsert: true, cacheControl: "31536000" });
    if (uploadError) throw new Error(`upload: ${uploadError.message}`);
    const { data: pub } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(storagePath);
    const dims = fileName.match(/-(\d+)x(\d+)\.\w+$/);
    const { error: mediaError } = await supabase.from("media").insert({
      file_name: fileName,
      storage_path: storagePath,
      url: pub.publicUrl,
      mime_type: contentType,
      size_bytes: bytes.length,
      alt_text: altText || null,
      width: dims ? Number(dims[1]) : null,
      height: dims ? Number(dims[2]) : null,
    });
    if (mediaError) warn(`media catalog row for ${fileName} not saved: ${mediaError.message}`);
    imageStats.copied += 1;
    rehosted.set(cleanUrl, pub.publicUrl);
    return pub.publicUrl;
  } catch (error) {
    imageStats.failed += 1;
    warn(`image ${cleanUrl} not re-hosted (kept Sanity URL): ${error.message}`);
    rehosted.set(cleanUrl, rawUrl);
    return rawUrl;
  }
}

/** Deep-walks a row and re-hosts every Sanity CDN URL it contains. */
async function rehostDeep(value, altHint) {
  if (typeof value === "string") return SANITY_CDN.test(value) ? rehost(value, altHint) : value;
  if (Array.isArray(value)) {
    const out = [];
    for (const item of value) out.push(await rehostDeep(item, altHint));
    return out;
  }
  if (value && typeof value === "object") {
    const out = {};
    const alt = typeof value.alt === "string" ? value.alt : altHint;
    for (const [k, v] of Object.entries(value)) out[k] = await rehostDeep(v, alt);
    return out;
  }
  return value;
}

// ---------------------------------------------------------------------------
// Generic "insert if missing, optionally update" by natural key
// ---------------------------------------------------------------------------
async function existingIdsBy(table, column) {
  const map = new Map();
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from(table).select(`id, ${column}`).range(from, from + 999);
    if (error) throw new Error(`${table}: ${error.message}`);
    for (const row of data) map.set(row[column], row.id);
    if (data.length < 1000) return map;
  }
}

/** Returns { id, action } where action is created | updated | skipped, or null on failure. */
async function writeRow(entity, table, row, existingId, label) {
  if (existingId && !UPDATE_EXISTING) {
    tally(entity).skipped += 1;
    return { id: existingId, action: "skipped" };
  }
  if (DRY_RUN) {
    tally(entity)[existingId ? "updated" : "created"] += 1;
    return { id: existingId ?? `dry-run:${label}`, action: existingId ? "updated" : "created" };
  }
  const finalRow = await rehostDeep(row);
  const query = existingId
    ? supabase.from(table).update(finalRow).eq("id", existingId).select("id").single()
    : supabase.from(table).insert(finalRow).select("id").single();
  const { data, error } = await query;
  if (error) {
    fail(entity, label, error.message);
    return null;
  }
  tally(entity)[existingId ? "updated" : "created"] += 1;
  return { id: data.id, action: existingId ? "updated" : "created" };
}

/** Replaces a parent's link rows (only called for rows we created/updated). */
async function replaceLinks(entity, table, parentColumn, parentId, rows, label) {
  if (DRY_RUN) return;
  const { error: delError } = await supabase.from(table).delete().eq(parentColumn, parentId);
  if (delError) return warn(`${entity} "${label}": could not reset ${table}: ${delError.message}`);
  if (rows.length === 0) return;
  const { error } = await supabase.from(table).insert(rows);
  if (error) warn(`${entity} "${label}": ${table} links failed: ${error.message}`);
}

const slugify = (s) =>
  s.toLowerCase().trim().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// ---------------------------------------------------------------------------
// 1. Universities
// ---------------------------------------------------------------------------
const IMG = `{ "url": asset->url, "alt": coalesce(alt, "") }`;

async function migrateUniversities() {
  const docs = await sanity.fetch(`*[_type == "university" && ${PUBLISHED}]{
    _id, name, "slug": slug.current, logo${IMG}, featured, studyMode, duration,
    eligibility, startingFee, emi, placementSupport, rating, reviewCount, approvals,
    rankings[]{source, value}, brochureUrl, websiteUrl
  }`);
  tally("universities").source = docs.length;
  const existing = await existingIdsBy("universities", "slug");
  const idMap = new Map();

  for (const doc of docs) {
    if (!doc.slug || !doc.name) {
      fail("universities", doc._id, "missing name or slug");
      continue;
    }
    const result = await writeRow(
      "universities",
      "universities",
      {
        slug: doc.slug,
        name: doc.name,
        logo_url: doc.logo?.url ?? null,
        logo_alt: doc.logo?.alt ?? null,
        featured: doc.featured ?? false,
        study_mode: ["Online", "Distance", "Online & Distance"].includes(doc.studyMode) ? doc.studyMode : "Online & Distance",
        duration: doc.duration || "2 Years",
        eligibility: doc.eligibility || "",
        starting_fee: doc.startingFee || "",
        emi: doc.emi ?? null,
        placement_support: doc.placementSupport ?? null,
        rating: typeof doc.rating === "number" ? Math.min(5, Math.max(0, doc.rating)) : null,
        review_count: doc.reviewCount ?? null,
        approvals: doc.approvals ?? [],
        rankings: doc.rankings ?? [],
        brochure_url: doc.brochureUrl ?? null,
        website_url: doc.websiteUrl ?? null,
        status: "published",
      },
      existing.get(doc.slug),
      doc.slug
    );
    if (result) idMap.set(doc._id, result.id);
  }
  return idMap;
}

// ---------------------------------------------------------------------------
// 2. Testimonials (no slug - matched on name + review text)
// ---------------------------------------------------------------------------
async function migrateTestimonials() {
  const docs = await sanity.fetch(`*[_type == "testimonial" && ${PUBLISHED}]{
    _id, name, designation, university, image${IMG}, review, rating
  }`);
  tally("testimonials").source = docs.length;

  const { data: rows, error } = await supabase.from("testimonials").select("id, name, review");
  if (error) throw new Error(`testimonials: ${error.message}`);
  const existing = new Map(rows.map((r) => [`${r.name}\u0000${r.review}`, r.id]));
  const idMap = new Map();

  for (const doc of docs) {
    if (!doc.name || !doc.review) {
      fail("testimonials", doc._id, "missing name or review");
      continue;
    }
    const result = await writeRow(
      "testimonials",
      "testimonials",
      {
        name: doc.name,
        designation: doc.designation ?? null,
        university: doc.university ?? null,
        image_url: doc.image?.url ?? null,
        image_alt: doc.image?.alt || null,
        review: doc.review,
        rating: Number.isInteger(doc.rating) && doc.rating >= 1 && doc.rating <= 5 ? doc.rating : 5,
        status: "published",
      },
      existing.get(`${doc.name}\u0000${doc.review}`),
      doc.name
    );
    if (result) idMap.set(doc._id, result.id);
  }
  return idMap;
}

// ---------------------------------------------------------------------------
// 3. Categories + tags (derived from blog posts) and blog posts
// ---------------------------------------------------------------------------
async function ensureTaxonomy(table, names) {
  const entity = table;
  tally(entity).source = names.length;
  const existing = await existingIdsBy(table, "slug");
  const idBySlug = new Map(existing);
  for (const name of names) {
    const slug = slugify(name);
    if (!slug) continue;
    if (existing.has(slug)) {
      tally(entity).skipped += 1;
      continue;
    }
    if (DRY_RUN) {
      tally(entity).created += 1;
      continue;
    }
    const { data, error } = await supabase.from(table).insert({ name, slug }).select("id").single();
    if (error) fail(entity, name, error.message);
    else {
      tally(entity).created += 1;
      idBySlug.set(slug, data.id);
    }
  }
  return idBySlug;
}

async function migrateBlogPosts() {
  const docs = await sanity.fetch(`*[_type == "blogPost" && ${PUBLISHED}]{
    _id, title, h1, "slug": slug.current, featuredImage${IMG}, excerpt,
    content[]{
      ...,
      _type == "image" => { ..., "asset": { "url": asset->url } }
    },
    author, publishedDate, category, tags, faqs[]{question, answer},
    "relatedPostSlugs": relatedPosts[]->slug.current,
    seo{ metaTitle, metaDescription, keywords, canonicalUrl, ogImage${IMG}, noIndex }
  }`);
  tally("blog_posts").source = docs.length;

  const categoryNames = [...new Set(docs.map((d) => d.category?.trim()).filter(Boolean))];
  const tagNames = [...new Set(docs.flatMap((d) => d.tags ?? []).map((t) => t?.trim()).filter(Boolean))];
  const categoryIds = await ensureTaxonomy("categories", categoryNames);
  await ensureTaxonomy("tags", tagNames);

  const existing = await existingIdsBy("blog_posts", "slug");
  const idBySlug = new Map(existing);
  const toLink = []; // [{ id, slug, relatedSlugs }]

  for (const doc of docs) {
    if (!doc.slug || !doc.title) {
      fail("blog_posts", doc._id, "missing title or slug");
      continue;
    }
    const missingImages = (doc.content ?? []).filter((b) => b._type === "image" && !b.asset?.url).length;
    if (missingImages) warn(`blog "${doc.slug}": ${missingImages} inline image(s) have no asset in Sanity`);
    if (!doc.publishedDate) warn(`blog "${doc.slug}": no publishedDate in Sanity - using migration time`);

    const row = {
      slug: doc.slug,
      title: doc.title,
      h1: doc.h1 ?? null,
      featured_image_url: doc.featuredImage?.url ?? "",
      featured_image_alt: doc.featuredImage?.alt ?? "",
      excerpt: doc.excerpt || "",
      content: doc.content ?? [],
      author: doc.author || "Admin",
      ...(doc.publishedDate ? { published_date: doc.publishedDate } : {}),
      category: doc.category?.trim() || null,
      category_id: doc.category ? categoryIds.get(slugify(doc.category)) ?? null : null,
      tags: (doc.tags ?? []).map((t) => t?.trim()).filter(Boolean),
      faqs: doc.faqs ?? [],
      seo_meta_title: doc.seo?.metaTitle ?? null,
      seo_meta_description: doc.seo?.metaDescription ?? null,
      seo_keywords: doc.seo?.keywords ?? null,
      seo_canonical_url: doc.seo?.canonicalUrl ?? null,
      seo_og_image_url: doc.seo?.ogImage?.url ?? null,
      seo_no_index: doc.seo?.noIndex ?? false,
      status: "published",
    };
    const result = await writeRow("blog_posts", "blog_posts", row, existing.get(doc.slug), doc.slug);
    if (!result) continue;
    idBySlug.set(doc.slug, result.id);
    if (result.action !== "skipped") toLink.push({ id: result.id, slug: doc.slug, relatedSlugs: doc.relatedPostSlugs ?? [] });
  }

  for (const { id, slug, relatedSlugs } of toLink) {
    const rows = relatedSlugs
      .filter(Boolean)
      .map((relatedSlug, index) => ({ blog_post_id: id, related_post_id: idBySlug.get(relatedSlug), sort_order: index }))
      .filter((r) => r.related_post_id && r.related_post_id !== id);
    if (rows.length < relatedSlugs.filter(Boolean).length) warn(`blog "${slug}": some related posts not found`);
    await replaceLinks("blog_posts", "blog_post_related", "blog_post_id", id, rows, slug);
  }
}

// ---------------------------------------------------------------------------
// 4. Landing pages (+ university / testimonial links)
// ---------------------------------------------------------------------------
async function migrateLandingPages(universityIds, testimonialIds) {
  const docs = await sanity.fetch(`*[_type == "landingPage" && ${PUBLISHED}]{
    _id, title, "slug": slug.current, category, region,
    hero{
      badge, heading, description, image${IMG},
      primaryButtonText, secondaryButtonText,
      stat1Value, stat1Label, stat2Value, stat2Label, stat3Value, stat3Label
    },
    universitySection{ badge, heading, description },
    "universitySanityIds": universities[]->_id,
    compareSection{ badge, heading, description, features[]{ label, key } },
    whyChoose{ heading, description, items[]{ title, description, icon } },
    stats{ heading, description, stats[]{ value, label } },
    specializations{ heading, description, items[]{ title, "slug": slug.current, description, icon } },
    benefits{ heading, description, items[]{ title, description, icon } },
    careerScope{ heading, description, roles[]{ title, salaryRange, description } },
    highlightBanner{ heading, description, buttonLabel },
    faq{ heading, description, faqs[]{ question, answer } },
    testimonialsHeading,
    "testimonialSanityIds": testimonials[]->_id,
    cta{ badge, heading, description, primaryButtonText, secondaryButtonText },
    seo{ metaTitle, metaDescription, keywords, canonicalUrl, ogImage${IMG}, noIndex }
  }`);
  tally("landing_pages").source = docs.length;
  const existing = await existingIdsBy("landing_pages", "slug");

  for (const doc of docs) {
    if (!doc.slug || !doc.title) {
      fail("landing_pages", doc._id, "missing title or slug");
      continue;
    }
    if (!LANDING_CATEGORIES.includes(doc.category)) {
      fail("landing_pages", doc.slug, `category "${doc.category}" is not one of: ${LANDING_CATEGORIES.join(", ")}`);
      continue;
    }
    const hero = doc.hero ?? {};
    const row = {
      slug: doc.slug,
      title: doc.title,
      category: doc.category,
      region: ["north", "south", "east", "west", "none"].includes(doc.region) ? doc.region : "none",
      status: "published",
      hero: {
        badge: hero.badge,
        heading: hero.heading ?? "",
        description: hero.description ?? "",
        // The front end reads hero.image as { src, alt }.
        image: hero.image?.url ? { src: hero.image.url, alt: hero.image.alt ?? "" } : null,
        primaryButtonText: hero.primaryButtonText,
        secondaryButtonText: hero.secondaryButtonText,
        stat1Value: hero.stat1Value,
        stat1Label: hero.stat1Label,
        stat2Value: hero.stat2Value,
        stat2Label: hero.stat2Label,
        stat3Value: hero.stat3Value,
        stat3Label: hero.stat3Label,
      },
      university_section: doc.universitySection ?? {},
      compare_section: doc.compareSection ?? null,
      why_choose: doc.whyChoose ?? null,
      stats: doc.stats ?? null,
      specializations: doc.specializations ?? null,
      benefits: doc.benefits ?? null,
      career_scope: doc.careerScope ?? null,
      highlight_banner: doc.highlightBanner ?? null,
      faq: doc.faq ?? null,
      testimonials_heading: doc.testimonialsHeading || "What Our Students Say",
      cta: doc.cta ?? {},
      seo_meta_title: doc.seo?.metaTitle ?? null,
      seo_meta_description: doc.seo?.metaDescription ?? null,
      seo_keywords: doc.seo?.keywords ?? null,
      seo_canonical_url: doc.seo?.canonicalUrl ?? null,
      seo_og_image_url: doc.seo?.ogImage?.url ?? null,
      seo_no_index: doc.seo?.noIndex ?? false,
    };

    const result = await writeRow("landing_pages", "landing_pages", row, existing.get(doc.slug), doc.slug);
    if (!result || result.action === "skipped") continue;

    const uniIds = (doc.universitySanityIds ?? []).filter(Boolean);
    const uniRows = uniIds
      .map((id, index) => ({ landing_page_id: result.id, university_id: universityIds.get(id), sort_order: index }))
      .filter((r) => r.university_id);
    if (uniRows.length < uniIds.length) warn(`landing "${doc.slug}": ${uniIds.length - uniRows.length} linked universit(ies) not migrated`);
    await replaceLinks("landing_pages", "landing_page_universities", "landing_page_id", result.id, uniRows, doc.slug);

    const tIds = (doc.testimonialSanityIds ?? []).filter(Boolean);
    const tRows = tIds
      .map((id, index) => ({ landing_page_id: result.id, testimonial_id: testimonialIds.get(id), sort_order: index }))
      .filter((r) => r.testimonial_id);
    if (tRows.length < tIds.length) warn(`landing "${doc.slug}": ${tIds.length - tRows.length} linked testimonial(s) not migrated`);
    await replaceLinks("landing_pages", "landing_page_testimonials", "landing_page_id", result.id, tRows, doc.slug);
  }
}

// ---------------------------------------------------------------------------
// 5. Navigation + site settings (seed only when empty)
// ---------------------------------------------------------------------------
async function seedNavigationAndSettings() {
  for (const [menuKey, items] of Object.entries(SEED_NAVIGATION)) {
    const entity = `navigation:${menuKey}`;
    tally(entity).source = items.length;
    const { count } = await supabase.from("navigation_items").select("*", { count: "exact", head: true }).eq("menu_key", menuKey);
    if (count > 0) {
      tally(entity).skipped += items.length;
      continue;
    }
    if (DRY_RUN) {
      tally(entity).created += items.length;
      continue;
    }
    const { error } = await supabase
      .from("navigation_items")
      .insert(items.map((item, i) => ({ menu_key: menuKey, label: item.label, href: item.href, sort_order: i })));
    if (error) fail(entity, menuKey, error.message);
    else tally(entity).created += items.length;
  }

  tally("site_settings").source = 1;
  const { data: existing } = await supabase.from("site_settings").select("key").eq("key", "site_info").maybeSingle();
  if (existing) tally("site_settings").skipped += 1;
  else if (DRY_RUN) tally("site_settings").created += 1;
  else {
    const { error } = await supabase.from("site_settings").insert({ key: "site_info", value: SEED_SITE_INFO });
    if (error) fail("site_settings", "site_info", error.message);
    else tally("site_settings").created += 1;
  }
}

// ---------------------------------------------------------------------------
// 6. Media catalog: every file under sanity/ in Storage gets a media row
//    (covers files uploaded on a run whose catalog insert failed).
// ---------------------------------------------------------------------------
async function listSanityObjects() {
  const objects = [];
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await supabase.storage.from(MEDIA_BUCKET).list("sanity", { limit: 1000, offset });
    if (error) throw new Error(`storage list: ${error.message}`);
    objects.push(...data.filter((o) => o.id));
    if (data.length < 1000) return objects;
  }
}

async function catalogUploadedImages() {
  const objects = await listSanityObjects();
  const entity = "media_catalog";
  tally(entity).source = objects.length;
  const { data: rows, error } = await supabase.from("media").select("storage_path").like("storage_path", "sanity/%");
  if (error) throw new Error(`media: ${error.message}`);
  const catalogued = new Set(rows.map((r) => r.storage_path));
  for (const object of objects) {
    const storagePath = `sanity/${object.name}`;
    if (catalogued.has(storagePath)) {
      tally(entity).skipped += 1;
      continue;
    }
    if (DRY_RUN || VERIFY_ONLY) {
      tally(entity).created += 1;
      continue;
    }
    const { data: pub } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(storagePath);
    const dims = object.name.match(/-(\d+)x(\d+)\.\w+$/);
    const { error: insertError } = await supabase.from("media").insert({
      file_name: object.name,
      storage_path: storagePath,
      url: pub.publicUrl,
      mime_type: object.metadata?.mimetype ?? "application/octet-stream",
      size_bytes: object.metadata?.size ?? 0,
      width: dims ? Number(dims[1]) : null,
      height: dims ? Number(dims[2]) : null,
    });
    if (insertError) fail(entity, object.name, insertError.message);
    else tally(entity).created += 1;
  }
}

// ---------------------------------------------------------------------------
// 7. Validation
// ---------------------------------------------------------------------------
async function validate(source) {
  console.log("\nValidation (Supabase, published rows):");
  const checks = [
    ["universities", source.university],
    ["testimonials", source.testimonial],
    ["blog_posts", source.blogPost],
    ["landing_pages", source.landingPage],
  ];
  for (const [table, expected] of checks) {
    const { count } = await supabase.from(table).select("*", { count: "exact", head: true }).eq("status", "published");
    const ok = count >= expected;
    console.log(`  ${ok ? "✓" : "✗"} ${table.padEnd(16)} ${count} in Supabase / ${expected} published in Sanity`);
    if (!ok) warn(`${table}: Supabase has ${count}, Sanity has ${expected} - ${expected - count} missing`);
  }
  for (const table of ["universities", "testimonials", "blog_posts", "landing_pages"]) {
    const { data } = await supabase.from(table).select("*");
    const leftovers = (data ?? []).filter((r) => JSON.stringify(r).includes("cdn.sanity.io")).length;
    if (leftovers) warn(`${table}: ${leftovers} row(s) still reference cdn.sanity.io`);
    else console.log(`  ✓ ${table.padEnd(16)} no cdn.sanity.io references`);
  }

  // Relationship links: compare against Sanity references.
  const links = await sanity.fetch(`{
    "lpUniversities": count(array::compact(*[_type == "landingPage" && ${PUBLISHED}].universities[]._ref)),
    "lpTestimonials": count(array::compact(*[_type == "landingPage" && ${PUBLISHED}].testimonials[]._ref)),
    "blogRelated": count(array::compact(*[_type == "blogPost" && ${PUBLISHED}].relatedPosts[]._ref))
  }`);
  for (const [table, expected] of [
    ["landing_page_universities", links.lpUniversities],
    ["landing_page_testimonials", links.lpTestimonials],
    ["blog_post_related", links.blogRelated],
  ]) {
    const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
    const ok = count === expected;
    console.log(`  ${ok ? "✓" : "!"} ${table.padEnd(26)} ${count} links / ${expected} references in Sanity`);
    if (!ok) warn(`${table}: ${count} links vs ${expected} Sanity references (references to unpublished docs are dropped)`);
  }

  // Every Supabase-hosted image URL used by content must resolve.
  const urls = new Set();
  for (const table of ["universities", "testimonials", "blog_posts", "landing_pages"]) {
    const { data } = await supabase.from(table).select("*");
    for (const m of JSON.stringify(data ?? []).matchAll(/https:\/\/[^"\\]+\/storage\/v1\/object\/public\/media\/[^"\\]+/g)) urls.add(m[0]);
  }
  let broken = 0;
  for (const url of urls) {
    const res = await fetch(url, { method: "HEAD" });
    if (!res.ok) {
      broken += 1;
      warn(`image ${url} returned ${res.status}`);
    }
  }
  console.log(`  ${broken ? "✗" : "✓"} ${urls.size} content image URLs checked, ${broken} broken`);

  const objects = await listSanityObjects();
  const { count: catalogued } = await supabase.from("media").select("*", { count: "exact", head: true }).like("storage_path", "sanity/%");
  console.log(`  ${catalogued === objects.length ? "✓" : "✗"} media catalog: ${catalogued} rows / ${objects.length} migrated files in Storage`);
  if (catalogued !== objects.length) warn(`media catalog has ${catalogued} rows for ${objects.length} files - apply migration 0003, then re-run npm run migrate:cms`);
}

// ---------------------------------------------------------------------------
async function main() {
  console.log(`Sanity -> Supabase migration ${DRY_RUN ? "[DRY RUN - no writes]" : ""}${UPDATE_EXISTING ? "[UPDATE EXISTING]" : ""}\n`);
  await preflight();

  const before = await sanityFingerprint();
  console.log(`\nSanity (${SANITY_PROJECT_ID}/${SANITY_DATASET}): ${before.total} documents, last updated ${before.lastUpdated}`);
  console.log(`  published: university ${before.university}, testimonial ${before.testimonial}, blogPost ${before.blogPost}, landingPage ${before.landingPage}`);
  console.log(`  drafts (excluded): ${before.drafts}`);
  if (before.otherTypes?.length) warn(`Sanity has document types this migration doesn't handle: ${before.otherTypes.join(", ")}`);

  if (VERIFY_ONLY) {
    await validate(before);
    if (warnings.length) {
      console.log(`
Warnings (${warnings.length}):`);
      for (const w of warnings) console.log(`  ! ${w}`);
    }
    return;
  }

  const universityIds = await migrateUniversities();
  const testimonialIds = await migrateTestimonials();
  await migrateBlogPosts();
  await migrateLandingPages(universityIds, testimonialIds);
  await seedNavigationAndSettings();
  await catalogUploadedImages();

  const after = await sanityFingerprint();
  const untouched = after.total === before.total && after.lastUpdated === before.lastUpdated;

  console.log("\nResults:");
  console.log("  entity                       source created updated skipped failed");
  for (const [entity, t] of Object.entries(report)) {
    console.log(`  ${entity.padEnd(28)} ${String(t.source).padStart(6)} ${String(t.created).padStart(7)} ${String(t.updated).padStart(7)} ${String(t.skipped).padStart(7)} ${String(t.failed).padStart(6)}`);
  }
  console.log(`  images: ${imageStats.copied} copied to Supabase, ${imageStats.reused} already there, ${imageStats.failed} failed`);

  if (!DRY_RUN) await validate(before);

  const failures = Object.entries(report).flatMap(([e, t]) => t.failures.map((f) => `${e} - ${f}`));
  if (failures.length) {
    console.log(`\nFailed records (${failures.length}):`);
    for (const f of failures) console.log(`  ✗ ${f}`);
  }
  if (warnings.length) {
    console.log(`\nWarnings (${warnings.length}):`);
    for (const w of warnings) console.log(`  ! ${w}`);
  }
  console.log(`\nSanity untouched: ${untouched ? "yes" : "NO - document count or last-updated changed during the run (someone may have edited in Studio)"}`);
  console.log(`\n${DRY_RUN ? "Dry run" : "Migration"} complete.`);
  if (failures.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error("\nMigration aborted:", error.message ?? error);
  process.exit(1);
});
