# CONTENT_DATABASE.md

Every page, every section, every card block is documented as individual files:

## Landing pages (`landing-pages/`) — 27 files
Each file contains: URL, meta title, meta description, slug, H1, breadcrumb, section sequence, component sequence, ordered card list with logo + eligibility + fee + CTAs, buttons, forms, testimonials, FAQ pointers, schema recommendations, internal/external links.

- top-distance-mba-colleges-university-in-north-zone.md
- top-distance-mba-colleges-university-in-west-zone.md
- top-distance-mba-colleges-university-in-south-zone.md
- top-distance-mba-colleges-university-in-east-zone.md
- top-online-mba-colleges-university-in-north-zone.md
- top-online-mba-colleges-university-in-west-zone.md
- top-online-mba-colleges-university-in-south-zone.md
- top-online-mba-colleges-university-in-east-zone.md
- top-distance-mba-in-business-management.md
- best-universities-for-distance-education-mba-marketing-in-india.md
- top-distance-mba-in-banking-and-finance-management.md
- top-distance-mba-in-operations-management.md
- top-distance-mba-in-information-technology-and-project-management.md
- top-distance-mba-in-top-executive-mba-iim-programs.md
- top-distance-mba-in-human-resource-management.md
- top-distance-mba-in-healthcare-management.md
- top-distance-mba-in-finance-management.md
- top-distance-mba-in-executive-management.md
- top-distance-mba-in-digital-marketing.md
- top-distance-mba-in-supply-chain-management.md
- symbiosis-center-for-distance-learning.md
- symbiosis-center-for-online-learning.md
- iim-online-distance-learnings.md
- top-online-distance-mca-bca-bba-colleges-university-bachelor-north.md
- top-online-distance-mca-bca-bba-colleges-university-bachelor-south.md
- top-online-distance-mca-bca-bba-colleges-university-bachelor-east.md
- top-online-distance-mca-bca-bba-colleges-university-bachelor-west.md

## Posts (`posts/`) — 5 files
- lpu-online-mba.md
- symbiosis-online-mba.md
- sikkim-manipal-university-online-mba.md
- online-mba-in-international-business.md
- lucrative-career-in-data-science-with-online-mba-in-ai-and-ml.md

## Core pages (`core-pages/`) — 6 files
- home.md
- about.md
- contact.md
- privacy-policy.md
- terms-and-conditions.md
- blog.md

## Raw source of truth (`raw-markdown/`)
Every page above ALSO has its full unmodified markdown fetch alongside the structured doc. When body copy, FAQ Q&A, testimonials or long-form paragraphs need to be transcribed into `content/*.ts` / `content/posts/*.mdx`, use the raw file — the structured `.md` doc captures structure and metadata only.

## Content model contract (TypeScript)

```ts
// lib/types.ts
export type Faq = { q: string; a: string };
export type Testimonial = { name: string; role?: string; quote: string; photo?: string };

export type UniversityLogo = {
  src: string;   // /assets/logos/…
  alt: string;
  width: number;
  height: number;
};

export type LandingCard = {
  position: number;         // 1-based, preserved from reference
  displayName: string;      // exact string from ###### heading
  universityKey: string;    // FK -> universities.ts
  logo: UniversityLogo;
  mode: string;             // "Online" | "Distance" | "Online & Distance"
  accreditation: string;    // "NAAC A+, UGC, AICTE"
  duration: string;         // "2 years"
  feeStartsInr: number | null;
  feeLabel?: string;        // for non-numeric variants
  eligibility: string;
};

export type LandingPage = {
  slug: string;
  title: string;             // meta title
  description: string;       // meta description
  h1: string;
  hero: { subheading?: string; badge?: string; variant: "distance" | "online" | "specialization" | "symbiosis-scdl" | "symbiosis-ssodl" | "iim" | "mca" };
  listing: { heading: string; description?: string; cards: LandingCard[] };
  body?: string;             // MDX/HTML — long-form copy under listing
  faqs?: Faq[];
  related?: { label: string; href: string }[];
};

export type Post = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  category: string;
  featuredImage: UniversityLogo;
  body: string;              // MDX
  faqs?: Faq[];
};
```

## Universities master (`content/universities.ts`)

Single source of truth used by every card across every page. Cards reference by `universityKey`; only per-page overrides (mode, duration, fee, eligibility) are stored on the card. Prevents drift.

```ts
export const universities = {
  "amity-odl": { name: "Amity University", logo: "/assets/logos/amity-university-odl.webp", accreditation: "NAAC A+, UGC, AICTE" },
  "nmims-sce": { name: "NMIMS-SCE", logo: "/assets/logos/nmims.webp", accreditation: "NAAC A+, UGC, AICTE" },
  // …47 total, see ASSETS_REQUIRED.md
} as const;
```
