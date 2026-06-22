import type { Metadata } from "next";

import Hero from "@/components/landing/hero";
import Stats from "@/components/landing/stats";
import UniversityGrid from "@/components/landing/university-grid";
import WhyChoose from "@/components/landing/why-choose";
import CompareUniversities from "@/components/landing/compare-universities";
import Specializations from "@/components/landing/specializations";
import ScholarshipBanner from "@/components/landing/scholarship-banner";
import FAQ from "@/components/landing/faq";
import CTA from "@/components/landing/cta";

export const metadata: Metadata = {
  title:
    "Top Distance MBA Colleges & Universities in North India 2026",
  description:
    "Compare top Distance MBA colleges and universities in North India. Check fees, NAAC grades, UGC approval, placements, scholarships and admission process for 2026.",
};

export default function Page() {
  return (
    <>
      <Hero />
      <Stats />
      <UniversityGrid />
      <WhyChoose />
      <CompareUniversities />
      <Specializations />
      <ScholarshipBanner />
      <FAQ />
      <CTA />
    </>
  );
}