import { University } from "@/types/landing";

// =============================================
// Universities Master Data (Single Source of Truth)
// =============================================
// Referenced by landing page cards via `id`.
// TODO: Replace placeholder data with actual values from reference website.

export const universities: University[] = [
  {
    id: "amity-online",

    slug: "amity-online",

    name: "Amity University Online",

    logo: "/universities/amity_university.png",

    rating: 4.8,

    reviewCount: 1254,

    studyMode: "Online MBA",

    duration: "2 Years",

    eligibility: "Bachelor's Degree",

    approvals: [
      {
        id: "ugc",
        label: "UGC",
      },
      {
        id: "aicte",
        label: "AICTE",
      },
      {
        id: "naac",
        label: "NAAC A+",
      },
    ],

    rankings: [
      {
        source: "NIRF",
        value: "#32",
      },
    ],

    startingFee: "₹49,750/Sem",

    emi: "₹8,292/Month",

    placementSupport: "Yes",

    brochureUrl: "#",

    websiteUrl: "#",

    featured: true,
  },

  {
    id: "lpu-online",

    slug: "lpu-online",

    name: "LPU Online",

    logo: "/universities/lpu.png",

    rating: 4.7,

    reviewCount: 982,

    studyMode: "Online MBA",

    duration: "2 Years",

    eligibility: "Bachelor's Degree",

    approvals: [
      {
        id: "ugc",
        label: "UGC",
      },
      {
        id: "aicte",
        label: "AICTE",
      },
    ],

    rankings: [
      {
        source: "NIRF",
        value: "#27",
      },
    ],

    startingFee: "₹45,000/Sem",

    emi: "₹7,500/Month",

    placementSupport: "Yes",

    brochureUrl: "#",

    websiteUrl: "#",

    featured: true,
  },

  // =============================================
  // North Zone Universities
  // =============================================

  {
    id: "symbiosis-online",

    slug: "symbiosis-online",

    name: "Symbiosis University",

    logo: "/universities/symbiosis.png",

    rating: 4.6,

    reviewCount: 876,

    studyMode: "Online & Distance MBA",

    duration: "2 Years",

    eligibility: "Bachelor's Degree",

    approvals: [
      {
        id: "ugc",
        label: "UGC",
      },
      {
        id: "aicte",
        label: "AICTE",
      },
      {
        id: "naac",
        label: "NAAC A+",
      },
    ],

    rankings: [
      {
        source: "NIRF",
        value: "#37",
      },
    ],

    startingFee: "₹79,000/Sem",

    emi: "₹13,167/Month",

    placementSupport: "Yes",

    brochureUrl: "#",

    websiteUrl: "#",

    featured: false,
  },

  {
    id: "upes-online",

    slug: "upes-online",

    name: "UPES Online",

    logo: "/universities/upes.png",

    rating: 4.5,

    reviewCount: 654,

    studyMode: "Online MBA",

    duration: "2 Years",

    eligibility: "Bachelor's Degree",

    approvals: [
      {
        id: "ugc",
        label: "UGC",
      },
      {
        id: "naac",
        label: "NAAC A",
      },
    ],

    startingFee: "₹75,000/Sem",

    emi: "₹12,500/Month",

    placementSupport: "Yes",

    brochureUrl: "#",

    websiteUrl: "#",

    featured: false,
  },

  {
    id: "chandigarh-university-online",

    slug: "chandigarh-university-online",

    name: "Chandigarh University Online",

    logo: "/universities/chitkara-university.png",

    rating: 4.5,

    reviewCount: 712,

    studyMode: "Online MBA",

    duration: "2 Years",

    eligibility: "Bachelor's Degree",

    approvals: [
      {
        id: "ugc",
        label: "UGC",
      },
      {
        id: "naac",
        label: "NAAC A+",
      },
    ],

    startingFee: "₹79,000/Sem",

    emi: "₹13,167/Month",

    placementSupport: "Yes",

    brochureUrl: "#",

    websiteUrl: "#",

    featured: false,
  },

  {
    id: "nmims-online",

    slug: "nmims-online",

    name: "NMIMS Global",

    logo: "/universities/nmims.png",

    rating: 4.7,

    reviewCount: 1123,

    studyMode: "Online MBA",

    duration: "2 Years",

    eligibility: "Bachelor's Degree",

    approvals: [
      {
        id: "ugc",
        label: "UGC",
      },
      {
        id: "aicte",
        label: "AICTE",
      },
      {
        id: "naac",
        label: "NAAC A+",
      },
    ],

    rankings: [
      {
        source: "NIRF",
        value: "#41",
      },
    ],

    startingFee: "₹1,05,000/Sem",

    emi: "₹17,500/Month",

    placementSupport: "Yes",

    brochureUrl: "#",

    websiteUrl: "#",

    featured: false,
  },

  {
    id: "jain-online",

    slug: "jain-online",

    name: "Jain University",

    logo: "/universities/jain.png",

    rating: 4.5,

    reviewCount: 567,

    studyMode: "Online MBA",

    duration: "2 Years",

    eligibility: "Bachelor's Degree",

    approvals: [
      {
        id: "ugc",
        label: "UGC",
      },
      {
        id: "naac",
        label: "NAAC A++",
      },
    ],

    startingFee: "₹80,000/Sem",

    emi: "₹13,333/Month",

    placementSupport: "Yes",

    brochureUrl: "#",

    websiteUrl: "#",

    featured: false,
  },

  {
    id: "manipal-jaipur-online",

    slug: "manipal-jaipur-online",

    name: "Manipal University Jaipur",

    logo: "/universities/manipal.png",

    rating: 4.6,

    reviewCount: 834,

    studyMode: "Online MBA",

    duration: "2 Years",

    eligibility: "Bachelor's Degree",

    approvals: [
      {
        id: "ugc",
        label: "UGC",
      },
      {
        id: "naac",
        label: "NAAC A+",
      },
    ],

    startingFee: "₹87,500/Sem",

    emi: "₹14,583/Month",

    placementSupport: "Yes",

    brochureUrl: "#",

    websiteUrl: "#",

    featured: false,
  },

  {
    id: "dypatil-online",

    slug: "dypatil-online",

    name: "DY Patil University",

    logo: "/universities/dpu.png",

    rating: 4.4,

    reviewCount: 432,

    studyMode: "Online MBA",

    duration: "2 Years",

    eligibility: "Bachelor's Degree",

    approvals: [
      {
        id: "ugc",
        label: "UGC",
      },
      {
        id: "naac",
        label: "NAAC A++",
      },
    ],

    startingFee: "₹84,500/Sem",

    emi: "₹14,083/Month",

    placementSupport: "Yes",

    brochureUrl: "#",

    websiteUrl: "#",

    featured: false,
  },

  {
    id: "shoolini-online",

    slug: "shoolini-online",

    name: "Shoolini University",

    logo: "/universities/shoolini_university.png",

    rating: 4.3,

    reviewCount: 321,

    studyMode: "Online MBA",

    duration: "2 Years",

    eligibility: "Bachelor's Degree",

    approvals: [
      {
        id: "ugc",
        label: "UGC",
      },
      {
        id: "naac",
        label: "NAAC A+",
      },
    ],

    startingFee: "₹60,000/Sem",

    emi: "₹10,000/Month",

    placementSupport: "Yes",

    brochureUrl: "#",

    websiteUrl: "#",

    featured: false,
  },

  {
    id: "subharti-online",

    slug: "subharti-online",

    name: "Shubharti Online",

    logo: "/universities/subharti.png",

    rating: 4.2,

    reviewCount: 245,

    studyMode: "Online MBA",

    duration: "2 Years",

    eligibility: "Bachelor's Degree",

    approvals: [
      {
        id: "ugc",
        label: "UGC",
      },
      {
        id: "naac",
        label: "NAAC A+",
      },
    ],

    startingFee: "₹57,500/Sem",

    emi: "₹9,583/Month",

    placementSupport: "Yes",

    brochureUrl: "#",

    websiteUrl: "#",

    featured: false,
  },

  {
    id: "sastra-online",

    slug: "sastra-online",

    name: "Sastra University",

    logo: "/universities/sastra.png",

    rating: 4.4,

    reviewCount: 512,

    studyMode: "Online MBA",

    duration: "2 Years",

    eligibility: "Bachelor's Degree",

    approvals: [
      {
        id: "ugc",
        label: "UGC",
      },
      {
        id: "naac",
        label: "NAAC A+",
      },
    ],

    startingFee: "₹62,500/Sem",

    emi: "₹10,417/Month",

    placementSupport: "Yes",

    brochureUrl: "#",

    websiteUrl: "#",

    featured: false,
  },

  {
    id: "uttaranchal-online",

    slug: "uttaranchal-online",

    name: "Uttaranchal University",

    logo: "/universities/uttaranchal.png",

    rating: 4.3,

    reviewCount: 387,

    studyMode: "Online MBA",

    duration: "2 Years",

    eligibility: "Bachelor's Degree",

    approvals: [
      {
        id: "ugc",
        label: "UGC",
      },
      {
        id: "naac",
        label: "NAAC A+",
      },
    ],

    startingFee: "₹47,500/Sem",

    emi: "₹7,917/Month",

    placementSupport: "Yes",

    brochureUrl: "#",

    websiteUrl: "#",

    featured: false,
  },

  // =============================================
  // Additional Universities (with logo assets)
  // TODO: Replace placeholder data with actual values
  // =============================================

  {
    id: "acharya-online",

    slug: "acharya-online",

    name: "Acharya University",

    logo: "/universities/acharya_university.png",

    rating: 4.1,

    studyMode: "Online & Distance MBA",

    duration: "2 Years",

    eligibility: "Bachelor's Degree",

    approvals: [
      {
        id: "ugc",
        label: "UGC",
      },
    ],

    startingFee: "Contact for fee",

    placementSupport: "Yes",

    brochureUrl: "#",

    websiteUrl: "#",

    featured: false,
  },

  {
    id: "amrita-online",

    slug: "amrita-online",

    name: "Amrita University",

    logo: "/universities/amrita.png",

    rating: 4.5,

    studyMode: "Online & Distance MBA",

    duration: "2 Years",

    eligibility: "Bachelor's Degree",

    approvals: [
      {
        id: "ugc",
        label: "UGC",
      },
      {
        id: "naac",
        label: "NAAC A++",
      },
    ],

    startingFee: "Contact for fee",

    placementSupport: "Yes",

    brochureUrl: "#",

    websiteUrl: "#",

    featured: false,
  },

  {
    id: "andhra-online",

    slug: "andhra-online",

    name: "Andhra University",

    logo: "/universities/andhra_university.png",

    rating: 4.2,

    studyMode: "Distance MBA",

    duration: "2 Years",

    eligibility: "Bachelor's Degree",

    approvals: [
      {
        id: "ugc",
        label: "UGC",
      },
    ],

    startingFee: "Contact for fee",

    placementSupport: "Yes",

    brochureUrl: "#",

    websiteUrl: "#",

    featured: false,
  },

  {
    id: "bharathiar-online",

    slug: "bharathiar-online",

    name: "Bharathiar University",

    logo: "/universities/bharathiair.png",

    rating: 4.3,

    studyMode: "Distance MBA",

    duration: "2 Years",

    eligibility: "Bachelor's Degree",

    approvals: [
      {
        id: "ugc",
        label: "UGC",
      },
      {
        id: "naac",
        label: "NAAC A+",
      },
    ],

    startingFee: "Contact for fee",

    placementSupport: "Yes",

    brochureUrl: "#",

    websiteUrl: "#",

    featured: false,
  },

  {
    id: "christ-online",

    slug: "christ-online",

    name: "CHRIST University",

    logo: "/universities/christ.png",

    rating: 4.5,

    studyMode: "Online MBA",

    duration: "2 Years",

    eligibility: "Bachelor's Degree",

    approvals: [
      {
        id: "ugc",
        label: "UGC",
      },
      {
        id: "naac",
        label: "NAAC A+",
      },
    ],

    startingFee: "Contact for fee",

    placementSupport: "Yes",

    brochureUrl: "#",

    websiteUrl: "#",

    featured: false,
  },

  {
    id: "gitam-online",

    slug: "gitam-online",

    name: "GITAM University",

    logo: "/universities/gitam.png",

    rating: 4.3,

    studyMode: "Online MBA",

    duration: "2 Years",

    eligibility: "Bachelor's Degree",

    approvals: [
      {
        id: "ugc",
        label: "UGC",
      },
      {
        id: "naac",
        label: "NAAC A+",
      },
    ],

    startingFee: "Contact for fee",

    placementSupport: "Yes",

    brochureUrl: "#",

    websiteUrl: "#",

    featured: false,
  },

  {
    id: "gla-online",

    slug: "gla-online",

    name: "GLA University",

    logo: "/universities/gla.png",

    rating: 4.2,

    studyMode: "Online MBA",

    duration: "2 Years",

    eligibility: "Bachelor's Degree",

    approvals: [
      {
        id: "ugc",
        label: "UGC",
      },
      {
        id: "naac",
        label: "NAAC A",
      },
    ],

    startingFee: "Contact for fee",

    placementSupport: "Yes",

    brochureUrl: "#",

    websiteUrl: "#",

    featured: false,
  },

  {
    id: "icfai-online",

    slug: "icfai-online",

    name: "ICFAI University",

    logo: "/universities/icfai.png",

    rating: 4.3,

    studyMode: "Online & Distance MBA",

    duration: "2 Years",

    eligibility: "Bachelor's Degree",

    approvals: [
      {
        id: "ugc",
        label: "UGC",
      },
      {
        id: "naac",
        label: "NAAC A+",
      },
    ],

    startingFee: "Contact for fee",

    placementSupport: "Yes",

    brochureUrl: "#",

    websiteUrl: "#",

    featured: false,
  },

  {
    id: "ignou-distance",

    slug: "ignou-distance",

    name: "IGNOU",

    logo: "/universities/ignou.png",

    rating: 4.4,

    studyMode: "Distance MBA",

    duration: "2 Years",

    eligibility: "Bachelor's Degree",

    approvals: [
      {
        id: "ugc",
        label: "UGC",
      },
      {
        id: "aicte",
        label: "AICTE",
      },
    ],

    startingFee: "Contact for fee",

    placementSupport: "Yes",

    brochureUrl: "#",

    websiteUrl: "#",

    featured: false,
  },

  {
    id: "kl-university-online",

    slug: "kl-university-online",

    name: "KL University",

    logo: "/universities/kl_university.png",

    rating: 4.4,

    studyMode: "Online MBA",

    duration: "2 Years",

    eligibility: "Bachelor's Degree",

    approvals: [
      {
        id: "ugc",
        label: "UGC",
      },
      {
        id: "naac",
        label: "NAAC A++",
      },
    ],

    startingFee: "Contact for fee",

    placementSupport: "Yes",

    brochureUrl: "#",

    websiteUrl: "#",

    featured: false,
  },

  {
    id: "mit-online",

    slug: "mit-online",

    name: "MIT University",

    logo: "/universities/mit.png",

    rating: 4.3,

    studyMode: "Online MBA",

    duration: "2 Years",

    eligibility: "Bachelor's Degree",

    approvals: [
      {
        id: "ugc",
        label: "UGC",
      },
      {
        id: "naac",
        label: "NAAC A+",
      },
    ],

    startingFee: "Contact for fee",

    placementSupport: "Yes",

    brochureUrl: "#",

    websiteUrl: "#",

    featured: false,
  },

  {
    id: "parul-online",

    slug: "parul-online",

    name: "Parul University",

    logo: "/universities/parul_university.png",

    rating: 4.2,

    studyMode: "Online MBA",

    duration: "2 Years",

    eligibility: "Bachelor's Degree",

    approvals: [
      {
        id: "ugc",
        label: "UGC",
      },
      {
        id: "naac",
        label: "NAAC A+",
      },
    ],

    startingFee: "Contact for fee",

    placementSupport: "Yes",

    brochureUrl: "#",

    websiteUrl: "#",

    featured: false,
  },

  {
    id: "vit-online",

    slug: "vit-online",

    name: "VIT University",

    logo: "/universities/vit.png",

    rating: 4.5,

    studyMode: "Online MBA",

    duration: "2 Years",

    eligibility: "Bachelor's Degree",

    approvals: [
      {
        id: "ugc",
        label: "UGC",
      },
      {
        id: "naac",
        label: "NAAC A+",
      },
    ],

    rankings: [
      {
        source: "NIRF",
        value: "#25",
      },
    ],

    startingFee: "Contact for fee",

    placementSupport: "Yes",

    brochureUrl: "#",

    websiteUrl: "#",

    featured: false,
  },

  {
    id: "srm-online",

    slug: "srm-online",

    name: "SRM University",

    logo: "/universities/srm.png",

    rating: 4.3,

    studyMode: "Online MBA",

    duration: "2 Years",

    eligibility: "Bachelor's Degree",

    approvals: [
      {
        id: "ugc",
        label: "UGC",
      },
      {
        id: "naac",
        label: "NAAC A++",
      },
    ],

    startingFee: "Contact for fee",

    placementSupport: "Yes",

    brochureUrl: "#",

    websiteUrl: "#",

    featured: false,
  },

  {
    id: "hindustan-online",

    slug: "hindustan-online",

    name: "Hindustan University",

    logo: "/universities/hindustan..png",

    rating: 4.1,

    studyMode: "Online MBA",

    duration: "2 Years",

    eligibility: "Bachelor's Degree",

    approvals: [
      {
        id: "ugc",
        label: "UGC",
      },
    ],

    startingFee: "Contact for fee",

    placementSupport: "Yes",

    brochureUrl: "#",

    websiteUrl: "#",

    featured: false,
  },

  {
    id: "sathyabama-online",

    slug: "sathyabama-online",

    name: "Sathyabama University",

    logo: "/universities/satyabama.png",

    rating: 4.2,

    studyMode: "Online MBA",

    duration: "2 Years",

    eligibility: "Bachelor's Degree",

    approvals: [
      {
        id: "ugc",
        label: "UGC",
      },
      {
        id: "naac",
        label: "NAAC A+",
      },
    ],

    startingFee: "Contact for fee",

    placementSupport: "Yes",

    brochureUrl: "#",

    websiteUrl: "#",

    featured: false,
  },

  {
    id: "shivnadar-online",

    slug: "shivnadar-online",

    name: "Shiv Nadar University",

    logo: "/universities/shivnandar.png",

    rating: 4.3,

    studyMode: "Online MBA",

    duration: "2 Years",

    eligibility: "Bachelor's Degree",

    approvals: [
      {
        id: "ugc",
        label: "UGC",
      },
      {
        id: "naac",
        label: "NAAC A",
      },
    ],

    startingFee: "Contact for fee",

    placementSupport: "Yes",

    brochureUrl: "#",

    websiteUrl: "#",

    featured: false,
  },
];
