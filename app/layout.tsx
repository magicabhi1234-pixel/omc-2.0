import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SITE } from "@/constants/site";
import { getSettings } from "@/lib/db/queries";
import { DEFAULT_OG_IMAGE } from "@/lib/metadata";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  // Italic is used in exactly one place sitewide (a blog blockquote) and
  // the browser synthesizes it fine from the normal weight - not worth
  // doubling every visitor's font payload for one rarely-seen element.
  style: ["normal"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

const DEFAULT_TITLE = "Online MBA Colleges | Compare Top Online MBA Programs";
const DEFAULT_DESCRIPTION = "Compare accredited online MBA programs, fees, specializations and admissions guidance in India.";

export const viewport: Viewport = {
  themeColor: "#0B3B68",
};

/**
 * Site-wide defaults. Verification tags, favicon and the default share image
 * come from Global Settings so they can be changed without a deploy.
 */
export async function generateMetadata(): Promise<Metadata> {
  const [branding, tracking] = await Promise.all([getSettings("branding"), getSettings("tracking")]);
  const shareImage = branding.og_image_url || DEFAULT_OG_IMAGE;
  const other: Record<string, string> = {};
  if (tracking.meta_domain_verification) other["facebook-domain-verification"] = tracking.meta_domain_verification;
  if (tracking.bing_site_verification) other["msvalidate.01"] = tracking.bing_site_verification;

  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: DEFAULT_TITLE,
      template: "%s | Online MBA Colleges",
    },
    description: DEFAULT_DESCRIPTION,
    applicationName: SITE.name,
    robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    ...(branding.favicon_url ? { icons: { icon: branding.favicon_url, apple: branding.favicon_url } } : {}),
    ...(tracking.google_site_verification || Object.keys(other).length
      ? { verification: { ...(tracking.google_site_verification ? { google: tracking.google_site_verification } : {}), other } }
      : {}),
    openGraph: {
      siteName: SITE.name,
      locale: "en_IN",
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      type: "website",
      images: [{ url: shareImage, width: 1200, height: 630, alt: SITE.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      images: [shareImage],
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" className={plusJakartaSans.variable}>
      <head>
        {/* Supabase Storage serves every blog/landing-page image; warming
            the connection here (rather than at the first <img> request)
            shaves the DNS+TLS handshake off whichever image ends up being
            the LCP element on those pages. */}
        <link rel="preconnect" href="https://cduthhiqrowburlasdio.supabase.co" />
        <link rel="dns-prefetch" href="https://cduthhiqrowburlasdio.supabase.co" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
