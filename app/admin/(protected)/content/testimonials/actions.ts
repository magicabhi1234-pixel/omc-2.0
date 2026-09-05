"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/db/client";
import { requirePermission } from "@/lib/auth/session";
import { logActivity } from "@/lib/auth/activity-log";

const testimonialSchema = z.object({
  name: z.string().trim().min(2).max(150),
  designation: z.string().trim().max(150).optional().or(z.literal("")),
  university: z.string().trim().max(150).optional().or(z.literal("")),
  image_url: z.string().trim().url().optional().or(z.literal("")),
  review: z.string().trim().min(10).max(2000),
  rating: z.coerce.number().int().min(1).max(5),
  status: z.enum(["draft", "published"]),
});

export interface TestimonialFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

function parseForm(formData: FormData) {
  const parsed = testimonialSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
    return { ok: false as const, error: "Please fix the highlighted fields.", fieldErrors };
  }
  const d = parsed.data;
  return {
    ok: true as const,
    row: {
      name: d.name,
      designation: d.designation || null,
      university: d.university || null,
      image_url: d.image_url || null,
      review: d.review,
      rating: d.rating,
      status: d.status,
    },
  };
}

function revalidateTestimonialConsumers() {
  revalidateTag("testimonial", { expire: 0 });
  revalidateTag("landing-page", { expire: 0 }); // pages showing sitewide-default testimonials
  revalidatePath("/admin/content/testimonials");
}

export async function createTestimonial(
  _prevState: TestimonialFormState,
  formData: FormData
): Promise<TestimonialFormState> {
  const profile = await requirePermission(() => true);
  const parsed = parseForm(formData);
  if (!parsed.ok) return parsed;

  const { data, error } = await supabaseAdmin
    .from("testimonials")
    .insert({ ...parsed.row, created_by: profile.id, updated_by: profile.id })
    .select("id")
    .single();
  if (error) return { error: error.message };

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: "create",
    contentType: "testimonial",
    contentId: data.id,
    newValue: parsed.row,
  });

  revalidateTestimonialConsumers();
  redirect("/admin/content/testimonials");
}

export async function updateTestimonial(
  id: string,
  _prevState: TestimonialFormState,
  formData: FormData
): Promise<TestimonialFormState> {
  const profile = await requirePermission(() => true);
  const parsed = parseForm(formData);
  if (!parsed.ok) return parsed;

  const { data: previous } = await supabaseAdmin.from("testimonials").select("*").eq("id", id).maybeSingle();
  const { error } = await supabaseAdmin
    .from("testimonials")
    .update({ ...parsed.row, updated_by: profile.id })
    .eq("id", id);
  if (error) return { error: error.message };

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: "update",
    contentType: "testimonial",
    contentId: id,
    previousValue: previous,
    newValue: parsed.row,
  });

  revalidateTestimonialConsumers();
  redirect("/admin/content/testimonials");
}

export async function deleteTestimonial(id: string): Promise<void> {
  const profile = await requirePermission((p) => p.canDeleteContent);
  const { data: previous } = await supabaseAdmin.from("testimonials").select("*").eq("id", id).maybeSingle();
  const { error } = await supabaseAdmin.from("testimonials").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: "delete",
    contentType: "testimonial",
    contentId: id,
    previousValue: previous,
  });

  revalidateTestimonialConsumers();
}

export async function toggleTestimonialStatus(id: string, nextStatus: "draft" | "published"): Promise<void> {
  const profile = await requirePermission((p) => p.canPublish);
  const { error } = await supabaseAdmin
    .from("testimonials")
    .update({ status: nextStatus, updated_by: profile.id })
    .eq("id", id);
  if (error) throw new Error(error.message);

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: nextStatus === "published" ? "publish" : "unpublish",
    contentType: "testimonial",
    contentId: id,
  });

  revalidateTestimonialConsumers();
}
