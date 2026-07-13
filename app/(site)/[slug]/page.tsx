import { notFound } from "next/navigation";
import { groq } from "next-sanity";

import { sanity } from "../../../lib/sanity";

import Hero from "@/components/landing/mba/Hero";
import UniversityCards from "@/components/landing/mba/UniversityCards";
import ContentSection from "@/components/landing/mba/ContentSection";
import CTASection from "@/components/landing/mba/CTASection";

const query = groq`
*[_type=="landingPage" && slug.current==$slug][0]{

  title,

  hero{
    badge,
    heading,
    description,

    image{
      asset->{
        url
      }
    },

    primaryButtonText,
    secondaryButtonText,

    stat1Value,
    stat1Label,

    stat2Value,
    stat2Label,

    stat3Value,
    stat3Label
  },

  universitySection{
    badge,
    heading,
    description
  },

  universities[]->{
    _id,
    name,
    slug,

    studyMode,
    duration,
    approvals,
    startingFee,
    eligibility,

    logo{
      asset->{
        url
      }
    }
  },

  contentHeading,
  contentDescription,

  cta{
    badge,
    heading,
    description,

    primaryButtonText,
    secondaryButtonText
  }
}
`;

export default async function LandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const page = await sanity.fetch(query, { slug });

  if (!page) {
    notFound();
  }

  return (
    <>
      <Hero
        badge={page.hero?.badge}
        heading={page.hero?.heading}
        description={page.hero?.description}
        image={page.hero?.image?.asset?.url}
        primaryButtonText={page.hero?.primaryButtonText}
        secondaryButtonText={page.hero?.secondaryButtonText}
        stat1Value={page.hero?.stat1Value}
        stat1Label={page.hero?.stat1Label}
        stat2Value={page.hero?.stat2Value}
        stat2Label={page.hero?.stat2Label}
        stat3Value={page.hero?.stat3Value}
        stat3Label={page.hero?.stat3Label}
      />

      <UniversityCards
        section={page.universitySection}
        universities={page.universities || []}
      />

      <ContentSection
        heading={page.contentHeading}
        description={page.contentDescription}
      />

      <CTASection
        badge={page.cta?.badge}
        heading={page.cta?.heading}
        description={page.cta?.description}
        primaryButtonText={page.cta?.primaryButtonText}
        secondaryButtonText={page.cta?.secondaryButtonText}
      />
    </>
  );
}