import { LandingPageData } from "@/types/landing";

export const symbiosisSSODL: LandingPageData = {
  slug: "symbiosis-center-for-online-learning",

  category: "University Pages",

  seo: {
    title: "Symbiosis Centre for Online Learning (SSODL) – Online MBA (2026)",
    description: "Explore Symbiosis SSODL Online MBA programs. Compare fees, approvals, duration, and placement support for working professionals.",
    keywords: ["Symbiosis Online Learning", "SSODL", "Symbiosis Online MBA", "Online MBA", "UGC Approved Online MBA"],
  },

  hero: {
    badge: "Symbiosis SSODL",
    heading: "Symbiosis Centre for Online Learning (SSODL)",
    description: "Explore Symbiosis SSODL's UGC-approved Online MBA programs designed for working professionals. Compare specializations, fees, and admission process.",
    heroImage: { src: "/universities/symbiosis.png", alt: "Symbiosis Centre for Online Learning" },
    primaryButton: { label: "Apply Now", variant: "primary" },
    secondaryButton: { label: "Download Brochure", variant: "outline" },
    stats: [
      { value: "1 Lakh+", label: "Students Enrolled" },
      { value: "NAAC A+", label: "Accreditation" },
      { value: "50+", label: "Programs Offered" },
    ],
  },

  universitySection: {
    badge: "Programs Offered",
    heading: "SSODL Online MBA Specializations",
    description: "Explore the range of online MBA specializations offered by Symbiosis SSODL.",
    universities: ["symbiosis-online"],
  },

  compareSection: {
    badge: "Compare",
    heading: "Compare SSODL Programs",
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
    heading: "Why Choose Symbiosis SSODL?",
    description: "India's leading online learning platform with UGC-approved programs.",
    items: [
      { title: "NAAC A+ Accredited", description: "Recognized for high academic standards.", icon: "award" },
      { title: "Flexible Online Learning", description: "Study anytime, anywhere with live and recorded sessions.", icon: "monitor" },
      { title: "Industry Relevant", description: "Curriculum designed for working professionals.", icon: "briefcase" },
    ],
  },

  stats: {
    heading: "Why Students Trust Symbiosis SSODL",
    stats: [
      { value: "1 Lakh+", label: "Alumni Network" },
      { value: "NAAC A+", label: "Accreditation" },
      { value: "50+", label: "Programs Offered" },
      { value: "4.6", label: "Student Rating" },
    ],
  },

  faq: {
    heading: "Frequently Asked Questions",
    faqs: [
      { question: "Is Symbiosis SSODL Online MBA valid?", answer: "Yes, SSODL programs are UGC-approved and valid for government and corporate jobs." },
      { question: "What is the fee for Symbiosis SSODL Online MBA?", answer: "The fee varies by specialization. Contact our counsellors for the latest fee structure." },
    ],
  },

  cta: {
    badge: "Get Free Counselling",
    heading: "Ready to Start Your Journey with Symbiosis SSODL?",
    description: "Talk to our education experts and get personalized guidance absolutely free.",
    primaryButton: { label: "Talk to Expert", variant: "primary" },
    secondaryButton: { label: "Compare Programs", variant: "outline" },
  },
};

export default symbiosisSSODL;

