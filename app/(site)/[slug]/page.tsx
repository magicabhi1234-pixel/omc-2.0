import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Hero from "@/components/landing/hero";
import Stats from "@/components/landing/stats";
import WhyChoose from "@/components/landing/why-choose";
import UniversityGrid from "@/components/landing/university-grid";
import CompareUniversities from "@/components/landing/compare-universities";
import Specializations from "@/components/landing/specializations";
import ScholarshipBanner from "@/components/landing/scholarship-banner";
import Testimonials from "@/components/landing/testimonials";
import FAQ from "@/components/landing/faq";
import CTA from "@/components/landing/cta";

import {
  top10OnlineMBANorthZone,
  top10OnlineMBAWestZone,
  top10OnlineMBASouthZone,
  top10OnlineMBAEastZone,
  top10DistanceMBANorthZone,
  top10DistanceMBAWestZone,
  top10DistanceMBASouthZone,
  top10DistanceMBAEastZone,
  topDistanceMBAInBusinessManagement,
  bestDistanceMBAInMarketing,
  topDistanceMBAInBankingAndFinance,
  topDistanceMBAInOperationsManagement,
  topDistanceMBAInITAndProjectManagement,
  topDistanceMBAInExecutiveMBAIIM,
  topDistanceMBAInHRManagement,
  topDistanceMBAInHealthcareManagement,
  topDistanceMBAInFinanceManagement,
  topDistanceMBAInExecutiveManagement,
  topDistanceMBAInDigitalMarketing,
  topDistanceMBAInSupplyChainManagement,
  symbiosisSCDL,
  symbiosisSSODL,
  iimOnlineDistanceLearnings,
  topOnlineDistanceMCABCABBANorth,
  topOnlineDistanceMCABCABBASouth,
  topOnlineDistanceMCABCABBAEast,
  topOnlineDistanceMCABCABBAWest,
} from "@/data/landing-pages";

import { LandingPageData } from "@/types/landing";

const landingPages: Record<string, LandingPageData> = {
  "top-10-online-mba-universities-colleges-north-zone": top10OnlineMBANorthZone,
  "top-10-online-mba-universities-colleges-west-zone": top10OnlineMBAWestZone,
  "top-10-online-mba-universities-colleges-south-zone": top10OnlineMBASouthZone,
  "top-10-online-mba-universities-colleges-east-zone": top10OnlineMBAEastZone,

  "top-online-mba-colleges-university-in-west-zone": top10OnlineMBAWestZone,

  "top-10-distance-mba-universities-colleges-north-zone": top10DistanceMBANorthZone,
  "top-10-distance-mba-universities-colleges-west-zone": top10DistanceMBAWestZone,
  "top-10-distance-mba-universities-colleges-south-zone": top10DistanceMBASouthZone,
  "top-10-distance-mba-universities-colleges-east-zone": top10DistanceMBAEastZone,

  "top-distance-mba-in-business-management": topDistanceMBAInBusinessManagement,
  "best-universities-for-distance-education-mba-marketing-in-india": bestDistanceMBAInMarketing,
  "top-distance-mba-in-banking-and-finance-management": topDistanceMBAInBankingAndFinance,
  "top-distance-mba-in-operations-management": topDistanceMBAInOperationsManagement,
  "top-distance-mba-in-information-technology-and-project-management": topDistanceMBAInITAndProjectManagement,
  "top-distance-mba-in-top-executive-mba-iim-programs": topDistanceMBAInExecutiveMBAIIM,
  "top-distance-mba-in-human-resource-management": topDistanceMBAInHRManagement,
  "top-distance-mba-in-healthcare-management": topDistanceMBAInHealthcareManagement,
  "top-distance-mba-in-finance-management": topDistanceMBAInFinanceManagement,
  "top-distance-mba-in-executive-management": topDistanceMBAInExecutiveManagement,
  "top-distance-mba-in-digital-marketing": topDistanceMBAInDigitalMarketing,
  "top-distance-mba-in-supply-chain-management": topDistanceMBAInSupplyChainManagement,

  "symbiosis-center-for-distance-learning": symbiosisSCDL,
  "symbiosis-center-for-online-learning": symbiosisSSODL,
  "iim-online-distance-learnings": iimOnlineDistanceLearnings,

  "top-online-distance-mca-bca-bba-colleges-university-bachelor-north": topOnlineDistanceMCABCABBANorth,
  "top-online-distance-mca-bca-bba-colleges-university-bachelor-south": topOnlineDistanceMCABCABBASouth,
  "top-online-distance-mca-bca-bba-colleges-university-bachelor-east": topOnlineDistanceMCABCABBAEast,
  "top-online-distance-mca-bca-bba-colleges-university-bachelor-west": topOnlineDistanceMCABCABBAWest,
};

const allSlugs = Object.keys(landingPages);

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return allSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = landingPages[slug];

  if (!page) return {};

  return {
    title: page.seo.title,
    description: page.seo.description,
    keywords: page.seo.keywords,
    openGraph: {
      title: page.seo.title,
      description: page.seo.description,
      type: "website",
    },
  };
}

export default async function LandingPage({ params }: PageProps) {
  const { slug } = await params;
  const page = landingPages[slug];

  if (!page) {
    notFound();
  }

  return (
    <main>
      <Hero {...page.hero} />

      {page.stats && <Stats stats={page.stats.stats} />}

      {page.whyChoose && (
        <WhyChoose
          heading={page.whyChoose.heading}
          description={page.whyChoose.description}
          items={page.whyChoose.items}
        />
      )}

      {page.universitySection && <UniversityGrid {...page.universitySection} />}

      {page.compareSection && <CompareUniversities {...page.compareSection} />}

      {page.specializations && <Specializations {...page.specializations} />}

      {page.scholarshipBanner && <ScholarshipBanner {...page.scholarshipBanner} />}

      {page.testimonials && <Testimonials {...page.testimonials} />}

      {page.faq && <FAQ {...page.faq} />}

      <CTA {...page.cta} />
    </main>
  );
}

