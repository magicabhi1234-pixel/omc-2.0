import { runAction } from "@/lib/admin/run-action";
import type { BulkResult } from "@/components/admin/content-table";

/**
 * Runs a single-item action for each id, sequentially, so every item still
 * goes through that action's own permission + ownership checks, validation,
 * activity log and cache revalidation. Max 200 per request.
 */
export async function runBulk(ids: string[], fn: (id: string) => Promise<unknown>): Promise<BulkResult> {
  const unique = [...new Set(ids)].filter((id) => /^[0-9a-f-]{36}$/.test(id)).slice(0, 200);
  const result: BulkResult = { done: 0, failed: [] };
  for (const id of unique) {
    const { error } = await runAction(() => fn(id));
    if (error) result.failed.push({ id, error });
    else result.done += 1;
  }
  return result;
}
