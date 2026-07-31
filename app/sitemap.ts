import type { MetadataRoute } from "next";
import { SITE } from "@/constants/site";
import { staticPages, getAllLandingSlugs, getBlogPostsByDate } from "@/data/registry";

/**
 * Dynamically generates sitemap.xml.
 *
 * Automatically includes:
 * - All static pages (Home, About, Contact, Blog, Privacy, Terms)
 * - All landing pages currently published in Sanity
 * - All blog posts currently published in Sanity
 *
 * No hardcoded URLs. Uses SITE.url from constants.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
  const landingSlugs = await getAllLandingSlugs();
  for (const slug of landingSlugs) {
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
  const blogPosts = await getBlogPostsByDate();
  for (const post of blogPosts) {
    entries.push({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return entries;
}
