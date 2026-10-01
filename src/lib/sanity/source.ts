import "server-only";

/**
 * Read-only access to the legacy Sanity dataset over Sanity's HTTP Query API
 * (no SDK - the site carries no Sanity dependency). Only *published*
 * documents are ever read, and nothing here can write to Sanity.
 *
 * GROQ projections below return documents already shaped like the Supabase
 * rows (snake_case), so the same mappers render both sources identically.
 */

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const API_VERSION = "2024-01-01";
const TOKEN = process.env.SANITY_API_TOKEN;

export const isSanityConfigured = Boolean(PROJECT_ID);
export const SANITY_CACHE_TAG = "sanity";
export const PUBLISHED = `!(_id in path("drafts.**")) && !(_id in path("versions.**"))`;

export async function sanityQuery<T>(query: string, params: Record<string, unknown> = {}, opts: { revalidate?: number | false } = {}): Promise<T> {
  if (!isSanityConfigured) throw new Error("Sanity is not configured (NEXT_PUBLIC_SANITY_PROJECT_ID).");
  const url = new URL(`https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}`);
  url.searchParams.set("perspective", "published");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}) },
    body: JSON.stringify({ query, params }),
    next: opts.revalidate === false ? undefined : { revalidate: opts.revalidate ?? 3600, tags: [SANITY_CACHE_TAG] },
    ...(opts.revalidate === false ? { cache: "no-store" as const } : {}),
  });
  if (!res.ok) throw new Error(`Sanity query failed (${res.status})`);
  return ((await res.json()) as { result: T }).result;
}

const IMAGE_URL = `asset->url`;

/** University document -> universities row shape. */
export const UNIVERSITY_ROW = `{
  "id": _id,
  "slug": slug.current,
  name,
  "logo_url": logo.${IMAGE_URL},
  "logo_alt": coalesce(logo.alt, ""),
  "featured": coalesce(featured, false),
  "study_mode": coalesce(studyMode, "Online & Distance"),
  "duration": coalesce(duration, "2 Years"),
  "eligibility": coalesce(eligibility, ""),
  "starting_fee": coalesce(startingFee, ""),
  emi,
  "placement_support": placementSupport,
  rating,
  "review_count": reviewCount,
  "approvals": coalesce(approvals, []),
  "rankings": coalesce(rankings[]{source, value}, []),
  "brochure_url": brochureUrl,
  "website_url": websiteUrl
}`;

/** Testimonial document -> testimonials row shape. */
export const TESTIMONIAL_ROW = `{
  "id": _id,
  name,
  designation,
  university,
  "image_url": image.${IMAGE_URL},
  "image_alt": coalesce(image.alt, ""),
  review,
  "rating": coalesce(rating, 5)
}`;

const SEO_FIELDS = `
  "seo_meta_title": seo.metaTitle,
  "seo_meta_description": seo.metaDescription,
  "seo_keywords": seo.keywords,
  "seo_canonical_url": seo.canonicalUrl,
  "seo_og_image_url": seo.ogImage.${IMAGE_URL},
  "seo_no_index": coalesce(seo.noIndex, false)`;

/** Landing page document -> landing_pages row shape, plus resolved universities/testimonials. */
export const LANDING_ROW = `{
  "sanity_id": _id,
  "slug": slug.current,
  title,
  category,
  "region": coalesce(region, "none"),
  "updated_at": _updatedAt,
  "hero": hero{
    badge, heading, description,
    "image": select(defined(image.asset) => { "src": image.${IMAGE_URL}, "alt": coalesce(image.alt, "") }, null),
    primaryButtonText, secondaryButtonText,
    stat1Value, stat1Label, stat2Value, stat2Label, stat3Value, stat3Label
  },
  "university_section": universitySection{ badge, heading, description },
  "compare_section": compareSection{ badge, heading, description, features[]{ label, key } },
  "why_choose": whyChoose{ heading, description, items[]{ title, description, icon } },
  stats{ heading, description, stats[]{ value, label } },
  specializations{ heading, description, items[]{ title, "slug": slug.current, description, icon } },
  benefits{ heading, description, items[]{ title, description, icon } },
  "career_scope": careerScope{ heading, description, roles[]{ title, salaryRange, description } },
  "highlight_banner": highlightBanner{ heading, description, buttonLabel },
  faq{ heading, description, faqs[]{ question, answer } },
  "testimonials_heading": coalesce(testimonialsHeading, "What Our Students Say"),
  "cta": coalesce(cta{ badge, heading, description, primaryButtonText, secondaryButtonText }, { "heading": "" }),
  ${SEO_FIELDS},
  "universities": universities[]->${UNIVERSITY_ROW},
  "testimonials": testimonials[]->${TESTIMONIAL_ROW}
}`;

/** Blog post document -> blog_posts row shape. Inline image refs resolved to URLs. */
export const BLOG_ROW = `{
  "sanity_id": _id,
  "slug": slug.current,
  title,
  h1,
  "featured_image_url": coalesce(featuredImage.${IMAGE_URL}, ""),
  "featured_image_alt": coalesce(featuredImage.alt, ""),
  "excerpt": coalesce(excerpt, ""),
  "content": coalesce(content[]{ ..., _type == "image" => { ..., "asset": { "url": asset->url } } }, []),
  "author": coalesce(author, "Admin"),
  "published_date": coalesce(publishedDate, _createdAt),
  "updated_at": _updatedAt,
  category,
  "tags": coalesce(tags, []),
  "faqs": coalesce(faqs[]{ question, answer }, []),
  "related_slugs": relatedPosts[]->slug.current,
  ${SEO_FIELDS}
}`;
