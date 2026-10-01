"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function DeleteButton({
  action,
  confirmMessage = "Delete this item? This cannot be undone.",
}: {
  action: () => Promise<void | { error?: string }>;
  confirmMessage?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(confirmMessage)) return;
        startTransition(async () => {
          try {
            const result = await action();
            if (result?.error) throw new Error(result.error);
            toast.success("Deleted successfully.");
          } catch (error) {
            toast.error(error instanceof Error ? error.message : "Delete failed.");
          }
        });
      }}
      aria-label="Delete"
      title="Delete"
    >
      <Trash2 size={15} />
    </Button>
  );
}
