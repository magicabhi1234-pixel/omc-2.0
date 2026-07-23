// =============================================
// Common Types
// =============================================

export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  robots?: string;
}

export interface ButtonData {
  label: string;
  href?: string;
  variant?: "primary" | "secondary" | "outline";
}

export interface ImageData {
  src: string;
  alt: string;
}

// =============================================
// Hero Section
// =============================================

export interface HeroStat {
  value: string;
  label: string;
}

export interface HeroSection {
  badge?: string;
  heading: string;
  description: string;

  backgroundImage?: string;
  heroImage?: ImageData;

  primaryButton: ButtonData;
  secondaryButton?: ButtonData;

  stats?: HeroStat[];
}

// =============================================
// University
// =============================================

export interface UniversityApproval {
  id: string;
  label: string;
}

export interface UniversityRanking {
  source: string;
  value: string;
}

export interface University {
  id: string;

  slug: string;

  name: string;

  logo: string;

  rating?: number;

  reviewCount?: number;

  studyMode: string;

  duration: string;

  eligibility: string;

  approvals: UniversityApproval[];

  rankings?: UniversityRanking[];

  startingFee: string;

  emi?: string;

  placementSupport?: string;

  brochureUrl?: string;

  websiteUrl?: string;

  featured?: boolean;
}

// =============================================
// University Section
// =============================================

export interface UniversitySection {
  badge?: string;

  heading: string;

  description?: string;

  universities: string[];
}

// =============================================
// Compare Section
// =============================================

export interface CompareFeature {
  id: string;

  label: string;

  key: keyof University | string;
}

export interface CompareSection {
  badge?: string;

  heading: string;

  description?: string;

  features: CompareFeature[];
}

// =============================================
// Why Choose Section
// =============================================

export interface WhyChooseItem {
  title: string;

  description: string;

  icon: string;
}

export interface WhyChooseSection {
  heading: string;

  description?: string;

  items: WhyChooseItem[];
}

// =============================================
// Stats Section
// =============================================

export interface StatCard {
  value: string;

  label: string;
}

export interface StatsSection {
  heading?: string;

  description?: string;

  stats: StatCard[];
}

// =============================================
// Scholarship Banner
// =============================================

export interface ScholarshipBanner {
  heading: string;

  description?: string;

  button: ButtonData;
}

// =============================================
// Specializations
// =============================================

export interface Specialization {
  title: string;

  slug: string;

  icon?: string;

  desc?: string;

  description?: string;
}

export interface SpecializationSection {
  heading: string;

  description?: string;

  items: Specialization[];
}

// =============================================
// Testimonials
// =============================================

export interface Testimonial {
  id: string;

  name: string;

  designation?: string;

  university?: string;

  image?: string;

  review: string;

  rating: number;
}

export interface TestimonialsSection {
  heading: string;

  description?: string;

  testimonials: Testimonial[];
}

// =============================================
// FAQ
// =============================================

export interface FAQItem {
  question: string;

  answer: string;
}

export interface FAQSection {
  heading: string;

  description?: string;

  faqs: FAQItem[];
}

// =============================================
// CTA
// =============================================

export interface CTASection {
  badge?: string;

  heading: string;

  description?: string;

  primaryButton: ButtonData;

  secondaryButton?: ButtonData;
}

// =============================================
// Landing Page
// =============================================

export interface LandingPageData {
  slug: string;

  category: string;

  seo: SEOData;

  hero: HeroSection;

  universitySection: UniversitySection;

  compareSection?: CompareSection;

  whyChoose?: WhyChooseSection;

  stats?: StatsSection;

  scholarshipBanner?: ScholarshipBanner;

  specializations?: SpecializationSection;

  testimonials?: TestimonialsSection;

  faq?: FAQSection;

  cta: CTASection;
}