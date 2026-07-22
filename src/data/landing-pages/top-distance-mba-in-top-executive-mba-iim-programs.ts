import { LandingPageData } from "@/types/landing";

export const topDistanceMBAInExecutiveMBAIIM: LandingPageData = {
  slug: "top-distance-mba-in-top-executive-mba-iim-programs",

  seo: {
    title: "Top Distance MBA & Executive MBA Programs from IIMs in India (2026)",
    description: "Compare top Executive MBA and Distance MBA programs from IIMs and other premier institutes based on fees, approvals, rankings, and eligibility.",
    keywords: ["Executive MBA IIM", "Distance MBA", "Top Executive MBA", "IIM Programs", "Best MBA Colleges"],
  },

  hero: {
    badge: "Admissions Open 2026",
    heading: "Top Distance MBA & Executive MBA (IIM Programs)",
    description: "Explore UGC-approved Executive MBA and Distance MBA programs from India's top institutes including IIMs. Compare fees, duration, and placement support.",
    heroImage: { src: "/universities/omc_logo.avif", alt: "Executive MBA IIM Programs" },
    primaryButton: { label: "Apply Now", variant: "primary" },
    secondaryButton: { label: "Download Brochure", variant: "outline" },
    stats: [{ value: "100+", label: "Universities" }, { value: "50K+", label: "Students Guided" }, { value: "15+", label: "Years Experience" }],
  },

  universitySection: {
    badge: "Top Programs",
    heading: "Compare Top Executive MBA & Distance MBA Programs",
    description: "Select the best program based on fees, rankings, approvals and placements.",
    universities: ["amity-online", "lpu-online", "nmims-online", "symbiosis-online", "jain-online", "manipal-jaipur-online", "upes-online", "vit-online", "icfai-online", "ignou-distance"],
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
    heading: "Why Choose an Executive MBA or Distance MBA?",
    description: "Advance your career with flexible learning options designed for working professionals.",
    items: [
      { title: "Career Acceleration", description: "Fast-track your career with advanced management education.", icon: "zap" },
      { title: "Flexible Learning", description: "Study anytime, anywhere at your own pace.", icon: "clock" },
      { title: "Network Building", description: "Connect with peers and industry leaders.", icon: "users" },
    ],
  },

  stats: {
    heading: "Why Students Trust Us",
    stats: [{ value: "100+", label: "Universities" }, { value: "50K+", label: "Students Guided" }, { value: "98%", label: "Student Satisfaction" }, { value: "15+", label: "Years Experience" }],
  },

  faq: {
    heading: "Frequently Asked Questions",
    faqs: [
      { question: "What is the difference between Executive MBA and Distance MBA?", answer: "Executive MBA is designed for senior professionals with work experience, while Distance MBA is open to all graduates." },
      { question: "Are IIM Executive MBAs valid?", answer: "Yes, Executive MBAs from IIMs are highly recognized and valued in the corporate world." },
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

export default topDistanceMBAInExecutiveMBAIIM;

