import { unstable_rethrow } from "next/navigation";

export type ActionResult = { error?: string };

/**
 * In production Next.js replaces the message of any error thrown from a
 * Server Action with a generic one, so users would only ever see "Something
 * went wrong". Wrapping an action turns thrown errors into a returned
 * `{ error }` the client can show, while still letting redirect()/notFound()
 * propagate.
 */
export async function runAction(fn: () => Promise<unknown>): Promise<ActionResult> {
  try {
    await fn();
    return {};
  } catch (error) {
    unstable_rethrow(error);
    console.error("[admin action]", error);
    return { error: error instanceof Error ? error.message : "Something went wrong. Please try again." };
  }
}
