"use client";

import { useState, useTransition } from "react";
import { MessageCircle, Phone, Trash2, X, Inbox } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/admin/page-kit";
import { LeadNotes, LeadStatusSelect } from "@/components/admin/lead-row-controls";
import type { LeadRow } from "@/lib/admin/leads";
import { bulkDeleteLeads, bulkUpdateLeadStatus, deleteLead, updateLeadNotes, updateLeadStatus } from "../../../app/admin/(protected)/leads/actions";

const IST = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" });

const wrap = async (fn: () => Promise<unknown>) => {
  try {
    await fn();
    return {};
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Something went wrong." };
  }
};

export default function LeadsTable({ rows, statuses, canDelete }: { rows: LeadRow[]; statuses: readonly string[]; canDelete: boolean }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState("");
  const [pending, startTransition] = useTransition();
  const all = rows.length > 0 && rows.every((r) => selected.has(r.id));

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const applyStatus = (status: string) =>
    startTransition(async () => {
      const result = await bulkUpdateLeadStatus([...selected], status);
      if (result.error) toast.error(result.error);
      else {
        toast.success(`${result.updated} lead${result.updated === 1 ? "" : "s"} marked ${status}.`);
        setSelected(new Set());
        setBulkStatus("");
      }
    });

  const removeSelected = () => {
    if (!window.confirm(`Delete ${selected.size} lead${selected.size === 1 ? "" : "s"}? This cannot be undone.`)) return;
    startTransition(async () => {
      const result = await bulkDeleteLeads([...selected]);
      if (result.error) toast.error(result.error);
      else {
        toast.success(`${result.deleted} lead${result.deleted === 1 ? "" : "s"} deleted.`);
        setSelected(new Set());
      }
    });
  };

  if (rows.length === 0) return <EmptyState iconNode={<Inbox size={22} aria-hidden="true" />} title="No leads match these filters" description="Try clearing the search or widening the date range." />;

  return (
    <>
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-secondary/60 px-4 py-2.5 text-sm" role="region" aria-label="Bulk actions">
          <span className="font-medium text-secondary-foreground">{selected.size} selected</span>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <select
              aria-label="Set status for selected leads"
              value={bulkStatus}
              disabled={pending}
              onChange={(e) => {
                setBulkStatus(e.target.value);
                if (e.target.value) applyStatus(e.target.value);
              }}
              className="h-8 cursor-pointer rounded-md border border-input bg-card px-2 text-sm capitalize"
            >
              <option value="">Set status…</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {canDelete && (
              <Button size="sm" variant="destructive" disabled={pending} onClick={removeSelected}>
                <Trash2 size={14} /> Delete
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())} aria-label="Clear selection">
              <X size={14} />
            </Button>
          </div>
        </div>
      )}
      <div className="max-h-[calc(100dvh-340px)] min-h-64 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-muted/90 backdrop-blur">
            <tr className="border-b border-border text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <th className="w-10 px-4">
                <input
                  type="checkbox"
                  aria-label="Select all leads on this page"
                  checked={all}
                  onChange={() => setSelected(all ? new Set() : new Set(rows.map((r) => r.id)))}
                  className="size-4 cursor-pointer accent-[var(--primary)]"
                />
              </th>
              <th className="h-11 px-4">Lead</th>
              <th className="h-11 px-4">Contact</th>
              <th className="hidden h-11 px-4 xl:table-cell">Interested in</th>
              <th className="h-11 px-4">Status</th>
              <th className="hidden h-11 px-4 2xl:table-cell">Notes</th>
              <th className="hidden h-11 px-4 lg:table-cell">Received</th>
              {canDelete && <th className="h-11 w-10 px-4"><span className="sr-only">Actions</span></th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((lead) => (
              <tr key={lead.id} data-state={selected.has(lead.id) ? "selected" : undefined} className="border-b border-border/70 align-top transition-colors last:border-0 hover:bg-accent/50 data-[state=selected]:bg-secondary/60">
                <td className="px-4 pt-4">
                  <input type="checkbox" aria-label={`Select ${lead.name}`} checked={selected.has(lead.id)} onChange={() => toggle(lead.id)} className="size-4 cursor-pointer accent-[var(--primary)]" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground" aria-hidden="true">
                      {lead.name.slice(0, 1).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="max-w-48 truncate font-medium text-foreground" title={lead.name}>{lead.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {lead.city || "—"}
                        {lead.source && <span className="capitalize"> · {lead.source}</span>}
                      </p>
                      {/* Notes column only fits on very wide screens - keep notes editable everywhere. */}
                      <div className="mt-1 2xl:hidden">
                        <LeadNotes notes={lead.notes} action={(next) => wrap(() => updateLeadNotes(lead.id, next))} />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <a href={`tel:+91${lead.mobile}`} className="font-medium tabular-nums hover:text-primary hover:underline">{lead.mobile}</a>
                    <a href={`tel:+91${lead.mobile}`} className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label={`Call ${lead.name}`}><Phone size={13} /></a>
                    <a href={`https://wa.me/91${lead.mobile}`} target="_blank" rel="noopener noreferrer" className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-success" aria-label={`WhatsApp ${lead.name}`}><MessageCircle size={13} /></a>
                  </div>
                  <a href={`mailto:${lead.email}`} className="block max-w-56 truncate text-xs text-muted-foreground hover:underline" title={lead.email}>{lead.email}</a>
                </td>
                <td className="hidden px-4 py-3 xl:table-cell">
                  <p className="max-w-52 truncate" title={lead.specialization}>{lead.specialization}</p>
                  {lead.page_path && <p className="max-w-56 truncate text-xs text-muted-foreground" title={lead.page_path}>{lead.page_path}</p>}
                </td>
                <td className="px-4 py-3">
                  <LeadStatusSelect status={lead.status ?? "new"} statuses={statuses} action={(next) => wrap(() => updateLeadStatus(lead.id, next))} />
                </td>
                <td className="hidden px-4 py-3 2xl:table-cell">
                  <LeadNotes notes={lead.notes} action={(next) => wrap(() => updateLeadNotes(lead.id, next))} />
                </td>
                <td className="hidden px-4 py-3 text-xs whitespace-nowrap text-muted-foreground lg:table-cell">{IST.format(new Date(lead.created_at))}</td>
                {canDelete && (
                  <td className="px-2 py-2.5">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      aria-label={`Delete lead from ${lead.name}`}
                      disabled={pending}
                      onClick={() => {
                        if (!window.confirm(`Delete the lead from "${lead.name}"?`)) return;
                        startTransition(async () => {
                          const r = await wrap(() => deleteLead(lead.id));
                          if (r.error) toast.error(r.error);
                          else toast.success("Lead deleted.");
                        });
                      }}
                    >
                      <Trash2 size={15} />
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
