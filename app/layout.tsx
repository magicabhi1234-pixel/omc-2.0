import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://onlinembacolleges.in"),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | Online MBA Colleges",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: "Online MBA Colleges",
  robots: { index: true, follow: true },
  openGraph: {
    siteName: "Online MBA Colleges",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    type: "website",
    images: ["/universities/omc_logo.avif"],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <head>
        {/* Sanity's image CDN serves every blog/landing-page image; warming
            the connection here (rather than at the first <img> request)
            shaves the DNS+TLS handshake off whichever image ends up being
            the LCP element on those pages. */}
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
