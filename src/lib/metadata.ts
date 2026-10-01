import type { Metadata } from "next";
import { SITE } from "@/constants/site";
import { getSettings } from "@/lib/db/queries";

export const DEFAULT_OG_IMAGE = "/og-default.jpg";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  /** Page-specific share image; falls back to the admin-configured default, then /og-default.jpg. */
  image?: string | null;
  /** Use the title as-is instead of appending " | Online MBA Colleges" (for titles that already name the brand). */
  absoluteTitle?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
};

/** Site-wide default share image: Global Settings > Branding, or the built-in one. */
export async function defaultShareImage(): Promise<string> {
  const branding = await getSettings("branding");
  return branding.og_image_url || DEFAULT_OG_IMAGE;
}

/**
 * Consistent title/description/canonical/OG/Twitter for a page. Next.js
 * replaces (doesn't merge) nested metadata objects, so every page's
 * openGraph must carry siteName/locale/images itself - otherwise it silently
 * drops the layout's defaults.
 */
export async function buildMetadata({
  title,
  description,
  path,
  noindex,
  image,
  absoluteTitle,
  type = "website",
  publishedTime,
  modifiedTime,
}: PageMetadataInput): Promise<Metadata> {
  const canonical = `${SITE.url}${path === "/" ? "" : path}` || SITE.url;
  const shareImage = image || (await defaultShareImage());
  const images = [{ url: shareImage, width: 1200, height: 630, alt: title }];
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE.name}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: SITE.name,
      locale: "en_IN",
      type,
      images,
      ...(type === "article" && publishedTime ? { publishedTime, modifiedTime: modifiedTime ?? publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [shareImage],
    },
  };
}
