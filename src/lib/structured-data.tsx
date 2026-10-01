import { SITE } from "@/constants/site";
import type { Branding, SiteInfo, SocialLinks } from "@/lib/site-settings";

/**
 * schema.org builders. Every page links into one entity graph via stable
 * @ids - the Organization and WebSite are declared once (site layout) and
 * referenced everywhere else, which is what lets search engines and AI
 * answer engines resolve "Online MBA Colleges" as a single entity.
 */

export const SITE_URL = SITE.url.replace(/\/+$/, "");
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const absoluteUrl = (pathOrUrl: string) => (/^https?:\/\//.test(pathOrUrl) ? pathOrUrl : `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`);

type Thing = Record<string, unknown>;

/** Renders JSON-LD safely: `<` is escaped so CMS text can never close the script tag. */
export function JsonLd({ data }: { data: Thing | Thing[] }) {
  const graph = Array.isArray(data) ? data : [data];
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

export function organizationSchema(info: SiteInfo, branding: Branding, social: SocialLinks): Thing {
  const sameAs = Object.values(social).filter((v): v is string => Boolean(v));
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: info.site_name,
    alternateName: "OMC",
    url: `${SITE_URL}/`,
    logo: { "@type": "ImageObject", url: absoluteUrl(branding.logo_url), caption: branding.logo_alt },
    description: info.footer_about,
    slogan: info.tagline || undefined,
    email: info.email,
    telephone: info.phone,
    ...(info.address ? { address: { "@type": "PostalAddress", streetAddress: info.address, addressCountry: "IN" } } : {}),
    areaServed: { "@type": "Country", name: "India" },
    knowsAbout: [
      "Online MBA",
      "Distance MBA",
      "Executive MBA",
      "UGC-entitled online degrees",
      "MBA specializations",
      "MBA admissions counselling in India",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "admissions counselling",
      telephone: info.phone,
      email: info.email,
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteSchema(info: SiteInfo): Thing {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: info.site_name,
    description: info.tagline,
    inLanguage: "en-IN",
    publisher: { "@id": ORGANIZATION_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/blog?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbSchema(crumbs: Crumb[], pageUrl: string): Thing {
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(pageUrl)}#breadcrumb`,
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function webPageSchema(opts: {
  path: string;
  name: string;
  description?: string;
  type?: "WebPage" | "CollectionPage" | "AboutPage" | "ContactPage" | "FAQPage";
  image?: string | null;
  dateModified?: string | null;
  hasBreadcrumb?: boolean;
}): Thing {
  const url = absoluteUrl(opts.path);
  return {
    "@type": opts.type ?? "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: opts.name,
    description: opts.description || undefined,
    inLanguage: "en-IN",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
    ...(opts.image ? { primaryImageOfPage: { "@type": "ImageObject", url: absoluteUrl(opts.image) } } : {}),
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
    ...(opts.hasBreadcrumb ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[], pagePath: string): Thing | null {
  const valid = faqs.filter((f) => f.question?.trim() && f.answer?.trim());
  if (valid.length === 0) return null;
  return {
    "@type": "FAQPage",
    "@id": `${absoluteUrl(pagePath)}#faq`,
    mainEntity: valid.map((faq) => ({
      "@type": "Question",
      name: faq.question.trim(),
      acceptedAnswer: { "@type": "Answer", text: faq.answer.trim() },
    })),
  };
}

export interface UniversityForSchema {
  name: string;
  slug?: string;
  logo?: string;
  websiteUrl?: string;
  approvals?: string[];
  duration?: string;
  startingFee?: string;
  studyMode?: string;
}

/**
 * Universities on a comparison page, as an ItemList of CollegeOrUniversity,
 * each offering its MBA as a Course. Only facts shown on the page are used
 * (no ratings: self-hosted review stars aren't eligible for rich results).
 */
export function universityListSchema(universities: UniversityForSchema[], pagePath: string, listName: string): Thing | null {
  if (universities.length === 0) return null;
  const pageUrl = absoluteUrl(pagePath);
  return {
    "@type": "ItemList",
    "@id": `${pageUrl}#universities`,
    name: listName,
    numberOfItems: universities.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: universities.map((u, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CollegeOrUniversity",
        name: u.name,
        ...(u.websiteUrl ? { url: u.websiteUrl, sameAs: u.websiteUrl } : {}),
        ...(u.logo ? { logo: absoluteUrl(u.logo) } : {}),
        address: { "@type": "PostalAddress", addressCountry: "IN" },
        ...(u.approvals?.length ? { hasCredential: u.approvals.map((a) => ({ "@type": "EducationalOccupationalCredential", name: `${a} approved` })) } : {}),
        makesOffer: {
          "@type": "Offer",
          category: "Tuition",
          ...(u.startingFee ? { description: `Fees from ${u.startingFee}` } : {}),
          itemOffered: {
            "@type": "Course",
            name: `${u.studyMode && u.studyMode !== "Online & Distance" ? `${u.studyMode} ` : "Online "}MBA - ${u.name}`,
            description: `Master of Business Administration offered by ${u.name}${u.duration ? `, ${u.duration}` : ""}.`,
            provider: { "@type": "CollegeOrUniversity", name: u.name },
            educationalCredentialAwarded: "MBA",
            ...(u.duration ? { timeRequired: u.duration.match(/(\d+)\s*year/i) ? `P${u.duration.match(/(\d+)\s*year/i)![1]}Y` : undefined } : {}),
            hasCourseInstance: {
              "@type": "CourseInstance",
              courseMode: u.studyMode?.toLowerCase().includes("distance") && !u.studyMode?.toLowerCase().includes("online") ? "Distance" : "Online",
              ...(u.duration ? { courseWorkload: u.duration } : {}),
            },
          },
        },
      },
    })),
  };
}

export function articleSchema(opts: {
  path: string;
  headline: string;
  description?: string;
  image?: string;
  datePublished: string;
  dateModified?: string | null;
  author: string;
  keywords?: string[];
  section?: string;
}): Thing {
  const url = absoluteUrl(opts.path);
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: opts.headline.slice(0, 110),
    description: opts.description || undefined,
    ...(opts.image ? { image: [absoluteUrl(opts.image)] } : {}),
    datePublished: opts.datePublished,
    dateModified: opts.dateModified || opts.datePublished,
    author: opts.author && opts.author.toLowerCase() !== "admin"
      ? { "@type": "Person", name: opts.author }
      : { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    mainEntityOfPage: { "@id": `${url}#webpage` },
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: "en-IN",
    ...(opts.keywords?.length ? { keywords: opts.keywords.join(", ") } : {}),
    ...(opts.section ? { articleSection: opts.section } : {}),
  };
}
