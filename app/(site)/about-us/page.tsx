import AboutHero from "@/components/about-us/hero";
import AboutStory from "@/components/about-us/about-story";
import AboutMission from "@/components/about-us/about-mission";
import AboutStats from "@/components/about-us/about-stats";
import AboutCTA from "@/components/about-us/about-cta";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "About Us",
  description:
    "Learn about Online MBA Colleges - our mission to help students compare accredited online MBA programs, fees, specializations and admissions guidance in India.",
  path: "/about-us",
});

export default function AboutUsPage() {
  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutMission />
      <AboutStats />
      <AboutCTA />
    </>
  );
}