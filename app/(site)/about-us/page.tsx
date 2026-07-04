export const metadata = {
  title: "About Us",
};

import AboutHero from "@/components/about-us/hero";
import AboutStory from "@/components/about-us/about-story";
import AboutMission from "@/components/about-us/about-mission";
import AboutStats from "@/components/about-us/about-stats";
import AboutCTA from "@/components/about-us/about-cta";

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