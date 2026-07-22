import { LandingPageData } from "@/types/landing";

export const topDistanceMBAInFinanceManagement: LandingPageData = {
  slug: "top-distance-mba-in-finance-management",

  seo: {
    title: "Top Distance MBA in Finance Management in India (2026)",
    description: "Compare the best Distance MBA in Finance Management universities based on fees, approvals, rankings, and eligibility.",
    keywords: ["Distance MBA Finance", "MBA Finance Management", "Top Distance MBA", "UGC Approved MBA", "Best MBA Finance Colleges"],
  },

  hero: {
    badge: "Admissions Open 2026",
    heading: "Top Distance MBA in Finance Management",
    description: "Build expertise in financial management, investment analysis, and corporate finance with a UGC-approved Distance MBA.",
    heroImage: { src: "/universities/omc_logo.avif", alt: "Distance MBA Finance Management" },
    primaryButton: { label: "Apply Now", variant: "primary" },
    secondaryButton: { label: "Download Brochure", variant: "outline" },
    stats: [{ value: "100+", label: "Universities" }, { value: "50K+", label: "Students Guided" }, { value: "15+", label: "Years Experience" }],
  },

  universitySection: {
    badge: "Top Universities",
    heading: "Compare Top Distance MBA in Finance Management Universities",
    description: "Select the best university based on fees, rankings, approvals and placements.",
    universities: ["amity-online", "lpu-online", "nmims-online", "symbiosis-online", "jain-online", "manipal-jaipur-online", "upes-online", "vit-online", "icfai-online", "christ-online"],
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
    heading: "Why Choose a Distance MBA in Finance Management?",
    description: "Develop advanced financial analysis and strategic management skills for leadership roles.",
    items: [
      { title: "Finance Expertise", description: "Master corporate finance, investment banking, and risk management.", icon: "trending-up" },
      { title: "Flexible Learning", description: "Study anytime, anywhere at your own pace.", icon: "clock" },
      { title: "Career Growth", description: "Unlock senior roles in finance, banking, and investment sectors.", icon: "briefcase" },
    ],
  },

  stats: {
    heading: "Why Students Trust Us",
    stats: [{ value: "100+", label: "Universities" }, { value: "50K+", label: "Students Guided" }, { value: "98%", label: "Student Satisfaction" }, { value: "15+", label: "Years Experience" }],
  },

  faq: {
    heading: "Frequently Asked Questions",
    faqs: [
      { question: "What is a Distance MBA in Finance Management?", answer: "It is a 2-year program covering corporate finance, investment management, financial markets, and risk analysis." },
      { question: "What career options are available?", answer: "Roles include Financial Manager, Investment Banker, Financial Analyst, and Corporate Finance Manager." },
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

export default topDistanceMBAInFinanceManagement;

