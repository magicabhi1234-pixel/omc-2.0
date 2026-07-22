/**
 * Shared Registry
 * ===============
 * Single source of truth for all landing pages, static pages, and blog posts.
 * Automatically consumed by sitemap.ts, robots.ts, and /landing-pages hub.
 *
 * HOW TO ADD A NEW LANDING PAGE:
 * 1. Create a new file in src/data/landing-pages/
 * 2. Export it from src/data/landing-pages/index.ts
 * 3. It is automatically included here.
 *
 * HOW TO ADD A NEW STATIC PAGE:
 * 1. Create the page in app/(site)/
 * 2. Add an entry to staticPages array below.
 *
 * Future blog posts from Sanity CMS are fetched dynamically.
 */

import {
  top10OnlineMBANorthZone,
  top10OnlineMBAWestZone,
  top10OnlineMBASouthZone,
  top10OnlineMBAEastZone,
  top10DistanceMBANorthZone,
  top10DistanceMBAWestZone,
  top10DistanceMBASouthZone,
  top10DistanceMBAEastZone,
  topDistanceMBAInBusinessManagement,
  bestDistanceMBAInMarketing,
  topDistanceMBAInBankingAndFinance,
  topDistanceMBAInOperationsManagement,
  topDistanceMBAInITAndProjectManagement,
  topDistanceMBAInExecutiveMBAIIM,
  topDistanceMBAInHRManagement,
  topDistanceMBAInHealthcareManagement,
  topDistanceMBAInFinanceManagement,
  topDistanceMBAInExecutiveManagement,
  topDistanceMBAInDigitalMarketing,
  topDistanceMBAInSupplyChainManagement,
  symbiosisSCDL,
  symbiosisSSODL,
  iimOnlineDistanceLearnings,
  topOnlineDistanceMCABCABBANorth,
  topOnlineDistanceMCABCABBASouth,
  topOnlineDistanceMCABCABBAEast,
  topOnlineDistanceMCABCABBAWest,
} from "@/data/landing-pages";

import type { LandingPageData } from "@/types/landing";

// ---------------------------------------------------------------------------
// Static Pages (non-landing, non-blog)
// ---------------------------------------------------------------------------
export interface StaticPageEntry {
  slug: string;
  title: string;
  description: string;
  priority: number;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
}

export const staticPages: StaticPageEntry[] = [
  {
    slug: "",
    title: "Home",
    description: "Online MBA Colleges in India 2026 | Compare Top Universities & Fees",
    priority: 1.0,
    changeFrequency: "weekly",
  },
  {
    slug: "about-us",
    title: "About Us",
    description: "Learn about Online MBA Colleges and our mission.",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    slug: "contact",
    title: "Contact",
    description: "Get in touch with Online MBA Colleges.",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    slug: "blog",
    title: "Blog",
    description: "Read the latest articles about Online MBA programs.",
    priority: 0.8,
    changeFrequency: "weekly",
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    description: "Privacy Policy of Online MBA Colleges.",
    priority: 0.3,
    changeFrequency: "yearly",
  },
  {
    slug: "terms-and-conditions",
    title: "Terms & Conditions",
    description: "Terms and Conditions of Online MBA Colleges.",
    priority: 0.3,
    changeFrequency: "yearly",
  },
];

// ---------------------------------------------------------------------------
// Landing Pages Registry
// ---------------------------------------------------------------------------

/**
 * All landing page data objects keyed by their slug.
 * Adding a new export to src/data/landing-pages/index.ts automatically includes it here.
 */
export const landingPages: Record<string, LandingPageData> = {
  "top-10-online-mba-universities-colleges-north-zone":
    top10OnlineMBANorthZone,
  "top-10-online-mba-universities-colleges-west-zone":
    top10OnlineMBAWestZone,
  "top-10-online-mba-universities-colleges-south-zone":
    top10OnlineMBASouthZone,
  "top-10-online-mba-universities-colleges-east-zone":
    top10OnlineMBAEastZone,
  "top-10-distance-mba-universities-colleges-north-zone":
    top10DistanceMBANorthZone,
  "top-10-distance-mba-universities-colleges-west-zone":
    top10DistanceMBAWestZone,
  "top-10-distance-mba-universities-colleges-south-zone":
    top10DistanceMBASouthZone,
  "top-10-distance-mba-universities-colleges-east-zone":
    top10DistanceMBAEastZone,
  "top-distance-mba-in-business-management":
    topDistanceMBAInBusinessManagement,
  "best-universities-for-distance-education-mba-marketing-in-india":
    bestDistanceMBAInMarketing,
  "top-distance-mba-in-banking-and-finance-management":
    topDistanceMBAInBankingAndFinance,
  "top-distance-mba-in-operations-management":
    topDistanceMBAInOperationsManagement,
  "top-distance-mba-in-information-technology-and-project-management":
    topDistanceMBAInITAndProjectManagement,
  "top-distance-mba-in-top-executive-mba-iim-programs":
    topDistanceMBAInExecutiveMBAIIM,
  "top-distance-mba-in-human-resource-management":
    topDistanceMBAInHRManagement,
  "top-distance-mba-in-healthcare-management":
    topDistanceMBAInHealthcareManagement,
  "top-distance-mba-in-finance-management":
    topDistanceMBAInFinanceManagement,
  "top-distance-mba-in-executive-management":
    topDistanceMBAInExecutiveManagement,
  "top-distance-mba-in-digital-marketing":
    topDistanceMBAInDigitalMarketing,
  "top-distance-mba-in-supply-chain-management":
    topDistanceMBAInSupplyChainManagement,
  "symbiosis-center-for-distance-learning":
    symbiosisSCDL,
  "symbiosis-center-for-online-learning":
    symbiosisSSODL,
  "iim-online-distance-learnings":
    iimOnlineDistanceLearnings,
  "top-online-distance-mca-bca-bba-colleges-university-bachelor-north":
    topOnlineDistanceMCABCABBANorth,
  "top-online-distance-mca-bca-bba-colleges-university-bachelor-south":
    topOnlineDistanceMCABCABBASouth,
  "top-online-distance-mca-bca-bba-colleges-university-bachelor-east":
    topOnlineDistanceMCABCABBAEast,
  "top-online-distance-mca-bca-bba-colleges-university-bachelor-west":
    topOnlineDistanceMCABCABBAWest,
};

// ---------------------------------------------------------------------------
// Derived Helpers
// ---------------------------------------------------------------------------

export const allLandingSlugs = Object.keys(landingPages);

export function getLandingPageBySlug(slug: string): LandingPageData | undefined {
  return landingPages[slug];
}
