/**
 * Slugs migrated as exact-slug-parity pages at the site root (matching the
 * source site's flat URL structure, e.g. /lpu-online-mba instead of
 * /blog/lpu-online-mba). Any blog post not in this set still resolves to
 * the standard /blog/<slug> route - this list only needs to grow if more
 * posts get their own root-level alias in the future.
 */
const FLAT_SLUG_POSTS = new Set([
  "lpu-online-mba",
  "symbiosis-online-mba",
  "sikkim-manipal-university-online-mba",
  "lucrative-career-in-data-science-with-online-mba-in-ai-and-ml",
  "online-mba-in-international-business",
]);

/** The canonical link target for a blog post - the flat root-level URL for migrated posts, /blog/<slug> otherwise. */
export function blogPostHref(slug: string): string {
  return FLAT_SLUG_POSTS.has(slug) ? `/${slug}` : `/blog/${slug}`;
}

/** Whether this post has a root-level exact-slug alias route. */
export function isFlatSlugPost(slug: string): boolean {
  return FLAT_SLUG_POSTS.has(slug);
}
