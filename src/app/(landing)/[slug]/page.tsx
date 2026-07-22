import { notFound } from "next/navigation";
import Hero from "@/components/landing/mba/hero/hero";

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

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function LandingPage({
  params,
}: PageProps) {
  const { slug } = await params;

  console.log("Slug:", slug);
  console.log("Available Pages:", Object.keys(landingPages));

  const page = landingPages[slug];

  if (!page) {
    console.error(`Landing page not found for slug: ${slug}`);
    notFound();
  }

  return (
    <main>
      <Hero {...page.hero} />
    </main>
  );
}