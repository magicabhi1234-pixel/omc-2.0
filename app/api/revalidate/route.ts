import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { safeEqual } from "@/lib/security/request";

const TAGS = ["landing-page", "blog", "testimonial", "settings", "navigation", "faq"] as const;

/**
 * Manual cache flush. Accepts the secret as `Authorization: Bearer <secret>`
 * (preferred - kept out of access logs) or the legacy `?secret=` param.
 */
export async function POST(req: NextRequest) {
  const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const secret = bearer || req.nextUrl.searchParams.get("secret");

  if (!safeEqual(secret, process.env.REVALIDATE_SECRET)) {
    return NextResponse.json({ success: false, message: "Invalid secret" }, { status: 401 });
  }

  try {
    // Expire immediately - editors expect published changes on the next request.
    for (const tag of TAGS) revalidateTag(tag, { expire: 0 });

    return NextResponse.json({
      success: true,
      revalidated: TAGS,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Revalidation Error:", error);
    return NextResponse.json({ success: false, message: "Revalidation failed" }, { status: 500 });
  }
}
