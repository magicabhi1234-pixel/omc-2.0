import { LandingPageData } from "@/types/landing";

export const topDistanceMBAInHealthcareManagement: LandingPageData = {
  slug: "top-distance-mba-in-healthcare-management",

  seo: {
    title: "Top Distance MBA in Healthcare Management in India (2026)",
    description: "Compare the best Distance MBA in Healthcare Management universities based on fees, approvals, rankings, and eligibility.",
    keywords: ["Distance MBA Healthcare Management", "MBA Healthcare", "Top Distance MBA", "UGC Approved MBA", "Best MBA Healthcare Colleges"],
  },

  hero: {
    badge: "Admissions Open 2026",
    heading: "Top Distance MBA in Healthcare Management",
    description: "Advance your career in healthcare administration with a UGC-approved Distance MBA in Healthcare Management.",
    heroImage: { src: "/universities/omc_logo.avif", alt: "Distance MBA Healthcare Management" },
    primaryButton: { label: "Apply Now", variant: "primary" },
    secondaryButton: { label: "Download Brochure", variant: "outline" },
    stats: [{ value: "100+", label: "Universities" }, { value: "50K+", label: "Students Guided" }, { value: "15+", label: "Years Experience" }],
  },

  universitySection: {
    badge: "Top Universities",
    heading: "Compare Top Distance MBA in Healthcare Management Universities",
    description: "Select the best university based on fees, rankings, approvals and placements.",
    universities: ["amity-online", "lpu-online", "nmims-online", "symbiosis-online", "jain-online", "manipal-jaipur-online", "upes-online", "vit-online", "srm-online", "shoolini-online"],
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
    heading: "Why Choose a Distance MBA in Healthcare Management?",
    description: "Master the skills needed to manage healthcare organizations, hospitals, and medical facilities.",
    items: [
      { title: "Healthcare Expertise", description: "Learn hospital administration, health policy, and healthcare operations.", icon: "heart" },
      { title: "Flexible Learning", description: "Study anytime, anywhere at your own pace.", icon: "clock" },
      { title: "Career Growth", description: "Unlock senior roles in hospital and healthcare administration.", icon: "briefcase" },
    ],
  },

  stats: {
    heading: "Why Students Trust Us",
    stats: [{ value: "100+", label: "Universities" }, { value: "50K+", label: "Students Guided" }, { value: "98%", label: "Student Satisfaction" }, { value: "15+", label: "Years Experience" }],
  },

  faq: {
    heading: "Frequently Asked Questions",
    faqs: [
      { question: "What is a Distance MBA in Healthcare Management?", answer: "It is a 2-year program covering hospital administration, health policy, healthcare operations, and medical facility management." },
      { question: "What career options are available?", answer: "Roles include Hospital Administrator, Healthcare Manager, Health Services Manager, and Clinical Operations Manager." },
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

export default topDistanceMBAInHealthcareManagement;

