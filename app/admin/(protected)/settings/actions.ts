"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/db/client";
import { requirePermission } from "@/lib/auth/session";
import { logActivity } from "@/lib/auth/activity-log";
import { MENU_KEYS, SETTINGS_GROUPS, type SettingsGroup } from "@/lib/site-settings";

export interface SettingsFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: boolean;
}

/** Saves one settings group (site_info | branding | social_links | tracking). */
export async function saveSettingsGroup(
  group: SettingsGroup,
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const profile = await requirePermission((p) => p.canManageSettings);
  const schema = SETTINGS_GROUPS[group];
  if (!schema) return { error: "Unknown settings group." };

  // Only keys the schema knows about; empty inputs are stored as "" so the
  // public site falls back to its defaults for them.
  const raw = Object.fromEntries(
    Object.keys(schema.shape).map((key) => [key, String(formData.get(key) ?? "").trim()])
  );
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
    return { error: "Please fix the highlighted fields.", fieldErrors };
  }
  // Persist what the editor typed (blank stays blank), validated above.
  const value = raw;

  const { data: previous } = await supabaseAdmin.from("site_settings").select("value").eq("key", group).maybeSingle();
  const { error } = await supabaseAdmin
    .from("site_settings")
    .upsert({ key: group, value, updated_by: profile.id }, { onConflict: "key" });
  if (error) return { error: error.message };

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: "update",
    contentType: "settings",
    contentId: group,
    previousValue: previous?.value ?? null,
    newValue: value,
  });

  revalidateTag("settings", { expire: 0 });
  revalidatePath("/admin/settings");
  return { success: true };
}

const navItemSchema = z.object({
  label: z.string().trim().min(1, "Every link needs a label").max(60),
  href: z
    .string()
    .trim()
    .max(500)
    .refine((v) => /^\/[^\s]*$/.test(v) || /^https?:\/\/[^\s]+$/.test(v) || /^(mailto|tel):[^\s]+$/.test(v), {
      message: "Links must start with /, https://, mailto: or tel:",
    }),
  opens_new_tab: z.boolean().optional().default(false),
});

export async function saveNavigationItems(
  menuKey: string,
  items: { label: string; href: string; opens_new_tab?: boolean }[]
): Promise<{ error?: string }> {
  const profile = await requirePermission((p) => p.canManageSettings);
  if (!(menuKey in MENU_KEYS)) return { error: "Unknown menu." };
  const parsed = z.array(navItemSchema).max(30, "A menu can have at most 30 links").safeParse(items);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid menu items." };

  const { data: previous } = await supabaseAdmin
    .from("navigation_items")
    .select("label, href, opens_new_tab, sort_order")
    .eq("menu_key", menuKey)
    .order("sort_order");

  const { error: deleteError } = await supabaseAdmin.from("navigation_items").delete().eq("menu_key", menuKey);
  if (deleteError) return { error: deleteError.message };
  if (parsed.data.length > 0) {
    const { error } = await supabaseAdmin.from("navigation_items").insert(
      parsed.data.map((item, index) => ({
        menu_key: menuKey,
        label: item.label,
        href: item.href,
        sort_order: index,
        is_external: /^https?:\/\//.test(item.href),
        opens_new_tab: item.opens_new_tab,
      }))
    );
    if (error) {
      // Put the previous menu back so a failed save never leaves it empty.
      if (previous?.length) {
        await supabaseAdmin
          .from("navigation_items")
          .insert(previous.map((p) => ({ ...p, menu_key: menuKey, is_external: /^https?:\/\//.test(p.href) })));
      }
      return { error: error.message };
    }
  }

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: "update",
    contentType: "navigation",
    contentId: menuKey,
    previousValue: previous,
    newValue: parsed.data,
  });

  revalidateTag("navigation", { expire: 0 });
  revalidatePath("/admin/menus");
  return {};
}
