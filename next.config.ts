import type { NextConfig } from "next";

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  // frame-ancestors only: a full script-src CSP would break the analytics /
  // tracking snippets editors can add from Global Settings.
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'" },
];

const nextConfig: NextConfig = {
  // Standalone output: required by the cPanel deployment (.cpanel.yml + server.js).
  // Vercel ignores it and builds as usual.
  output: "standalone",
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cduthhiqrowburlasdio.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Sanity fallback content (read-only legacy CMS) keeps its Sanity CDN images.
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      { source: "/admin", destination: "/admin/dashboard", permanent: false },
      // Thin hardcoded page (empty university grid) superseded by the CMS page on the same topic.
      {
        source: "/top-colleges-university-in-north-zone",
        destination: "/top-10-distance-mba-universities-colleges-north-zone",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
