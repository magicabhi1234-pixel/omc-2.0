import type { Metadata } from "next";
import dynamic from "next/dynamic";

import Hero from "@/components/home/hero";
import TrustedUniversities from "@/components/home/trusted-universities";
import Specializations from "@/components/home/specializations";
import WhyOMC from "@/components/home/why-omc";
import Comparison from "@/components/home/comparison";
import Blogs from "@/components/home/blogs";
import FAQ from "@/components/home/faq";
import CTA from "@/components/home/cta";
import Testimonials from "@/components/home/testimonials";
import { buildMetadata } from "@/lib/metadata";

// Code-split: this is the only "use client" boundary above the fold on the
// homepage. SSR stays on (default) so the form/selects are in the initial
// HTML - only the interactive-handler JS is split into its own chunk
// instead of the shared main bundle.
const AIMatchFinder = dynamic(() => import("@/components/home/ai-match-finder"));

export const metadata: Metadata = buildMetadata({
  title: "Online MBA Colleges in India 2026 | Compare Top Universities & Fees",
  description:
    "Find and compare the best Online MBA colleges in India. Check university fees, NAAC grades, placements, specializations, scholarships and admission process. Get free MBA counselling.",
  path: "/",
});

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