import ContactHero from "@/components/contact/hero";
import ContactInfo from "@/components/contact/contact-info";
import ContactForm from "@/components/contact/contact-form";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Contact Us",
  description:
    "Get in touch with Online MBA Colleges for free admission guidance, university comparison and MBA counselling.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactInfo />
      <ContactForm />
    </>
  );
}