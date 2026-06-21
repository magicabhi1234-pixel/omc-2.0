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