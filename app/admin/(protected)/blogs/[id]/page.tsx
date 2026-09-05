import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/db/client";
import { requireProfile } from "@/lib/auth/session";
import { canAccessContent } from "@/lib/auth/permissions";
import BlogPostForm from "@/components/admin/blog-post-form";
import { updateBlogPost } from "../actions";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await requireProfile();

  const { data } = await supabaseAdmin.from("blog_posts").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  if (!canAccessContent(profile.permissions, profile.id, data.created_by)) notFound();

  const [{ data: otherPosts }, { data: relatedLinks }] = await Promise.all([
    supabaseAdmin.from("blog_posts").select("id, title").neq("id", id).order("title"),
    supabaseAdmin.from("blog_post_related").select("related_post_id").eq("blog_post_id", id).order("sort_order"),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Edit Blog Post</h1>
      <div className="mt-6">
        <BlogPostForm
          action={updateBlogPost.bind(null, id)}
          initial={data}
          otherPosts={otherPosts ?? []}
          initialRelatedIds={(relatedLinks ?? []).map((r) => r.related_post_id)}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
