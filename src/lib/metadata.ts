import type { Metadata } from "next";
import { SITE } from "@/constants/site";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
};

/** Builds a consistent title/description/canonical/OG/Twitter block for a static page. */
export function buildMetadata({ title, description, path, noindex }: PageMetadataInput): Metadata {
  const canonical = `${SITE.url}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
