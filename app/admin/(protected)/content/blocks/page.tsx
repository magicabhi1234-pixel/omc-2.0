import { Plus } from "lucide-react";
import { supabaseAdmin } from "@/lib/db/client";
import { requireProfile } from "@/lib/auth/session";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LinkButton from "@/components/admin/link-button";
import PublishToggle from "@/components/admin/publish-toggle";
import DeleteButton from "@/components/admin/delete-button";
import { deleteContentBlock, toggleContentBlockStatus } from "./actions";
import { runAction } from "@/lib/admin/run-action";

export default async function ContentBlocksListPage() {
  const profile = await requireProfile();

  const { data } = await supabaseAdmin
    .from("content_blocks")
    .select("id, content_type, slug, title, status")
    .order("content_type", { ascending: true });

  const blocks = data ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Other Content</h1>
          <p className="mt-1 text-slate-600">Generic content types with no dedicated table - {blocks.length} total</p>
        </div>
        <LinkButton href="/admin/content/blocks/new"><Plus size={16} className="mr-2" /> New Content Item</LinkButton>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blocks.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-medium">{b.title}</TableCell>
                <TableCell className="text-slate-500">{b.content_type}</TableCell>
                <TableCell className="text-slate-500">{b.slug ?? "—"}</TableCell>
                <TableCell>
                  <PublishToggle
                    status={b.status as "draft" | "published"}
                    action={async (next) => {
                      "use server";
                      return runAction(() => toggleContentBlockStatus(b.id, next));
                    }}
                  />
                </TableCell>
                <TableCell className="text-right"><div className="flex justify-end gap-1">
                  <LinkButton href={`/admin/content/blocks/${b.id}`} variant="ghost" size="sm">Edit</LinkButton>
                  {profile.permissions.canDeleteContent && (
                    <DeleteButton
                      action={async () => {
                        "use server";
                        return runAction(() => deleteContentBlock(b.id));
                      }}
                      confirmMessage={`Delete "${b.title}"?`}
                    />
                  )}
                </div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {blocks.length === 0 && <p className="p-8 text-center text-sm text-slate-500">No custom content items yet.</p>}
      </div>
    </div>
  );
}
