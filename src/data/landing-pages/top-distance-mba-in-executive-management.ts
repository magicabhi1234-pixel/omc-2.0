import { LandingPageData } from "@/types/landing";

export const topDistanceMBAInExecutiveManagement: LandingPageData = {
  slug: "top-distance-mba-in-executive-management",

  category: "Executive MBA",

  seo: {
    title: "Top Distance MBA in Executive Management in India (2026)",
    description: "Compare the best Distance MBA in Executive Management universities based on fees, approvals, rankings, and eligibility.",
    keywords: ["Distance MBA Executive Management", "MBA Executive", "Top Distance MBA", "UGC Approved MBA", "Best Executive MBA Colleges"],
  },

  hero: {
    badge: "Admissions Open 2026",
    heading: "Top Distance MBA in Executive Management",
    description: "Advance your leadership career with a UGC-approved Distance MBA in Executive Management designed for experienced professionals.",
    heroImage: { src: "/universities/omc_logo.avif", alt: "Distance MBA Executive Management" },
    primaryButton: { label: "Apply Now", variant: "primary" },
    secondaryButton: { label: "Download Brochure", variant: "outline" },
    stats: [{ value: "100+", label: "Universities" }, { value: "50K+", label: "Students Guided" }, { value: "15+", label: "Years Experience" }],
  },

  universitySection: {
    badge: "Top Universities",
    heading: "Compare Top Distance MBA in Executive Management Universities",
    description: "Select the best university based on fees, rankings, approvals and placements.",
    universities: ["amity-online", "lpu-online", "nmims-online", "symbiosis-online", "jain-online", "manipal-jaipur-online", "upes-online", "vit-online", "srm-online", "icfai-online"],
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
    heading: "Why Choose a Distance MBA in Executive Management?",
    description: "Develop strategic leadership skills and accelerate your career growth.",
    items: [
      { title: "Leadership Focus", description: "Master strategic management, leadership, and organizational change.", icon: "zap" },
      { title: "Flexible Learning", description: "Study anytime, anywhere at your own pace.", icon: "clock" },
      { title: "Career Growth", description: "Unlock C-suite and senior leadership roles.", icon: "briefcase" },
    ],
  },

  stats: {
    heading: "Why Students Trust Us",
    stats: [{ value: "100+", label: "Universities" }, { value: "50K+", label: "Students Guided" }, { value: "98%", label: "Student Satisfaction" }, { value: "15+", label: "Years Experience" }],
  },

  faq: {
    heading: "Frequently Asked Questions",
    faqs: [
      { question: "What is a Distance MBA in Executive Management?", answer: "It is a program designed for senior professionals focusing on strategic leadership, organizational behavior, and advanced management." },
      { question: "Who should pursue an Executive Management MBA?", answer: "It is ideal for mid-to-senior level professionals looking to move into leadership roles." },
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

export default topDistanceMBAInExecutiveManagement;

