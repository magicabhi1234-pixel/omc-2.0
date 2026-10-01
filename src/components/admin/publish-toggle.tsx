"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/** Status pill that toggles Published <-> Draft, with an optimistic update. */
export default function PublishToggle({
  status,
  action,
}: {
  status: "draft" | "published";
  action: (nextStatus: "draft" | "published") => Promise<void | { error?: string }>;
}) {
  const [current, setCurrent] = useState(status);
  const [pending, startTransition] = useTransition();
  const next = current === "published" ? "draft" : "published";

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const previous = current;
          setCurrent(next);
          try {
            const result = await action(next);
            if (result?.error) throw new Error(result.error);
            toast.success(next === "published" ? "Published - live on the site." : "Moved to drafts.");
          } catch (error) {
            setCurrent(previous);
            toast.error(error instanceof Error ? error.message : "Failed to update status.");
          }
        })
      }
      title={`Click to ${next === "published" ? "publish" : "unpublish"}`}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition disabled:cursor-wait",
        current === "published"
          ? "border-success/25 bg-success-soft text-success hover:border-success/50"
          : "border-border bg-muted text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"
      )}
    >
      {pending ? <Loader2 size={11} className="animate-spin" aria-hidden="true" /> : <span className={cn("size-1.5 rounded-full", current === "published" ? "bg-success" : "bg-muted-foreground/60")} aria-hidden="true" />}
      {current === "published" ? "Published" : "Draft"}
    </button>
  );
}
