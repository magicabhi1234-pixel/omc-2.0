import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { runSanitySync } from "@/lib/sanity/sync";
import { safeEqual } from "@/lib/security/request";

/**
 * Sanity webhook target (Sanity > API > Webhooks): on publish, import any new
 * documents into the dashboard (insert-only - dashboard edits always win).
 * Authenticate with the header `Authorization: Bearer <SANITY_WEBHOOK_SECRET>`.
 */
export async function POST(request: Request) {
  const secret = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!process.env.SANITY_WEBHOOK_SECRET || !safeEqual(secret, process.env.SANITY_WEBHOOK_SECRET)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  const result = await runSanitySync({ dryRun: false, trigger: "webhook" });
  for (const tag of ["landing-page", "blog", "testimonial", "sanity"]) revalidateTag(tag, { expire: 0 });
  const imported = Object.fromEntries(Object.entries(result.entities).map(([k, v]) => [k, v.imported]));
  return NextResponse.json({ success: result.status !== "failed", status: result.status, imported, error: result.error }, { status: result.status === "failed" ? 500 : 200 });
}
