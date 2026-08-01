import type {
  BenefitsSection,
  CareerScopeSection,
  CompareSection,
  CTASection,
  FAQSection,
  HeroSection,
  LandingPageData,
  ScholarshipBanner,
  SEOData,
  SpecializationSection,
  StatsSection,
  Testimonial,
  University,
  WhyChooseSection,
} from "@/types/landing";

/** Raw shape returned by LANDING_PAGE_BY_SLUG_QUERY, before final composition. */
export interface RawLandingPage {
  slug: string;
  category: string;
  seo: SEOData;
  hero: HeroSection;
  universitySection?: {
    badge?: string;
    heading: string;
    description?: string;
  };
  universities: University[];
  compareSection?: CompareSection;
  whyChoose?: WhyChooseSection;
  stats?: StatsSection;
  specializations?: SpecializationSection;
  benefits?: BenefitsSection;
  careerScope?: CareerScopeSection;
  scholarshipBanner?: ScholarshipBanner;
  faq?: FAQSection;
  testimonialsHeading?: string;
  testimonials?: Testimonial[];
  cta: CTASection;
}

/**
 * Composes the final `LandingPageData` shape from a raw Sanity query result -
 * mainly folding the resolved `universities` list into `universitySection`
 * (kept as a separate top-level projection in GROQ to avoid dereferencing the
 * same references twice), and turning the flat testimonial reference list
 * back into a `TestimonialsSection`.
 */
export function mapLandingPage(raw: RawLandingPage | null): LandingPageData | null {
  if (!raw) return null;

  const { universities, testimonialsHeading, testimonials, universitySection, ...rest } = raw;

  return {
    ...rest,
    universitySection: universitySection
      ? { ...universitySection, universities }
      : { heading: "", universities },
    testimonials:
      testimonials && testimonials.length > 0
        ? { heading: testimonialsHeading || "What Our Students Say", testimonials }
        : undefined,
  };
}
