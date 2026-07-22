import { LandingPageData } from "@/types/landing";

export const symbiosisSCDL: LandingPageData = {
  slug: "symbiosis-center-for-distance-learning",

  seo: {
    title: "Symbiosis Centre for Distance Learning (SCDL) – Distance MBA (2026)",
    description: "Explore Symbiosis SCDL Distance MBA programs. Compare fees, approvals, duration, and placement support for working professionals.",
    keywords: ["Symbiosis Distance Learning", "SCDL", "Symbiosis Distance MBA", "Distance MBA", "UGC Approved MBA"],
  },

  hero: {
    badge: "Symbiosis SCDL",
    heading: "Symbiosis Centre for Distance Learning (SCDL)",
    description: "Explore Symbiosis SCDL's UGC-approved Distance MBA programs designed for working professionals. Compare specializations, fees, and admission process.",
    heroImage: { src: "/universities/symbiosis.png", alt: "Symbiosis Centre for Distance Learning" },
    primaryButton: { label: "Apply Now", variant: "primary" },
    secondaryButton: { label: "Download Brochure", variant: "outline" },
    stats: [
      { value: "2 Lakh+", label: "Students Enrolled" },
      { value: "20+", label: "Years of Excellence" },
      { value: "NAAC A+", label: "Accreditation" },
    ],
  },

  universitySection: {
    badge: "Programs Offered",
    heading: "SCDL Distance MBA Specializations",
    description: "Explore the range of distance MBA specializations offered by Symbiosis SCDL.",
    universities: ["symbiosis-online"],
  },

  compareSection: {
    badge: "Compare",
    heading: "Compare SCDL Programs",
    description: "Compare fees, duration, and other details across specializations.",
    features: [
      { id: "fees", label: "Course Fees", key: "startingFee" },
      { id: "duration", label: "Duration", key: "duration" },
      { id: "mode", label: "Study Mode", key: "studyMode" },
      { id: "eligibility", label: "Eligibility", key: "eligibility" },
      { id: "placement", label: "Placement Support", key: "placementSupport" },
    ],
  },

  whyChoose: {
    heading: "Why Choose Symbiosis SCDL?",
    description: "India's leading distance learning institute with decades of academic excellence.",
    items: [
      { title: "NAAC A+ Accredited", description: "Recognized for high academic standards.", icon: "award" },
      { title: "Flexible Learning", description: "Study anytime, anywhere at your own pace.", icon: "clock" },
      { title: "Industry Relevant", description: "Curriculum designed for working professionals.", icon: "briefcase" },
    ],
  },

  stats: {
    heading: "Why Students Trust Symbiosis SCDL",
    stats: [
      { value: "2 Lakh+", label: "Alumni Network" },
      { value: "20+", label: "Years of Excellence" },
      { value: "NAAC A+", label: "Accreditation" },
      { value: "30+", label: "Programs Offered" },
    ],
  },

  faq: {
    heading: "Frequently Asked Questions",
    faqs: [
      { question: "Is Symbiosis SCDL Distance MBA valid?", answer: "Yes, SCDL programs are UGC-approved and valid for government and corporate jobs." },
      { question: "What is the fee for Symbiosis SCDL Distance MBA?", answer: "The fee varies by specialization. Contact our counsellors for the latest fee structure." },
    ],
  },

  cta: {
    badge: "Get Free Counselling",
    heading: "Ready to Start Your Journey with Symbiosis SCDL?",
    description: "Talk to our education experts and get personalized guidance absolutely free.",
    primaryButton: { label: "Talk to Expert", variant: "primary" },
    secondaryButton: { label: "Compare Programs", variant: "outline" },
  },
};

export default symbiosisSCDL;

