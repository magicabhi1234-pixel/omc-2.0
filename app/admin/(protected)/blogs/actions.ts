"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { urlOrPath } from "@/lib/admin/validators";
import { supabaseAdmin } from "@/lib/db/client";
import { contentAccessError, requirePermission } from "@/lib/auth/session";
import { logActivity } from "@/lib/auth/activity-log";
import { canAccessContent } from "@/lib/auth/permissions";

const blogPostSchema = z.object({
  title: z.string().trim().min(2).max(200),
  h1: z.string().trim().max(200).optional().or(z.literal("")),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers and hyphens only"),
  featured_image_url: urlOrPath,
  featured_image_alt: z.string().trim().min(1).max(200),
  excerpt: z.string().trim().min(1).max(300),
  content: z.string(), // JSON-stringified Portable Text block array
  author: z.string().trim().min(1).max(100),
  published_date: z.string().trim().min(1).refine((v) => !Number.isNaN(Date.parse(v)), "Enter a valid date"),
  category: z.string().trim().max(100).optional().or(z.literal("")),
  tags: z.string().optional(), // comma-separated
  faqs: z.string(), // JSON-stringified [{question, answer}]
  related_posts: z.string().optional(), // comma-separated post ids
  seo_meta_title: z.string().trim().max(60).optional().or(z.literal("")),
  seo_meta_description: z.string().trim().max(160).optional().or(z.literal("")),
  seo_keywords: z.string().optional(),
  seo_canonical_url: z.string().trim().url().optional().or(z.literal("")),
  seo_og_image_url: urlOrPath.optional().or(z.literal("")),
  seo_no_index: z.coerce.boolean().optional(),
  status: z.enum(["draft", "published"]),
});

export interface BlogPostFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

function parseForm(formData: FormData) {
  const parsed = blogPostSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
    return { ok: false as const, error: "Please fix the highlighted fields.", fieldErrors };
  }
  const d = parsed.data;

  let content: unknown[] = [];
  let faqs: { question: string; answer: string }[] = [];
  try {
    content = JSON.parse(d.content);
    faqs = JSON.parse(d.faqs);
  } catch {
    return { ok: false as const, error: "Content or FAQ data was malformed - please try again." };
  }

  const relatedIds = d.related_posts
    ? d.related_posts.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return {
    ok: true as const,
    row: {
      title: d.title,
      h1: d.h1 || null,
      slug: d.slug,
      featured_image_url: d.featured_image_url,
      featured_image_alt: d.featured_image_alt,
      excerpt: d.excerpt,
      content,
      author: d.author,
      published_date: new Date(d.published_date).toISOString(),
      category: d.category || null,
      tags: d.tags ? d.tags.split(",").map((s) => s.trim()).filter(Boolean) : [],
      faqs,
      seo_meta_title: d.seo_meta_title || null,
      seo_meta_description: d.seo_meta_description || null,
      seo_keywords: d.seo_keywords ? d.seo_keywords.split(",").map((s) => s.trim()).filter(Boolean) : null,
      seo_canonical_url: d.seo_canonical_url || null,
      seo_og_image_url: d.seo_og_image_url || null,
      seo_no_index: d.seo_no_index ?? false,
      status: d.status,
    },
    relatedIds,
  };
}

async function syncRelatedPosts(postId: string, relatedIds: string[]) {
  await supabaseAdmin.from("blog_post_related").delete().eq("blog_post_id", postId);
  if (relatedIds.length > 0) {
    await supabaseAdmin.from("blog_post_related").insert(
      relatedIds.slice(0, 6).map((relatedId, index) => ({
        blog_post_id: postId,
        related_post_id: relatedId,
        sort_order: index,
      }))
    );
  }
}

function revalidateBlogConsumers(slug?: string) {
  revalidateTag("blog", { expire: 0 });
  if (slug) revalidateTag(`blog:${slug}`, { expire: 0 });
  revalidatePath("/admin/blogs");
}

export async function createBlogPost(
  _prevState: BlogPostFormState,
  formData: FormData
): Promise<BlogPostFormState> {
  const profile = await requirePermission(() => true);
  const parsed = parseForm(formData);
  if (!parsed.ok) return parsed;

  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .insert({ ...parsed.row, created_by: profile.id, updated_by: profile.id })
    .select("id")
    .single();

  if (error) {
    return { error: error.code === "23505" ? "That slug is already in use." : error.message };
  }

  await syncRelatedPosts(data.id, parsed.relatedIds);

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: "create",
    contentType: "blog_post",
    contentId: data.id,
    newValue: parsed.row,
  });

  revalidateBlogConsumers(parsed.row.slug);
  redirect("/admin/blogs");
}

export async function updateBlogPost(
  id: string,
  _prevState: BlogPostFormState,
  formData: FormData
): Promise<BlogPostFormState> {
  const profile = await requirePermission(() => true);

  const { data: previous } = await supabaseAdmin.from("blog_posts").select("*").eq("id", id).maybeSingle();
  if (!previous) return { error: "Post not found." };
  if (!canAccessContent(profile.permissions, profile.id, previous.created_by)) {
    return { error: "You don't have permission to edit this post." };
  }

  const parsed = parseForm(formData);
  if (!parsed.ok) return parsed;

  const { error } = await supabaseAdmin
    .from("blog_posts")
    .update({ ...parsed.row, updated_by: profile.id })
    .eq("id", id);

  if (error) {
    return { error: error.code === "23505" ? "That slug is already in use." : error.message };
  }

  await syncRelatedPosts(id, parsed.relatedIds);

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: "update",
    contentType: "blog_post",
    contentId: id,
    previousValue: previous,
    newValue: parsed.row,
  });

  revalidateBlogConsumers(parsed.row.slug);
  if (previous.slug !== parsed.row.slug) revalidateBlogConsumers(previous.slug);
  redirect("/admin/blogs");
}

export async function deleteBlogPost(id: string): Promise<void> {
  const profile = await requirePermission((p) => p.canDeleteContent);
  const { data: previous } = await supabaseAdmin.from("blog_posts").select("*").eq("id", id).maybeSingle();

  const { error } = await supabaseAdmin.from("blog_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: "delete",
    contentType: "blog_post",
    contentId: id,
    previousValue: previous,
  });

  revalidateBlogConsumers(previous?.slug);
}

export async function toggleBlogPostStatus(
  id: string,
  slug: string,
  nextStatus: "draft" | "published"
): Promise<void> {
  const profile = await requirePermission((p) => p.canPublish);
  const accessError = await contentAccessError(profile, "blog_posts", id);
  if (accessError) throw new Error(accessError);
  const { error } = await supabaseAdmin
    .from("blog_posts")
    .update({ status: nextStatus, updated_by: profile.id })
    .eq("id", id);
  if (error) throw new Error(error.message);

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: nextStatus === "published" ? "publish" : "unpublish",
    contentType: "blog_post",
    contentId: id,
  });

  revalidateBlogConsumers(slug);
}
