import "server-only";
import { isDbConfigured, supabaseAdmin } from "@/lib/db/client";
import {
  mapBlogPost,
  mapBlogPostSummary,
  mapLandingPageRow,
  mapTestimonial,
  mapUniversity,
  type BlogPostRow,
  type LandingPageRow,
  type TestimonialRow,
  type UniversityRow,
} from "@/lib/db/mappers";
import type { LandingPageData } from "@/types/landing";
import type { BlogPost } from "@/types/blog";
import { BLOG_ROW, LANDING_ROW, PUBLISHED, isSanityConfigured, sanityQuery } from "./source";
import { isTombstoned, type TombstoneType } from "./tombstones";

/**
 * Hybrid CMS read path. The dashboard (Supabase) is the primary source; Sanity
 * is consulted only when Supabase can't answer:
 *   1. Supabase is unreachable / not configured, or
 *   2. the slug has never existed in Supabase (in any status) and wasn't
 *      deliberately deleted there (tombstone).
 * A draft or unpublished row in the dashboard always wins - Sanity never
 * "un-hides" content an editor hid or deleted.
 */
type Availability = "present" | "absent" | "unavailable";

async function dashboardAvailability(table: "landing_pages" | "blog_posts", slug: string, type: TombstoneType): Promise<Availability> {
  if (!isDbConfigured) return "unavailable";
  try {
    const { data, error } = await supabaseAdmin.from(table).select("id").eq("slug", slug).maybeSingle();
    if (error) return "unavailable";
    if (data) return "present";
    return (await isTombstoned(type, slug)) ? "present" : "absent";
  } catch {
    return "unavailable";
  }
}

export async function sanityLandingFallback(slug: string): Promise<LandingPageData | null> {
  if (!isSanityConfigured || (await dashboardAvailability("landing_pages", slug, "landing_page")) === "present") return null;
  try {
    const doc = await sanityQuery<(LandingPageRow & { universities?: UniversityRow[]; testimonials?: TestimonialRow[] }) | null>(
      `*[_type == "landingPage" && slug.current == $slug && ${PUBLISHED}][0]${LANDING_ROW}`,
      { slug }
    );
    if (!doc) return null;
    console.warn("[cms] serving landing page from Sanity fallback:", slug);
    return mapLandingPageRow(
      doc,
      (doc.universities ?? []).filter(Boolean).map(mapUniversity),
      (doc.testimonials ?? []).filter(Boolean).map(mapTestimonial)
    );
  } catch (error) {
    console.error("[cms] Sanity landing fallback failed:", slug, error);
    return null;
  }
}

export async function sanityBlogFallback(slug: string): Promise<BlogPost | null> {
  if (!isSanityConfigured || (await dashboardAvailability("blog_posts", slug, "blog_post")) === "present") return null;
  try {
    const doc = await sanityQuery<(BlogPostRow & { related_slugs?: string[] | null }) | null>(
      `*[_type == "blogPost" && slug.current == $slug && ${PUBLISHED}][0]${BLOG_ROW}`,
      { slug }
    );
    if (!doc) return null;
    let related: BlogPostRow[] = [];
    if (doc.related_slugs?.length) {
      related = await sanityQuery<BlogPostRow[]>(`*[_type == "blogPost" && slug.current in $slugs && ${PUBLISHED}]${BLOG_ROW}`, { slugs: doc.related_slugs });
    }
    console.warn("[cms] serving blog post from Sanity fallback:", slug);
    return mapBlogPost(doc, related.map(mapBlogPostSummary));
  } catch (error) {
    console.error("[cms] Sanity blog fallback failed:", slug, error);
    return null;
  }
}
