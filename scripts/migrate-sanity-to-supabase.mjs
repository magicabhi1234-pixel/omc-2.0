/**
 * One-off migration: reads every document out of Sanity and writes it into
 * the new Supabase CMS schema (supabase/migrations/0001_cms_schema.sql must
 * already be applied). Safe to re-run - every insert uses `upsert` keyed by
 * slug (or, for testimonials, by name+review) so running twice just updates
 * rows in place rather than duplicating them.
 *
 * Run with: npm run migrate:cms
 */
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

// Talks to Sanity's Query API directly over plain `fetch` - no Sanity SDK/package
// needed, since this is the one remaining place anything ever reads from Sanity
// again (a one-time read for migration), and the project intentionally carries
// zero Sanity dependencies otherwise.
const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const SANITY_API_VERSION = "2024-01-01";
const SANITY_TOKEN = process.env.SANITY_API_TOKEN;

const sanity = {
  async fetch(query) {
    const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(SANITY_TOKEN ? { Authorization: `Bearer ${SANITY_TOKEN}` } : {}),
      },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) {
      throw new Error(`Sanity query failed (${res.status}): ${await res.text()}`);
    }
    const json = await res.json();
    return json.result;
  },
};

const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const IMAGE_PROJECTION = `{ "url": asset->url, "alt": coalesce(alt, "") }`;

function resolveImage(node) {
  return node?.asset ? { src: node.asset.url ?? "", alt: node.alt ?? "" } : null;
}

// ---------------------------------------------------------------------------
// 1. Universities
// ---------------------------------------------------------------------------
async function migrateUniversities() {
  const docs = await sanity.fetch(`*[_type == "university"]{
    _id, name, "slug": slug.current, logo${IMAGE_PROJECTION}, featured, studyMode, duration,
    eligibility, startingFee, emi, placementSupport, rating, reviewCount, approvals,
    rankings[]{source, value}, brochureUrl, websiteUrl
  }`);

  const idMap = new Map(); // sanity _id -> supabase id
  for (const doc of docs) {
    const { data, error } = await supabase
      .from("universities")
      .upsert(
        {
          slug: doc.slug,
          name: doc.name,
          logo_url: doc.logo?.url ?? null,
          logo_alt: doc.logo?.alt ?? null,
          featured: doc.featured ?? false,
          study_mode: doc.studyMode || "Online & Distance",
          duration: doc.duration || "2 Years",
          eligibility: doc.eligibility || "",
          starting_fee: doc.startingFee || "",
          emi: doc.emi ?? null,
          placement_support: doc.placementSupport ?? null,
          rating: doc.rating ?? null,
          review_count: doc.reviewCount ?? null,
          approvals: doc.approvals ?? [],
          rankings: doc.rankings ?? [],
          brochure_url: doc.brochureUrl ?? null,
          website_url: doc.websiteUrl ?? null,
          status: "published",
        },
        { onConflict: "slug" }
      )
      .select("id")
      .single();

    if (error) {
      console.error(`  university "${doc.name}" failed:`, error.message);
      continue;
    }
    idMap.set(doc._id, data.id);
  }
  console.log(`Universities migrated: ${idMap.size}/${docs.length}`);
  return idMap;
}

// ---------------------------------------------------------------------------
// 2. Testimonials
// ---------------------------------------------------------------------------
async function migrateTestimonials() {
  const docs = await sanity.fetch(`*[_type == "testimonial"]{
    _id, name, designation, university, image${IMAGE_PROJECTION}, review, rating
  }`);

  const idMap = new Map();
  for (const doc of docs) {
    const { data: existing } = await supabase
      .from("testimonials")
      .select("id")
      .eq("name", doc.name)
      .eq("review", doc.review)
      .maybeSingle();

    const row = {
      name: doc.name,
      designation: doc.designation ?? null,
      university: doc.university ?? null,
      image_url: doc.image?.url ?? null,
      review: doc.review,
      rating: doc.rating ?? 5,
      status: "published",
    };

    let id = existing?.id;
    if (id) {
      await supabase.from("testimonials").update(row).eq("id", id);
    } else {
      const { data, error } = await supabase.from("testimonials").insert(row).select("id").single();
      if (error) {
        console.error(`  testimonial "${doc.name}" failed:`, error.message);
        continue;
      }
      id = data.id;
    }
    idMap.set(doc._id, id);
  }
  console.log(`Testimonials migrated: ${idMap.size}/${docs.length}`);
  return idMap;
}

// ---------------------------------------------------------------------------
// 3. Blog posts (+ related-post links)
// ---------------------------------------------------------------------------
async function migrateBlogPosts() {
  const docs = await sanity.fetch(`*[_type == "blogPost"]{
    _id, title, h1, "slug": slug.current, featuredImage${IMAGE_PROJECTION}, excerpt, content,
    author, publishedDate, category, tags, faqs[]{question, answer},
    "relatedPostSlugs": relatedPosts[]->slug.current,
    seo{ metaTitle, metaDescription, keywords, canonicalUrl, ogImage${IMAGE_PROJECTION}, noIndex }
  }`);

  // Resolve inline image asset refs inside `content` to plain URLs, matching
  // the shape src/lib/portable-text.ts expects (asset.url, not asset._ref).
  function resolveContentImages(content) {
    return (content ?? []).map((block) => {
      if (block._type === "image" && block.asset) {
        return { ...block, asset: { url: block.asset.url ?? "" } };
      }
      return block;
    });
  }

  const idMap = new Map(); // sanity slug -> supabase id
  const relatedSlugsBySlug = new Map();

  for (const doc of docs) {
    const row = {
      slug: doc.slug,
      title: doc.title,
      h1: doc.h1 ?? null,
      featured_image_url: doc.featuredImage?.url ?? "",
      featured_image_alt: doc.featuredImage?.alt ?? "",
      excerpt: doc.excerpt || "",
      content: resolveContentImages(doc.content),
      author: doc.author || "Admin",
      published_date: doc.publishedDate,
      category: doc.category ?? null,
      tags: doc.tags ?? [],
      faqs: doc.faqs ?? [],
      seo_meta_title: doc.seo?.metaTitle ?? null,
      seo_meta_description: doc.seo?.metaDescription ?? null,
      seo_keywords: doc.seo?.keywords ?? null,
      seo_canonical_url: doc.seo?.canonicalUrl ?? null,
      seo_og_image_url: doc.seo?.ogImage?.url ?? null,
      seo_no_index: doc.seo?.noIndex ?? false,
      status: "published",
    };

    const { data, error } = await supabase
      .from("blog_posts")
      .upsert(row, { onConflict: "slug" })
      .select("id")
      .single();

    if (error) {
      console.error(`  blog post "${doc.title}" failed:`, error.message);
      continue;
    }
    idMap.set(doc.slug, data.id);
    if (doc.relatedPostSlugs?.length) relatedSlugsBySlug.set(doc.slug, doc.relatedPostSlugs);
  }

  for (const [slug, relatedSlugs] of relatedSlugsBySlug) {
    const postId = idMap.get(slug);
    if (!postId) continue;
    await supabase.from("blog_post_related").delete().eq("blog_post_id", postId);
    const rows = relatedSlugs
      .map((relatedSlug, index) => ({
        blog_post_id: postId,
        related_post_id: idMap.get(relatedSlug),
        sort_order: index,
      }))
      .filter((r) => r.related_post_id);
    if (rows.length > 0) await supabase.from("blog_post_related").insert(rows);
  }

  console.log(`Blog posts migrated: ${idMap.size}/${docs.length}`);
  return idMap;
}

// ---------------------------------------------------------------------------
// 4. Landing pages (+ university/testimonial links)
// ---------------------------------------------------------------------------
async function migrateLandingPages(universityIdMap, testimonialIdMap) {
  const docs = await sanity.fetch(`*[_type == "landingPage"]{
    _id, title, "slug": slug.current, category, region,
    hero{
      badge, heading, description, image${IMAGE_PROJECTION},
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
    seo{ metaTitle, metaDescription, keywords, canonicalUrl, ogImage${IMAGE_PROJECTION}, noIndex }
  }`);

  let migrated = 0;
  for (const doc of docs) {
    const row = {
      slug: doc.slug,
      title: doc.title,
      category: doc.category,
      region: doc.region || "none",
      status: "published",
      hero: {
        badge: doc.hero?.badge,
        heading: doc.hero?.heading ?? "",
        description: doc.hero?.description ?? "",
        image: resolveImage(doc.hero?.image),
        primaryButtonText: doc.hero?.primaryButtonText,
        secondaryButtonText: doc.hero?.secondaryButtonText,
        stat1Value: doc.hero?.stat1Value,
        stat1Label: doc.hero?.stat1Label,
        stat2Value: doc.hero?.stat2Value,
        stat2Label: doc.hero?.stat2Label,
        stat3Value: doc.hero?.stat3Value,
        stat3Label: doc.hero?.stat3Label,
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

    const { data, error } = await supabase
      .from("landing_pages")
      .upsert(row, { onConflict: "slug" })
      .select("id")
      .single();

    if (error) {
      console.error(`  landing page "${doc.title}" failed:`, error.message);
      continue;
    }

    const pageId = data.id;
    await supabase.from("landing_page_universities").delete().eq("landing_page_id", pageId);
    await supabase.from("landing_page_testimonials").delete().eq("landing_page_id", pageId);

    const uniRows = (doc.universitySanityIds ?? [])
      .map((sanityId, index) => ({
        landing_page_id: pageId,
        university_id: universityIdMap.get(sanityId),
        sort_order: index,
      }))
      .filter((r) => r.university_id);
    if (uniRows.length > 0) await supabase.from("landing_page_universities").insert(uniRows);

    const testimonialRows = (doc.testimonialSanityIds ?? [])
      .map((sanityId, index) => ({
        landing_page_id: pageId,
        testimonial_id: testimonialIdMap.get(sanityId),
        sort_order: index,
      }))
      .filter((r) => r.testimonial_id);
    if (testimonialRows.length > 0) await supabase.from("landing_page_testimonials").insert(testimonialRows);

    migrated += 1;
  }
  console.log(`Landing pages migrated: ${migrated}/${docs.length}`);
}

async function main() {
  console.log("Starting Sanity -> Supabase migration...\n");
  const universityIdMap = await migrateUniversities();
  const testimonialIdMap = await migrateTestimonials();
  await migrateBlogPosts();
  await migrateLandingPages(universityIdMap, testimonialIdMap);
  console.log("\nMigration complete.");
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
