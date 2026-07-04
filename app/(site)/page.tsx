import type { Metadata } from "next";

import Hero from "@/components/home/hero";
import TrustedUniversities from "@/components/home/trusted-universities";
import Specializations from "@/components/home/specializations";
import WhyOMC from "@/components/home/why-omc";
import Comparison from "@/components/home/comparison";
import Blogs from "@/components/home/blogs";
import FAQ from "@/components/home/faq";
import CTA from "@/components/home/cta";
import Testimonials from "@/components/home/testimonials";
import AIMatchFinder from "@/components/home/ai-match-finder";

export const metadata: Metadata = {
  title:
    "Online MBA Colleges in India 2026 | Compare Top Universities & Fees",
  description:
    "Find and compare the best Online MBA colleges in India. Check university fees, NAAC grades, placements, specializations, scholarships and admission process. Get free MBA counselling.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <AIMatchFinder />
      <TrustedUniversities />
      <Specializations />
      <WhyOMC />
      <Comparison />
      <Blogs />
      <FAQ />
      <CTA />
      <Testimonials />
    </>
  );
}