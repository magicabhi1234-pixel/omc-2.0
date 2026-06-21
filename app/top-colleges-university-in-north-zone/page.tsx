import Hero from "@/components/landing/hero";
import UniversityGrid from "@/components/landing/university-grid";
import WhyChoose from "@/components/landing/why-choose";
import FAQ from "@/components/landing/faq";
import CTA from "@/components/landing/cta";

export default function Page() {
  return (
    <>
      <Hero />
      <UniversityGrid />
      <WhyChoose />
      <FAQ />
      <CTA />
    </>
  );
}