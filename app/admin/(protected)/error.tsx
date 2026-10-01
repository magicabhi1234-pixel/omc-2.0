"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Keeps the sidebar usable when a dashboard page fails, instead of a blank error screen. */
export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[admin] page error", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg rounded-xl border border-destructive/30 bg-card p-6 text-center" role="alert">
      <AlertTriangle className="mx-auto text-destructive" size={28} aria-hidden="true" />
      <h1 className="mt-3 text-lg font-semibold text-foreground">This page couldn&apos;t load</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Something went wrong while loading or saving. Your other work is unaffected.
        {error.digest && <span className="mt-2 block text-xs text-muted-foreground">Reference: {error.digest}</span>}
      </p>
      <Button type="button" className="mt-4" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
