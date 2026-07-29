import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
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
      <body>
        {children}
      </body>
    </html>
  );
}
