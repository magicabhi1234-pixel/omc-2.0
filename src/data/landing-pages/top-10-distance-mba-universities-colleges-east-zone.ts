import { LandingPageData } from "@/types/landing";

export const top10DistanceMBAEastZone: LandingPageData = {
  slug: "top-10-distance-mba-universities-colleges-east-zone",

  seo: {
    title: "Top 10 Distance MBA Universities & Colleges in East Zone (2026)",
    description: "Compare the best Distance MBA universities in East India based on fees, approvals, rankings, placement support and eligibility.",
    keywords: ["Distance MBA East India", "Top Distance MBA", "Online MBA", "UGC Approved MBA", "Best Distance MBA Colleges"],
  },

  hero: {
    badge: "Admissions Open 2026",
    heading: "Top 10 Distance MBA Universities & Colleges in East Zone",
    description: "Compare India's leading UGC-approved Distance MBA universities across East India by fees, approvals, flexibility and career support.",
    heroImage: { src: "/universities/omc_logo.avif", alt: "Distance MBA Colleges" },
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
    heading: "Compare Top Distance MBA Universities",
    description: "Select the best university based on fees, rankings, approvals and placements.",
    universities: [
      "ignou-distance",
      "icfai-online",
      "kl-university-online",
      "bharathiar-online",
      "andhra-online",
      "mit-online",
      "amrita-online",
      "sastra-online",
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
    heading: "Why Choose a Distance MBA?",
    description: "A Distance MBA offers flexibility, affordability and career growth without interrupting your work.",
    items: [
      { title: "Flexible Learning", description: "Study anytime, anywhere at your own pace.", icon: "clock" },
      { title: "Affordable Fees", description: "Lower cost compared to regular MBA programs.", icon: "wallet" },
      { title: "Career Growth", description: "Improve managerial skills and career opportunities.", icon: "briefcase" },
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
      { question: "Is a Distance MBA valid in India?", answer: "Yes. UGC-approved Distance MBA degrees are valid across India." },
      { question: "Can I pursue a Distance MBA while working?", answer: "Yes. Distance MBA programs are designed for working professionals." },
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

export default top10DistanceMBAEastZone;

