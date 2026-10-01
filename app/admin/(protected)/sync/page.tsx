import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/db/client";
import { requirePermission } from "@/lib/auth/session";
import SanitySyncPanel from "@/components/admin/sanity-sync-panel";
import { isSanityConfigured } from "@/lib/sanity/source";

export const metadata: Metadata = { title: "Sanity Sync" };

const IST = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

export default async function SanitySyncPage() {
  await requirePermission((p) => p.canManageSettings);
  const { data: runs, error } = await supabaseAdmin
    .from("cms_sync_runs")
    .select("id, trigger, status, summary, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Sanity Sync</h1>
      <div className="mt-2 max-w-3xl space-y-2 text-sm text-slate-600">
        <p>
          This dashboard is the primary CMS. Sanity remains connected as a <strong>read-only fallback and import source</strong>:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>If the database is unreachable, or a page has never existed in the dashboard, the site serves the published Sanity version.</li>
          <li>Importing copies <em>new</em> Sanity documents into the dashboard. It never changes or duplicates existing dashboard content, and never re-imports something deleted here.</li>
          <li>Set up a Sanity webhook to <code>/api/sanity-sync</code> with header <code>Authorization: Bearer $SANITY_WEBHOOK_SECRET</code> to import automatically on publish.</li>
        </ul>
      </div>

      {!isSanityConfigured ? (
        <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800" role="alert">
          Sanity isn&apos;t configured - set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.
        </p>
      ) : (
        <div className="mt-6">
          <SanitySyncPanel />
        </div>
      )}

      <section className="mt-10">
        <h2 className="font-semibold text-slate-900">Recent runs</h2>
        {error ? (
          <p className="mt-2 text-sm text-amber-800">Run history unavailable ({error.message}). Apply migration 0004.</p>
        ) : runs && runs.length > 0 ? (
          <ul className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
            {runs.map((run) => {
              const summary = run.summary as Record<string, { imported?: number }>;
              const imported = ["universities", "testimonials", "blog_posts", "landing_pages"].reduce((n, k) => n + (summary?.[k]?.imported ?? 0), 0);
              return (
                <li key={run.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                  <span>
                    <span className="font-medium capitalize text-slate-900">{run.trigger}</span> · {run.status} · {imported} imported
                  </span>
                  <span className="text-xs text-slate-500">{IST.format(new Date(run.created_at))}</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-500">No imports yet.</p>
        )}
      </section>
    </div>
  );
}
