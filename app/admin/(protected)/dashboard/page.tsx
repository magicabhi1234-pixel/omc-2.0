import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  GraduationCap,
  HelpCircle,
  Image as ImageIcon,
  Inbox,
  MessageSquareQuote,
  Newspaper,
  Plus,
  Sparkles,
  TrendingUp,
  Upload,
  UserCheck,
} from "lucide-react";
import { supabaseAdmin } from "@/lib/db/client";
import { requireProfile } from "@/lib/auth/session";
import { Panel, StatCard, EmptyState } from "@/components/admin/page-kit";
import LeadsChart, { type DayCount } from "@/components/admin/leads-chart";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

const DAY = 864e5;
const IST_DAY = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }); // yyyy-mm-dd
const IST_LABEL = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });
const IST_TIME = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

/** Outside the component: time windows are request data, not render state. */
function timeWindow(days: number) {
  const now = Date.now();
  return { now, sinceIso: new Date(now - days * DAY).toISOString() };
}

async function count(table: string, filter?: (q: ReturnType<ReturnType<typeof supabaseAdmin.from>["select"]>) => unknown) {
  let query = supabaseAdmin.from(table).select("*", { count: "exact", head: true });
  if (filter) query = filter(query) as typeof query;
  const { count: n, error } = await query;
  return error ? null : (n ?? 0);
}

async function systemHealth() {
  const [db, leadCols, faqs, limiter, bucket] = await Promise.all([
    supabaseAdmin.from("landing_pages").select("id", { head: true, count: "exact" }),
    supabaseAdmin.from("leads").select("lead_type, status", { head: true }),
    supabaseAdmin.from("faqs").select("id", { head: true }),
    supabaseAdmin.rpc("check_rate_limit", { p_key: "health:dashboard", p_limit: 1000000, p_window_seconds: 60 }),
    supabaseAdmin.storage.getBucket("media"),
  ]);
  const email = Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL && process.env.ADMIN_NOTIFICATION_EMAIL);
  return [
    { label: "Database", ok: !db.error, detail: db.error?.message },
    { label: "Lead tracking", ok: !leadCols.error, detail: leadCols.error?.message },
    { label: "Rate limiter", ok: !limiter.error, detail: limiter.error?.message },
    { label: "FAQ manager", ok: !faqs.error, detail: faqs.error?.message },
    { label: "Media storage", ok: !bucket.error && Boolean(bucket.data), detail: bucket.error?.message },
    { label: "Lead emails", ok: email, detail: email ? undefined : "Resend environment variables missing" },
  ];
}

const STATUS_ORDER = ["new", "contacted", "qualified", "converted", "closed", "spam"] as const;

export default async function DashboardPage() {
  const profile = await requireProfile();
  const { permissions } = profile;
  const { now, sinceIso: since60 } = timeWindow(60);
  const firstName = (profile.fullName || profile.email).split(/[\s@]/)[0];

  const [leadRows, pages, pagesDraft, blogs, universities, testimonials, faqs, media, mediaNoAlt, health, logs] = await Promise.all([
    permissions.canManageLeads
      ? supabaseAdmin.from("leads").select("created_at, status, source").gte("created_at", since60).limit(10000)
      : Promise.resolve({ data: null }),
    count("landing_pages", (q) => q.eq("status", "published")),
    count("landing_pages", (q) => q.eq("status", "draft")),
    count("blog_posts", (q) => q.eq("status", "published")),
    count("universities", (q) => q.eq("status", "published")),
    count("testimonials", (q) => q.eq("status", "published")),
    count("faqs", (q) => q.eq("status", "published")),
    count("media"),
    count("media", (q) => q.is("alt_text", null).like("mime_type", "image/%")),
    permissions.canManageSettings ? systemHealth() : Promise.resolve(null),
    permissions.canViewActivityLogs
      ? supabaseAdmin
          .from("activity_logs")
          .select("id, user_email, action, content_type, created_at")
          .not("action", "in", "(login,logout)")
          .order("created_at", { ascending: false })
          .limit(8)
      : Promise.resolve(null),
  ]);

  // ---- Lead analytics (IST calendar days) ----
  const leads = (leadRows.data ?? []) as { created_at: string; status: string | null; source: string | null }[];
  const in30 = leads.filter((l) => now - Date.parse(l.created_at) <= 30 * DAY).length;
  const prev30 = leads.length - in30;
  const trendPct = prev30 > 0 ? Math.round(((in30 - prev30) / prev30) * 100) : null;
  const byDay = new Map<string, number>();
  for (const l of leads) {
    const key = IST_DAY.format(new Date(l.created_at));
    byDay.set(key, (byDay.get(key) ?? 0) + 1);
  }
  const days: DayCount[] = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(now - (13 - i) * DAY);
    const key = IST_DAY.format(d);
    return { date: key, label: IST_LABEL.format(d), count: byDay.get(key) ?? 0 };
  });
  const last14 = days.reduce((n, d) => n + d.count, 0);
  const statusCounts = STATUS_ORDER.map((s) => ({ status: s, n: leads.filter((l) => (l.status ?? "new") === s).length }));
  const statusMax = Math.max(1, ...statusCounts.map((s) => s.n));
  const newLeads = statusCounts.find((s) => s.status === "new")?.n ?? 0;
  const contacted = leads.filter((l) => l.status && l.status !== "new" && l.status !== "spam").length;
  const contactRate = leads.length ? Math.round((contacted / leads.length) * 100) : 0;

  const content = [
    { label: "Landing pages", value: pages, href: "/admin/pages", icon: FileText, note: pagesDraft ? `${pagesDraft} drafts` : null },
    { label: "Blog posts", value: blogs, href: "/admin/blogs", icon: Newspaper, note: null },
    { label: "Universities", value: universities, href: "/admin/content/universities", icon: GraduationCap, note: null },
    { label: "Testimonials", value: testimonials, href: "/admin/content/testimonials", icon: MessageSquareQuote, note: null },
    { label: "FAQs", value: faqs, href: "/admin/faqs", icon: HelpCircle, note: null },
    { label: "Media files", value: media, href: "/admin/media", icon: ImageIcon, note: mediaNoAlt ? `${mediaNoAlt} need alt text` : null },
  ];

  const healthOk = health?.every((c) => c.ok);

  return (
    <div className="space-y-6">
      {/* Welcome + quick actions */}
      <div className="relative overflow-hidden rounded-2xl border border-border p-6 text-white sm:p-7" style={{ backgroundImage: "linear-gradient(120deg, #0b3b68 0%, #10457a 55%, #0f172a 100%)" }}>
        <div className="pointer-events-none absolute -top-16 -right-10 size-56 rounded-full bg-brand-accent/25 soft-glow" aria-hidden="true" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-white/70 uppercase">
              <Sparkles size={13} aria-hidden="true" /> {IST_LABEL.format(new Date(now))}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Welcome back, {firstName}</h1>
            <p className="mt-1.5 max-w-xl text-sm text-white/75">
              {permissions.canManageLeads
                ? `${in30} leads in the last 30 days${newLeads ? ` · ${newLeads} waiting for a first call` : ""}.`
                : "Here’s what’s happening across the site."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/pages/new" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-white px-3.5 text-sm font-medium text-brand shadow-sm transition hover:bg-white/90">
              <Plus size={15} /> Landing page
            </Link>
            <Link href="/admin/blogs/new" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-white/10 px-3.5 text-sm font-medium text-white ring-1 ring-white/20 transition hover:bg-white/15">
              <Plus size={15} /> Blog post
            </Link>
            {permissions.canUploadMedia && (
              <Link href="/admin/media" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-white/10 px-3.5 text-sm font-medium text-white ring-1 ring-white/20 transition hover:bg-white/15">
                <Upload size={15} /> Upload
              </Link>
            )}
            {permissions.canManageLeads && (
              <Link href="/admin/leads" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-accent px-3.5 text-sm font-semibold text-brand-dark shadow-sm transition hover:bg-brand-accent/90">
                <Inbox size={15} /> Open leads
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {permissions.canManageLeads ? (
          <>
            <StatCard
              label="Leads · 30 days"
              value={in30}
              icon={TrendingUp}
              href="/admin/leads"
              trend={trendPct === null ? null : { value: `${trendPct >= 0 ? "+" : ""}${trendPct}%`, positive: trendPct >= 0 }}
              hint="vs previous 30 days"
            />
            <StatCard label="New, not contacted" value={newLeads} icon={Inbox} tone="accent" href="/admin/leads?status=new" hint={newLeads ? "Follow up today" : "All caught up"} />
            <StatCard label="Contact rate" value={`${contactRate}%`} icon={UserCheck} tone="success" hint="leads moved past “new”" />
          </>
        ) : (
          <>
            <StatCard label="Published pages" value={pages ?? "—"} icon={FileText} href="/admin/pages" />
            <StatCard label="Blog posts" value={blogs ?? "—"} icon={Newspaper} href="/admin/blogs" />
            <StatCard label="Universities" value={universities ?? "—"} icon={GraduationCap} href="/admin/content/universities" />
          </>
        )}
        <StatCard label="Live landing pages" value={pages ?? "—"} icon={FileText} tone="neutral" href="/admin/pages" hint={pagesDraft ? `${pagesDraft} in draft` : "No drafts"} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {permissions.canManageLeads && (
          <Panel
            className="xl:col-span-2"
            title="Leads per day"
            description={`Last 14 days · ${last14} total`}
            actions={
              <Link href="/admin/leads" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                All leads <ArrowRight size={14} />
              </Link>
            }
          >
            <LeadsChart data={days} />
          </Panel>
        )}

        {permissions.canManageLeads && (
          <Panel title="Lead pipeline" description="Last 60 days by status">
            <ul className="space-y-3">
              {statusCounts.map(({ status, n }) => (
                <li key={status}>
                  <Link href={`/admin/leads?status=${status}`} className="group block">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground capitalize group-hover:text-primary">{status}</span>
                      <span className="text-muted-foreground tabular-nums">{n}</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                      <div className="h-full rounded-full bg-[var(--chart-1)]" style={{ width: `${(n / statusMax) * 100}%` }} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
        )}

        <Panel title="Content summary" description="Published items" className={cn(!permissions.canManageLeads && "xl:col-span-2")}>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {content.map(({ label, value, href, icon: Icon, note }) => (
              <li key={label}>
                <Link href={href} className="flex h-full flex-col rounded-lg border border-border p-3 transition hover:border-primary/30 hover:bg-accent/50">
                  <Icon size={16} className="text-primary" aria-hidden="true" />
                  <span className="mt-2 text-xl font-semibold tabular-nums">{value ?? "—"}</span>
                  <span className="text-xs text-muted-foreground">{label}</span>
                  {note && <span className="mt-1 text-[11px] font-medium text-warning">{note}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        {logs && (
          <Panel
            title="Recent activity"
            actions={
              <Link href="/admin/activity-logs" className="text-sm font-medium text-primary hover:underline">
                View all
              </Link>
            }
            bodyClassName="p-0"
          >
            {logs.data && logs.data.length > 0 ? (
              <ol className="divide-y divide-border">
                {logs.data.map((log) => (
                  <li key={log.id} className="flex gap-3 px-5 py-3">
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-[var(--chart-1)]" aria-hidden="true" />
                    <div className="min-w-0 text-sm">
                      <p className="truncate">
                        <span className="font-medium text-foreground">{log.user_email?.split("@")[0] ?? "System"}</span>{" "}
                        <span className="text-muted-foreground">{log.action.replace(/_/g, " ")}</span>{" "}
                        <span className="text-foreground">{log.content_type.replace(/_/g, " ")}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{IST_TIME.format(new Date(log.created_at))}</p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <EmptyState icon={Sparkles} title="No activity yet" description="Edits, publishes and uploads will show up here." />
            )}
          </Panel>
        )}

        {health && (
          <Panel
            title="System health"
            actions={
              <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", healthOk ? "bg-success-soft text-success" : "bg-warning-soft text-warning")}>
                {healthOk ? <CheckCircle2 size={13} aria-hidden="true" /> : <AlertTriangle size={13} aria-hidden="true" />}
                {healthOk ? "All systems normal" : "Needs attention"}
              </span>
            }
          >
            <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
              {health.map((check) => (
                <li key={check.label} className="flex items-start gap-2.5 rounded-lg bg-muted/50 px-3 py-2 text-sm">
                  {check.ok ? (
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-success" aria-label="OK" />
                  ) : (
                    <AlertTriangle size={16} className="mt-0.5 shrink-0 text-warning" aria-label="Needs attention" />
                  )}
                  <span className="min-w-0">
                    <span className="text-foreground">{check.label}</span>
                    {!check.ok && check.detail && <span className="block text-xs break-words text-muted-foreground">{check.detail}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        )}
      </div>
    </div>
  );
}
