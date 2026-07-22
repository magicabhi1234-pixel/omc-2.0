import { LandingPageData } from "@/types/landing";

export const topDistanceMBAInHRManagement: LandingPageData = {
  slug: "top-distance-mba-in-human-resource-management",

  seo: {
    title: "Top Distance MBA in Human Resource Management in India (2026)",
    description: "Compare the best Distance MBA in HR Management universities based on fees, approvals, rankings, and eligibility.",
    keywords: ["Distance MBA HR Management", "MBA Human Resources", "Top Distance MBA", "UGC Approved MBA", "Best MBA HR Colleges"],
  },

  hero: {
    badge: "Admissions Open 2026",
    heading: "Top Distance MBA in Human Resource Management",
    description: "Build a career in HR management with a UGC-approved Distance MBA. Compare fees, duration, and placement support from top universities.",
    heroImage: { src: "/universities/omc_logo.avif", alt: "Distance MBA HR Management" },
    primaryButton: { label: "Apply Now", variant: "primary" },
    secondaryButton: { label: "Download Brochure", variant: "outline" },
    stats: [{ value: "100+", label: "Universities" }, { value: "50K+", label: "Students Guided" }, { value: "15+", label: "Years Experience" }],
  },

  universitySection: {
    badge: "Top Universities",
    heading: "Compare Top Distance MBA in HR Management Universities",
    description: "Select the best university based on fees, rankings, approvals and placements.",
    universities: ["amity-online", "lpu-online", "nmims-online", "symbiosis-online", "jain-online", "manipal-jaipur-online", "upes-online", "ignou-distance", "icfai-online", "christ-online"],
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
    heading: "Why Choose a Distance MBA in HR Management?",
    description: "Master talent management, organizational behavior, and strategic HR leadership.",
    items: [
      { title: "HR Expertise", description: "Learn talent acquisition, performance management, and employee relations.", icon: "users" },
      { title: "Flexible Learning", description: "Study anytime, anywhere at your own pace.", icon: "clock" },
      { title: "Career Growth", description: "Unlock senior roles in HR management and organizational development.", icon: "briefcase" },
    ],
  },

  stats: {
    heading: "Why Students Trust Us",
    stats: [{ value: "100+", label: "Universities" }, { value: "50K+", label: "Students Guided" }, { value: "98%", label: "Student Satisfaction" }, { value: "15+", label: "Years Experience" }],
  },

  faq: {
    heading: "Frequently Asked Questions",
    faqs: [
      { question: "What is a Distance MBA in HR Management?", answer: "It is a 2-year program covering talent management, organizational behavior, compensation management, and HR strategy." },
      { question: "What career options are available after an MBA in HR?", answer: "Roles include HR Manager, Talent Acquisition Manager, HR Business Partner, and Training & Development Manager." },
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

export default topDistanceMBAInHRManagement;

