import { type SchemaTypeDefinition } from "sanity";

// Documents
import { university } from "./documents/university";
import { landingPage } from "./documents/landingPage";
import { blogPost } from "./documents/blogPost";

// Objects
import { seo } from "./objects/seo";
import { faq } from "./objects/faq";
import { approval } from "./objects/approval";
import { ranking } from "./objects/ranking";
import { fee } from "./objects/fee";
import { placement } from "./objects/placement";
import { course } from "./objects/course";

import { hero } from "./objects/hero";
import { cta } from "./objects/cta";
import { universitySection } from "./objects/universitySection";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  university,
  landingPage,
  blogPost,

  // Objects
  hero,
  cta,
  universitySection,

  seo,
  faq,
  approval,
  ranking,
  fee,
  placement,
  course,
];