"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function PublishToggle({
  status,
  action,
}: {
  status: "draft" | "published";
  action: (nextStatus: "draft" | "published") => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();
  const next = status === "published" ? "draft" : "published";

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          try {
            await action(next);
            toast.success(next === "published" ? "Published." : "Unpublished.");
          } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update status.");
          }
        })
      }
      className="cursor-pointer"
      title={`Click to ${next === "published" ? "publish" : "unpublish"}`}
    >
      <Badge variant={status === "published" ? "default" : "secondary"}>
        {pending ? "..." : status}
      </Badge>
    </button>
  );
}
