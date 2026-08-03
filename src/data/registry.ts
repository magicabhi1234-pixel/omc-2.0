/**
 * Shared Registry
 * ===============
 * Single source of truth for static page metadata, plus thin Sanity-backed
 * accessors for landing pages and blog posts - consumed by sitemap.ts,
 * robots.ts, the /landing-pages hub, and the [slug]/blog[slug] routes.
 *
 * Landing pages, blog posts, universities and testimonials are managed
 * entirely from Sanity Studio (/studio) - there is no static fallback data
 * for them anymore. See src/lib/sanity/ for the query + mapping layer.
 */

import { sanityFetch } from "@/lib/sanity/client";
import { mapLandingPage, type RawLandingPage } from "@/lib/sanity/mappers";
import {
  BLOG_POSTS_BY_DATE_QUERY,
  BLOG_POST_BY_SLUG_QUERY,
  BLOG_SLUGS_QUERY,
  DEFAULT_TESTIMONIALS_QUERY,
  LANDING_PAGE_BY_SLUG_QUERY,
  LANDING_PAGE_HUB_QUERY,
  LANDING_PAGE_SLUGS_QUERY,
} from "@/lib/sanity/queries";
import type { LandingPageData, Testimonial } from "@/types/landing";
import type { BlogPost, BlogPostSummary } from "@/types/blog";

// ---------------------------------------------------------------------------
// Static Pages (non-landing, non-blog)
// ---------------------------------------------------------------------------
export interface StaticPageEntry {
  slug: string;
  title: string;
  description: string;
  priority: number;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
}

export const staticPages: StaticPageEntry[] = [
  {
    slug: "",
    title: "Home",
    description: "Online MBA Colleges in India 2026 | Compare Top Universities & Fees",
    priority: 1.0,
    changeFrequency: "weekly",
  },
  {
    slug: "about-us",
    title: "About Us",
    description: "Learn about Online MBA Colleges and our mission.",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    slug: "about",
    title: "About",
    description: "Learn about Online MBA Colleges and our mission.",
    priority: 0.5,
    changeFrequency: "monthly",
  },
  {
    slug: "contact",
    title: "Contact",
    description: "Get in touch with Online MBA Colleges.",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    slug: "blog",
    title: "Blog",
    description: "Read the latest articles about Online MBA programs.",
    priority: 0.8,
    changeFrequency: "weekly",
  },
  {
    slug: "category/learning",
    title: "Learning",
    description: "MBA admissions guides, university comparisons and career insights.",
    priority: 0.6,
    changeFrequency: "weekly",
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    description: "Privacy Policy of Online MBA Colleges.",
    priority: 0.3,
    changeFrequency: "yearly",
  },
  {
    slug: "terms-and-conditions",
    title: "Terms & Conditions",
    description: "Terms and Conditions of Online MBA Colleges.",
    priority: 0.3,
    changeFrequency: "yearly",
  },
];

// ---------------------------------------------------------------------------
// Landing Pages (Sanity-backed)
// ---------------------------------------------------------------------------

export async function getAllLandingSlugs(): Promise<string[]> {
  return sanityFetch<string[]>({
    query: LANDING_PAGE_SLUGS_QUERY,
    tags: ["landing-page"],
    fallback: [],
  });
}

export async function getLandingPageBySlug(slug: string): Promise<LandingPageData | null> {
  const raw = await sanityFetch<RawLandingPage | null>({
    query: LANDING_PAGE_BY_SLUG_QUERY,
    params: { slug },
    tags: ["landing-page", `landing-page:${slug}`],
    fallback: null,
  });
  const page = mapLandingPage(raw);
  if (!page) return null;

  // Pages without their own testimonials show the sitewide defaults instead
  // of nothing - same source as the homepage, never hardcoded per-component.
  if (!page.testimonials) {
    const defaults = await getDefaultTestimonials();
    if (defaults.length > 0) {
      page.testimonials = { heading: "What Our Students Say", testimonials: defaults };
    }
  }

  return page;
}

export interface LandingPageHubEntry {
  slug: string;
  category: string;
  seoTitle: string;
  seoDescription: string;
}

export async function getLandingPagesForHub(): Promise<LandingPageHubEntry[]> {
  return sanityFetch<LandingPageHubEntry[]>({
    query: LANDING_PAGE_HUB_QUERY,
    tags: ["landing-page"],
    fallback: [],
  });
}

// ---------------------------------------------------------------------------
// Testimonials (Sanity-backed)
// ---------------------------------------------------------------------------

/** Sitewide default testimonials (e.g. homepage). Individual landing pages can override these. */
export async function getDefaultTestimonials(): Promise<Testimonial[]> {
  return sanityFetch<Testimonial[]>({
    query: DEFAULT_TESTIMONIALS_QUERY,
    tags: ["testimonial"],
    fallback: [],
  });
}

// ---------------------------------------------------------------------------
// Blog Posts (Sanity-backed)
// ---------------------------------------------------------------------------

export async function getAllBlogSlugs(): Promise<string[]> {
  return sanityFetch<string[]>({
    query: BLOG_SLUGS_QUERY,
    tags: ["blog"],
    fallback: [],
  });
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return sanityFetch<BlogPost | null>({
    query: BLOG_POST_BY_SLUG_QUERY,
    params: { slug },
    tags: ["blog", `blog:${slug}`],
    fallback: null,
  });
}

/** All blog posts, newest first. */
export async function getBlogPostsByDate(): Promise<BlogPostSummary[]> {
  return sanityFetch<BlogPostSummary[]>({
    query: BLOG_POSTS_BY_DATE_QUERY,
    tags: ["blog"],
    fallback: [],
  });
}
