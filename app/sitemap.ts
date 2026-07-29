import type { MetadataRoute } from "next";
import { SITE } from "@/constants/site";
import {
  staticPages,
  allLandingSlugs,
  blogPosts,
  allBlogSlugs,
} from "@/data/registry";

/**
 * Dynamically generates sitemap.xml.
 *
 * Automatically includes:
 * - All static pages (Home, About, Contact, Blog, Privacy, Terms)
 * - All landing pages (every entry in src/data/landing-pages/)
 * - All blog posts (every entry in src/data/blog-posts/)
 * - Future landing pages and blog posts are included automatically when added to the registry.
 *
 * No hardcoded URLs. Uses SITE.url from constants.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE.url.replace(/\/+$/, "");

  const entries: MetadataRoute.Sitemap = [];

  // -----------------------------------------------------------------------
  // 1. Static pages
  // -----------------------------------------------------------------------
  for (const page of staticPages) {
    const url =
      page.slug === ""
        ? baseUrl
        : `${baseUrl}/${page.slug}`;

    entries.push({
      url,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    });
  }

  // -----------------------------------------------------------------------
  // 2. Landing pages
  // -----------------------------------------------------------------------
  for (const slug of allLandingSlugs) {
    entries.push({
      url: `${baseUrl}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  // -----------------------------------------------------------------------
  // 3. Landing Pages Hub
  // -----------------------------------------------------------------------
  entries.push({
    url: `${baseUrl}/landing-pages`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  });

  // -----------------------------------------------------------------------
  // 4. Blog posts
  // -----------------------------------------------------------------------
  for (const slug of allBlogSlugs) {
    const post = blogPosts[slug];
    entries.push({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(post.lastModifiedDate ?? post.publishedDate),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return entries;
}
