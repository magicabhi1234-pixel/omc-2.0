import { type SchemaTypeDefinition } from "sanity";

// Documents
import { university } from "./documents/university";
import { landingPage } from "./documents/landingPage";
import { blogPost } from "./documents/blogPost";
import { testimonial } from "./documents/testimonial";

// Objects
import { seo } from "./objects/seo";
import { faq } from "./objects/faq";
import { faqSection } from "./objects/faqSection";
import { ranking } from "./objects/ranking";
import { tableRow, tableBlock } from "./objects/tableBlock";

import { hero } from "./objects/hero";
import { cta } from "./objects/cta";
import { universitySection } from "./objects/universitySection";
import { whyChooseItem, whyChooseSection } from "./objects/whyChooseSection";
import { statCard, statsSection } from "./objects/statsSection";
import { specializationItem, specializationSection } from "./objects/specializationSection";
import { highlightBanner } from "./objects/highlightBanner";
import { compareFeature, compareSection } from "./objects/compareSection";
import { benefitItem, benefitsSection } from "./objects/benefitsSection";
import { careerRole, careerScopeSection } from "./objects/careerScopeSection";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  university,
  landingPage,
  blogPost,
  testimonial,

  // Objects
  hero,
  cta,
  universitySection,
  whyChooseItem,
  whyChooseSection,
  statCard,
  statsSection,
  specializationItem,
  specializationSection,
  highlightBanner,
  compareFeature,
  compareSection,
  benefitItem,
  benefitsSection,
  careerRole,
  careerScopeSection,

  seo,
  faq,
  faqSection,
  ranking,
  tableRow,
  tableBlock,
];
