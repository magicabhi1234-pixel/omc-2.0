import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Newspaper, Pencil, Plus } from "lucide-react";
import { supabaseAdmin } from "@/lib/db/client";
import { requireProfile } from "@/lib/auth/session";
import { canAccessContent } from "@/lib/auth/permissions";
import LinkButton from "@/components/admin/link-button";
import PublishToggle from "@/components/admin/publish-toggle";
import DeleteButton from "@/components/admin/delete-button";
import ContentTable from "@/components/admin/content-table";
import { PageHeader } from "@/components/admin/page-kit";
import { runAction } from "@/lib/admin/run-action";
import { blogPostHref } from "@/lib/blog-links";
import { deleteBlogPost, toggleBlogPostStatus } from "./actions";
import { bulkBlogPosts } from "../bulk-actions";

export const metadata: Metadata = { title: "Blogs" };

const IST = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });

export default async function BlogsListPage() {
  const profile = await requireProfile();

  const { data } = await supabaseAdmin
    .from("blog_posts")
    .select("id, title, slug, author, status, published_date, created_by, category")
    .order("published_date", { ascending: false });
  const posts = data ?? [];

  return (
    <div>
      <PageHeader
        title="Blog Posts"
        description={`${posts.length} articles and guides.`}
        actions={
          <LinkButton href="/admin/blogs/new">
            <Plus size={16} /> New post
          </LinkButton>
        }
      />
      <ContentTable
        noun={{ one: "post", many: "posts" }}
        emptyIcon={<Newspaper size={22} aria-hidden="true" />}
        emptyAction={<LinkButton href="/admin/blogs/new"><Plus size={16} /> Write the first post</LinkButton>}
        searchPlaceholder="Search by title, slug or author…"
        canDelete={profile.permissions.canDeleteContent}
        canPublish={profile.permissions.canPublish}
        bulkAction={bulkBlogPosts}
        columns={[{ label: "Post" }, { label: "Author", className: "hidden md:table-cell" }, { label: "Published", className: "hidden lg:table-cell" }, { label: "Status" }, { label: "", className: "text-right" }]}
        rows={posts.map((p) => {
          const canEdit = canAccessContent(profile.permissions, profile.id, p.created_by);
          return {
            id: p.id,
            status: p.status,
            search: `${p.title} ${p.slug} ${p.author} ${p.category ?? ""}`.toLowerCase(),
            cells: [
              <div key="t" className="min-w-0">
                {canEdit ? (
                  <Link href={`/admin/blogs/${p.id}`} className="font-medium text-foreground hover:text-primary hover:underline">{p.title}</Link>
                ) : (
                  <span className="font-medium text-foreground">{p.title}</span>
                )}
                <p className="truncate text-xs text-muted-foreground">{blogPostHref(p.slug)}</p>
              </div>,
              <span key="a" className="text-sm whitespace-nowrap text-muted-foreground">{p.author}</span>,
              <span key="d" className="text-sm whitespace-nowrap text-muted-foreground">{IST.format(new Date(p.published_date))}</span>,
              <PublishToggle
                key="s"
                status={p.status as "draft" | "published"}
                action={async (next) => {
                  "use server";
                  return runAction(() => toggleBlogPostStatus(p.id, p.slug, next));
                }}
              />,
              <div key="x" className="flex justify-end gap-1">
                {p.status === "published" && (
                  <a href={blogPostHref(p.slug)} target="_blank" rel="noopener noreferrer" className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground" aria-label={`View ${p.title} on the site`} title="View on site">
                    <ExternalLink size={15} />
                  </a>
                )}
                {canEdit && (
                  <LinkButton href={`/admin/blogs/${p.id}`} variant="ghost" size="icon-sm" className="text-muted-foreground">
                    <Pencil size={15} />
                    <span className="sr-only">Edit {p.title}</span>
                  </LinkButton>
                )}
                {profile.permissions.canDeleteContent && (
                  <DeleteButton
                    action={async () => {
                      "use server";
                      return runAction(() => deleteBlogPost(p.id));
                    }}
                    confirmMessage={`Delete "${p.title}"? This cannot be undone.`}
                  />
                )}
              </div>,
            ],
          };
        })}
      />
    </div>
  );
}
