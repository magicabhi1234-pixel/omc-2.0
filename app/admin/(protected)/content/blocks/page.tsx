import type { Metadata } from "next";
import Link from "next/link";
import { Layers, Pencil, Plus } from "lucide-react";
import { supabaseAdmin } from "@/lib/db/client";
import { requireProfile } from "@/lib/auth/session";
import LinkButton from "@/components/admin/link-button";
import PublishToggle from "@/components/admin/publish-toggle";
import DeleteButton from "@/components/admin/delete-button";
import ContentTable from "@/components/admin/content-table";
import { PageHeader } from "@/components/admin/page-kit";
import { runAction } from "@/lib/admin/run-action";
import { deleteContentBlock, toggleContentBlockStatus } from "./actions";
import { bulkContentBlocks } from "../../bulk-actions";

export const metadata: Metadata = { title: "Content Blocks" };

export default async function ContentBlocksListPage() {
  const profile = await requireProfile();

  const { data } = await supabaseAdmin
    .from("content_blocks")
    .select("id, content_type, slug, title, status")
    .order("updated_at", { ascending: false });
  const blocks = data ?? [];

  return (
    <div>
      <PageHeader
        title="Content Blocks"
        description="Flexible content items for any future content type - no code changes required."
        actions={
          <LinkButton href="/admin/content/blocks/new">
            <Plus size={16} /> New block
          </LinkButton>
        }
      />
      <ContentTable
        noun={{ one: "content block", many: "content blocks" }}
        emptyIcon={<Layers size={22} aria-hidden="true" />}
        emptyAction={<LinkButton href="/admin/content/blocks/new"><Plus size={16} /> Create a block</LinkButton>}
        searchPlaceholder="Search by title, type or slug…"
        canDelete={profile.permissions.canDeleteContent}
        canPublish={profile.permissions.canPublish}
        bulkAction={bulkContentBlocks}
        columns={[{ label: "Title" }, { label: "Type", className: "hidden sm:table-cell" }, { label: "Slug", className: "hidden md:table-cell" }, { label: "Status" }, { label: "", className: "text-right" }]}
        rows={blocks.map((b) => ({
          id: b.id,
          status: b.status,
          search: `${b.title ?? ""} ${b.content_type} ${b.slug ?? ""}`.toLowerCase(),
          cells: [
            <Link key="t" href={`/admin/content/blocks/${b.id}`} className="font-medium text-foreground hover:text-primary hover:underline">{b.title || "Untitled"}</Link>,
            <span key="y" className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">{b.content_type}</span>,
            <span key="s" className="text-sm text-muted-foreground">{b.slug ?? "—"}</span>,
            <PublishToggle
              key="p"
              status={b.status as "draft" | "published"}
              action={async (next) => {
                "use server";
                return runAction(() => toggleContentBlockStatus(b.id, next));
              }}
            />,
            <div key="x" className="flex justify-end gap-1">
              <LinkButton href={`/admin/content/blocks/${b.id}`} variant="ghost" size="icon-sm" className="text-muted-foreground">
                <Pencil size={15} />
                <span className="sr-only">Edit {b.title}</span>
              </LinkButton>
              {profile.permissions.canDeleteContent && (
                <DeleteButton
                  action={async () => {
                    "use server";
                    return runAction(() => deleteContentBlock(b.id));
                  }}
                  confirmMessage={`Delete "${b.title}"?`}
                />
              )}
            </div>,
          ],
        }))}
      />
    </div>
  );
}
