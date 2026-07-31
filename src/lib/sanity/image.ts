import { createImageUrlBuilder } from "@sanity/image-url";
import type { Image as SanityImageValue } from "sanity";
import { sanity } from "./client";

const builder = createImageUrlBuilder(sanity);

export type SanityImage = SanityImageValue & {
  alt?: string;
};

/** Builds an optimized, CDN-served URL for a Sanity image reference. */
export function urlForImage(source: SanityImageValue | undefined) {
  if (!source?.asset) return undefined;
  return builder.image(source);
}

/** Convenience: resolves a Sanity image to a plain `{ src, alt }` pair, or `fallback` if absent. */
export function resolveImage(
  image: SanityImage | undefined,
  fallback: { src: string; alt: string }
): { src: string; alt: string } {
  const url = urlForImage(image)?.url();
  if (!url) return fallback;
  return { src: url, alt: image?.alt || fallback.alt };
}
