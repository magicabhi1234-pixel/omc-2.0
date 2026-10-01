import AboutHero from "@/components/about-us/hero";
import AboutStory from "@/components/about-us/about-story";
import AboutMission from "@/components/about-us/about-mission";
import AboutStats from "@/components/about-us/about-stats";
import AboutCTA from "@/components/about-us/about-cta";
import { buildMetadata } from "@/lib/metadata";
import FAQ from "@/components/landing/faq";
import Breadcrumbs from "@/components/common/breadcrumbs";
import { getFaqs } from "@/lib/db/queries";
import { JsonLd, ORGANIZATION_ID, breadcrumbSchema, faqSchema, webPageSchema, type Crumb } from "@/lib/structured-data";

const CRUMBS: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about-us" },
];

export const generateMetadata = () =>
  buildMetadata({
  title: "About Us",
  description:
    "Learn about Online MBA Colleges - our mission to help students compare accredited online MBA programs, fees, specializations and admissions guidance in India.",
  path: "/about-us",
});

export default async function AboutUsPage() {
  const faqs = await getFaqs("about");
  return (
    <>
      <JsonLd
        data={[
          { ...webPageSchema({ path: "/about-us", name: "About Online MBA Colleges", type: "AboutPage", hasBreadcrumb: true }), mainEntity: { "@id": ORGANIZATION_ID } },
          breadcrumbSchema(CRUMBS, "/about-us"),
          faqSchema(faqs, "/about-us"),
        ].filter((node): node is Record<string, unknown> => node !== null)}
      />
      <Breadcrumbs crumbs={CRUMBS} />
      <AboutHero />
      <AboutStory />
      <AboutMission />
      <AboutStats />
      <FAQ faqs={faqs} heading="About Online MBA Colleges: FAQs" id="about-faq" />
      <AboutCTA />
    </>
  );
}