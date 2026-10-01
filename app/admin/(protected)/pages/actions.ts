"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { urlOrPath } from "@/lib/admin/validators";
import { supabaseAdmin } from "@/lib/db/client";
import { contentAccessError, requirePermission } from "@/lib/auth/session";
import { logActivity } from "@/lib/auth/activity-log";
import { clearTombstone, recordTombstone } from "@/lib/sanity/tombstones";

const CATEGORIES = [
  "Online MBA",
  "Distance MBA",
  "MBA Specializations",
  "Executive MBA",
  "University Pages",
  "Bachelor Programs",
] as const;

const landingPageSchema = z.object({
  title: z.string().trim().min(2).max(200),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers and hyphens only"),
  category: z.enum(CATEGORIES),
  region: z.enum(["north", "south", "east", "west", "none"]).optional(),
  status: z.enum(["draft", "published"]),
  hero: z.string(), // JSON
  university_section: z.string(), // JSON
  compare_section: z.string(), // JSON
  why_choose: z.string(), // JSON
  stats: z.string(), // JSON
  specializations: z.string(), // JSON
  benefits: z.string(), // JSON
  career_scope: z.string(), // JSON
  highlight_banner: z.string(), // JSON
  faq: z.string(), // JSON
  testimonials_heading: z.string().trim().max(100).optional().or(z.literal("")),
  cta: z.string(), // JSON
  universities: z.string().optional(), // comma-separated ids
  testimonials: z.string().optional(), // comma-separated ids
  seo_meta_title: z.string().trim().max(60).optional().or(z.literal("")),
  seo_meta_description: z.string().trim().max(160).optional().or(z.literal("")),
  seo_keywords: z.string().optional(),
  seo_canonical_url: z.string().trim().url().optional().or(z.literal("")),
  seo_og_image_url: urlOrPath.optional().or(z.literal("")),
  seo_no_index: z.coerce.boolean().optional(),
});

export interface LandingPageFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

function tryParseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function parseForm(formData: FormData) {
  const parsed = landingPageSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
    return { ok: false as const, error: "Please fix the highlighted fields.", fieldErrors };
  }
  const d = parsed.data;

  const universityIds = d.universities ? d.universities.split(",").map((s) => s.trim()).filter(Boolean) : [];
  if (universityIds.length === 0) {
    return {
      ok: false as const,
      error: "Select at least one university.",
      fieldErrors: { universities: "Required" },
    };
  }

  return {
    ok: true as const,
    row: {
      title: d.title,
      slug: d.slug,
      category: d.category,
      region: d.region || "none",
      status: d.status,
      hero: tryParseJson(d.hero, {}),
      university_section: tryParseJson(d.university_section, {}),
      compare_section: tryParseJson(d.compare_section, null),
      why_choose: tryParseJson(d.why_choose, null),
      stats: tryParseJson(d.stats, null),
      specializations: tryParseJson(d.specializations, null),
      benefits: tryParseJson(d.benefits, null),
      career_scope: tryParseJson(d.career_scope, null),
      highlight_banner: tryParseJson(d.highlight_banner, null),
      faq: tryParseJson(d.faq, null),
      testimonials_heading: d.testimonials_heading || "What Our Students Say",
      cta: tryParseJson(d.cta, {}),
      seo_meta_title: d.seo_meta_title || null,
      seo_meta_description: d.seo_meta_description || null,
      seo_keywords: d.seo_keywords ? d.seo_keywords.split(",").map((s) => s.trim()).filter(Boolean) : null,
      seo_canonical_url: d.seo_canonical_url || null,
      seo_og_image_url: d.seo_og_image_url || null,
      seo_no_index: d.seo_no_index ?? false,
    },
    universityIds,
    testimonialIds: d.testimonials ? d.testimonials.split(",").map((s) => s.trim()).filter(Boolean) : [],
  };
}

async function syncLinks(
  pageId: string,
  universityIds: string[],
  testimonialIds: string[]
) {
  await supabaseAdmin.from("landing_page_universities").delete().eq("landing_page_id", pageId);
  await supabaseAdmin.from("landing_page_testimonials").delete().eq("landing_page_id", pageId);

  if (universityIds.length > 0) {
    await supabaseAdmin.from("landing_page_universities").insert(
      universityIds.map((university_id, index) => ({ landing_page_id: pageId, university_id, sort_order: index }))
    );
  }
  if (testimonialIds.length > 0) {
    await supabaseAdmin.from("landing_page_testimonials").insert(
      testimonialIds.map((testimonial_id, index) => ({ landing_page_id: pageId, testimonial_id, sort_order: index }))
    );
  }
}

function revalidateLandingPageConsumers(slug?: string) {
  revalidateTag("landing-page", { expire: 0 });
  if (slug) revalidateTag(`landing-page:${slug}`, { expire: 0 });
  revalidatePath("/admin/pages");
}

export async function createLandingPage(
  _prevState: LandingPageFormState,
  formData: FormData
): Promise<LandingPageFormState> {
  const profile = await requirePermission(() => true);
  const parsed = parseForm(formData);
  if (!parsed.ok) return parsed;

  const { data, error } = await supabaseAdmin
    .from("landing_pages")
    .insert({ ...parsed.row, created_by: profile.id, updated_by: profile.id })
    .select("id")
    .single();

  if (error) {
    return { error: error.code === "23505" ? "That slug is already in use." : error.message };
  }

  await syncLinks(data.id, parsed.universityIds, parsed.testimonialIds);

  await clearTombstone("landing_page", parsed.row.slug);

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: "create",
    contentType: "landing_page",
    contentId: data.id,
    newValue: parsed.row,
  });

  revalidateLandingPageConsumers(parsed.row.slug);
  redirect("/admin/pages");
}

export async function updateLandingPage(
  id: string,
  _prevState: LandingPageFormState,
  formData: FormData
): Promise<LandingPageFormState> {
  const profile = await requirePermission(() => true);
  const accessError = await contentAccessError(profile, "landing_pages", id);
  if (accessError) return { error: accessError };
  const parsed = parseForm(formData);
  if (!parsed.ok) return parsed;

  const { data: previous } = await supabaseAdmin.from("landing_pages").select("*").eq("id", id).maybeSingle();

  const { error } = await supabaseAdmin
    .from("landing_pages")
    .update({ ...parsed.row, updated_by: profile.id })
    .eq("id", id);

  if (error) {
    return { error: error.code === "23505" ? "That slug is already in use." : error.message };
  }

  await syncLinks(id, parsed.universityIds, parsed.testimonialIds);

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: "update",
    contentType: "landing_page",
    contentId: id,
    previousValue: previous,
    newValue: parsed.row,
  });

  revalidateLandingPageConsumers(parsed.row.slug);
  if (previous && previous.slug !== parsed.row.slug) revalidateLandingPageConsumers(previous.slug);
  redirect("/admin/pages");
}

export async function deleteLandingPage(id: string): Promise<void> {
  const profile = await requirePermission((p) => p.canDeleteContent);
  const { data: previous } = await supabaseAdmin.from("landing_pages").select("*").eq("id", id).maybeSingle();

  const { error } = await supabaseAdmin.from("landing_pages").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await recordTombstone("landing_page", previous?.slug, profile.id);

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: "delete",
    contentType: "landing_page",
    contentId: id,
    previousValue: previous,
  });

  revalidateLandingPageConsumers(previous?.slug);
}

export async function toggleLandingPageStatus(
  id: string,
  slug: string,
  nextStatus: "draft" | "published"
): Promise<void> {
  const profile = await requirePermission((p) => p.canPublish);
  const accessError = await contentAccessError(profile, "landing_pages", id);
  if (accessError) throw new Error(accessError);
  const { error } = await supabaseAdmin
    .from("landing_pages")
    .update({ status: nextStatus, updated_by: profile.id })
    .eq("id", id);
  if (error) throw new Error(error.message);

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: nextStatus === "published" ? "publish" : "unpublish",
    contentType: "landing_page",
    contentId: id,
  });

  revalidateLandingPageConsumers(slug);
}
