"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Loader2, Save } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

/**
 * Sticky save bar for editor forms (place it as the form's last child).
 * - tracks unsaved changes and warns before leaving the page
 * - Ctrl/Cmd+S saves
 * - stays visible while scrolling long forms
 */
export default function FormActionBar({
  pending,
  submitLabel = "Save",
  cancelHref,
  hint,
}: {
  pending: boolean;
  submitLabel?: string;
  cancelHref?: string;
  hint?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const form = ref.current?.closest("form");
    if (!form) return;
    const markDirty = () => setDirty(true);
    const onSubmit = () => setDirty(false);
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        form.requestSubmit();
      }
    };
    form.addEventListener("input", markDirty);
    form.addEventListener("change", markDirty);
    form.addEventListener("submit", onSubmit);
    window.addEventListener("keydown", onKey);
    return () => {
      form.removeEventListener("input", markDirty);
      form.removeEventListener("change", markDirty);
      form.removeEventListener("submit", onSubmit);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  return (
    <div
      ref={ref}
      className="sticky bottom-3 z-20 mt-8 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card/95 px-4 py-3 shadow-[0_8px_30px_rgb(15_23_42/0.12)] backdrop-blur supports-[backdrop-filter]:bg-card/85"
    >
      <div className="min-w-0 flex-1 text-sm text-muted-foreground">
        {dirty ? (
          <span className="inline-flex items-center gap-2 text-warning">
            <span className="size-2 rounded-full bg-warning" aria-hidden="true" /> Unsaved changes
          </span>
        ) : (
          hint ?? <span className="hidden sm:inline">Tip: press Ctrl/⌘ + S to save</span>
        )}
      </div>
      {cancelHref && (
        <Link href={cancelHref} className={buttonVariants({ variant: "ghost" })}>
          Cancel
        </Link>
      )}
      <Button type="submit" disabled={pending} className="min-w-28">
        {pending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
        {pending ? "Saving…" : submitLabel}
      </Button>
    </div>
  );
}
