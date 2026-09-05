"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function DeleteButton({
  action,
  confirmMessage = "Delete this item? This cannot be undone.",
}: {
  action: () => Promise<void>;
  confirmMessage?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(confirmMessage)) return;
        startTransition(async () => {
          try {
            await action();
            toast.success("Deleted successfully.");
          } catch (error) {
            toast.error(error instanceof Error ? error.message : "Delete failed.");
          }
        });
      }}
      aria-label="Delete"
    >
      <Trash2 size={16} className="text-red-600" />
    </Button>
  );
}
