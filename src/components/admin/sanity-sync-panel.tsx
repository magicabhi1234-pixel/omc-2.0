"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { RefreshCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SyncResult } from "@/lib/sanity/sync";
import { previewSanitySync, runSanityImport } from "../../../app/admin/(protected)/sync/actions";

const LABELS: Record<keyof SyncResult["entities"], string> = {
  universities: "Universities",
  testimonials: "Testimonials",
  blog_posts: "Blog posts",
  landing_pages: "Landing pages",
};

export default function SanitySyncPanel() {
  const [result, setResult] = useState<SyncResult | null>(null);
  const [pending, startTransition] = useTransition();
  const pendingImports = result ? Object.values(result.entities).reduce((n, e) => n + e.toImport.length, 0) : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const r = await previewSanitySync();
              setResult(r);
              if (r.error) toast.error(r.error);
            })
          }
        >
          <Search size={16} className="mr-2" /> {pending ? "Checking..." : "Check Sanity for new content"}
        </Button>
        {result?.dryRun && pendingImports > 0 && (
          <Button
            type="button"
            disabled={pending}
            onClick={() => {
              if (!window.confirm(`Import ${pendingImports} new item(s) from Sanity into the dashboard? Existing dashboard content is never changed.`)) return;
              startTransition(async () => {
                const r = await runSanityImport();
                setResult(r);
                if (r.status === "failed") toast.error(r.error ?? "Import failed.");
                else toast.success(r.status === "partial" ? "Imported, with some failures - see below." : "Import complete.");
              });
            }}
          >
            <RefreshCcw size={16} className="mr-2" /> Import {pendingImports} new item{pendingImports === 1 ? "" : "s"}
          </Button>
        )}
      </div>

      {result && (
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm font-medium text-foreground">
            {result.dryRun ? "Preview" : "Import result"} · {result.status}
            {result.error && <span className="text-destructive"> - {result.error}</span>}
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="py-2 font-medium">Content</th>
                  <th className="py-2 font-medium">In Sanity</th>
                  <th className="py-2 font-medium">Already in dashboard</th>
                  <th className="py-2 font-medium">Deleted in dashboard</th>
                  <th className="py-2 font-medium">{result.dryRun ? "Would import" : "Imported"}</th>
                  <th className="py-2 font-medium">Failed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(Object.keys(LABELS) as (keyof SyncResult["entities"])[]).map((key) => {
                  const e = result.entities[key];
                  return (
                    <tr key={key} className="align-top">
                      <td className="py-2 font-medium text-foreground">{LABELS[key]}</td>
                      <td className="py-2">{e.inSanity}</td>
                      <td className="py-2">{e.alreadyInDashboard}</td>
                      <td className="py-2">{e.deletedInDashboard}</td>
                      <td className="py-2">
                        {(result.dryRun ? e.toImport : e.imported).length}
                        {(result.dryRun ? e.toImport : e.imported).length > 0 && (
                          <span className="block text-xs text-muted-foreground">{(result.dryRun ? e.toImport : e.imported).slice(0, 5).join(", ")}</span>
                        )}
                      </td>
                      <td className="py-2 text-destructive">
                        {e.failed.length}
                        {e.failed.slice(0, 3).map((f) => (
                          <span key={f.key} className="block text-xs">{f.key}: {f.reason}</span>
                        ))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!result.dryRun && (
            <p className="mt-3 text-xs text-muted-foreground">
              Images: {result.images.copied} copied to the Media Library, {result.images.reused} already there, {result.images.failed} failed.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
