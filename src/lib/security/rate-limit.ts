import "server-only";
import { supabaseAdmin, isDbConfigured } from "@/lib/db/client";

/**
 * Per-instance fallback, used only when the shared Postgres limiter is
 * unavailable (migration 0002 not applied yet, or a DB blip). It can't
 * coordinate across serverless instances, but it still caps a single hot
 * instance - better than failing fully open.
 */
const memoryBuckets = new Map<string, { count: number; windowStart: number }>();

function memoryLimit(key: string, limit: number, windowSeconds: number): boolean {
  const now = Date.now();
  const bucket = memoryBuckets.get(key);
  if (!bucket || now - bucket.windowStart > windowSeconds * 1000) {
    memoryBuckets.set(key, { count: 1, windowStart: now });
    if (memoryBuckets.size > 5000) {
      for (const [k, b] of memoryBuckets) {
        if (now - b.windowStart > windowSeconds * 1000) memoryBuckets.delete(k);
      }
    }
    return true;
  }
  bucket.count += 1;
  return bucket.count <= limit;
}

/** Returns true if the caller identified by `key` is still within `limit` hits per `windowSeconds`. */
export async function checkRateLimit(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  if (isDbConfigured) {
    const { data, error } = await supabaseAdmin.rpc("check_rate_limit", {
      p_key: key,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });
    if (!error && typeof data === "boolean") return data;
    console.error("[rate-limit] shared limiter unavailable, using in-memory fallback:", error?.message);
  }
  return memoryLimit(key, limit, windowSeconds);
}
