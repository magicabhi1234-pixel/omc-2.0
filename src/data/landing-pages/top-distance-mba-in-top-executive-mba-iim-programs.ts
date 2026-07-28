import { LandingPageData } from "@/types/landing";

export const topDistanceMBAInExecutiveMBAIIM: LandingPageData = {
  slug: "top-distance-mba-in-top-executive-mba-iim-programs",

  category: "Executive MBA",

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
    universities: [
      "iim-kozhikode",
      "iim-lucknow",
      "iim-indore",
      "iim-raipur",
      "iim-rohtak",
      "iim-udaipur",
      "iim-kashipur",
      "iim-ranchi",
      "iim-shillong",
      "iim-vishakhapatnam",
      "iim-jammu",
      "iim-nagpur",
      "iim-amritsar",
      "iim-bodh-gaya",
      "iim-sambalpur",
      "iim-sirmaur",
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
      { question: "Is Online MBA valid?", answer: "Yes, a Online MBA is a legitimate degree. The institute which is accepted by UGC-DEB is accredited to provide a valid Online education degree." },
      { question: "Does Online learning help in career growth?", answer: "Online Learning Degree is the most in Demand skills for Working Professionals these days. Online learning aids in occupation development and opportunities. The majority of business urge their staff members the obtaining higher education to boost as well as improve their capability." },
      { question: "Does MNC and government jobs do take into consideration a Online education?", answer: "Yes, UGC-DEB Approved Online course degree stands for private as well as govt. jobs." },
      { question: "What is the difference in between Online learning as well as Online discovering?", answer: "In Online discovering the studies are one side. Course material is supplied by the institute and also self-learning is the primary purpose. Whereas Online learning is a kind of Online course, where Online Classes and Research is conducted between Teachers and Student by using the internet with the help of laptop computer, mobile, or tablet computer. A dedicated mentor is also assigned to the Students to help them through out their course duration." },
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

