import type { MetadataRoute } from "next";
import { SITE } from "@/constants/site";
import {
  staticPages,
  landingPages,
  allLandingSlugs,
} from "@/data/registry";

/**
 * Dynamically generates sitemap.xml.
 *
 * Automatically includes:
 * - All static pages (Home, About, Contact, Blog, Privacy, Terms)
 * - All landing pages (every entry in src/data/landing-pages/)
 * - Future landing pages are included automatically when added to the registry.
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

  return entries;
}

