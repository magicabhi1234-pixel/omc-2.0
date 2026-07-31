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

import { getAllLandingSlugs, getLandingPageBySlug } from "@/data/registry";
import { SITE } from "@/constants/site";
import type { LandingPageData } from "@/types/landing";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const slugs = await getAllLandingSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLandingPageBySlug(slug);

  if (!page) return {};

  const canonical = page.seo.canonical ?? `${SITE.url}/${slug}`;

  return {
    title: page.seo.title,
    description: page.seo.description,
    keywords: page.seo.keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: page.seo.title,
      description: page.seo.description,
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: page.seo.title,
      description: page.seo.description,
    },
  };
}

function LandingPageJsonLd({ page, canonical }: { page: LandingPageData; canonical: string }) {
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebPage",
      "@id": canonical,
      url: canonical,
      name: page.seo.title,
      description: page.seo.description,
      isPartOf: {
        "@type": "WebSite",
        "@id": `${SITE.url}/`,
        name: SITE.name,
      },
    },
  ];

  if (page.faq && page.faq.faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: page.faq.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function LandingPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getLandingPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const canonical = page.seo.canonical ?? `${SITE.url}/${slug}`;

  return (
    <main>
      <LandingPageJsonLd page={page} canonical={canonical} />

      <Hero {...page.hero} universities={page.universitySection?.universities} />

      {page.stats && <Stats stats={page.stats.stats} />}

      {page.whyChoose && (
        <WhyChoose
          heading={page.whyChoose.heading}
          description={page.whyChoose.description}
          items={page.whyChoose.items}
        />
      )}

      {page.universitySection && <UniversityGrid {...page.universitySection} />}

      {page.compareSection && (
        <CompareUniversities
          {...page.compareSection}
          universities={page.universitySection?.universities}
        />
      )}

      {page.specializations && <Specializations {...page.specializations} />}

      {page.scholarshipBanner && <ScholarshipBanner {...page.scholarshipBanner} />}

      {page.testimonials && <Testimonials {...page.testimonials} />}

      {page.faq && <FAQ {...page.faq} />}

      <CTA {...page.cta} />
    </main>
  );
}

