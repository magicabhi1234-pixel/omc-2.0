import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Secret validation
    const secret = req.nextUrl.searchParams.get("secret");

    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid secret",
        },
        { status: 401 }
      );
    }

    // Read webhook payload (optional)
    const body = await req.json().catch(() => ({}));

    console.log("Sanity Webhook:", body);

    // Revalidate tags immediately - this is a CMS webhook, so editors expect
    // published changes to be live on next request, not eventually-consistent.
    revalidateTag("landing-page", { expire: 0 });
    revalidateTag("blog", { expire: 0 });
    revalidateTag("testimonial", { expire: 0 });

    return NextResponse.json({
      success: true,
      revalidated: ["landing-page", "blog", "testimonial"],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Revalidation Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Revalidation failed",
      },
      { status: 500 }
    );
  }
}
