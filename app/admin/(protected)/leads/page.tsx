import type { Metadata } from "next";
import Link from "next/link";
import { Download, Filter, Mail, Search } from "lucide-react";
import { requirePermission } from "@/lib/auth/session";
import { supabaseAdmin } from "@/lib/db/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import DeleteButton from "@/components/admin/delete-button";
import LeadsTable from "@/components/admin/leads-table";
import { EmptyState, PageHeader, Pagination, StatusDot } from "@/components/admin/page-kit";
import { cn } from "@/lib/utils";
import { runAction } from "@/lib/admin/run-action";
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
import { deleteSubscriber } from "./actions";

export const metadata: Metadata = { title: "Leads" };

type SearchParams = Record<string, string | string[] | undefined>;

function buildQuery(filters: LeadFilters, overrides: Record<string, string | undefined> = {}) {
  const params = new URLSearchParams();
  const merged: Record<string, string | undefined> = { type: filters.tab, q: filters.q, status: filters.status, from: filters.from, to: filters.to, ...overrides };
  for (const [key, value] of Object.entries(merged)) if (value) params.set(key, value);
  return params.toString();
}

const dateFormat = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

export default async function LeadsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const profile = await requirePermission((p) => p.canManageLeads);
  const params = await searchParams;
  const filters = parseLeadFilters(params);
  const pageParam = Number(Array.isArray(params.page) ? params.page[0] : params.page);
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
  const canDelete = profile.permissions.canDeleteContent;
  const isNewsletter = filters.tab === "newsletter";

  const [result, inquiryCount, contactCount, newsletterCount] = await Promise.all([
    isNewsletter ? fetchSubscribers(filters, { page }) : fetchLeads(filters, { page }),
    supabaseAdmin.from("leads").select("*", { count: "exact", head: true }).eq("lead_type", "inquiry"),
    supabaseAdmin.from("leads").select("*", { count: "exact", head: true }).eq("lead_type", "contact"),
    supabaseAdmin.from("newsletter_subscribers").select("*", { count: "exact", head: true }),
  ]);
  const tabCounts = { inquiry: inquiryCount.count, contact: contactCount.count, newsletter: newsletterCount.count };
  const totalPages = Math.max(1, Math.ceil(result.count / LEADS_PAGE_SIZE));
  const exportQuery = buildQuery(filters);
  const hasFilters = Boolean(filters.q || filters.status || filters.from || filters.to);

  return (
    <div>
      <PageHeader
        title="Leads"
        description="Every enquiry, contact request and newsletter signup from the site. Exports respect the current filters."
        actions={
          <>
            {/* Plain anchors, not next/link: these are file downloads from a route handler. */}
            <a href={`/admin/leads/export?${exportQuery}&format=csv`} download className={buttonVariants({ variant: "outline" })}>
              <Download size={15} /> CSV
            </a>
            <a href={`/admin/leads/export?${exportQuery}&format=xlsx`} download className={buttonVariants({ variant: "outline" })}>
              <Download size={15} /> Excel
            </a>
          </>
        }
      />

      <nav aria-label="Lead type" className="mb-4 flex gap-1 overflow-x-auto rounded-xl bg-muted p-1 sm:inline-flex">
        {LEAD_TABS.map((tab) => (
          <Link
            key={tab}
            href={`/admin/leads?type=${tab}`}
            aria-current={filters.tab === tab ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition",
              filters.tab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {LEAD_TAB_LABELS[tab]}
            {tabCounts[tab] != null && (
              <span className={cn("rounded-full px-1.5 text-xs tabular-nums", filters.tab === tab ? "bg-secondary text-secondary-foreground" : "bg-background/60")}>{tabCounts[tab]}</span>
            )}
          </Link>
        ))}
      </nav>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_2px_rgb(15_23_42/0.04)]">
        <form method="get" className="grid grid-cols-[minmax(0,1fr)] gap-3 border-b border-border p-3 sm:p-4 md:grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
          <input type="hidden" name="type" value={filters.tab} />
          <div className="relative md:col-span-2 lg:col-span-1">
            <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input name="q" defaultValue={filters.q} placeholder={isNewsletter ? "Search email…" : "Search name, email, mobile, city…"} aria-label="Search leads" className="h-9 pl-9" />
          </div>
          {!isNewsletter && (
            <select name="status" defaultValue={filters.status ?? ""} aria-label="Filter by status" className="h-9 cursor-pointer rounded-lg border border-input bg-card px-3 text-sm capitalize shadow-xs">
              <option value="">All statuses</option>
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          )}
          <div className="flex min-w-0 items-center gap-2">
            <Input type="date" name="from" defaultValue={filters.from} aria-label="From date" className="h-9 min-w-0 flex-1" />
            <span className="text-muted-foreground" aria-hidden="true">–</span>
            <Input type="date" name="to" defaultValue={filters.to} aria-label="To date" className="h-9 min-w-0 flex-1" />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="h-9 flex-1 lg:flex-none">
              <Filter size={15} /> Apply
            </Button>
            {hasFilters && (
              <Link href={`/admin/leads?type=${filters.tab}`} className={buttonVariants({ variant: "ghost", className: "h-9" })}>
                Clear
              </Link>
            )}
          </div>
        </form>

        {result.error && (
          <p className="m-4 rounded-lg border border-warning/30 bg-warning-soft p-4 text-sm text-warning" role="alert">
            Couldn&apos;t load leads: {result.error}
          </p>
        )}

        {isNewsletter ? (
          result.rows.length === 0 ? (
            <EmptyState icon={Mail} title="No subscribers yet" description="Newsletter signups from the site footer appear here." />
          ) : (
            <Table containerClassName="max-h-[calc(100dvh-340px)]">
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden md:table-cell">Signed up from</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Subscribed</TableHead>
                  {canDelete && <TableHead><span className="sr-only">Actions</span></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {(result.rows as Awaited<ReturnType<typeof fetchSubscribers>>["rows"]).map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">
                      <a href={`mailto:${s.email}`} className="hover:underline">{s.email}</a>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">{s.page_path ?? s.source ?? "—"}</TableCell>
                    <TableCell><StatusDot status={s.status} /></TableCell>
                    <TableCell className="hidden text-muted-foreground sm:table-cell">{dateFormat.format(new Date(s.created_at))}</TableCell>
                    {canDelete && (
                      <TableCell className="text-right">
                        <DeleteButton
                          action={async () => {
                            "use server";
                            return runAction(() => deleteSubscriber(s.id));
                          }}
                          confirmMessage={`Remove subscriber ${s.email}?`}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )
        ) : (
          <LeadsTable rows={result.rows as Awaited<ReturnType<typeof fetchLeads>>["rows"]} statuses={LEAD_STATUSES} canDelete={canDelete} />
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={result.count}
          pageSize={LEADS_PAGE_SIZE}
          hrefFor={(p) => `/admin/leads?${buildQuery(filters, { page: String(p) })}`}
        />
      </div>
    </div>
  );
}
