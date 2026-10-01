import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin, isDbConfigured } from "@/lib/db/client";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { clientIp, isSameOrigin } from "@/lib/security/request";

const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  pagePath: z.string().trim().max(300).startsWith("/").optional(),
  website: z.string().max(500).optional(), // honeypot
});

export async function POST(request: Request) {
  if (!isSameOrigin(request.headers)) {
    return NextResponse.json({ success: false, message: "Invalid request origin." }, { status: 403 });
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ success: false, message: "Unsupported content type." }, { status: 415 });
  }
  if (!(await checkRateLimit(`newsletter:${clientIp(request.headers)}`, 5, 600))) {
    return NextResponse.json(
      { success: false, message: "Too many attempts. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  const parsed = subscribeSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: "Please enter a valid email address." }, { status: 400 });
  }
  if (parsed.data.website) return NextResponse.json({ success: true });

  if (!isDbConfigured) {
    console.error("[newsletter] database not configured");
    return NextResponse.json({ success: false, message: "Subscription is unavailable right now." }, { status: 503 });
  }

  const { email, pagePath } = parsed.data;
  const { error } = await supabaseAdmin
    .from("newsletter_subscribers")
    .insert({ email, source: "footer", page_path: pagePath ?? null });

  if (error) {
    // Already on the list: re-subscribe silently - same success message either
    // way, so the endpoint can't be used to probe who is subscribed.
    if (error.code === "23505") {
      await supabaseAdmin
        .from("newsletter_subscribers")
        .update({ status: "subscribed" })
        .eq("email", email);
      return NextResponse.json({ success: true });
    }
    console.error("[newsletter] insert failed: %s %s", error.code, error.message);
    return NextResponse.json({ success: false, message: "Subscription failed. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
