import AboutHero from "@/components/about-us/hero";
import AboutStory from "@/components/about-us/about-story";
import AboutMission from "@/components/about-us/about-mission";
import AboutStats from "@/components/about-us/about-stats";
import AboutCTA from "@/components/about-us/about-cta";
import { buildMetadata } from "@/lib/metadata";

// Exact-slug migration of the source site's /about/ page (source's own /about-us
// path 404s - its real about page lives at /about/). Renders the same content
// as /about-us; canonical points there to avoid a duplicate-content signal
// while keeping this URL itself fully live (no redirect, per migration rules).
export const metadata = buildMetadata({
  title: "About Us",
  description:
    "Learn about Online MBA Colleges - our mission to help students compare accredited online MBA programs, fees, specializations and admissions guidance in India.",
  path: "/about-us",
});

export default function AboutPage() {
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
