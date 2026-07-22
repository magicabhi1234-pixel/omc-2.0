import { LandingPageData } from "@/types/landing";

export const topOnlineDistanceMCABCABBANorth: LandingPageData = {
  slug: "top-online-distance-mca-bca-bba-colleges-university-bachelor-north",

  category: "Bachelor Programs",

  seo: {
    title: "Top Online & Distance MCA, BCA, BBA Colleges in North Zone (2026)",
    description: "Compare the best online and distance MCA, BCA, BBA programs in North India. Compare fees, approvals, rankings, and eligibility.",
    keywords: ["Online MCA North India", "Distance BCA", "Online BBA", "Top Distance Learning", "UGC Approved Programs"],
  },

  hero: {
    badge: "Admissions Open 2026",
    heading: "Top Online & Distance MCA, BCA, BBA Colleges in North Zone",
    description: "Compare India's best online and distance bachelor's and master's programs in North India. Compare fees, approvals, and placement support.",
    heroImage: { src: "/universities/omc_logo.avif", alt: "Online Distance MCA BCA BBA" },
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
    heading: "Compare Top Online & Distance Programs",
    description: "Select the best university based on fees, rankings, approvals and placements.",
    universities: [
      "amity-online",
      "lpu-online",
      "symbiosis-online",
      "nmims-online",
      "jain-online",
      "manipal-jaipur-online",
      "upes-online",
      "chandigarh-university-online",
      "shoolini-online",
      "ignou-distance",
    ],
  },

  compareSection: {
    badge: "Compare",
    heading: "Compare Programs Side by Side",
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
    heading: "Why Choose Online & Distance Learning?",
    description: "Flexible, affordable, and UGC-approved programs to advance your career.",
    items: [
      { title: "Flexible Learning", description: "Study anytime, anywhere at your own pace.", icon: "clock" },
      { title: "Affordable Fees", description: "Lower cost compared to regular programs.", icon: "wallet" },
      { title: "Career Growth", description: "Improve skills and career opportunities.", icon: "briefcase" },
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
      { question: "Are online MCA, BCA, BBA degrees valid?", answer: "Yes, UGC-approved online degrees are valid for government and corporate jobs." },
      { question: "Can I study while working?", answer: "Yes, online and distance programs are designed for working professionals." },
    ],
  },

  cta: {
    badge: "Get Free Counselling",
    heading: "Need Help Choosing the Right Program?",
    description: "Talk to our education experts and get personalized guidance absolutely free.",
    primaryButton: { label: "Talk to Expert", variant: "primary" },
    secondaryButton: { label: "Compare Programs", variant: "outline" },
  },
};

export default topOnlineDistanceMCABCABBANorth;

