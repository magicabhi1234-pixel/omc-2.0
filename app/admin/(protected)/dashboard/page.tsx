import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Newspaper,
  GraduationCap,
  MessageSquareQuote,
  Image as ImageIcon,
  Inbox,
  HelpCircle,
  Plus,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { supabaseAdmin } from "@/lib/db/client";
import { requireProfile } from "@/lib/auth/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LinkButton from "@/components/admin/link-button";

export const metadata: Metadata = { title: "Dashboard" };

/** Outside the component: the time window is request data, not render state. */
function daysAgoIso(days: number) {
  return new Date(Date.now() - days * 864e5).toISOString();
}

const IST = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

async function countRows(table: string, filter?: (q: ReturnType<ReturnType<typeof supabaseAdmin.from>["select"]>) => unknown) {
  let query = supabaseAdmin.from(table).select("*", { count: "exact", head: true });
  if (filter) query = filter(query) as typeof query;
  const { count, error } = await query;
  return error ? null : (count ?? 0);
}

/** Each check reflects something that silently breaks a feature when missing. */
async function systemHealth() {
  const sinceWeek = daysAgoIso(7);
  const [db, leadCols, faqs, limiter, bucket] = await Promise.all([
    supabaseAdmin.from("landing_pages").select("id", { head: true, count: "exact" }),
    supabaseAdmin.from("leads").select("lead_type, status", { head: true }).gte("created_at", sinceWeek),
    supabaseAdmin.from("faqs").select("id", { head: true }),
    supabaseAdmin.rpc("check_rate_limit", { p_key: "health:dashboard", p_limit: 1000000, p_window_seconds: 60 }),
    supabaseAdmin.storage.getBucket("media"),
  ]);
  const email = Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL && process.env.ADMIN_NOTIFICATION_EMAIL);
  return [
    { label: "Database connection", ok: !db.error, detail: db.error?.message },
    { label: "Lead tracking columns (migration 0002)", ok: !leadCols.error, detail: leadCols.error?.message },
    { label: "Shared rate limiter (migration 0002)", ok: !limiter.error, detail: limiter.error?.message },
    { label: "FAQ manager table (migration 0004)", ok: !faqs.error, detail: faqs.error?.message },
    { label: "Media storage bucket", ok: !bucket.error && Boolean(bucket.data), detail: bucket.error?.message },
    { label: "Lead email delivery configured", ok: email, detail: email ? undefined : "Set RESEND_API_KEY, RESEND_FROM_EMAIL and ADMIN_NOTIFICATION_EMAIL" },
  ];
}

export default async function DashboardPage() {
  const profile = await requireProfile();
  const { permissions } = profile;
  const since7d = daysAgoIso(7);

  const [landingPages, drafts, blogPosts, universities, testimonials, faqs, media, leads7d, newLeads, health, recentLogs] = await Promise.all([
    countRows("landing_pages"),
    countRows("landing_pages", (q) => q.eq("status", "draft")),
    countRows("blog_posts"),
    countRows("universities"),
    countRows("testimonials"),
    countRows("faqs"),
    countRows("media"),
    permissions.canManageLeads ? countRows("leads", (q) => q.gte("created_at", since7d)) : Promise.resolve(null),
    permissions.canManageLeads ? countRows("leads", (q) => q.eq("status", "new")) : Promise.resolve(null),
    permissions.canManageSettings ? systemHealth() : Promise.resolve(null),
    permissions.canViewActivityLogs
      ? supabaseAdmin
          .from("activity_logs")
          .select("id, user_email, action, content_type, content_id, created_at")
          .order("created_at", { ascending: false })
          .limit(10)
      : Promise.resolve(null),
  ]);

  const stats = [
    ...(permissions.canManageLeads
      ? [{ label: "Leads (7 days)", value: leads7d, sub: newLeads != null ? `${newLeads} new, uncontacted` : undefined, href: "/admin/leads", icon: Inbox }]
      : []),
    { label: "Landing Pages", value: landingPages, sub: drafts ? `${drafts} drafts` : undefined, href: "/admin/pages", icon: FileText },
    { label: "Blog Posts", value: blogPosts, href: "/admin/blogs", icon: Newspaper },
    { label: "Universities", value: universities, href: "/admin/content/universities", icon: GraduationCap },
    { label: "Testimonials", value: testimonials, href: "/admin/content/testimonials", icon: MessageSquareQuote },
    { label: "FAQs", value: faqs, href: "/admin/faqs", icon: HelpCircle },
    { label: "Media Files", value: media, href: "/admin/media", icon: ImageIcon },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Welcome, {profile.fullName || profile.email}</h1>
      <p className="mt-1 text-slate-600">Here&apos;s what&apos;s happening across your site.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <LinkButton href="/admin/pages/new" size="sm"><Plus size={14} className="mr-1" /> Landing page</LinkButton>
        <LinkButton href="/admin/blogs/new" size="sm" variant="outline"><Plus size={14} className="mr-1" /> Blog post</LinkButton>
        <LinkButton href="/admin/faqs" size="sm" variant="outline"><Plus size={14} className="mr-1" /> FAQ</LinkButton>
        {permissions.canUploadMedia && <LinkButton href="/admin/media" size="sm" variant="outline"><Plus size={14} className="mr-1" /> Upload media</LinkButton>}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
        {stats.map(({ label, value, sub, href, icon: Icon }) => (
          <Link key={href} href={href} className="rounded-xl focus-visible:ring-2 focus-visible:ring-[#0B3B68] focus-visible:outline-none">
            <Card className="h-full transition hover:shadow-md">
              <CardContent className="pt-5">
                <Icon className="text-[#0B3B68]" size={22} aria-hidden="true" />
                <p className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">{value ?? "—"}</p>
                <p className="text-sm text-slate-600">{label}</p>
                {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {health && (
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {health.map((check) => (
                  <li key={check.label} className="flex items-start gap-2 text-sm">
                    {check.ok ? (
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-green-600" aria-label="OK" />
                    ) : (
                      <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-600" aria-label="Needs attention" />
                    )}
                    <span>
                      <span className="text-slate-800">{check.label}</span>
                      {!check.ok && check.detail && <span className="block text-xs text-slate-500">{check.detail}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {recentLogs && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {recentLogs.data && recentLogs.data.length > 0 ? (
                <ul className="divide-y divide-slate-100">
                  {recentLogs.data.map((log) => (
                    <li key={log.id} className="flex flex-col gap-0.5 py-2.5 text-sm sm:flex-row sm:items-center sm:justify-between">
                      <span className="min-w-0 truncate">
                        <span className="font-medium text-slate-900">{log.user_email ?? "System"}</span>{" "}
                        <span className="text-slate-500">{log.action}</span> <span className="text-slate-700">{log.content_type}</span>
                      </span>
                      <span className="shrink-0 text-xs text-slate-500">{log.created_at ? IST.format(new Date(log.created_at)) : ""}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500">No activity recorded yet.</p>
              )}
              <Link href="/admin/activity-logs" className="mt-3 inline-block text-sm font-medium text-[#0B3B68] hover:underline">
                View full history →
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
