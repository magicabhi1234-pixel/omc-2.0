import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, Pencil, Plus, Star } from "lucide-react";
import { supabaseAdmin } from "@/lib/db/client";
import { requireProfile } from "@/lib/auth/session";
import LinkButton from "@/components/admin/link-button";
import PublishToggle from "@/components/admin/publish-toggle";
import DeleteButton from "@/components/admin/delete-button";
import ContentTable from "@/components/admin/content-table";
import { PageHeader } from "@/components/admin/page-kit";
import { runAction } from "@/lib/admin/run-action";
import { deleteUniversity, toggleUniversityStatus } from "./actions";
import { bulkUniversities } from "../../bulk-actions";

export const metadata: Metadata = { title: "Universities" };

export default async function UniversitiesListPage() {
  const profile = await requireProfile();

  const { data } = await supabaseAdmin
    .from("universities")
    .select("id, name, slug, study_mode, status, featured, starting_fee, logo_url, approvals")
    .order("name", { ascending: true });
  const universities = data ?? [];

  return (
    <div>
      <PageHeader
        title="Universities"
        description={`${universities.length} university profiles used across the comparison pages.`}
        actions={
          <LinkButton href="/admin/content/universities/new">
            <Plus size={16} /> New university
          </LinkButton>
        }
      />
      <ContentTable
        noun={{ one: "university", many: "universities" }}
        emptyIcon={<GraduationCap size={22} aria-hidden="true" />}
        searchPlaceholder="Search universities…"
        canDelete={profile.permissions.canDeleteContent}
        canPublish={profile.permissions.canPublish}
        bulkAction={bulkUniversities}
        columns={[{ label: "University" }, { label: "Mode", className: "hidden md:table-cell" }, { label: "Starting fee", className: "hidden lg:table-cell" }, { label: "Approvals", className: "hidden xl:table-cell" }, { label: "Status" }, { label: "", className: "text-right" }]}
        rows={universities.map((u) => ({
          id: u.id,
          status: u.status,
          search: `${u.name} ${u.slug} ${(u.approvals ?? []).join(" ")}`.toLowerCase(),
          cells: [
            <div key="n" className="flex min-w-0 items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-lg border border-border bg-white">
                {u.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail
                  <img src={u.logo_url} alt="" loading="lazy" className="size-full object-contain p-0.5" />
                ) : (
                  <GraduationCap size={16} className="text-muted-foreground" />
                )}
              </span>
              <span className="min-w-0">
                <Link href={`/admin/content/universities/${u.id}`} className="flex items-center gap-1.5 font-medium text-foreground hover:text-primary hover:underline">
                  <span className="truncate">{u.name}</span>
                  {u.featured && <Star size={13} className="shrink-0 fill-brand-accent text-brand-accent" aria-label="Featured" />}
                </Link>
                <span className="block truncate text-xs text-muted-foreground">{u.slug}</span>
              </span>
            </div>,
            <span key="m" className="text-sm whitespace-nowrap text-muted-foreground">{u.study_mode}</span>,
            <span key="f" className="text-sm whitespace-nowrap tabular-nums">{u.starting_fee || "—"}</span>,
            <div key="a" className="flex flex-wrap gap-1">
              {(u.approvals ?? []).slice(0, 3).map((a: string) => (
                <span key={a} className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">{a}</span>
              ))}
            </div>,
            <PublishToggle
              key="s"
              status={u.status as "draft" | "published"}
              action={async (next) => {
                "use server";
                return runAction(() => toggleUniversityStatus(u.id, next));
              }}
            />,
            <div key="x" className="flex justify-end gap-1">
              <LinkButton href={`/admin/content/universities/${u.id}`} variant="ghost" size="icon-sm" className="text-muted-foreground">
                <Pencil size={15} />
                <span className="sr-only">Edit {u.name}</span>
              </LinkButton>
              {profile.permissions.canDeleteContent && (
                <DeleteButton
                  action={async () => {
                    "use server";
                    return runAction(() => deleteUniversity(u.id));
                  }}
                  confirmMessage={`Delete "${u.name}"? It will be removed from every landing page that lists it.`}
                />
              )}
            </div>,
          ],
        }))}
      />
    </div>
  );
}
