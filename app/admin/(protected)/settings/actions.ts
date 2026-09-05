"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/db/client";
import { requirePermission } from "@/lib/auth/session";
import { logActivity } from "@/lib/auth/activity-log";

const siteInfoSchema = z.object({
  site_name: z.string().trim().min(1),
  tagline: z.string().trim().optional().or(z.literal("")),
  email: z.string().trim().email(),
  phone: z.string().trim().min(1),
  footer_about: z.string().trim().optional().or(z.literal("")),
  footer_hours: z.string().trim().optional().or(z.literal("")),
});

export interface SettingsFormState {
  error?: string;
  success?: boolean;
}

export async function saveSiteInfo(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const profile = await requirePermission((p) => p.canManageSettings);
  const parsed = siteInfoSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const { error } = await supabaseAdmin
    .from("site_settings")
    .upsert({ key: "site_info", value: parsed.data, updated_by: profile.id }, { onConflict: "key" });
  if (error) return { error: error.message };

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: "update",
    contentType: "settings",
    contentId: "site_info",
    newValue: parsed.data,
  });

  revalidateTag("settings", { expire: 0 });
  revalidatePath("/admin/settings");
  return { success: true };
}

export async function saveNavigationItems(menuKey: string, items: { label: string; href: string }[]): Promise<void> {
  const profile = await requirePermission((p) => p.canManageSettings);

  await supabaseAdmin.from("navigation_items").delete().eq("menu_key", menuKey);
  if (items.length > 0) {
    await supabaseAdmin.from("navigation_items").insert(
      items.map((item, index) => ({
        menu_key: menuKey,
        label: item.label,
        href: item.href,
        sort_order: index,
        is_external: /^https?:\/\//.test(item.href),
      }))
    );
  }

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: "update",
    contentType: "navigation",
    contentId: menuKey,
    newValue: items,
  });

  revalidateTag("navigation", { expire: 0 });
  revalidatePath("/admin/settings");
}
