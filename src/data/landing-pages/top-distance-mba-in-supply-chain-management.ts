import { LandingPageData } from "@/types/landing";

export const topDistanceMBAInSupplyChainManagement: LandingPageData = {
  slug: "top-distance-mba-in-supply-chain-management",

  category: "MBA Specializations",

  seo: {
    title: "Top Distance MBA in Supply Chain Management in India (2026)",
    description: "Compare the best Distance MBA in Supply Chain Management universities based on fees, approvals, rankings, and eligibility.",
    keywords: ["Distance MBA Supply Chain", "MBA Logistics", "Top Distance MBA", "UGC Approved MBA", "Best Supply Chain MBA"],
  },

  hero: {
    badge: "Admissions Open 2026",
    heading: "Top Distance MBA in Supply Chain Management",
    description: "Build a career in logistics and supply chain with a UGC-approved Distance MBA. Compare fees, duration, and placement support from top universities.",
    heroImage: { src: "/universities/omc_logo.avif", alt: "Distance MBA Supply Chain Management" },
    primaryButton: { label: "Apply Now", variant: "primary" },
    secondaryButton: { label: "Download Brochure", variant: "outline" },
    stats: [{ value: "100+", label: "Universities" }, { value: "50K+", label: "Students Guided" }, { value: "15+", label: "Years Experience" }],
  },

  universitySection: {
    badge: "Top Universities",
    heading: "Compare Top Distance MBA in Supply Chain Management Universities",
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
    heading: "Why Choose a Distance MBA in Supply Chain Management?",
    description: "Master the end-to-end supply chain, logistics, and procurement management skills.",
    items: [
      { title: "Supply Chain Expertise", description: "Learn logistics, procurement, inventory management, and distribution.", icon: "truck" },
      { title: "Flexible Learning", description: "Study anytime, anywhere at your own pace.", icon: "clock" },
      { title: "Career Growth", description: "Unlock senior roles in supply chain, logistics, and operations.", icon: "briefcase" },
    ],
  },

  stats: {
    heading: "Why Students Trust Us",
    stats: [{ value: "100+", label: "Universities" }, { value: "50K+", label: "Students Guided" }, { value: "98%", label: "Student Satisfaction" }, { value: "15+", label: "Years Experience" }],
  },

  faq: {
    heading: "Frequently Asked Questions",
    faqs: [
      { question: "What is a Distance MBA in Supply Chain Management?", answer: "It is a 2-year program covering logistics, procurement, inventory management, and global supply chain strategy." },
      { question: "What career options are available?", answer: "Roles include Supply Chain Manager, Logistics Manager, Procurement Manager, and Operations Director." },
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

export default topDistanceMBAInSupplyChainManagement;

