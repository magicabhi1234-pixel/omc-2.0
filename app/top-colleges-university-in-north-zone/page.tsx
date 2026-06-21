import Hero from "@/components/landing/hero";
import Stats from "@/components/landing/stats";
import UniversityGrid from "@/components/landing/university-grid";
import CompareUniversities from "@/components/landing/compare-universities";
import Specializations from "@/components/landing/specializations";
import ScholarshipBanner from "@/components/landing/scholarship-banner";
import WhyChoose from "@/components/landing/why-choose";
import FAQ from "@/components/landing/faq";
import CTA from "@/components/landing/cta";

export default function Page() {
  return (
    <>
      <Hero />
      <Stats />
      <UniversityGrid />
      <CompareUniversities />
      <Specializations />
      <ScholarshipBanner />
      <WhyChoose />
      <FAQ />
      <CTA />
    </>
  );
}