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
