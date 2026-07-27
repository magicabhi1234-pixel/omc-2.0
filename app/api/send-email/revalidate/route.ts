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

    // Revalidate tags
revalidateTag("landing-page", "max");
revalidateTag("universities", "max");
revalidateTag("blog", "max");
revalidateTag("seo", "max");
revalidateTag("header", "max");
revalidateTag("footer", "max");

    return NextResponse.json({
      success: true,
      revalidated: [
        "landing-page",
        "universities",
        "blog",
        "seo",
        "header",
        "footer",
      ],
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
