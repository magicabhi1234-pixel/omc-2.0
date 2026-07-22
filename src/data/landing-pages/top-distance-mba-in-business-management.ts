import { LandingPageData } from "@/types/landing";

export const topDistanceMBAInBusinessManagement: LandingPageData = {
  slug: "top-distance-mba-in-business-management",

  category: "MBA Specializations",

  seo: {
    title: "Top Distance MBA in Business Management in India (2026)",
    description: "Compare the best Distance MBA in Business Management universities based on fees, approvals, rankings, and eligibility.",
    keywords: ["Distance MBA Business Management", "Top Distance MBA", "UGC Approved MBA", "Best Distance MBA Colleges", "MBA in Business Management"],
  },

  hero: {
    badge: "Admissions Open 2026",
    heading: "Top Distance MBA in Business Management",
    description: "Explore UGC-approved Distance MBA programs in Business Management from India's top universities. Compare fees, duration, and placement support.",
    heroImage: { src: "/universities/omc_logo.avif", alt: "Distance MBA Business Management" },
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
    heading: "Compare Top Distance MBA in Business Management Universities",
    description: "Select the best university based on fees, rankings, approvals and placements.",
    universities: [
      "amity-online",
      "lpu-online",
      "symbiosis-online",
      "nmims-online",
      "jain-online",
      "manipal-jaipur-online",
      "upes-online",
      "ignou-distance",
      "icfai-online",
      "amrita-online",
    ],
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
    heading: "Why Choose a Distance MBA in Business Management?",
    description: "A Distance MBA in Business Management equips you with essential leadership and strategic skills to excel in the corporate world.",
    items: [
      { title: "Comprehensive Curriculum", description: "Cover management, finance, marketing, and operations.", icon: "book" },
      { title: "Flexible Learning", description: "Study anytime, anywhere at your own pace.", icon: "clock" },
      { title: "Career Growth", description: "Unlock senior management and leadership roles.", icon: "briefcase" },
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
      { question: "What is a Distance MBA in Business Management?", answer: "It is a 2-year postgraduate program covering business strategy, leadership, and management principles through distance learning." },
      { question: "Is a Distance MBA in Business Management valid?", answer: "Yes, when earned from a UGC-approved university, it is valid for government jobs and corporate roles." },
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

export default topDistanceMBAInBusinessManagement;

