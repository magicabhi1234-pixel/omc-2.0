import type { SlugIsUniqueValidator } from "sanity";

/**
 * Static routes that already exist outside the CMS - a landingPage document
 * with one of these slugs would either 404 (Next.js prefers the static route
 * over the [slug] catch-all) or, for the root path, be unreachable entirely.
 * Kept in sync manually with app/(site)/*; there's no way to import the App
 * Router's route list into a Studio-side schema file.
 */
export const RESERVED_LANDING_PAGE_SLUGS = [
  "",
  "about-us",
  "blog",
  "contact",
  "landing-pages",
  "privacy-policy",
  "terms-and-conditions",
  "thank-you",
  "top-colleges-university-in-north-zone",
  "studio",
  "api",
  "sitemap.xml",
  "robots.txt",
];

/** Rejects reserved/static-route slugs, then defers to Sanity's own per-type, draft-aware uniqueness check. */
export const landingPageSlugIsUnique: SlugIsUniqueValidator = (slug, context) => {
  if (RESERVED_LANDING_PAGE_SLUGS.includes(slug)) return false;
  return context.defaultIsUnique(slug, context);
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Custom Rule check: lowercase letters, numbers and single hyphens only - matches what actually produces a clean URL. */
export function validateSlugFormat(slug: { current?: string } | undefined) {
  if (!slug?.current) return true;
  return SLUG_PATTERN.test(slug.current)
    ? true
    : "Slug must contain only lowercase letters, numbers and hyphens (e.g. top-online-mba-north-zone) - no spaces, underscores or uppercase letters.";
}
