import { LandingPageData } from "@/types/landing";

export const topDistanceMBAInBankingAndFinance: LandingPageData = {
  slug: "top-distance-mba-in-banking-and-finance-management",

  seo: {
    title: "Top Distance MBA in Banking & Finance Management in India (2026)",
    description: "Compare the best Distance MBA in Banking and Finance Management universities based on fees, approvals, rankings, and eligibility.",
    keywords: ["Distance MBA Banking Finance", "MBA Finance Management", "Top Distance MBA", "UGC Approved MBA", "Best MBA Finance Colleges"],
  },

  hero: {
    badge: "Admissions Open 2026",
    heading: "Top Distance MBA in Banking & Finance Management",
    description: "Build a career in banking and finance with a UGC-approved Distance MBA. Compare fees, duration, and placement support from top universities.",
    heroImage: { src: "/universities/omc_logo.avif", alt: "Distance MBA Banking and Finance" },
    primaryButton: { label: "Apply Now", variant: "primary" },
    secondaryButton: { label: "Download Brochure", variant: "outline" },
    stats: [
      { value: "100+", label: "Universities" },
      { value: "50K+", label: "Students Guided" },
      { value: "15+", label: "Years Experience" },
    ],
  },

  universitySection: {
    badge: "Top Universities",
    heading: "Compare Top Distance MBA in Banking & Finance Universities",
    description: "Select the best university based on fees, rankings, approvals and placements.",
    universities: ["amity-online", "lpu-online", "nmims-online", "symbiosis-online", "jain-online", "manipal-jaipur-online", "upes-online", "ignou-distance", "icfai-online", "vit-online"],
  },

  compareSection: {
    badge: "Compare",
    heading: "Compare Universities Side by Side",
    description: "Compare fees, approvals, placements, eligibility and duration before making your decision.",
    features: [
      { id: "fees", label: "Course Fees", key: "startingFee" },
      { id: "duration", label: "Duration", key: "duration" },
      { id: "mode", label: "Study Mode", key: "studyMode" },
      { id: "eligibility", label: "Eligibility", key: "eligibility" },
      { id: "placement", label: "Placement Support", key: "placementSupport" },
    ],
  },

  whyChoose: {
    heading: "Why Choose a Distance MBA in Banking & Finance?",
    description: "Gain expertise in financial management, investment banking, and risk analysis while continuing your career.",
    items: [
      { title: "Finance Expertise", description: "Master financial management, banking operations, and investment strategies.", icon: "trending-up" },
      { title: "Flexible Learning", description: "Study anytime, anywhere at your own pace.", icon: "clock" },
      { title: "Career Growth", description: "Unlock senior roles in banking, finance, and investment sectors.", icon: "briefcase" },
    ],
  },

  stats: {
    heading: "Why Students Trust Us",
    stats: [
      { value: "100+", label: "Universities" },
      { value: "50K+", label: "Students Guided" },
      { value: "98%", label: "Student Satisfaction" },
      { value: "15+", label: "Years Experience" },
    ],
  },

  faq: {
    heading: "Frequently Asked Questions",
    faqs: [
      { question: "What is a Distance MBA in Banking & Finance Management?", answer: "It is a 2-year program covering financial management, banking operations, investment analysis, and risk management." },
      { question: "Can I work in a bank after a Distance MBA in Finance?", answer: "Yes, UGC-approved Distance MBA degrees are recognized by banks and financial institutions." },
    ],
  },

  cta: {
    badge: "Get Free Counselling",
    heading: "Need Help Choosing the Right University?",
    description: "Talk to our education experts and get personalized guidance absolutely free.",
    primaryButton: { label: "Talk to Expert", variant: "primary" },
    secondaryButton: { label: "Compare Universities", variant: "outline" },
  },
};

export default topDistanceMBAInBankingAndFinance;

