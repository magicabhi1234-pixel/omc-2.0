import "server-only";
import { supabaseAdmin } from "@/lib/db/client";

export const LEAD_TABS = ["inquiry", "contact", "newsletter"] as const;
export type LeadTab = (typeof LEAD_TABS)[number];

export const LEAD_STATUSES = ["new", "contacted", "qualified", "converted", "closed", "spam"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_TAB_LABELS: Record<LeadTab, string> = {
  inquiry: "Inquiry Leads",
  contact: "Contact Leads",
  newsletter: "Newsletter",
};

export interface LeadRow {
  id: string;
  name: string;
  mobile: string;
  email: string;
  city: string | null;
  specialization: string;
  lead_type: string | null;
  source: string | null;
  page_path: string | null;
  status: string | null;
  notes: string | null;
  created_at: string;
}

export interface SubscriberRow {
  id: string;
  email: string;
  source: string | null;
  page_path: string | null;
  status: string;
  created_at: string;
}

export interface LeadFilters {
  tab: LeadTab;
  q?: string;
  status?: string;
  from?: string; // yyyy-mm-dd
  to?: string;
}

export function parseLeadFilters(params: Record<string, string | string[] | undefined>): LeadFilters {
  const one = (key: string) => {
    const value = params[key];
    return (Array.isArray(value) ? value[0] : value)?.trim() || undefined;
  };
  const tab = one("type");
  const status = one("status");
  const isDate = (v?: string) => (v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : undefined);
  return {
    tab: LEAD_TABS.includes(tab as LeadTab) ? (tab as LeadTab) : "inquiry",
    q: one("q")?.slice(0, 100),
    status: status && (LEAD_STATUSES as readonly string[]).includes(status) ? status : undefined,
    from: isDate(one("from")),
    to: isDate(one("to")),
  };
}

/** Strips characters that have meaning in PostgREST's `or=(...)` filter grammar or ILIKE patterns. */
function searchTerm(q: string): string {
  return q.replace(/[,()*%_\\:"']/g, " ").replace(/\s+/g, " ").trim();
}

function endOfDay(date: string) {
  return `${date}T23:59:59.999Z`;
}

export const LEADS_PAGE_SIZE = 50;

export async function fetchLeads(filters: LeadFilters, range?: { page: number }) {
  let query = supabaseAdmin
    .from("leads")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  // Migration 0002 adds lead_type NOT NULL DEFAULT 'inquiry', backfilling older rows.
  query = query.eq("lead_type", filters.tab);

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.from) query = query.gte("created_at", filters.from);
  if (filters.to) query = query.lte("created_at", endOfDay(filters.to));
  const term = filters.q ? searchTerm(filters.q) : "";
  if (term) {
    query = query.or(
      `name.ilike.*${term}*,email.ilike.*${term}*,mobile.ilike.*${term}*,city.ilike.*${term}*,specialization.ilike.*${term}*`
    );
  }
  if (range) {
    const start = (range.page - 1) * LEADS_PAGE_SIZE;
    query = query.range(start, start + LEADS_PAGE_SIZE - 1);
  } else {
    query = query.limit(10000);
  }

  const { data, count, error } = await query;
  return { rows: (data ?? []) as LeadRow[], count: count ?? 0, error: error?.message };
}

export async function fetchSubscribers(filters: LeadFilters, range?: { page: number }) {
  let query = supabaseAdmin
    .from("newsletter_subscribers")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (filters.from) query = query.gte("created_at", filters.from);
  if (filters.to) query = query.lte("created_at", endOfDay(filters.to));
  const term = filters.q ? searchTerm(filters.q) : "";
  if (term) query = query.ilike("email", `%${term}%`);
  if (range) {
    const start = (range.page - 1) * LEADS_PAGE_SIZE;
    query = query.range(start, start + LEADS_PAGE_SIZE - 1);
  } else {
    query = query.limit(10000);
  }

  const { data, count, error } = await query;
  return { rows: (data ?? []) as SubscriberRow[], count: count ?? 0, error: error?.message };
}
