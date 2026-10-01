"use client";

import { useMemo, useState, useTransition } from "react";
import { ChevronLeft, ChevronRight, Search, Trash2, Eye, EyeOff, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/admin/page-kit";

export interface ContentRow {
  id: string;
  /** Lower-cased text the search box matches against. */
  search: string;
  status?: "draft" | "published" | string;
  /** Server-rendered cells, one per column. */
  cells: React.ReactNode[];
}

export type BulkOp = "publish" | "unpublish" | "delete";
export type BulkResult = { done: number; failed: { id: string; error: string }[] };

const PAGE_SIZE = 25;

export default function ContentTable({
  columns,
  rows,
  noun,
  emptyIcon,
  emptyAction,
  bulkAction,
  canDelete = false,
  canPublish = true,
  statusFilter = true,
  searchPlaceholder = "Search…",
  toolbar,
}: {
  columns: { label: string; className?: string }[];
  rows: ContentRow[];
  noun: { one: string; many: string };
  /** Rendered icon element, e.g. <FileText size={22} /> */
  emptyIcon: React.ReactNode;
  emptyAction?: React.ReactNode;
  bulkAction?: (ids: string[], op: BulkOp) => Promise<BulkResult>;
  canDelete?: boolean;
  canPublish?: boolean;
  statusFilter?: boolean;
  searchPlaceholder?: string;
  toolbar?: React.ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "published" | "draft">("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => (!q || r.search.includes(q)) && (status === "all" || r.status === status));
  }, [rows, query, status]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const counts = useMemo(() => ({ all: rows.length, published: rows.filter((r) => r.status === "published").length, draft: rows.filter((r) => r.status === "draft").length }), [rows]);

  const allVisibleSelected = visible.length > 0 && visible.every((r) => selected.has(r.id));
  const toggleAll = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      for (const r of visible) {
        if (allVisibleSelected) next.delete(r.id);
        else next.add(r.id);
      }
      return next;
    });
  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const runBulk = (op: BulkOp) => {
    if (!bulkAction) return;
    const ids = [...selected];
    if (op === "delete" && !window.confirm(`Delete ${ids.length} ${ids.length === 1 ? noun.one : noun.many}? This cannot be undone.`)) return;
    startTransition(async () => {
      const result = await bulkAction(ids, op);
      if (result.done) toast.success(`${result.done} ${result.done === 1 ? noun.one : noun.many} ${op === "delete" ? "deleted" : op === "publish" ? "published" : "unpublished"}.`);
      if (result.failed.length) toast.error(`${result.failed.length} failed: ${result.failed[0].error}`);
      setSelected(new Set(result.failed.map((f) => f.id)));
    });
  };

  const selectable = Boolean(bulkAction);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_2px_rgb(15_23_42/0.04)]">
      <div className="flex flex-col gap-3 border-b border-border p-3 sm:flex-row sm:items-center sm:p-4">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder={searchPlaceholder}
            aria-label={`Search ${noun.many}`}
            className="h-9 pl-9"
          />
        </div>
        {statusFilter && (
          <div className="flex rounded-lg bg-muted p-1" role="group" aria-label="Filter by status">
            {(["all", "published", "draft"] as const).map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={status === s}
                onClick={() => {
                  setStatus(s);
                  setPage(1);
                }}
                className={cn(
                  "cursor-pointer rounded-md px-3 py-1 text-sm capitalize transition",
                  status === s ? "bg-card font-medium text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {s} <span className="text-xs text-muted-foreground tabular-nums">{counts[s]}</span>
              </button>
            ))}
          </div>
        )}
        {toolbar}
      </div>

      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-secondary/60 px-4 py-2.5 text-sm" role="region" aria-label="Bulk actions">
          <span className="font-medium text-secondary-foreground">{selected.size} selected</span>
          <div className="ml-auto flex flex-wrap gap-2">
            {canPublish && (
              <>
                <Button size="sm" variant="outline" disabled={pending} onClick={() => runBulk("publish")}>
                  <Eye size={14} /> Publish
                </Button>
                <Button size="sm" variant="outline" disabled={pending} onClick={() => runBulk("unpublish")}>
                  <EyeOff size={14} /> Unpublish
                </Button>
              </>
            )}
            {canDelete && (
              <Button size="sm" variant="destructive" disabled={pending} onClick={() => runBulk("delete")}>
                <Trash2 size={14} /> Delete
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())} aria-label="Clear selection">
              <X size={14} />
            </Button>
          </div>
        </div>
      )}

      {visible.length === 0 ? (
        <EmptyState
          iconNode={emptyIcon}
          title={rows.length === 0 ? `No ${noun.many} yet` : `No ${noun.many} match`}
          description={rows.length === 0 ? undefined : "Try a different search or filter."}
          action={rows.length === 0 ? emptyAction : undefined}
        />
      ) : (
        <div className="max-h-[calc(100dvh-300px)] min-h-48 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-muted/90 backdrop-blur">
              <tr className="border-b border-border">
                {selectable && (
                  <th className="w-10 px-4">
                    <input type="checkbox" aria-label="Select all on this page" checked={allVisibleSelected} onChange={toggleAll} className="size-4 cursor-pointer accent-[var(--primary)]" />
                  </th>
                )}
                {columns.map((c) => (
                  <th key={c.label} scope="col" className={cn("h-11 px-4 text-left text-xs font-semibold tracking-wide whitespace-nowrap text-muted-foreground uppercase", c.className)}>
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.id} data-state={selected.has(row.id) ? "selected" : undefined} className="border-b border-border/70 transition-colors last:border-0 hover:bg-accent/50 data-[state=selected]:bg-secondary/60">
                  {selectable && (
                    <td className="px-4">
                      <input type="checkbox" aria-label="Select row" checked={selected.has(row.id)} onChange={() => toggle(row.id)} className="size-4 cursor-pointer accent-[var(--primary)]" />
                    </td>
                  )}
                  {row.cells.map((cell, i) => (
                    <td key={i} className={cn("px-4 py-3 align-middle", columns[i]?.className)}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length > PAGE_SIZE && (
        <div className="flex flex-col items-center justify-between gap-2 border-t border-border px-4 py-3 text-sm sm:flex-row">
          <p className="text-muted-foreground">
            Showing <span className="font-medium text-foreground tabular-nums">{(current - 1) * PAGE_SIZE + 1}–{Math.min(filtered.length, current * PAGE_SIZE)}</span> of{" "}
            <span className="font-medium text-foreground tabular-nums">{filtered.length}</span>
          </p>
          <div className="flex items-center gap-1">
            <Button size="icon-sm" variant="outline" disabled={current === 1} onClick={() => setPage(current - 1)} aria-label="Previous page">
              <ChevronLeft size={15} />
            </Button>
            <span className="px-2 tabular-nums">
              {current} / {totalPages}
            </span>
            <Button size="icon-sm" variant="outline" disabled={current === totalPages} onClick={() => setPage(current + 1)} aria-label="Next page">
              <ChevronRight size={15} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
