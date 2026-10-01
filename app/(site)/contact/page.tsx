import ContactHero from "@/components/contact/hero";
import ContactInfo from "@/components/contact/contact-info";
import ContactForm from "@/components/contact/contact-form";
import FAQ from "@/components/landing/faq";
import Breadcrumbs from "@/components/common/breadcrumbs";
import { buildMetadata } from "@/lib/metadata";
import { getFaqs, getSettings } from "@/lib/db/queries";
import { JsonLd, ORGANIZATION_ID, breadcrumbSchema, faqSchema, webPageSchema, type Crumb } from "@/lib/structured-data";

const DESCRIPTION =
  "Get in touch with Online MBA Colleges for free admission guidance, university comparison and MBA counselling.";
const CRUMBS: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
];

export const generateMetadata = () =>
  buildMetadata({
    title: "Contact Us",
    description: DESCRIPTION,
    path: "/contact",
  });

export default async function ContactPage() {
  const [info, faqs] = await Promise.all([getSettings("site_info"), getFaqs("contact")]);

  return (
    <>
      <JsonLd
        data={[
          { ...webPageSchema({ path: "/contact", name: "Contact Online MBA Colleges", description: DESCRIPTION, type: "ContactPage", hasBreadcrumb: true }), mainEntity: { "@id": ORGANIZATION_ID } },
          breadcrumbSchema(CRUMBS, "/contact"),
          faqSchema(faqs, "/contact"),
        ].filter((node): node is Record<string, unknown> => node !== null)}
      />
      <Breadcrumbs crumbs={CRUMBS} />
      <ContactHero />
      <ContactInfo info={info} />
      <ContactForm />
      <FAQ faqs={faqs} heading="Questions about counselling" />
    </>
  );
}
