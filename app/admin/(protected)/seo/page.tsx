import type { Metadata } from "next";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/db/client";
import { requireProfile } from "@/lib/auth/session";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { blogPostHref } from "@/lib/blog-links";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "SEO" };

interface SeoRow {
  id: string;
  type: "Landing page" | "Blog post";
  title: string;
  path: string;
  editHref: string;
  status: string;
  metaTitle: string;
  metaDescription: string;
  canonical: string | null;
  ogImage: string | null;
  noIndex: boolean;
  hasFaqs: boolean;
}

type Level = "ok" | "warn" | "bad";

/** Google truncates titles around 60 characters and descriptions around 155-160. */
function titleLevel(t: string): Level {
  if (!t) return "bad";
  return t.length < 25 || t.length > 60 ? "warn" : "ok";
}
function descriptionLevel(d: string): Level {
  if (!d) return "bad";
  return d.length < 70 || d.length > 160 ? "warn" : "ok";
}

function Pill({ level, children, title }: { level: Level; children: React.ReactNode; title?: string }) {
  return (
    <span
      title={title}
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        level === "ok" && "bg-green-50 text-green-700",
        level === "warn" && "bg-amber-50 text-amber-800",
        level === "bad" && "bg-red-50 text-red-700"
      )}
    >
      {children}
    </span>
  );
}

export default async function SeoOverviewPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  await requireProfile();
  const { filter } = await searchParams;

  const [{ data: pages }, { data: posts }] = await Promise.all([
    supabaseAdmin
      .from("landing_pages")
      .select("id, title, slug, status, hero, faq, seo_meta_title, seo_meta_description, seo_canonical_url, seo_og_image_url, seo_no_index"),
    supabaseAdmin
      .from("blog_posts")
      .select("id, title, slug, status, faqs, featured_image_url, seo_meta_title, seo_meta_description, seo_canonical_url, seo_og_image_url, seo_no_index"),
  ]);

  const rows: SeoRow[] = [
    ...(pages ?? []).map((p) => ({
      id: p.id,
      type: "Landing page" as const,
      title: p.title,
      path: `/${p.slug}`,
      editHref: `/admin/pages/${p.id}`,
      status: p.status,
      metaTitle: p.seo_meta_title || p.title || "",
      metaDescription: p.seo_meta_description || (p.hero as { description?: string } | null)?.description || "",
      canonical: p.seo_canonical_url,
      ogImage: p.seo_og_image_url || (p.hero as { image?: { src?: string } } | null)?.image?.src || null,
      noIndex: p.seo_no_index,
      hasFaqs: ((p.faq as { faqs?: unknown[] } | null)?.faqs?.length ?? 0) > 0,
    })),
    ...(posts ?? []).map((p) => ({
      id: p.id,
      type: "Blog post" as const,
      title: p.title,
      path: blogPostHref(p.slug),
      editHref: `/admin/blogs/${p.id}`,
      status: p.status,
      metaTitle: p.seo_meta_title || p.title || "",
      metaDescription: p.seo_meta_description || "",
      canonical: p.seo_canonical_url,
      ogImage: p.seo_og_image_url || p.featured_image_url || null,
      noIndex: p.seo_no_index,
      hasFaqs: Array.isArray(p.faqs) && p.faqs.length > 0,
    })),
  ];

  const issues = (r: SeoRow) =>
    [titleLevel(r.metaTitle) !== "ok", descriptionLevel(r.metaDescription) !== "ok", !r.ogImage, r.noIndex && r.status === "published"].filter(Boolean).length;
  const titleCounts = new Map<string, number>();
  for (const r of rows) titleCounts.set(r.metaTitle.toLowerCase(), (titleCounts.get(r.metaTitle.toLowerCase()) ?? 0) + 1);
  const duplicates = rows.filter((r) => (titleCounts.get(r.metaTitle.toLowerCase()) ?? 0) > 1);

  const shown = filter === "issues" ? rows.filter((r) => issues(r) > 0 || duplicates.includes(r)) : rows;
  const summary = [
    { label: "Pages", value: rows.length },
    { label: "Title too long/short or missing", value: rows.filter((r) => titleLevel(r.metaTitle) !== "ok").length },
    { label: "Description too long/short or missing", value: rows.filter((r) => descriptionLevel(r.metaDescription) !== "ok").length },
    { label: "Duplicate titles", value: duplicates.length },
    { label: "No share image", value: rows.filter((r) => !r.ogImage).length },
    { label: "Published but noindex", value: rows.filter((r) => r.noIndex && r.status === "published").length },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">SEO</h1>
      <p className="mt-1 text-slate-600">
        What search engines see for each page, using the same fallbacks as the live site (meta title falls back to the page title, etc.).
        Edit a page to change its SEO fields; sitewide verification tags live in Global Settings.
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {summary.map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-3">
            <dt className="text-xs text-slate-500">{s.label}</dt>
            <dd className="mt-1 text-xl font-bold text-slate-900">{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex gap-2 text-sm">
        <Link href="/admin/seo" className={cn("rounded-full px-3 py-1", filter !== "issues" ? "bg-[#0B3B68] text-white" : "bg-white text-slate-700 ring-1 ring-slate-200")}>
          All ({rows.length})
        </Link>
        <Link href="/admin/seo?filter=issues" className={cn("rounded-full px-3 py-1", filter === "issues" ? "bg-[#0B3B68] text-white" : "bg-white text-slate-700 ring-1 ring-slate-200")}>
          Needs work ({rows.filter((r) => issues(r) > 0 || duplicates.includes(r)).length})
        </Link>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Page</TableHead>
              <TableHead>Meta title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Share image</TableHead>
              <TableHead>Index</TableHead>
              <TableHead>FAQ schema</TableHead>
              <TableHead className="text-right">Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shown.map((row) => (
              <TableRow key={row.id} className="align-top">
                <TableCell className="max-w-64 whitespace-normal">
                  <p className="font-medium text-slate-900">{row.title}</p>
                  <a href={row.path} target="_blank" rel="noreferrer" className="text-xs text-slate-500 hover:underline">
                    {row.path}
                  </a>
                  <p className="text-xs text-slate-500">
                    {row.type}
                    {row.status === "draft" && " · draft"}
                  </p>
                </TableCell>
                <TableCell className="max-w-72 whitespace-normal">
                  <Pill level={titleLevel(row.metaTitle)}>{row.metaTitle.length} chars</Pill>
                  {duplicates.includes(row) && <Pill level="warn"> duplicate</Pill>}
                  <p className="mt-1 text-xs text-slate-600">{row.metaTitle || "—"}</p>
                </TableCell>
                <TableCell className="max-w-72 whitespace-normal">
                  <Pill level={descriptionLevel(row.metaDescription)}>{row.metaDescription.length} chars</Pill>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-600">{row.metaDescription || "—"}</p>
                </TableCell>
                <TableCell>
                  <Pill level={row.ogImage ? "ok" : "warn"}>{row.ogImage ? "Set" : "Missing"}</Pill>
                </TableCell>
                <TableCell>
                  <Pill level={row.noIndex ? (row.status === "published" ? "bad" : "warn") : "ok"}>{row.noIndex ? "noindex" : "index"}</Pill>
                </TableCell>
                <TableCell>
                  <Pill level={row.hasFaqs ? "ok" : "warn"}>{row.hasFaqs ? "Yes" : "No FAQs"}</Pill>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={row.editHref} className="text-sm font-medium text-[#0B3B68] hover:underline">
                    Edit
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
