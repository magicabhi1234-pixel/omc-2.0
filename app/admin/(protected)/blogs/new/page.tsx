import { supabaseAdmin } from "@/lib/db/client";
import BlogPostForm from "@/components/admin/blog-post-form";
import { createBlogPost } from "../actions";

export default async function NewBlogPostPage() {
  const { data } = await supabaseAdmin.from("blog_posts").select("id, title").order("title");

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">New Blog Post</h1>
      <div className="mt-6">
        <BlogPostForm action={createBlogPost} otherPosts={data ?? []} submitLabel="Create Post" />
      </div>
    </div>
  );
}
