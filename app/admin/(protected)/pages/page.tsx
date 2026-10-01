import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, FileText, Pencil, Plus } from "lucide-react";
import { supabaseAdmin } from "@/lib/db/client";
import { requireProfile } from "@/lib/auth/session";
import LinkButton from "@/components/admin/link-button";
import PublishToggle from "@/components/admin/publish-toggle";
import DeleteButton from "@/components/admin/delete-button";
import ContentTable from "@/components/admin/content-table";
import { PageHeader } from "@/components/admin/page-kit";
import { runAction } from "@/lib/admin/run-action";
import { deleteLandingPage, toggleLandingPageStatus } from "./actions";
import { bulkLandingPages } from "../bulk-actions";

export const metadata: Metadata = { title: "Landing Pages" };

const IST = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });

export default async function LandingPagesListPage() {
  const profile = await requireProfile();

  const { data } = await supabaseAdmin
    .from("landing_pages")
    .select("id, title, slug, category, status, updated_at")
    .order("updated_at", { ascending: false });
  const pages = data ?? [];

  return (
    <div>
      <PageHeader
        title="Landing Pages"
        description={`${pages.length} program comparison pages. Published pages are live at their URL and listed in the sitemap.`}
        actions={
          <LinkButton href="/admin/pages/new">
            <Plus size={16} /> New landing page
          </LinkButton>
        }
      />
      <ContentTable
        noun={{ one: "landing page", many: "landing pages" }}
        emptyIcon={<FileText size={22} aria-hidden="true" />}
        emptyAction={<LinkButton href="/admin/pages/new"><Plus size={16} /> Create the first page</LinkButton>}
        searchPlaceholder="Search by title, URL or category…"
        canDelete={profile.permissions.canDeleteContent}
        canPublish={profile.permissions.canPublish}
        bulkAction={bulkLandingPages}
        columns={[{ label: "Page" }, { label: "Category", className: "hidden md:table-cell" }, { label: "Status" }, { label: "Updated", className: "hidden lg:table-cell" }, { label: "", className: "text-right" }]}
        rows={pages.map((p) => ({
          id: p.id,
          status: p.status,
          search: `${p.title} ${p.slug} ${p.category}`.toLowerCase(),
          cells: [
            <div key="t" className="min-w-0">
              <Link href={`/admin/pages/${p.id}`} className="font-medium text-foreground hover:text-primary hover:underline">
                {p.title}
              </Link>
              <p className="truncate text-xs text-muted-foreground">/{p.slug}</p>
            </div>,
            <span key="c" className="inline-flex rounded-md bg-muted px-2 py-0.5 text-xs font-medium whitespace-nowrap text-muted-foreground">{p.category}</span>,
            <PublishToggle
              key="s"
              status={p.status as "draft" | "published"}
              action={async (next) => {
                "use server";
                return runAction(() => toggleLandingPageStatus(p.id, p.slug, next));
              }}
            />,
            <span key="u" className="text-sm whitespace-nowrap text-muted-foreground">{p.updated_at ? IST.format(new Date(p.updated_at)) : "—"}</span>,
            <div key="a" className="flex justify-end gap-1">
              {p.status === "published" && (
                <a href={`/${p.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground" aria-label={`View ${p.title} on the site`} title="View on site">
                  <ExternalLink size={15} />
                </a>
              )}
              <LinkButton href={`/admin/pages/${p.id}`} variant="ghost" size="icon-sm" className="text-muted-foreground" >
                <Pencil size={15} />
                <span className="sr-only">Edit {p.title}</span>
              </LinkButton>
              {profile.permissions.canDeleteContent && (
                <DeleteButton
                  action={async () => {
                    "use server";
                    return runAction(() => deleteLandingPage(p.id));
                  }}
                  confirmMessage={`Delete "${p.title}"? This cannot be undone.`}
                />
              )}
            </div>,
          ],
        }))}
      />
    </div>
  );
}
