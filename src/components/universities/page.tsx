import UniversitiesHero from "@/components/universities/hero";
import UniversityGrid from "@/components/universities/university-grid";
import WhyChoose from "@/components/universities/why-choose";
import CTA from "@/components/home/cta";

export default function UniversitiesPage() {
  return (
    <>
      <UniversitiesHero />
      <UniversityGrid />
      <WhyChoose />
      <CTA />
    </>
  );
}