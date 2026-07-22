import type { MetadataRoute } from "next";
import { SITE } from "@/constants/site";

/**
 * Dynamically generates robots.txt.
 *
 * - Allows crawling in Production.
 * - Disallows crawling in Development.
 * - Automatically references /sitemap.xml.
 * - Uses the production domain from SITE.url.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE.url.replace(/\/+$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: process.env.NODE_ENV === "development" ? "/" : undefined,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

