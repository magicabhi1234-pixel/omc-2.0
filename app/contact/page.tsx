export const metadata = {
  title: "Contact Us",
};

import ContactHero from "@/components/contact/hero";
import ContactInfo from "@/components/contact/contact-info";
import ContactForm from "@/components/contact/contact-form";

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactInfo />
      <ContactForm />
    </>
  );
}