import Link from "next/link";
import { getLandingPagesForHub, type LandingPageHubEntry } from "@/data/registry";
import { buildMetadata } from "@/lib/metadata";
import Breadcrumbs from "@/components/common/breadcrumbs";
import { JsonLd, absoluteUrl, breadcrumbSchema, webPageSchema, type Crumb } from "@/lib/structured-data";

const TITLE = "All Online & Distance MBA Comparisons";
const DESCRIPTION =
  "Browse every Online MBA, Distance MBA, MBA specialization, Executive MBA, university and bachelor program comparison on Online MBA Colleges, grouped by category.";
const PATH = "/landing-pages";
const CRUMBS: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Programs", path: PATH },
];

export const generateMetadata = () => buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

function LandingPagesJsonLd({ entries, lastUpdated }: { entries: LandingPageHubEntry[]; lastUpdated?: string }) {
  return (
    <JsonLd
      data={[
        {
          ...webPageSchema({ path: PATH, name: TITLE, description: DESCRIPTION, type: "CollectionPage", dateModified: lastUpdated, hasBreadcrumb: true }),
          mainEntity: { "@id": `${absoluteUrl(PATH)}#list` },
        },
        {
          "@type": "ItemList",
          "@id": `${absoluteUrl(PATH)}#list`,
          numberOfItems: entries.length,
          itemListElement: entries.map((entry, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: absoluteUrl(`/${entry.slug}`),
            name: entry.seoTitle,
          })),
        },
        breadcrumbSchema(CRUMBS, PATH),
      ]}
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
  // Real last edit across the listed pages - not "today" on every render.
  const lastUpdatedIso = entries
    .map((e) => e.updatedAt)
    .filter((d): d is string => Boolean(d))
    .sort()
    .at(-1);
  const lastUpdated = lastUpdatedIso
    ? new Date(lastUpdatedIso).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Kolkata" })
    : null;

  return (
    <>
      <LandingPagesJsonLd entries={entries} lastUpdated={lastUpdatedIso} />
      <Breadcrumbs crumbs={CRUMBS} />

      <div className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-slate-50 to-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Browse All Program Comparisons
              </h1>
              <p className="mt-5 text-lg leading-7 text-slate-600">
                Explore our complete collection of landing pages covering Online MBA,
                Distance MBA, MBA Specializations, Executive MBA, University Pages,
                and Bachelor Programs across India.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C2410C]/10 px-3 py-1 font-medium text-[#C2410C]">
                  {totalCount} Pages
                </span>
                {lastUpdated && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">
                    Last updated: {lastUpdated}
                  </span>
                )}
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
                    <span className="rounded-full bg-[#C2410C]/10 px-3 py-1 text-sm font-medium text-[#C2410C]">
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
                        <span className="inline-flex rounded-full bg-[#C2410C]/10 px-2.5 py-0.5 text-xs font-semibold text-[#C2410C]">
                          {category}
                        </span>
                        <h3 className="mt-3 text-base font-semibold leading-snug text-slate-900 group-hover:text-[#0B3B68] transition-colors">
                          {page.seoTitle}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-500 line-clamp-2">
                          {page.seoDescription}
                        </p>
                      </div>
                      <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#C2410C]">
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
      </div>
    </>
  );
}
