import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const LOGIN_PATH = "/omc-adminlogin";

/**
 * Runs on /admin/* and the login page. Three jobs:
 * 1. Redirect the legacy /admin/login URL to /omc-adminlogin.
 * 2. Refresh the Supabase auth session cookie (required by @supabase/ssr's
 *    cookie-based flow, otherwise sessions silently expire mid-use).
 * 3. Gate every /admin/* route behind a valid session - the actual
 *    profile/role check happens deeper (layout + every Server Action), this
 *    is just the "are you logged in at all" front door.
 *
 * Bouncing an already-signed-in user away from the login page is done by the
 * page itself, since only it can tell an active profile from a bare session.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.search = request.nextUrl.search;
    return NextResponse.redirect(loginUrl, 308);
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (pathname.startsWith("/admin") && !user) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin pages are per-user and must never be cached or indexed.
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/omc-adminlogin"],
};
