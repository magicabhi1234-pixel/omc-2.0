"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/db/client";
import { requirePermission } from "@/lib/auth/session";
import { logActivity } from "@/lib/auth/activity-log";

const universitySchema = z.object({
  name: z.string().trim().min(2).max(150),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers and hyphens only"),
  logo_url: z.string().trim().url().optional().or(z.literal("")),
  logo_alt: z.string().trim().max(200).optional().or(z.literal("")),
  featured: z.coerce.boolean().optional(),
  study_mode: z.enum(["Online", "Distance", "Online & Distance"]),
  duration: z.string().trim().min(1).max(50),
  eligibility: z.string().trim().min(1).max(500),
  starting_fee: z.string().trim().min(1).max(50),
  emi: z.string().trim().max(50).optional().or(z.literal("")),
  placement_support: z.string().trim().max(50).optional().or(z.literal("")),
  rating: z.coerce.number().min(0).max(5).optional(),
  review_count: z.coerce.number().int().min(0).optional(),
  approvals: z.string().optional(), // comma-separated
  brochure_url: z.string().trim().url().optional().or(z.literal("")),
  website_url: z.string().trim().url().optional().or(z.literal("")),
  status: z.enum(["draft", "published"]),
});

export interface UniversityFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

function parseUniversityForm(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = universitySchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { ok: false as const, error: "Please fix the highlighted fields.", fieldErrors };
  }
  const data = parsed.data;
  return {
    ok: true as const,
    row: {
      name: data.name,
      slug: data.slug,
      logo_url: data.logo_url || null,
      logo_alt: data.logo_alt || null,
      featured: data.featured ?? false,
      study_mode: data.study_mode,
      duration: data.duration,
      eligibility: data.eligibility,
      starting_fee: data.starting_fee,
      emi: data.emi || null,
      placement_support: data.placement_support || null,
      rating: data.rating ?? null,
      review_count: data.review_count ?? null,
      approvals: data.approvals
        ? data.approvals.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      brochure_url: data.brochure_url || null,
      website_url: data.website_url || null,
      status: data.status,
    },
  };
}

function revalidateUniversityConsumers() {
  // Universities are embedded (via join) into any landing page that
  // references them, so a university edit must bust the same tag a landing
  // page publish would - otherwise a page showing stale university data
  // would only refresh after the 5-minute fallback window.
  revalidateTag("landing-page", { expire: 0 });
  revalidatePath("/admin/content/universities");
}

export async function createUniversity(
  _prevState: UniversityFormState,
  formData: FormData
): Promise<UniversityFormState> {
  const profile = await requirePermission((p) => p.contentScope === "all" || true);
  const parsed = parseUniversityForm(formData);
  if (!parsed.ok) return parsed;

  const { data, error } = await supabaseAdmin
    .from("universities")
    .insert({ ...parsed.row, created_by: profile.id, updated_by: profile.id })
    .select("id")
    .single();

  if (error) {
    return { error: error.code === "23505" ? "That slug is already in use." : error.message };
  }

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: "create",
    contentType: "university",
    contentId: data.id,
    newValue: parsed.row,
  });

  revalidateUniversityConsumers();
  redirect("/admin/content/universities");
}

export async function updateUniversity(
  id: string,
  _prevState: UniversityFormState,
  formData: FormData
): Promise<UniversityFormState> {
  const profile = await requirePermission(() => true);
  const parsed = parseUniversityForm(formData);
  if (!parsed.ok) return parsed;

  const { data: previous } = await supabaseAdmin.from("universities").select("*").eq("id", id).maybeSingle();

  const { error } = await supabaseAdmin
    .from("universities")
    .update({ ...parsed.row, updated_by: profile.id })
    .eq("id", id);

  if (error) {
    return { error: error.code === "23505" ? "That slug is already in use." : error.message };
  }

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: "update",
    contentType: "university",
    contentId: id,
    previousValue: previous,
    newValue: parsed.row,
  });

  revalidateUniversityConsumers();
  redirect("/admin/content/universities");
}

export async function deleteUniversity(id: string): Promise<void> {
  const profile = await requirePermission((p) => p.canDeleteContent);
  const { data: previous } = await supabaseAdmin.from("universities").select("*").eq("id", id).maybeSingle();

  const { error } = await supabaseAdmin.from("universities").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: "delete",
    contentType: "university",
    contentId: id,
    previousValue: previous,
  });

  revalidateUniversityConsumers();
  revalidatePath("/admin/content/universities");
}

export async function toggleUniversityStatus(id: string, nextStatus: "draft" | "published"): Promise<void> {
  const profile = await requirePermission((p) => p.canPublish);
  const { error } = await supabaseAdmin
    .from("universities")
    .update({ status: nextStatus, updated_by: profile.id })
    .eq("id", id);
  if (error) throw new Error(error.message);

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: nextStatus === "published" ? "publish" : "unpublish",
    contentType: "university",
    contentId: id,
  });

  revalidateUniversityConsumers();
}
