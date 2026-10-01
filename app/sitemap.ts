import type { MetadataRoute } from "next";
import { SITE } from "@/constants/site";
import { staticPages, getLandingPagesForHub, getBlogPostsByDate } from "@/data/registry";
import { blogPostHref } from "@/lib/blog-links";

/**
 * sitemap.xml - canonical, indexable URLs only (no /about alias, no
 * /category/learning duplicate, no noindex pages), each with its real
 * last-modified date so crawlers can prioritise what actually changed.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE.url.replace(/\/+$/, "");
  const [landingPages, blogPosts] = await Promise.all([getLandingPagesForHub(), getBlogPostsByDate()]);

  const latest = (dates: (string | null | undefined)[]) => {
    const times = dates.map((d) => (d ? Date.parse(d) : NaN)).filter((t) => !Number.isNaN(t));
    return times.length ? new Date(Math.max(...times)) : undefined;
  };
  const latestLanding = latest(landingPages.map((p) => p.updatedAt));
  const latestBlog = latest(blogPosts.map((p) => p.lastModifiedDate ?? p.publishedDate));

  const entries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: page.slug === "" ? `${baseUrl}/` : `${baseUrl}/${page.slug}`,
    // Listing pages change whenever their content does; others have no CMS date.
    lastModified: page.slug === "" ? latest([latestLanding?.toISOString(), latestBlog?.toISOString()]) : page.slug === "blog" ? latestBlog : undefined,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  entries.push({
    url: `${baseUrl}/landing-pages`,
    lastModified: latestLanding,
    changeFrequency: "weekly",
    priority: 0.8,
  });

  for (const page of landingPages) {
    entries.push({
      url: `${baseUrl}/${page.slug}`,
      lastModified: page.updatedAt ? new Date(page.updatedAt) : undefined,
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  for (const post of blogPosts) {
    entries.push({
      url: `${baseUrl}${blogPostHref(post.slug)}`,
      lastModified: new Date(post.lastModifiedDate ?? post.publishedDate),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return entries;
}
