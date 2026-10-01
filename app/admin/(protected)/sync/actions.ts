"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requirePermission } from "@/lib/auth/session";
import { logActivity } from "@/lib/auth/activity-log";
import { runSanitySync, type SyncResult } from "@/lib/sanity/sync";

/** Preview: what an import would create. Reads Sanity and the dashboard; writes nothing. */
export async function previewSanitySync(): Promise<SyncResult> {
  const profile = await requirePermission((p) => p.canManageSettings);
  return runSanitySync({ dryRun: true, trigger: "preview", startedBy: profile.id });
}

/** Imports Sanity content that doesn't exist in the dashboard yet (never modifies existing rows). */
export async function runSanityImport(): Promise<SyncResult> {
  const profile = await requirePermission((p) => p.canManageSettings);
  const result = await runSanitySync({ dryRun: false, trigger: "manual", startedBy: profile.id });
  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: "create",
    contentType: "cms_sync",
    newValue: Object.fromEntries(Object.entries(result.entities).map(([k, v]) => [k, v.imported.length])),
  });
  for (const tag of ["landing-page", "blog", "testimonial", "sanity"]) revalidateTag(tag, { expire: 0 });
  revalidatePath("/admin/sync");
  return result;
}
