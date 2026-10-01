import type {
  BenefitsSection,
  CareerScopeSection,
  CompareSection,
  FAQSection,
  HeroSection,
  HighlightBanner,
  LandingPageData,
  SEOData,
  SpecializationSection,
  StatsSection,
  Testimonial,
  University,
  UniversityApproval,
  WhyChooseSection,
} from "@/types/landing";
import type { BlogPost, BlogPostSummary } from "@/types/blog";

// ---------------------------------------------------------------------------
// Row shapes (as selected from Supabase) - snake_case, matching the SQL schema
// ---------------------------------------------------------------------------

export interface UniversityRow {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  rating: number | null;
  review_count: number | null;
  study_mode: string;
  duration: string;
  eligibility: string;
  approvals: string[] | null;
  rankings: { source: string; value: string }[] | null;
  starting_fee: string;
  emi: string | null;
  placement_support: string | null;
  brochure_url: string | null;
  website_url: string | null;
  featured: boolean;
}

export interface TestimonialRow {
  id: string;
  name: string;
  designation: string | null;
  university: string | null;
  image_url: string | null;
  review: string;
  rating: number;
}

export interface SeoRowFields {
  seo_meta_title: string | null;
  seo_meta_description: string | null;
  seo_keywords: string[] | null;
  seo_canonical_url: string | null;
  seo_og_image_url: string | null;
  seo_no_index: boolean | null;
}

export function mapUniversity(row: UniversityRow): University {
  return {
    id: row.slug,
    slug: row.slug,
    name: row.name,
    logo: row.logo_url ?? "",
    rating: row.rating ?? undefined,
    reviewCount: row.review_count ?? undefined,
    studyMode: row.study_mode,
    duration: row.duration,
    eligibility: row.eligibility,
    approvals: (row.approvals ?? []).map(
      (label): UniversityApproval => ({ id: label.toLowerCase(), label })
    ),
    rankings: row.rankings && row.rankings.length > 0 ? row.rankings : undefined,
    startingFee: row.starting_fee,
    emi: row.emi ?? undefined,
    placementSupport: row.placement_support ?? undefined,
    brochureUrl: row.brochure_url ?? undefined,
    websiteUrl: row.website_url ?? undefined,
    featured: row.featured,
  };
}

export function mapTestimonial(row: TestimonialRow): Testimonial {
  return {
    id: row.id,
    name: row.name,
    designation: row.designation ?? undefined,
    university: row.university ?? undefined,
    image: row.image_url ?? undefined,
    review: row.review,
    rating: row.rating,
  };
}

/** Same fallback chain the old GROQ `SEO_PROJECTION` computed. */
export function mapSeo(
  row: SeoRowFields,
  fallbackTitle: string,
  fallbackDescription: string
): SEOData {
  return {
    title: row.seo_meta_title || fallbackTitle,
    description: row.seo_meta_description || fallbackDescription,
    keywords: row.seo_keywords ?? undefined,
    canonical: row.seo_canonical_url ?? undefined,
    ogImage: row.seo_og_image_url ?? undefined,
    robots: row.seo_no_index ? "noindex" : "index,follow",
  };
}

// ---------------------------------------------------------------------------
// Landing pages
// ---------------------------------------------------------------------------

export interface LandingPageRow extends SeoRowFields {
  slug: string;
  title: string;
  category: string;
  updated_at?: string | null;
  hero: Partial<HeroSection> & {
    image?: { src: string; alt: string };
    primaryButtonText?: string;
    secondaryButtonText?: string;
    stat1Value?: string;
    stat1Label?: string;
    stat2Value?: string;
    stat2Label?: string;
    stat3Value?: string;
    stat3Label?: string;
  };
  university_section: { badge?: string; heading?: string; description?: string } | null;
  compare_section: CompareSection | null;
  why_choose: WhyChooseSection | null;
  stats: StatsSection | null;
  specializations: SpecializationSection | null;
  benefits: BenefitsSection | null;
  career_scope: CareerScopeSection | null;
  highlight_banner: (Omit<HighlightBanner, "button"> & { buttonLabel?: string }) | null;
  faq: FAQSection | null;
  testimonials_heading: string | null;
  cta: {
    badge?: string;
    heading: string;
    description?: string;
    primaryButtonText?: string;
    secondaryButtonText?: string;
  };
}

function toButton(label: string | undefined, fallback: string, variant: "primary" | "outline") {
  return { label: label || fallback, variant };
}

export function mapLandingPageRow(
  row: LandingPageRow,
  universities: University[],
  testimonials: Testimonial[]
): LandingPageData {
  const hero = row.hero ?? {};
  const cta = row.cta ?? { heading: "" };

  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    updatedAt: row.updated_at ?? undefined,
    // No meta description set: the hero intro is the page's own summary.
    seo: mapSeo(row, row.title, (row.hero?.description ?? "").slice(0, 300)),
    hero: {
      badge: hero.badge,
      heading: hero.heading ?? "",
      description: hero.description ?? "",
      heroImage: hero.image,
      primaryButton: toButton(hero.primaryButtonText, "Apply Now", "primary"),
      secondaryButton: hero.secondaryButtonText
        ? toButton(hero.secondaryButtonText, "", "outline")
        : undefined,
      stats: [
        hero.stat1Value ? { value: hero.stat1Value, label: hero.stat1Label ?? "" } : null,
        hero.stat2Value ? { value: hero.stat2Value, label: hero.stat2Label ?? "" } : null,
        hero.stat3Value ? { value: hero.stat3Value, label: hero.stat3Label ?? "" } : null,
      ].filter((s): s is { value: string; label: string } => s !== null),
    },
    universitySection: {
      badge: row.university_section?.badge,
      heading: row.university_section?.heading ?? "",
      description: row.university_section?.description,
      universities,
    },
    compareSection: row.compare_section ?? undefined,
    whyChoose: row.why_choose ?? undefined,
    stats: row.stats ?? undefined,
    specializations: row.specializations ?? undefined,
    benefits: row.benefits ?? undefined,
    careerScope: row.career_scope ?? undefined,
    highlightBanner: row.highlight_banner
      ? {
          heading: row.highlight_banner.heading,
          description: row.highlight_banner.description,
          button: toButton(row.highlight_banner.buttonLabel, "Get Placement Assistance", "primary"),
        }
      : undefined,
    faq: row.faq ?? undefined,
    testimonials:
      testimonials.length > 0
        ? { heading: row.testimonials_heading || "What Our Students Say", testimonials }
        : undefined,
    cta: {
      badge: cta.badge,
      heading: cta.heading,
      description: cta.description,
      primaryButton: toButton(cta.primaryButtonText, "Apply Now", "primary"),
      secondaryButton: cta.secondaryButtonText
        ? toButton(cta.secondaryButtonText, "", "outline")
        : undefined,
    },
  };
}

// ---------------------------------------------------------------------------
// Blog posts
// ---------------------------------------------------------------------------

export interface BlogPostRow extends SeoRowFields {
  slug: string;
  title: string;
  h1: string | null;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  author: string;
  published_date: string;
  updated_at: string;
  category: string | null;
  tags: string[] | null;
  excerpt: string;
  content: unknown[];
  faqs: { question: string; answer: string }[] | null;
}

/** ~200 wpm reading-time estimate from the same rough word-count heuristic the old GROQ query used. */
/** Visible words in a Portable Text block array (span text and table cells - not JSON keys/markup). */
export function countWords(content: unknown[]): number {
  let words = 0;
  const walk = (node: unknown) => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (!node || typeof node !== "object") return;
    const n = node as Record<string, unknown>;
    if (n._type === "span" && typeof n.text === "string") words += n.text.split(/\s+/).filter(Boolean).length;
    else if (typeof n.cells === "object" && Array.isArray(n.cells)) {
      for (const cell of n.cells) if (typeof cell === "string") words += cell.split(/\s+/).filter(Boolean).length;
    }
    for (const value of Object.values(n)) if (typeof value === "object") walk(value);
  };
  walk(content);
  return words;
}

function estimateReadingTime(content: unknown[]): string {
  return `${Math.max(1, Math.round(countWords(content) / 200))} min`;
}

export function mapBlogPostSummary(row: BlogPostRow): BlogPostSummary {
  return {
    slug: row.slug,
    title: row.title,
    h1: row.h1 || row.title,
    featuredImage: { src: row.featured_image_url ?? "", alt: row.featured_image_alt ?? "" },
    author: row.author,
    publishedDate: row.published_date,
    category: row.category ?? undefined,
    excerpt: row.excerpt,
    readingTime: estimateReadingTime(row.content ?? []),
    lastModifiedDate: row.updated_at ?? undefined,
  };
}

export function mapBlogPost(row: BlogPostRow, relatedPosts: BlogPostSummary[]): BlogPost {
  const summary = mapBlogPostSummary(row);
  return {
    ...summary,
    seo: mapSeo(row, row.title, row.excerpt),
    lastModifiedDate: row.updated_at,
    tags: row.tags ?? undefined,
    content: (row.content ?? []) as BlogPost["content"],
    wordCount: Math.max(1, countWords(row.content ?? [])),
    faqs: row.faqs && row.faqs.length > 0 ? row.faqs : undefined,
    relatedPosts: relatedPosts.length > 0 ? relatedPosts : undefined,
  };
}
