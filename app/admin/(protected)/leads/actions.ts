"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/db/client";
import { requirePermission } from "@/lib/auth/session";
import { logActivity } from "@/lib/auth/activity-log";
import { LEAD_STATUSES } from "@/lib/admin/leads";

const idSchema = z.string().uuid();
const statusSchema = z.enum(LEAD_STATUSES);
const notesSchema = z.string().trim().max(2000);

export async function updateLeadStatus(id: string, status: string): Promise<void> {
  const profile = await requirePermission((p) => p.canManageLeads);
  const leadId = idSchema.parse(id);
  const next = statusSchema.parse(status);

  const { data: previous } = await supabaseAdmin.from("leads").select("status").eq("id", leadId).maybeSingle();
  const { error } = await supabaseAdmin.from("leads").update({ status: next }).eq("id", leadId);
  if (error) throw new Error(error.message);

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: "update",
    contentType: "lead",
    contentId: leadId,
    previousValue: previous,
    newValue: { status: next },
  });
  revalidatePath("/admin/leads");
}

export async function updateLeadNotes(id: string, notes: string): Promise<void> {
  const profile = await requirePermission((p) => p.canManageLeads);
  const leadId = idSchema.parse(id);
  const value = notesSchema.parse(notes);

  const { error } = await supabaseAdmin.from("leads").update({ notes: value || null }).eq("id", leadId);
  if (error) throw new Error(error.message);

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: "update",
    contentType: "lead",
    contentId: leadId,
    newValue: { notes: value },
  });
  revalidatePath("/admin/leads");
}

export async function deleteLead(id: string): Promise<void> {
  const profile = await requirePermission((p) => p.canManageLeads && p.canDeleteContent);
  const leadId = idSchema.parse(id);

  const { data: previous } = await supabaseAdmin.from("leads").select("*").eq("id", leadId).maybeSingle();
  const { error } = await supabaseAdmin.from("leads").delete().eq("id", leadId);
  if (error) throw new Error(error.message);

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: "delete",
    contentType: "lead",
    contentId: leadId,
    previousValue: previous,
  });
  revalidatePath("/admin/leads");
}

export async function deleteSubscriber(id: string): Promise<void> {
  const profile = await requirePermission((p) => p.canManageLeads && p.canDeleteContent);
  const subscriberId = idSchema.parse(id);

  const { data: previous } = await supabaseAdmin
    .from("newsletter_subscribers")
    .select("*")
    .eq("id", subscriberId)
    .maybeSingle();
  const { error } = await supabaseAdmin.from("newsletter_subscribers").delete().eq("id", subscriberId);
  if (error) throw new Error(error.message);

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: "delete",
    contentType: "newsletter_subscriber",
    contentId: subscriberId,
    previousValue: previous,
  });
  revalidatePath("/admin/leads");
}

const bulkIdsSchema = z.array(z.string().uuid()).min(1).max(500);

/** Sets the status of many leads at once (one UPDATE, one audit entry). */
export async function bulkUpdateLeadStatus(ids: string[], status: string): Promise<{ error?: string; updated?: number }> {
  const profile = await requirePermission((p) => p.canManageLeads);
  const parsedIds = bulkIdsSchema.safeParse(ids);
  const next = statusSchema.safeParse(status);
  if (!parsedIds.success || !next.success) return { error: "Invalid selection." };

  const { error, count } = await supabaseAdmin.from("leads").update({ status: next.data }, { count: "exact" }).in("id", parsedIds.data);
  if (error) return { error: error.message };

  await logActivity({ userId: profile.id, userEmail: profile.email, action: "update", contentType: "lead", contentId: `${parsedIds.data.length} leads`, newValue: { ids: parsedIds.data, status: next.data } });
  revalidatePath("/admin/leads");
  return { updated: count ?? parsedIds.data.length };
}

/** Deletes many leads at once. Requires delete permission as well as lead access. */
export async function bulkDeleteLeads(ids: string[]): Promise<{ error?: string; deleted?: number }> {
  const profile = await requirePermission((p) => p.canManageLeads && p.canDeleteContent);
  const parsedIds = bulkIdsSchema.safeParse(ids);
  if (!parsedIds.success) return { error: "Invalid selection." };

  const { data: previous } = await supabaseAdmin.from("leads").select("*").in("id", parsedIds.data);
  const { error, count } = await supabaseAdmin.from("leads").delete({ count: "exact" }).in("id", parsedIds.data);
  if (error) return { error: error.message };

  await logActivity({ userId: profile.id, userEmail: profile.email, action: "delete", contentType: "lead", contentId: `${parsedIds.data.length} leads`, previousValue: previous });
  revalidatePath("/admin/leads");
  return { deleted: count ?? parsedIds.data.length };
}
