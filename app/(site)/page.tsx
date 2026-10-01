import dynamic from "next/dynamic";

import Hero from "@/components/home/hero";
import TrustedUniversities from "@/components/home/trusted-universities";
import Specializations from "@/components/home/specializations";
import WhyOMC from "@/components/home/why-omc";
import Comparison from "@/components/home/comparison";
import Blogs from "@/components/home/blogs";
import FAQ, { DEFAULT_HOME_FAQS } from "@/components/home/faq";
import CTA from "@/components/home/cta";
import Testimonials from "@/components/home/testimonials";
import { buildMetadata } from "@/lib/metadata";
import { getFaqs, getFinderUniversities } from "@/lib/db/queries";
import { JsonLd, faqSchema, webPageSchema } from "@/lib/structured-data";

// Code-split: this is the only "use client" boundary above the fold on the
// homepage. SSR stays on (default) so the form/selects are in the initial
// HTML - only the interactive-handler JS is split into its own chunk
// instead of the shared main bundle.
const AIMatchFinder = dynamic(() => import("@/components/home/ai-match-finder"));

const DESCRIPTION =
  "Compare the best online MBA colleges in India by fees, UGC/NAAC approvals, placements and specializations. Get free, unbiased MBA admission counselling.";

export const generateMetadata = () =>
  buildMetadata({
    title: `Online MBA Colleges in India ${new Date().getFullYear()} | Compare Fees & Universities`,
    absoluteTitle: true,
    description: DESCRIPTION,
    path: "/",
  });

export default async function HomePage() {
  const [faqs, finderUniversities] = await Promise.all([getFaqs("home", DEFAULT_HOME_FAQS), getFinderUniversities()]);

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ path: "/", name: "Online MBA Colleges in India - compare fees and universities", description: DESCRIPTION }),
          faqSchema(faqs, "/"),
        ].filter((node): node is Record<string, unknown> => node !== null)}
      />
      <Hero />
      <AIMatchFinder universities={finderUniversities} />
      <TrustedUniversities />
      <Specializations />
      <WhyOMC />
      <Comparison />
      <Blogs />
      <FAQ faqs={faqs} />
      <CTA />
      <Testimonials />
    </>
  );
}
