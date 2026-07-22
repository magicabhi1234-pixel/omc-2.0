import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Hero from "@/components/landing/mba/hero/hero";
import StatsSection from "@/components/landing/mba/stats/stats";
import UniversityGrid from "@/components/landing/mba/university-grid/university-grid";
import WhyChooseSection from "@/components/landing/mba/why-choose/why-choose";
import CompareCollege from "@/components/landing/mba/compare-college/compare-college";
import Specializations from "@/components/landing/mba/specializations/specializations";
import ScholarshipBanner from "@/components/landing/mba/scholarship-banner/scholarship-banner";
import Testimonials from "@/components/landing/mba/testimonials/testimonials";
import FAQ from "@/components/landing/mba/faq/faq";
import CTASection from "@/components/landing/mba/cta/cta";

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
  "top-10-online-mba-universities-colleges-north-zone":
    top10OnlineMBANorthZone,
  "top-10-online-mba-universities-colleges-west-zone":
    top10OnlineMBAWestZone,
  "top-10-online-mba-universities-colleges-south-zone":
    top10OnlineMBASouthZone,
  "top-10-online-mba-universities-colleges-east-zone":
    top10OnlineMBAEastZone,
  "top-10-distance-mba-universities-colleges-north-zone":
    top10DistanceMBANorthZone,
  "top-10-distance-mba-universities-colleges-west-zone":
    top10DistanceMBAWestZone,
  "top-10-distance-mba-universities-colleges-south-zone":
    top10DistanceMBASouthZone,
  "top-10-distance-mba-universities-colleges-east-zone":
    top10DistanceMBAEastZone,
  "top-distance-mba-in-business-management":
    topDistanceMBAInBusinessManagement,
  "best-universities-for-distance-education-mba-marketing-in-india":
    bestDistanceMBAInMarketing,
  "top-distance-mba-in-banking-and-finance-management":
    topDistanceMBAInBankingAndFinance,
  "top-distance-mba-in-operations-management":
    topDistanceMBAInOperationsManagement,
  "top-distance-mba-in-information-technology-and-project-management":
    topDistanceMBAInITAndProjectManagement,
  "top-distance-mba-in-top-executive-mba-iim-programs":
    topDistanceMBAInExecutiveMBAIIM,
  "top-distance-mba-in-human-resource-management":
    topDistanceMBAInHRManagement,
  "top-distance-mba-in-healthcare-management":
    topDistanceMBAInHealthcareManagement,
  "top-distance-mba-in-finance-management":
    topDistanceMBAInFinanceManagement,
  "top-distance-mba-in-executive-management":
    topDistanceMBAInExecutiveManagement,
  "top-distance-mba-in-digital-marketing":
    topDistanceMBAInDigitalMarketing,
  "top-distance-mba-in-supply-chain-management":
    topDistanceMBAInSupplyChainManagement,
  "symbiosis-center-for-distance-learning":
    symbiosisSCDL,
  "symbiosis-center-for-online-learning":
    symbiosisSSODL,
  "iim-online-distance-learnings":
    iimOnlineDistanceLearnings,
  "top-online-distance-mca-bca-bba-colleges-university-bachelor-north":
    topOnlineDistanceMCABCABBANorth,
  "top-online-distance-mca-bca-bba-colleges-university-bachelor-south":
    topOnlineDistanceMCABCABBASouth,
  "top-online-distance-mca-bca-bba-colleges-university-bachelor-east":
    topOnlineDistanceMCABCABBAEast,
  "top-online-distance-mca-bca-bba-colleges-university-bachelor-west":
    topOnlineDistanceMCABCABBAWest,
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

  if (!page) {
    return {};
  }

  return {
    title: page.seo.title,
    description: page.seo.description,
    keywords: page.seo.keywords,
  };
}

export default async function LandingPage({
  params,
}: PageProps) {
  const { slug } = await params;

  console.log("Slug:", slug);
  console.log("Available Pages:", allSlugs);

  const page = landingPages[slug];

  if (!page) {
    console.error(`Landing page not found for slug: ${slug}`);
    notFound();
  }

  return (
    <main>
      {/* Keep existing Hero Section - page-specific */}
      <Hero {...page.hero} />

      {/* Stats Section */}
      {page.stats && <StatsSection {...page.stats} />}

      {/* University Grid Section */}
      {page.universitySection && (
        <UniversityGrid
          {...page.universitySection}
          category={page.category}
        />
      )}

      {/* Why Choose Section */}
      {page.whyChoose && <WhyChooseSection {...page.whyChoose} />}

      {/* Compare Section */}
      {page.compareSection && (
        <CompareCollege
          {...page.compareSection}
          universityIds={page.universitySection?.universities || []}
        />
      )}

      {/* Specializations Section */}
      {page.specializations && <Specializations {...page.specializations} />}

      {/* Scholarship Banner */}
      {page.scholarshipBanner && (
        <ScholarshipBanner {...page.scholarshipBanner} />
      )}

      {/* Testimonials Section */}
      {page.testimonials && <Testimonials {...page.testimonials} />}

      {/* FAQ Section */}
      {page.faq && <FAQ {...page.faq} />}

      {/* CTA Section */}
      <CTASection {...page.cta} />
    </main>
  );
}

