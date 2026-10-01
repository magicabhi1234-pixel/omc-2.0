import { Plus } from "lucide-react";
import { supabaseAdmin } from "@/lib/db/client";
import { requireProfile } from "@/lib/auth/session";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LinkButton from "@/components/admin/link-button";
import PublishToggle from "@/components/admin/publish-toggle";
import DeleteButton from "@/components/admin/delete-button";
import { deleteLandingPage, toggleLandingPageStatus } from "./actions";
import { runAction } from "@/lib/admin/run-action";

export default async function LandingPagesListPage() {
  const profile = await requireProfile();

  const { data } = await supabaseAdmin
    .from("landing_pages")
    .select("id, title, slug, category, status")
    .order("title", { ascending: true });

  const pages = data ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Landing Pages</h1>
          <p className="mt-1 text-slate-600">{pages.length} total</p>
        </div>
        <LinkButton href="/admin/pages/new"><Plus size={16} className="mr-2" /> New Landing Page</LinkButton>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.title}</TableCell>
                <TableCell className="text-slate-500">/{p.slug}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>
                  <PublishToggle
                    status={p.status as "draft" | "published"}
                    action={async (next) => {
                      "use server";
                      return runAction(() => toggleLandingPageStatus(p.id, p.slug, next));
                    }}
                  />
                </TableCell>
                <TableCell className="text-right"><div className="flex justify-end gap-1">
                  <LinkButton href={`/admin/pages/${p.id}`} variant="ghost" size="sm">Edit</LinkButton>
                  {profile.permissions.canDeleteContent && (
                    <DeleteButton
                      action={async () => {
                        "use server";
                        return runAction(() => deleteLandingPage(p.id));
                      }}
                      confirmMessage={`Delete "${p.title}"? This cannot be undone.`}
                    />
                  )}
                </div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {pages.length === 0 && <p className="p-8 text-center text-sm text-slate-500">No landing pages yet.</p>}
      </div>
    </div>
  );
}
