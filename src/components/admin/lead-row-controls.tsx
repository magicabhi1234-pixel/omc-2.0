"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/30",
  contacted: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30",
  qualified: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/30",
  converted: "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-300 dark:border-green-500/30",
  closed: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:border-slate-500/30",
  spam: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30",
};

export function LeadStatusSelect({
  status,
  statuses,
  action,
}: {
  status: string;
  statuses: readonly string[];
  action: (next: string) => Promise<void | { error?: string }>;
}) {
  const [value, setValue] = useState(status);
  const [pending, startTransition] = useTransition();

  return (
    <select
      aria-label="Lead status"
      value={value}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value;
        const previous = value;
        setValue(next);
        startTransition(async () => {
          try {
            const result = await action(next);
            if (result?.error) throw new Error(result.error);
            toast.success(`Marked as ${next}.`);
          } catch (error) {
            setValue(previous);
            toast.error(error instanceof Error ? error.message : "Failed to update status.");
          }
        });
      }}
      className={`cursor-pointer rounded-md border px-2 py-1 text-xs font-medium capitalize disabled:opacity-60 ${STATUS_STYLES[value] ?? STATUS_STYLES.new}`}
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}

export function LeadNotes({ notes, action }: { notes: string | null; action: (next: string) => Promise<void | { error?: string }> }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(notes ?? "");
  const [pending, startTransition] = useTransition();

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="max-w-48 cursor-pointer truncate text-left text-xs text-muted-foreground hover:text-foreground"
        title={notes ?? "Add a note"}
      >
        {notes || "+ Add note"}
      </button>
    );
  }

  return (
    <div className="w-56 space-y-2">
      <Textarea
        aria-label="Lead notes"
        value={value}
        maxLength={2000}
        rows={3}
        autoFocus
        onChange={(e) => setValue(e.target.value)}
        className="text-xs"
      />
      <div className="flex gap-2">
        <Button
          type="button"
          size="xs"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              try {
                const result = await action(value);
                if (result?.error) throw new Error(result.error);
                toast.success("Note saved.");
                setOpen(false);
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to save note.");
              }
            })
          }
        >
          {pending ? "Saving..." : "Save"}
        </Button>
        <Button type="button" size="xs" variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
