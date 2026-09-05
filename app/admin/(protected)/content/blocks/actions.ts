"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/db/client";
import { requirePermission } from "@/lib/auth/session";
import { logActivity } from "@/lib/auth/activity-log";

const schema = z.object({
  content_type: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9_]+$/, "Use lowercase letters, numbers and underscores only"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers and hyphens only")
    .optional()
    .or(z.literal("")),
  title: z.string().trim().min(1).max(200),
  data: z.string(), // JSON
  status: z.enum(["draft", "published"]),
  seo_meta_title: z.string().trim().max(60).optional().or(z.literal("")),
  seo_meta_description: z.string().trim().max(160).optional().or(z.literal("")),
});

export interface ContentBlockFormState {
  error?: string;
}

function parseForm(formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const d = parsed.data;
  let data: unknown = {};
  try {
    data = d.data.trim() ? JSON.parse(d.data) : {};
  } catch {
    return { ok: false as const, error: "Data must be valid JSON." };
  }
  return {
    ok: true as const,
    row: {
      content_type: d.content_type,
      slug: d.slug || null,
      title: d.title,
      data,
      status: d.status,
      seo_meta_title: d.seo_meta_title || null,
      seo_meta_description: d.seo_meta_description || null,
    },
  };
}

function revalidate() {
  revalidateTag("content-block", { expire: 0 });
  revalidatePath("/admin/content/blocks");
}

export async function createContentBlock(
  _prevState: ContentBlockFormState,
  formData: FormData
): Promise<ContentBlockFormState> {
  const profile = await requirePermission(() => true);
  const parsed = parseForm(formData);
  if (!parsed.ok) return parsed;

  const { data, error } = await supabaseAdmin
    .from("content_blocks")
    .insert({ ...parsed.row, created_by: profile.id, updated_by: profile.id })
    .select("id")
    .single();
  if (error) return { error: error.code === "23505" ? "That type + slug combination already exists." : error.message };

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: "create",
    contentType: "content_block",
    contentId: data.id,
    newValue: parsed.row,
  });

  revalidate();
  redirect("/admin/content/blocks");
}

export async function updateContentBlock(
  id: string,
  _prevState: ContentBlockFormState,
  formData: FormData
): Promise<ContentBlockFormState> {
  const profile = await requirePermission(() => true);
  const parsed = parseForm(formData);
  if (!parsed.ok) return parsed;

  const { data: previous } = await supabaseAdmin.from("content_blocks").select("*").eq("id", id).maybeSingle();
  const { error } = await supabaseAdmin
    .from("content_blocks")
    .update({ ...parsed.row, updated_by: profile.id })
    .eq("id", id);
  if (error) return { error: error.code === "23505" ? "That type + slug combination already exists." : error.message };

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: "update",
    contentType: "content_block",
    contentId: id,
    previousValue: previous,
    newValue: parsed.row,
  });

  revalidate();
  redirect("/admin/content/blocks");
}

export async function deleteContentBlock(id: string): Promise<void> {
  const profile = await requirePermission((p) => p.canDeleteContent);
  const { data: previous } = await supabaseAdmin.from("content_blocks").select("*").eq("id", id).maybeSingle();
  const { error } = await supabaseAdmin.from("content_blocks").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: "delete",
    contentType: "content_block",
    contentId: id,
    previousValue: previous,
  });

  revalidate();
}

export async function toggleContentBlockStatus(id: string, nextStatus: "draft" | "published"): Promise<void> {
  const profile = await requirePermission((p) => p.canPublish);
  const { error } = await supabaseAdmin
    .from("content_blocks")
    .update({ status: nextStatus, updated_by: profile.id })
    .eq("id", id);
  if (error) throw new Error(error.message);

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: nextStatus === "published" ? "publish" : "unpublish",
    contentType: "content_block",
    contentId: id,
  });

  revalidate();
}
