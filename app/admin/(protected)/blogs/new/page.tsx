import { supabaseAdmin } from "@/lib/db/client";
import BlogPostForm from "@/components/admin/blog-post-form";
import { createBlogPost } from "../actions";
import { PageHeader } from "@/components/admin/page-kit";

export default async function NewBlogPostPage() {
  const { data } = await supabaseAdmin.from("blog_posts").select("id, title").order("title");

  return (
    <div>
      <PageHeader title="New Blog Post" />
      <div>
        <BlogPostForm action={createBlogPost} otherPosts={data ?? []} submitLabel="Create Post" />
      </div>
    </div>
  );
}
