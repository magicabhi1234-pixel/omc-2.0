import { LandingPageData } from "@/types/landing";

export const topDistanceMBAInITAndProjectManagement: LandingPageData = {
  slug: "top-distance-mba-in-information-technology-and-project-management",

  category: "MBA Specializations",

  seo: {
    title: "Top Distance MBA in IT & Project Management in India (2026)",
    description: "Compare the best Distance MBA in Information Technology and Project Management universities based on fees, approvals, rankings, and eligibility.",
    keywords: ["Distance MBA IT Management", "MBA Project Management", "Top Distance MBA", "UGC Approved MBA", "Best MBA IT Colleges"],
  },

  hero: {
    badge: "Admissions Open 2026",
    heading: "Top Distance MBA in IT & Project Management",
    description: "Combine technology leadership with project management skills through a UGC-approved Distance MBA in IT and Project Management.",
    heroImage: { src: "/universities/omc_logo.avif", alt: "Distance MBA IT Project Management" },
    primaryButton: { label: "Apply Now", variant: "primary" },
    secondaryButton: { label: "Download Brochure", variant: "outline" },
    stats: [{ value: "100+", label: "Universities" }, { value: "50K+", label: "Students Guided" }, { value: "15+", label: "Years Experience" }],
  },

  universitySection: {
    badge: "Top Universities",
    heading: "Compare Top Distance MBA in IT & Project Management Universities",
    description: "Select the best university based on fees, rankings, approvals and placements.",
    universities: ["amity-online", "lpu-online", "nmims-online", "symbiosis-online", "jain-online", "upes-online", "vit-online", "srm-online", "chandigarh-university-online", "shoolini-online"],
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
    heading: "Why Choose a Distance MBA in IT & Project Management?",
    description: "Develop the skills to lead technology projects and manage IT teams effectively.",
    items: [
      { title: "Tech Leadership", description: "Master IT strategy, project management, and digital transformation.", icon: "monitor" },
      { title: "Flexible Learning", description: "Study anytime, anywhere at your own pace.", icon: "clock" },
      { title: "Career Growth", description: "Unlock senior roles in IT management and project leadership.", icon: "briefcase" },
    ],
  },

  stats: {
    heading: "Why Students Trust Us",
    stats: [{ value: "100+", label: "Universities" }, { value: "50K+", label: "Students Guided" }, { value: "98%", label: "Student Satisfaction" }, { value: "15+", label: "Years Experience" }],
  },

  faq: {
    heading: "Frequently Asked Questions",
    faqs: [
      { question: "What is a Distance MBA in IT & Project Management?", answer: "It is a 2-year program combining IT strategy, project management methodologies, and technology leadership." },
      { question: "What career options are available?", answer: "Roles include IT Manager, Project Manager, Technology Consultant, and Digital Transformation Lead." },
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

export default topDistanceMBAInITAndProjectManagement;

