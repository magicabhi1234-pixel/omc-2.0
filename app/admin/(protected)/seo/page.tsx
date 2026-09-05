import Link from "next/link";
import { supabaseAdmin } from "@/lib/db/client";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SeoRow {
  id: string;
  title: string;
  slug: string;
  editHref: string;
  seo_meta_title: string | null;
  seo_meta_description: string | null;
  seo_canonical_url: string | null;
  status: string;
}

function Check({ ok }: { ok: boolean }) {
  return ok ? (
    <Badge variant="default">Set</Badge>
  ) : (
    <Badge variant="secondary" className="bg-amber-100 text-amber-800">Missing</Badge>
  );
}

export default async function SeoOverviewPage() {
  const [{ data: pages }, { data: posts }] = await Promise.all([
    supabaseAdmin
      .from("landing_pages")
      .select("id, title, slug, status, seo_meta_title, seo_meta_description, seo_canonical_url"),
    supabaseAdmin
      .from("blog_posts")
      .select("id, title, slug, status, seo_meta_title, seo_meta_description, seo_canonical_url"),
  ]);

  const rows: SeoRow[] = [
    ...(pages ?? []).map((p) => ({ ...p, editHref: `/admin/pages/${p.id}` })),
    ...(posts ?? []).map((p) => ({ ...p, editHref: `/admin/blogs/${p.id}` })),
  ];

  const missingTitle = rows.filter((r) => !r.seo_meta_title).length;
  const missingDescription = rows.filter((r) => !r.seo_meta_description).length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">SEO Overview</h1>
      <p className="mt-1 text-slate-600">
        {rows.length} content items - {missingTitle} missing a meta title, {missingDescription} missing a meta description.
      </p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Meta Title</TableHead>
              <TableHead>Meta Description</TableHead>
              <TableHead>Canonical URL</TableHead>
              <TableHead className="text-right">Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.title}</TableCell>
                <TableCell className="text-slate-500">/{row.slug}</TableCell>
                <TableCell><Check ok={!!row.seo_meta_title} /></TableCell>
                <TableCell><Check ok={!!row.seo_meta_description} /></TableCell>
                <TableCell><Check ok={!!row.seo_canonical_url} /></TableCell>
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
