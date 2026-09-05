import { Plus } from "lucide-react";
import { supabaseAdmin } from "@/lib/db/client";
import { requireProfile } from "@/lib/auth/session";
import { canAccessContent } from "@/lib/auth/permissions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LinkButton from "@/components/admin/link-button";
import PublishToggle from "@/components/admin/publish-toggle";
import DeleteButton from "@/components/admin/delete-button";
import { deleteBlogPost, toggleBlogPostStatus } from "./actions";

export default async function BlogsListPage() {
  const profile = await requireProfile();

  const { data } = await supabaseAdmin
    .from("blog_posts")
    .select("id, title, slug, author, status, published_date, created_by")
    .order("published_date", { ascending: false });

  const posts = data ?? [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Blog Posts</h1>
          <p className="mt-1 text-slate-600">{posts.length} total</p>
        </div>
        <LinkButton href="/admin/blogs/new"><Plus size={16} className="mr-2" /> New Post</LinkButton>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((p) => {
              const canEdit = canAccessContent(profile.permissions, profile.id, p.created_by);
              return (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.title}</TableCell>
                  <TableCell className="text-slate-500">/blog/{p.slug}</TableCell>
                  <TableCell>{p.author}</TableCell>
                  <TableCell>{new Date(p.published_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <PublishToggle
                      status={p.status as "draft" | "published"}
                      action={async (next) => {
                        "use server";
                        await toggleBlogPostStatus(p.id, p.slug, next);
                      }}
                    />
                  </TableCell>
                  <TableCell className="flex justify-end gap-1">
                    {canEdit && (
                      <LinkButton href={`/admin/blogs/${p.id}`} variant="ghost" size="sm">Edit</LinkButton>
                    )}
                    {profile.permissions.canDeleteContent && (
                      <DeleteButton
                        action={async () => {
                          "use server";
                          await deleteBlogPost(p.id);
                        }}
                        confirmMessage={`Delete "${p.title}"? This cannot be undone.`}
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {posts.length === 0 && <p className="p-8 text-center text-sm text-slate-500">No blog posts yet.</p>}
      </div>
    </div>
  );
}
