import type { Metadata } from "next";
import { SITE } from "@/constants/site";
import { buildMetadata } from "@/lib/metadata";
import { blogPostHref, isFlatSlugPost } from "@/lib/blog-links";
import type { BlogPost } from "@/types/blog";

/**
 * Metadata for a blog post, shared by /blog/[slug] and the flat alias routes
 * (/lpu-online-mba etc.). The canonical is always the post's primary URL:
 * the flat alias for migrated posts, else an explicit CMS canonical, else
 * /blog/<slug> - never undefined.
 */
export async function blogPostMetadata(post: BlogPost): Promise<Metadata> {
  const path = blogPostHref(post.slug);
  const canonical = !isFlatSlugPost(post.slug) && post.seo.canonical ? post.seo.canonical : `${SITE.url}${path}`;

  const base = await buildMetadata({
    title: post.seo.title,
    description: post.seo.description,
    path,
    noindex: post.seo.robots === "noindex",
    image: post.seo.ogImage || post.featuredImage.src || null,
    absoluteTitle: post.seo.title.length > 45,
    type: "article",
    publishedTime: post.publishedDate,
    modifiedTime: post.lastModifiedDate,
  });

  return {
    ...base,
    keywords: post.seo.keywords,
    alternates: { canonical },
    authors: [{ name: post.author }],
  };
}
