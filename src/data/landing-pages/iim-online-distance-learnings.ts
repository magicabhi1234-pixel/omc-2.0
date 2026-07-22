import { LandingPageData } from "@/types/landing";

export const iimOnlineDistanceLearnings: LandingPageData = {
  slug: "iim-online-distance-learnings",

  seo: {
    title: "IIM Online & Distance Learning Programs (2026)",
    description: "Explore online and distance learning programs from India's top IIMs. Compare executive MBA, management programs, fees, and eligibility.",
    keywords: ["IIM Online Programs", "IIM Distance Learning", "Executive MBA IIM", "Online MBA", "IIM Management Programs"],
  },

  hero: {
    badge: "IIM Programs",
    heading: "IIM Online & Distance Learning Programs",
    description: "Explore online and distance learning programs from India's premier IIMs. Compare executive education, management programs, fees, and admission process.",
    heroImage: { src: "/universities/omc_logo.avif", alt: "IIM Online Distance Learning" },
    primaryButton: { label: "Apply Now", variant: "primary" },
    secondaryButton: { label: "Download Brochure", variant: "outline" },
    stats: [
      { value: "Top Ranked", label: "B-Schools" },
      { value: "50K+", label: "IIM Alumni" },
      { value: "15+", label: "Years Experience" },
    ],
  },

  universitySection: {
    badge: "Top Programs",
    heading: "Compare IIM Online & Distance Programs",
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
    heading: "Why Choose IIM Programs?",
    description: "IIM programs offer world-class management education and unmatched career opportunities.",
    items: [
      { title: "Global Recognition", description: "IIM degrees are recognized worldwide for excellence.", icon: "globe" },
      { title: "Expert Faculty", description: "Learn from India's best management faculty and industry leaders.", icon: "users" },
      { title: "Career Growth", description: "Unlock top leadership roles with an IIM credential.", icon: "briefcase" },
    ],
  },

  stats: {
    heading: "Why Students Trust Us",
    stats: [
      { value: "Top Ranked", label: "B-Schools" },
      { value: "50K+", label: "Students Guided" },
      { value: "98%", label: "Student Satisfaction" },
      { value: "15+", label: "Years Experience" },
    ],
  },

  faq: {
    heading: "Frequently Asked Questions",
    faqs: [
      { question: "Do IIMs offer online degrees?", answer: "Yes, many IIMs offer online Executive MBA and management programs for working professionals." },
      { question: "Are IIM online programs valid?", answer: "Yes, IIM online programs are highly recognized and valued in the corporate world." },
    ],
  },

  cta: {
    badge: "Get Free Counselling",
    heading: "Need Help Choosing the Right IIM Program?",
    description: "Talk to our education experts and get personalized guidance absolutely free.",
    primaryButton: { label: "Talk to Expert", variant: "primary" },
    secondaryButton: { label: "Compare Programs", variant: "outline" },
  },
};

export default iimOnlineDistanceLearnings;

