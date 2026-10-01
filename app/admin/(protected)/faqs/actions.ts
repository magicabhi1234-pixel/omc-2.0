"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/db/client";
import { requirePermission } from "@/lib/auth/session";
import { logActivity } from "@/lib/auth/activity-log";
import { FAQ_PLACEMENTS } from "@/lib/site-settings";

type Result = { error?: string; id?: string };

const placementSchema = z.enum(Object.keys(FAQ_PLACEMENTS) as [string, ...string[]]);
const faqSchema = z.object({
  question: z.string().trim().min(5, "Question is too short").max(300),
  answer: z.string().trim().min(10, "Answer is too short").max(3000),
  placement: placementSchema,
  status: z.enum(["draft", "published"]),
});

function revalidateFaqs() {
  revalidateTag("faq", { expire: 0 });
  revalidatePath("/admin/faqs");
}

export async function saveFaq(id: string | null, input: z.input<typeof faqSchema>): Promise<Result> {
  const profile = await requirePermission((p) => p.canPublish);
  const parsed = faqSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid FAQ." };

  if (id) {
    if (!z.string().uuid().safeParse(id).success) return { error: "Invalid FAQ." };
    const { data: previous } = await supabaseAdmin.from("faqs").select("*").eq("id", id).maybeSingle();
    if (!previous) return { error: "FAQ not found." };
    const { error } = await supabaseAdmin.from("faqs").update({ ...parsed.data, updated_by: profile.id }).eq("id", id);
    if (error) return { error: error.message };
    await logActivity({ userId: profile.id, userEmail: profile.email, action: "update", contentType: "faq", contentId: id, previousValue: previous, newValue: parsed.data });
    revalidateFaqs();
    return { id };
  }

  const { data: last } = await supabaseAdmin
    .from("faqs")
    .select("sort_order")
    .eq("placement", parsed.data.placement)
    .order("sort_order", { ascending: false })
    .limit(1);
  const { data, error } = await supabaseAdmin
    .from("faqs")
    .insert({ ...parsed.data, sort_order: (last?.[0]?.sort_order ?? -1) + 1, created_by: profile.id, updated_by: profile.id })
    .select("id")
    .single();
  if (error) return { error: error.message };
  await logActivity({ userId: profile.id, userEmail: profile.email, action: "create", contentType: "faq", contentId: data.id, newValue: parsed.data });
  revalidateFaqs();
  return { id: data.id };
}

export async function deleteFaq(id: string): Promise<Result> {
  const profile = await requirePermission((p) => p.canDeleteContent);
  if (!z.string().uuid().safeParse(id).success) return { error: "Invalid FAQ." };
  const { data: previous } = await supabaseAdmin.from("faqs").select("*").eq("id", id).maybeSingle();
  const { error } = await supabaseAdmin.from("faqs").delete().eq("id", id);
  if (error) return { error: error.message };
  await logActivity({ userId: profile.id, userEmail: profile.email, action: "delete", contentType: "faq", contentId: id, previousValue: previous });
  revalidateFaqs();
  return {};
}

/** Persists a new order for one placement's FAQs. */
export async function reorderFaqs(placement: string, orderedIds: string[]): Promise<Result> {
  const profile = await requirePermission((p) => p.canPublish);
  if (!placementSchema.safeParse(placement).success) return { error: "Invalid page." };
  const ids = z.array(z.string().uuid()).max(200).safeParse(orderedIds);
  if (!ids.success) return { error: "Invalid order." };

  for (const [index, id] of ids.data.entries()) {
    const { error } = await supabaseAdmin.from("faqs").update({ sort_order: index }).eq("id", id).eq("placement", placement);
    if (error) return { error: error.message };
  }
  await logActivity({ userId: profile.id, userEmail: profile.email, action: "update", contentType: "faq", contentId: placement, newValue: { order: ids.data } });
  revalidateFaqs();
  return {};
}
