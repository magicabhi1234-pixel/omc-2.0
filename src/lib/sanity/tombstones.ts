import "server-only";
import { supabaseAdmin } from "@/lib/db/client";

export type TombstoneType = "landing_page" | "blog_post" | "university" | "testimonial";

/** Records that an editor deleted this item, so the Sanity fallback/sync never brings it back. Never throws. */
export async function recordTombstone(type: TombstoneType, naturalKey: string | null | undefined, deletedBy: string) {
  if (!naturalKey) return;
  const { error } = await supabaseAdmin
    .from("cms_tombstones")
    .upsert({ content_type: type, natural_key: naturalKey, deleted_by: deletedBy, deleted_at: new Date().toISOString() });
  if (error) console.error("[tombstone] not recorded (is migration 0004 applied?):", type, naturalKey, error.message);
}

/** Clears a tombstone when the same item is deliberately re-created in the dashboard. */
export async function clearTombstone(type: TombstoneType, naturalKey: string | null | undefined) {
  if (!naturalKey) return;
  await supabaseAdmin.from("cms_tombstones").delete().eq("content_type", type).eq("natural_key", naturalKey);
}

export async function isTombstoned(type: TombstoneType, naturalKey: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from("cms_tombstones")
    .select("natural_key")
    .eq("content_type", type)
    .eq("natural_key", naturalKey)
    .maybeSingle();
  // Table missing (0004 not applied) => no tombstones recorded yet.
  return !error && Boolean(data);
}

export async function tombstonedKeys(type: TombstoneType): Promise<Set<string>> {
  const { data, error } = await supabaseAdmin.from("cms_tombstones").select("natural_key").eq("content_type", type);
  return new Set(error ? [] : (data ?? []).map((r) => r.natural_key as string));
}
