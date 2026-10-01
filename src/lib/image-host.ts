/** Hosts next/image is configured to optimize (next.config.ts remotePatterns). */
const OPTIMIZABLE_HOSTS = ["cduthhiqrowburlasdio.supabase.co", "cdn.sanity.io"];

/** Site-relative paths and allow-listed hosts can go through next/image; anything else must be rendered unoptimized. */
export function isOptimizableImage(src: string): boolean {
  if (src.startsWith("/")) return true;
  try {
    return OPTIMIZABLE_HOSTS.includes(new URL(src).hostname);
  } catch {
    return false;
  }
}
