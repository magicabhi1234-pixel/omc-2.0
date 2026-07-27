import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://onlinembacolleges.in"),
  title: {
    default: "Online MBA Colleges | Compare Top Online MBA Programs",
    template: "%s | Online MBA Colleges",
  },
  description: "Compare accredited online MBA programs, fees, specializations and admissions guidance in India.",
  applicationName: "Online MBA Colleges",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
