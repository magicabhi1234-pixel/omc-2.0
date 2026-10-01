import { unstable_cache } from "next/cache";
import { supabaseAdmin, dbFetch } from "./client";
import {
  mapUniversity,
  mapTestimonial,
  mapLandingPageRow,
  mapBlogPost,
  mapBlogPostSummary,
  type UniversityRow,
  type TestimonialRow,
  type LandingPageRow,
  type BlogPostRow,
} from "./mappers";
import type { LandingPageData, Testimonial, University } from "@/types/landing";
import type { BlogPost, BlogPostSummary } from "@/types/blog";
import { parseSettings, type FaqPlacement, type SettingsGroup } from "@/lib/site-settings";

/**
 * Time-based safety net on top of the primary on-demand path (Server Actions
 * call `revalidateTag` immediately after every publish/unpublish/save, the
 * same way the old Sanity webhook did) - if a tag is ever missed, nothing
 * goes stale for longer than this.
 */
const FALLBACK_REVALIDATE_SECONDS = 300;

const BLOG_POST_SELECT =
  "slug, title, h1, featured_image_url, featured_image_alt, excerpt, content, author, published_date, updated_at, category, tags, faqs, seo_meta_title, seo_meta_description, seo_keywords, seo_canonical_url, seo_og_image_url, seo_no_index";

// ---------------------------------------------------------------------------
// Universities
// ---------------------------------------------------------------------------

async function fetchUniversitiesByIds(ids: string[]): Promise<Map<string, University>> {
  if (ids.length === 0) return new Map();
  const { data } = await supabaseAdmin
    .from("universities")
    .select(
      "id, slug, name, logo_url, rating, review_count, study_mode, duration, eligibility, approvals, rankings, starting_fee, emi, placement_support, brochure_url, website_url, featured"
    )
    .in("id", ids);
  const map = new Map<string, University>();
  for (const row of (data ?? []) as (UniversityRow & { id: string })[]) {
    map.set(row.id, mapUniversity(row));
  }
  return map;
}

async function fetchTestimonialsByIds(ids: string[]): Promise<Map<string, Testimonial>> {
  if (ids.length === 0) return new Map();
  const { data } = await supabaseAdmin
    .from("testimonials")
    .select("id, name, designation, university, image_url, review, rating")
    .in("id", ids);
  const map = new Map<string, Testimonial>();
  for (const row of (data ?? []) as TestimonialRow[]) {
    map.set(row.id, mapTestimonial(row));
  }
  return map;
}

// ---------------------------------------------------------------------------
// Landing Pages
// ---------------------------------------------------------------------------

export const getAllLandingSlugs = unstable_cache(
  async (): Promise<string[]> =>
    dbFetch(async () => {
      const { data } = await supabaseAdmin
        .from("landing_pages")
        .select("slug")
        .eq("status", "published");
      return (data ?? []).map((r: { slug: string }) => r.slug);
    }, []),
  ["landing-slugs"],
  { tags: ["landing-page"], revalidate: FALLBACK_REVALIDATE_SECONDS }
);

async function fetchLandingPageBySlug(slug: string): Promise<LandingPageData | null> {
  const { data: page } = await supabaseAdmin
    .from("landing_pages")
    .select(
      "id, slug, title, category, hero, university_section, compare_section, why_choose, stats, specializations, benefits, career_scope, highlight_banner, faq, testimonials_heading, cta, seo_meta_title, seo_meta_description, seo_keywords, seo_canonical_url, seo_og_image_url, seo_no_index"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!page) return null;
  const row = page as LandingPageRow & { id: string };

  const { data: uniLinks } = await supabaseAdmin
    .from("landing_page_universities")
    .select("university_id, sort_order")
    .eq("landing_page_id", row.id)
    .order("sort_order", { ascending: true });

  const { data: testimonialLinks } = await supabaseAdmin
    .from("landing_page_testimonials")
    .select("testimonial_id, sort_order")
    .eq("landing_page_id", row.id)
    .order("sort_order", { ascending: true });

  const uniIds = (uniLinks ?? []).map((r: { university_id: string }) => r.university_id);
  const testimonialIds = (testimonialLinks ?? []).map((r: { testimonial_id: string }) => r.testimonial_id);

  const uniMap = await fetchUniversitiesByIds(uniIds);
  const universities = uniIds.map((id: string) => uniMap.get(id)).filter((u): u is University => !!u);

  let testimonials: Testimonial[] = [];
  if (testimonialIds.length > 0) {
    const tMap = await fetchTestimonialsByIds(testimonialIds);
    testimonials = testimonialIds
      .map((id: string) => tMap.get(id))
      .filter((t): t is Testimonial => !!t);
  } else {
    testimonials = await getDefaultTestimonials();
  }

  return mapLandingPageRow(row, universities, testimonials);
}

export async function getLandingPageBySlug(slug: string): Promise<LandingPageData | null> {
  const cached = unstable_cache(
    () => dbFetch(() => fetchLandingPageBySlug(slug), null),
    ["landing-page", slug],
    { tags: ["landing-page", `landing-page:${slug}`], revalidate: FALLBACK_REVALIDATE_SECONDS }
  );
  return cached();
}

export interface LandingPageHubEntry {
  slug: string;
  category: string;
  seoTitle: string;
  seoDescription: string;
}

export const getLandingPagesForHub = unstable_cache(
  async (): Promise<LandingPageHubEntry[]> =>
    dbFetch(async () => {
      const { data } = await supabaseAdmin
        .from("landing_pages")
        .select("slug, title, category, seo_meta_title, seo_meta_description")
        .eq("status", "published")
        .order("title", { ascending: true });
      return (data ?? []).map(
        (r: {
          slug: string;
          title: string;
          category: string;
          seo_meta_title: string | null;
          seo_meta_description: string | null;
        }) => ({
          slug: r.slug,
          category: r.category,
          seoTitle: r.seo_meta_title || r.title,
          seoDescription: r.seo_meta_description || "",
        })
      );
    }, []),
  ["landing-pages-hub"],
  { tags: ["landing-page"], revalidate: FALLBACK_REVALIDATE_SECONDS }
);

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

export const getDefaultTestimonials = unstable_cache(
  async (): Promise<Testimonial[]> =>
    dbFetch(async () => {
      const { data } = await supabaseAdmin
        .from("testimonials")
        .select("id, name, designation, university, image_url, review, rating")
        .eq("status", "published")
        .order("created_at", { ascending: true });
      return (data ?? []).map((row: TestimonialRow) => mapTestimonial(row));
    }, []),
  ["default-testimonials"],
  { tags: ["testimonial"], revalidate: FALLBACK_REVALIDATE_SECONDS }
);

// ---------------------------------------------------------------------------
// Blog Posts
// ---------------------------------------------------------------------------

export const getAllBlogSlugs = unstable_cache(
  async (): Promise<string[]> =>
    dbFetch(async () => {
      const { data } = await supabaseAdmin.from("blog_posts").select("slug").eq("status", "published");
      return (data ?? []).map((r: { slug: string }) => r.slug);
    }, []),
  ["blog-slugs"],
  { tags: ["blog"], revalidate: FALLBACK_REVALIDATE_SECONDS }
);

async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data } = await supabaseAdmin
    .from("blog_posts")
    .select(`id, ${BLOG_POST_SELECT}`)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!data) return null;
  const row = data as BlogPostRow & { id: string };

  const { data: relatedLinks } = await supabaseAdmin
    .from("blog_post_related")
    .select("related_post_id, sort_order")
    .eq("blog_post_id", row.id)
    .order("sort_order", { ascending: true });

  let relatedPosts: BlogPostSummary[] = [];
  const relatedIds = (relatedLinks ?? []).map((r: { related_post_id: string }) => r.related_post_id);
  if (relatedIds.length > 0) {
    const { data: relatedRows } = await supabaseAdmin
      .from("blog_posts")
      .select(BLOG_POST_SELECT)
      .in("id", relatedIds)
      .eq("status", "published");
    relatedPosts = (relatedRows ?? []).map((r: BlogPostRow) => mapBlogPostSummary(r));
  }

  return mapBlogPost(row, relatedPosts);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const cached = unstable_cache(
    () => dbFetch(() => fetchBlogPostBySlug(slug), null),
    ["blog-post", slug],
    { tags: ["blog", `blog:${slug}`], revalidate: FALLBACK_REVALIDATE_SECONDS }
  );
  return cached();
}

export const getBlogPostsByDate = unstable_cache(
  async (): Promise<BlogPostSummary[]> =>
    dbFetch(async () => {
      const { data } = await supabaseAdmin
        .from("blog_posts")
        .select(BLOG_POST_SELECT)
        .eq("status", "published")
        .order("published_date", { ascending: false });
      return (data ?? []).map((row: BlogPostRow) => mapBlogPostSummary(row));
    }, []),
  ["blog-posts-by-date"],
  { tags: ["blog"], revalidate: FALLBACK_REVALIDATE_SECONDS }
);

// ---------------------------------------------------------------------------
// Navigation & site settings
// ---------------------------------------------------------------------------

export interface NavigationItemRow {
  label: string;
  href: string;
  is_external: boolean;
  opens_new_tab: boolean;
}

export async function getNavigationItems(menuKey: string): Promise<NavigationItemRow[]> {
  const cached = unstable_cache(
    () =>
      dbFetch(async () => {
        const { data } = await supabaseAdmin
          .from("navigation_items")
          .select("label, href, is_external, opens_new_tab")
          .eq("menu_key", menuKey)
          .order("sort_order", { ascending: true });
        return (data ?? []) as NavigationItemRow[];
      }, []),
    ["navigation-items", menuKey],
    { tags: ["navigation"], revalidate: FALLBACK_REVALIDATE_SECONDS }
  );
  return cached();
}

export async function getSiteSetting<T>(key: string, fallback: T): Promise<T> {
  const cached = unstable_cache(
    () =>
      dbFetch(async () => {
        const { data } = await supabaseAdmin
          .from("site_settings")
          .select("value")
          .eq("key", key)
          .maybeSingle();
        return data ? ((data as { value: unknown }).value as T) : fallback;
      }, fallback),
    ["site-setting", key],
    { tags: ["settings"], revalidate: FALLBACK_REVALIDATE_SECONDS }
  );
  return cached();
}

/** A validated global-settings group, with defaults for anything unset. */
export async function getSettings<G extends SettingsGroup>(group: G) {
  return parseSettings(group, await getSiteSetting<unknown>(group, {}));
}

export interface FaqItem {
  question: string;
  answer: string;
}

/** Published FAQs for a page placement, in editor-defined order; `fallback` if the table is unavailable or empty. */
export async function getFaqs(placement: FaqPlacement, fallback: FaqItem[] = []): Promise<FaqItem[]> {
  const cached = unstable_cache(
    () =>
      dbFetch(async () => {
        const { data, error } = await supabaseAdmin
          .from("faqs")
          .select("question, answer")
          .eq("placement", placement)
          .eq("status", "published")
          .order("sort_order", { ascending: true });
        if (error) throw new Error(error.message);
        return (data ?? []) as FaqItem[];
      }, [] as FaqItem[]),
    ["faqs", placement],
    { tags: ["faq"], revalidate: FALLBACK_REVALIDATE_SECONDS }
  );
  const faqs = await cached();
  return faqs.length > 0 ? faqs : fallback;
}
