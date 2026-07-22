import { LandingPageData } from "@/types/landing";

export const bestDistanceMBAInMarketing: LandingPageData = {
  slug: "best-universities-for-distance-education-mba-marketing-in-india",

  seo: {
    title: "Best Universities for Distance MBA in Marketing in India (2026)",
    description: "Compare top UGC-approved Distance MBA in Marketing universities based on fees, rankings, placement support, and eligibility.",
    keywords: ["Distance MBA Marketing", "MBA in Marketing", "Top Distance MBA", "UGC Approved MBA", "Best MBA Marketing Colleges"],
  },

  hero: {
    badge: "Admissions Open 2026",
    heading: "Best Universities for Distance MBA in Marketing",
    description: "Advance your marketing career with a UGC-approved Distance MBA in Marketing. Compare fees, duration, and placement support from India's top universities.",
    heroImage: { src: "/universities/omc_logo.avif", alt: "Distance MBA Marketing" },
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
    heading: "Compare Top Distance MBA in Marketing Universities",
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
      "christ-online",
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
    heading: "Why Choose a Distance MBA in Marketing?",
    description: "Master brand management, digital strategy, and consumer behavior while continuing your career.",
    items: [
      { title: "Marketing Expertise", description: "Learn brand management, digital marketing, and consumer insights.", icon: "target" },
      { title: "Flexible Learning", description: "Study anytime, anywhere at your own pace.", icon: "clock" },
      { title: "Career Growth", description: "Unlock senior roles in marketing and brand management.", icon: "briefcase" },
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
      { question: "What is a Distance MBA in Marketing?", answer: "It is a 2-year program covering brand management, digital marketing, consumer behavior, and sales strategy through distance learning." },
      { question: "Is a Distance MBA in Marketing valid for jobs?", answer: "Yes, UGC-approved Distance MBA degrees are valid for corporate and government jobs." },
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

export default bestDistanceMBAInMarketing;

