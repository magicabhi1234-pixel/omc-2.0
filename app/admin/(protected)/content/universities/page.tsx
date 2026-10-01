import { Plus } from "lucide-react";
import { supabaseAdmin } from "@/lib/db/client";
import { requireProfile } from "@/lib/auth/session";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LinkButton from "@/components/admin/link-button";
import PublishToggle from "@/components/admin/publish-toggle";
import DeleteButton from "@/components/admin/delete-button";
import { deleteUniversity, toggleUniversityStatus } from "./actions";
import { runAction } from "@/lib/admin/run-action";

export default async function UniversitiesListPage() {
  const profile = await requireProfile();

  const { data } = await supabaseAdmin
    .from("universities")
    .select("id, name, slug, study_mode, status, featured")
    .order("name", { ascending: true });

  const universities = data ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Universities</h1>
          <p className="mt-1 text-slate-600">{universities.length} total</p>
        </div>
        <LinkButton href="/admin/content/universities/new"><Plus size={16} className="mr-2" /> New University</LinkButton>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Study Mode</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {universities.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell className="text-slate-500">/{u.slug}</TableCell>
                <TableCell>{u.study_mode}</TableCell>
                <TableCell>{u.featured ? "Yes" : "—"}</TableCell>
                <TableCell>
                  <PublishToggle
                    status={u.status as "draft" | "published"}
                    action={async (next) => {
                      "use server";
                      return runAction(() => toggleUniversityStatus(u.id, next));
                    }}
                  />
                </TableCell>
                <TableCell className="text-right"><div className="flex justify-end gap-1">
                  <LinkButton href={`/admin/content/universities/${u.id}`} variant="ghost" size="sm">Edit</LinkButton>
                  {profile.permissions.canDeleteContent && (
                    <DeleteButton
                      action={async () => {
                        "use server";
                        return runAction(() => deleteUniversity(u.id));
                      }}
                      confirmMessage={`Delete "${u.name}"? This cannot be undone.`}
                    />
                  )}
                </div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {universities.length === 0 && (
          <p className="p-8 text-center text-sm text-slate-500">No universities yet.</p>
        )}
      </div>
    </div>
  );
}
