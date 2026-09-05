/**
 * Shared Registry
 * ===============
 * Single source of truth for static page metadata, plus thin accessors for
 * landing pages and blog posts - consumed by sitemap.ts, robots.ts, the
 * /landing-pages hub, and the [slug]/blog[slug] routes.
 *
 * Landing pages, blog posts, universities and testimonials are managed from
 * the custom admin dashboard (/admin) and stored in Supabase - there is no
 * static fallback data for them. See src/lib/db/ for the query + mapping
 * layer (this file used to read from Sanity; the exported function
 * signatures below are unchanged, only what backs them).
 */

import {
  getAllLandingSlugs as dbGetAllLandingSlugs,
  getLandingPageBySlug as dbGetLandingPageBySlug,
  getLandingPagesForHub as dbGetLandingPagesForHub,
  getDefaultTestimonials as dbGetDefaultTestimonials,
  getAllBlogSlugs as dbGetAllBlogSlugs,
  getBlogPostBySlug as dbGetBlogPostBySlug,
  getBlogPostsByDate as dbGetBlogPostsByDate,
  type LandingPageHubEntry,
} from "@/lib/db/queries";
import type { LandingPageData, Testimonial } from "@/types/landing";
import type { BlogPost, BlogPostSummary } from "@/types/blog";

export type { LandingPageHubEntry };

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
// Landing Pages (Supabase-backed)
// ---------------------------------------------------------------------------

export async function getAllLandingSlugs(): Promise<string[]> {
  return dbGetAllLandingSlugs();
}

export async function getLandingPageBySlug(slug: string): Promise<LandingPageData | null> {
  return dbGetLandingPageBySlug(slug);
}

export async function getLandingPagesForHub(): Promise<LandingPageHubEntry[]> {
  return dbGetLandingPagesForHub();
}

// ---------------------------------------------------------------------------
// Testimonials (Supabase-backed)
// ---------------------------------------------------------------------------

/** Sitewide default testimonials (e.g. homepage). Individual landing pages can override these. */
export async function getDefaultTestimonials(): Promise<Testimonial[]> {
  return dbGetDefaultTestimonials();
}

// ---------------------------------------------------------------------------
// Blog Posts (Supabase-backed)
// ---------------------------------------------------------------------------

export async function getAllBlogSlugs(): Promise<string[]> {
  return dbGetAllBlogSlugs();
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return dbGetBlogPostBySlug(slug);
}

/** All blog posts, newest first. */
export async function getBlogPostsByDate(): Promise<BlogPostSummary[]> {
  return dbGetBlogPostsByDate();
}
