import "server-only";
import { timingSafeEqual } from "node:crypto";

type HeaderSource = Pick<Headers, "get">;

/** Best-effort client IP. On Vercel, x-forwarded-for's first hop is set by the edge and can't be spoofed by the client. */
export function clientIp(headers: HeaderSource): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip")?.trim() || "unknown";
}

/**
 * CSRF guard for JSON route handlers: browsers always send Origin on
 * cross-origin POSTs, so rejecting a mismatched Origin blocks forged
 * submissions from other sites. (Server Actions get this check from Next.js
 * itself; route handlers don't.)
 */
export function isSameOrigin(headers: HeaderSource): boolean {
  const origin = headers.get("origin");
  if (!origin) return true; // same-origin navigations / non-browser clients; rate limiting still applies
  const host = headers.get("x-forwarded-host") ?? headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** Constant-time string comparison for shared secrets. */
export function safeEqual(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a || !b) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

/** Only allow post-login redirects to admin paths on this site (blocks `//evil.com`, `/\evil.com`, etc). */
export function safeAdminRedirect(next: string | null | undefined): string {
  if (!next || !/^\/admin(\/[A-Za-z0-9\-._~/?=&%]*)?$/.test(next) || next.includes("//")) {
    return "/admin/dashboard";
  }
  return next;
}
