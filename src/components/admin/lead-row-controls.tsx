"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  contacted: "bg-amber-50 text-amber-700 border-amber-200",
  qualified: "bg-violet-50 text-violet-700 border-violet-200",
  converted: "bg-green-50 text-green-700 border-green-200",
  closed: "bg-slate-100 text-slate-600 border-slate-200",
  spam: "bg-red-50 text-red-700 border-red-200",
};

export function LeadStatusSelect({
  status,
  statuses,
  action,
}: {
  status: string;
  statuses: readonly string[];
  action: (next: string) => Promise<void>;
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
            await action(next);
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

export function LeadNotes({ notes, action }: { notes: string | null; action: (next: string) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(notes ?? "");
  const [pending, startTransition] = useTransition();

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="max-w-48 cursor-pointer truncate text-left text-xs text-slate-500 hover:text-slate-900"
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
                await action(value);
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
