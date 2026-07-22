import { LandingPageData } from "@/types/landing";

export const topDistanceMBAInDigitalMarketing: LandingPageData = {
  slug: "top-distance-mba-in-digital-marketing",

  seo: {
    title: "Top Distance MBA in Digital Marketing in India (2026)",
    description: "Compare the best Distance MBA in Digital Marketing universities based on fees, approvals, rankings, and eligibility.",
    keywords: ["Distance MBA Digital Marketing", "MBA Digital Marketing", "Top Distance MBA", "UGC Approved MBA", "Best Digital Marketing MBA"],
  },

  hero: {
    badge: "Admissions Open 2026",
    heading: "Top Distance MBA in Digital Marketing",
    description: "Master digital marketing strategies with a UGC-approved Distance MBA. Compare fees, duration, and placement support from top universities.",
    heroImage: { src: "/universities/omc_logo.avif", alt: "Distance MBA Digital Marketing" },
    primaryButton: { label: "Apply Now", variant: "primary" },
    secondaryButton: { label: "Download Brochure", variant: "outline" },
    stats: [{ value: "100+", label: "Universities" }, { value: "50K+", label: "Students Guided" }, { value: "15+", label: "Years Experience" }],
  },

  universitySection: {
    badge: "Top Universities",
    heading: "Compare Top Distance MBA in Digital Marketing Universities",
    description: "Select the best university based on fees, rankings, approvals and placements.",
    universities: ["amity-online", "lpu-online", "nmims-online", "symbiosis-online", "jain-online", "manipal-jaipur-online", "upes-online", "vit-online", "srm-online", "christ-online"],
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
    heading: "Why Choose a Distance MBA in Digital Marketing?",
    description: "Build expertise in SEO, SEM, social media, content strategy, and digital analytics.",
    items: [
      { title: "Digital Expertise", description: "Master SEO, PPC, social media, content marketing, and analytics.", icon: "globe" },
      { title: "Flexible Learning", description: "Study anytime, anywhere at your own pace.", icon: "clock" },
      { title: "Career Growth", description: "Unlock senior roles in digital marketing and brand management.", icon: "briefcase" },
    ],
  },

  stats: {
    heading: "Why Students Trust Us",
    stats: [{ value: "100+", label: "Universities" }, { value: "50K+", label: "Students Guided" }, { value: "98%", label: "Student Satisfaction" }, { value: "15+", label: "Years Experience" }],
  },

  faq: {
    heading: "Frequently Asked Questions",
    faqs: [
      { question: "What is a Distance MBA in Digital Marketing?", answer: "It is a 2-year program covering SEO, SEM, social media marketing, content strategy, and digital analytics." },
      { question: "What career options are available?", answer: "Roles include Digital Marketing Manager, SEO Specialist, Social Media Manager, and Content Marketing Lead." },
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

export default topDistanceMBAInDigitalMarketing;

