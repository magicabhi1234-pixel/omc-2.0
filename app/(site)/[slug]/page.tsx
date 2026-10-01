import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Hero from "@/components/landing/hero";
import Stats from "@/components/landing/stats";
import WhyChoose from "@/components/landing/why-choose";
import UniversityGrid from "@/components/landing/university-grid";
import CompareUniversities from "@/components/landing/compare-universities";
import Specializations from "@/components/landing/specializations";
import Benefits from "@/components/landing/benefits";
import CareerScope from "@/components/landing/career-scope";
import HighlightBanner from "@/components/landing/highlight-banner";
import Testimonials from "@/components/landing/testimonials";
import FAQ from "@/components/landing/faq";
import CTA from "@/components/landing/cta";

import { getAllLandingSlugs, getLandingPageBySlug } from "@/data/registry";
import type { LandingPageData } from "@/types/landing";
import AtAGlance from "@/components/landing/at-a-glance";
import Breadcrumbs from "@/components/common/breadcrumbs";
import { buildMetadata } from "@/lib/metadata";
import {
  JsonLd,
  breadcrumbSchema,
  faqSchema,
  universityListSchema,
  webPageSchema,
  type Crumb,
} from "@/lib/structured-data";

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

  const base = await buildMetadata({
    title: page.seo.title,
    description: page.seo.description,
    path: `/${slug}`,
    noindex: page.seo.robots === "noindex",
    image: page.seo.ogImage ?? page.hero.heroImage?.src ?? null,
    // CMS titles already read as complete titles ("... in North Zone (2026)").
    absoluteTitle: page.seo.title.length > 45,
    modifiedTime: page.updatedAt,
  });

  return {
    ...base,
    keywords: page.seo.keywords,
    // An explicit canonical set in the CMS wins over the page's own URL.
    ...(page.seo.canonical ? { alternates: { canonical: page.seo.canonical } } : {}),
  };
}

function LandingPageJsonLd({ page, path, crumbs }: { page: LandingPageData; path: string; crumbs: Crumb[] }) {
  const universities = page.universitySection?.universities ?? [];
  const graph = [
    webPageSchema({
      path,
      name: page.seo.title,
      description: page.seo.description,
      type: universities.length > 0 ? "CollectionPage" : "WebPage",
      image: page.seo.ogImage ?? page.hero.heroImage?.src,
      dateModified: page.updatedAt,
      hasBreadcrumb: true,
    }),
    breadcrumbSchema(crumbs, path),
    universityListSchema(
      universities.map((u) => ({
        name: u.name,
        logo: u.logo,
        websiteUrl: u.websiteUrl,
        approvals: (u.approvals ?? []).map((a) => a?.label).filter(Boolean) as string[],
        duration: u.duration,
        startingFee: u.startingFee,
        studyMode: u.studyMode,
      })),
      path,
      page.title ?? page.seo.title
    ),
    page.faq ? faqSchema(page.faq.faqs, path) : null,
  ].filter((node): node is Record<string, unknown> => node !== null);

  return <JsonLd data={graph} />;
}

export default async function LandingPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getLandingPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const path = `/${slug}`;
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Programs", path: "/landing-pages" },
    { name: page.title ?? page.seo.title, path },
  ];

  return (
    <>
      <LandingPageJsonLd page={page} path={path} crumbs={crumbs} />
      <Breadcrumbs crumbs={crumbs} />

      <Hero {...page.hero} universities={page.universitySection?.universities} />

      <AtAGlance
        title={page.title ?? page.seo.title}
        category={page.category}
        universities={page.universitySection?.universities ?? []}
        updatedAt={page.updatedAt}
      />

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

      {page.benefits && <Benefits {...page.benefits} />}

      {page.careerScope && <CareerScope {...page.careerScope} />}

      {page.highlightBanner && <HighlightBanner {...page.highlightBanner} />}

      {page.testimonials && <Testimonials {...page.testimonials} />}

      {page.faq && <FAQ {...page.faq} />}

      <CTA {...page.cta} />
    </>
  );
}

