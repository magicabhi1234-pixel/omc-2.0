import type { Metadata } from "next";
import Link from "next/link";
import { Download, Search } from "lucide-react";
import { requirePermission } from "@/lib/auth/session";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import LinkButton from "@/components/admin/link-button";
import DeleteButton from "@/components/admin/delete-button";
import { LeadNotes, LeadStatusSelect } from "@/components/admin/lead-row-controls";
import { cn } from "@/lib/utils";
import {
  LEAD_STATUSES,
  LEAD_TABS,
  LEAD_TAB_LABELS,
  LEADS_PAGE_SIZE,
  fetchLeads,
  fetchSubscribers,
  parseLeadFilters,
  type LeadFilters,
} from "@/lib/admin/leads";
import { deleteLead, deleteSubscriber, updateLeadNotes, updateLeadStatus } from "./actions";

export const metadata: Metadata = { title: "Leads" };

type SearchParams = Record<string, string | string[] | undefined>;

function buildQuery(filters: LeadFilters, overrides: Record<string, string | undefined> = {}) {
  const params = new URLSearchParams();
  const merged: Record<string, string | undefined> = {
    type: filters.tab,
    q: filters.q,
    status: filters.status,
    from: filters.from,
    to: filters.to,
    ...overrides,
  };
  for (const [key, value] of Object.entries(merged)) if (value) params.set(key, value);
  return params.toString();
}

const dateFormat = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
});

export default async function LeadsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const profile = await requirePermission((p) => p.canManageLeads);
  const params = await searchParams;
  const filters = parseLeadFilters(params);
  const pageParam = Number(Array.isArray(params.page) ? params.page[0] : params.page);
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
  const canDelete = profile.permissions.canDeleteContent;

  const isNewsletter = filters.tab === "newsletter";
  const result = isNewsletter ? await fetchSubscribers(filters, { page }) : await fetchLeads(filters, { page });
  const totalPages = Math.max(1, Math.ceil(result.count / LEADS_PAGE_SIZE));
  const exportQuery = buildQuery(filters);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
          <p className="mt-1 text-slate-600">{result.count} {LEAD_TAB_LABELS[filters.tab].toLowerCase()} match the current filters</p>
        </div>
        <div className="flex gap-2">
          {/* Plain anchors, not next/link: these are file downloads from a route handler. */}
          <a href={`/admin/leads/export?${exportQuery}&format=csv`} download className={buttonVariants({ variant: "outline" })}>
            <Download size={16} className="mr-2" /> CSV
          </a>
          <a href={`/admin/leads/export?${exportQuery}&format=xlsx`} download className={buttonVariants({ variant: "outline" })}>
            <Download size={16} className="mr-2" /> Excel
          </a>
        </div>
      </div>

      <nav aria-label="Lead type" className="mt-6 flex gap-1 overflow-x-auto border-b border-slate-200">
        {LEAD_TABS.map((tab) => (
          <Link
            key={tab}
            href={`/admin/leads?type=${tab}`}
            aria-current={filters.tab === tab ? "page" : undefined}
            className={cn(
              "-mb-px border-b-2 px-4 py-2 text-sm font-medium whitespace-nowrap transition",
              filters.tab === tab
                ? "border-[#0B3B68] text-[#0B3B68]"
                : "border-transparent text-slate-500 hover:text-slate-900"
            )}
          >
            {LEAD_TAB_LABELS[tab]}
          </Link>
        ))}
      </nav>

      <form method="get" className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto_auto]">
        <input type="hidden" name="type" value={filters.tab} />
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
          <Input
            name="q"
            defaultValue={filters.q}
            placeholder={isNewsletter ? "Search email" : "Search name, email, mobile, city..."}
            aria-label="Search leads"
            className="pl-9"
          />
        </div>
        {!isNewsletter && (
          <select
            name="status"
            defaultValue={filters.status ?? ""}
            aria-label="Filter by status"
            className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm capitalize"
          >
            <option value="">All statuses</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        )}
        <Input type="date" name="from" defaultValue={filters.from} aria-label="From date" />
        <Input type="date" name="to" defaultValue={filters.to} aria-label="To date" />
        <Button type="submit">Apply</Button>
      </form>

      {result.error && (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800" role="alert">
          Couldn&apos;t load leads: {result.error}. If this mentions a missing column or table, apply{" "}
          <code>supabase/migrations/0002_security_leads.sql</code> in the Supabase SQL Editor.
        </p>
      )}

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        {isNewsletter ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subscribed</TableHead>
                {canDelete && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {(result.rows as Awaited<ReturnType<typeof fetchSubscribers>>["rows"]).map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">
                    <a href={`mailto:${s.email}`} className="hover:underline">{s.email}</a>
                  </TableCell>
                  <TableCell className="text-slate-500">{s.page_path ?? s.source ?? "—"}</TableCell>
                  <TableCell className="capitalize">{s.status}</TableCell>
                  <TableCell className="whitespace-nowrap text-slate-500">{dateFormat.format(new Date(s.created_at))}</TableCell>
                  {canDelete && (
                    <TableCell className="text-right">
                      <DeleteButton
                        action={async () => {
                          "use server";
                          await deleteSubscriber(s.id);
                        }}
                        confirmMessage={`Remove subscriber ${s.email}?`}
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Received</TableHead>
                {canDelete && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {(result.rows as Awaited<ReturnType<typeof fetchLeads>>["rows"]).map((lead) => (
                <TableRow key={lead.id} className="align-top">
                  <TableCell>
                    <p className="font-medium text-slate-900">{lead.name}</p>
                    <p className="text-xs text-slate-500">{lead.city || "—"}</p>
                  </TableCell>
                  <TableCell className="text-sm">
                    <a href={`tel:+91${lead.mobile}`} className="block hover:underline">{lead.mobile}</a>
                    <a href={`mailto:${lead.email}`} className="block text-xs text-slate-500 hover:underline">{lead.email}</a>
                  </TableCell>
                  <TableCell className="max-w-48 text-sm whitespace-normal">{lead.specialization}</TableCell>
                  <TableCell className="text-xs text-slate-500">
                    <p className="capitalize">{lead.source ?? "—"}</p>
                    {lead.page_path && <p className="max-w-40 truncate" title={lead.page_path}>{lead.page_path}</p>}
                  </TableCell>
                  <TableCell>
                    <LeadStatusSelect
                      status={lead.status ?? "new"}
                      statuses={LEAD_STATUSES}
                      action={async (next) => {
                        "use server";
                        await updateLeadStatus(lead.id, next);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <LeadNotes
                      notes={lead.notes}
                      action={async (next) => {
                        "use server";
                        await updateLeadNotes(lead.id, next);
                      }}
                    />
                  </TableCell>
                  <TableCell className="text-xs whitespace-nowrap text-slate-500">{dateFormat.format(new Date(lead.created_at))}</TableCell>
                  {canDelete && (
                    <TableCell className="text-right">
                      <DeleteButton
                        action={async () => {
                          "use server";
                          await deleteLead(lead.id);
                        }}
                        confirmMessage={`Delete the lead from "${lead.name}"? This cannot be undone.`}
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {result.rows.length === 0 && !result.error && (
          <p className="p-8 text-center text-sm text-slate-500">No leads match these filters.</p>
        )}
      </div>

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="mt-4 flex items-center justify-between text-sm">
          <span className="text-slate-500">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <LinkButton href={`/admin/leads?${buildQuery(filters, { page: String(page - 1) })}`} variant="outline" size="sm">
                Previous
              </LinkButton>
            )}
            {page < totalPages && (
              <LinkButton href={`/admin/leads?${buildQuery(filters, { page: String(page + 1) })}`} variant="outline" size="sm">
                Next
              </LinkButton>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
