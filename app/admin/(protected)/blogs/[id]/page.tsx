import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { blogPostHref } from "@/lib/blog-links";
import { supabaseAdmin } from "@/lib/db/client";
import { requireProfile } from "@/lib/auth/session";
import { canAccessContent } from "@/lib/auth/permissions";
import BlogPostForm from "@/components/admin/blog-post-form";
import { updateBlogPost } from "../actions";
import { PageHeader } from "@/components/admin/page-kit";

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
      <PageHeader
        eyebrow="Blog post"
        title={data.title}
        description={<>{blogPostHref(data.slug)} · {data.status === "published" ? "Published" : "Draft"}</>}
        actions={
          data.status === "published" ? (
            <a href={blogPostHref(data.slug)} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "outline" })}>
              <ExternalLink size={15} /> View live
            </a>
          ) : null
        }
      />
      <div>
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
