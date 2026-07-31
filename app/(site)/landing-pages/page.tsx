import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/constants/site";
import { getLandingPagesForHub, type LandingPageHubEntry } from "@/data/registry";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: "All Landing Pages | Browse Online MBA Programs",
  description:
    "Browse all landing pages for Online MBA, Distance MBA, MBA Specializations, University Pages, and Bachelor Programs.",
  alternates: {
    canonical: `${SITE.url}/landing-pages`,
  },
  openGraph: {
    title: "All Landing Pages | Browse Online MBA Programs",
    description:
      "Browse all landing pages for Online MBA, Distance MBA, MBA Specializations, University Pages, and Bachelor Programs.",
    url: `${SITE.url}/landing-pages`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Landing Pages | Browse Online MBA Programs",
    description:
      "Browse all landing pages for Online MBA, Distance MBA, MBA Specializations, University Pages, and Bachelor Programs.",
  },
};

// ---------------------------------------------------------------------------
// Structured Data
// ---------------------------------------------------------------------------

function LandingPagesJsonLd({ entries }: { entries: LandingPageHubEntry[] }) {
  const itemList = entries.map((entry, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${SITE.url}/${entry.slug}`,
    name: entry.seoTitle,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE.url}/landing-pages`,
        url: `${SITE.url}/landing-pages`,
        name: "All Landing Pages | Browse Online MBA Programs",
        description:
          "Browse all landing pages for Online MBA, Distance MBA, MBA Specializations, University Pages, and Bachelor Programs.",
        isPartOf: {
          "@type": "WebSite",
          "@id": `${SITE.url}/`,
          name: SITE.name,
        },
      },
      {
        "@type": "ItemList",
        itemListElement: itemList,
      },
      {
        "@type": "WebPage",
        "@id": `${SITE.url}/landing-pages`,
        url: `${SITE.url}/landing-pages`,
        name: "All Landing Pages | Browse Online MBA Programs",
        description:
          "Browse all landing pages for Online MBA, Distance MBA, MBA Specializations, University Pages, and Bachelor Programs.",
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: SITE.url,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "All Landing Pages",
              item: `${SITE.url}/landing-pages`,
            },
          ],
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default async function LandingPagesPage() {
  const entries = await getLandingPagesForHub();

  // Group landing pages by category
  const grouped = entries.reduce<Record<string, LandingPageHubEntry[]>>((acc, entry) => {
    const category = entry.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(entry);
    return acc;
  }, {});

  const categoryEntries = Object.entries(grouped).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  const totalCount = entries.length;
  const lastUpdated = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <LandingPagesJsonLd entries={entries} />

      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-slate-50 to-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Browse All Landing Pages
              </h1>
              <p className="mt-5 text-lg leading-7 text-slate-600">
                Explore our complete collection of landing pages covering Online MBA,
                Distance MBA, MBA Specializations, Executive MBA, University Pages,
                and Bachelor Programs across India.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F47C45]/10 px-3 py-1 font-medium text-[#F47C45]">
                  {totalCount} Pages
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">
                  Last Updated: {lastUpdated}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filters & Content */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {categoryEntries.map(([category, pages]) => (
              <div key={category} className="mb-16 last:mb-0">
                {/* Category Header */}
                <div className="mb-8 border-b border-slate-200 pb-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-900">
                      {category}
                    </h2>
                    <span className="rounded-full bg-[#F47C45]/10 px-3 py-1 text-sm font-medium text-[#F47C45]">
                      {pages.length} Page{pages.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Cards Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {pages.map((page) => (
                    <Link
                      key={page.slug}
                      href={`/${page.slug}`}
                      className="group relative flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#0B3B68]"
                      aria-label={`View ${page.seoTitle}`}
                    >
                      <div className="flex-1">
                        <span className="inline-flex rounded-full bg-[#F47C45]/10 px-2.5 py-0.5 text-xs font-semibold text-[#F47C45]">
                          {category}
                        </span>
                        <h3 className="mt-3 text-base font-semibold leading-snug text-slate-900 group-hover:text-[#0B3B68] transition-colors">
                          {page.seoTitle}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-500 line-clamp-2">
                          {page.seoDescription}
                        </p>
                      </div>
                      <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#F47C45]">
                        Explore
                        <svg
                          className="h-4 w-4 transition-transform group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
