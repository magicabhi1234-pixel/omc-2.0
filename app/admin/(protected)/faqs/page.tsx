import type { Metadata } from "next";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/db/client";
import { requirePermission } from "@/lib/auth/session";
import FaqManager, { type FaqRow } from "@/components/admin/faq-manager";
import { cn } from "@/lib/utils";
import { FAQ_PLACEMENTS, type FaqPlacement } from "@/lib/site-settings";
import { PageHeader } from "@/components/admin/page-kit";

export const metadata: Metadata = { title: "FAQs" };

export default async function FaqsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const profile = await requirePermission((p) => p.canPublish);
  const { page } = await searchParams;
  const placement = (page && page in FAQ_PLACEMENTS ? page : "home") as FaqPlacement;

  const { data, error } = await supabaseAdmin
    .from("faqs")
    .select("id, question, answer, status, placement")
    .order("sort_order", { ascending: true });
  const all = data ?? [];
  const rows = all.filter((f) => f.placement === placement) as FaqRow[];

  return (
    <div>
      <PageHeader title="FAQs" description={<>Published FAQs appear on their page and are marked up as FAQPage structured data for Google and AI answer engines. Landing-page and blog FAQs are edited on those pages.</>} />

      {error && (
        <p className="mt-4 rounded-lg border border-warning/30 bg-warning-soft p-4 text-sm text-warning" role="alert">
          Couldn&apos;t load FAQs: {error.message}. If the table is missing, apply <code>supabase/migrations/0004_dashboard_modules.sql</code>.
        </p>
      )}

      <nav aria-label="FAQ pages" className="mt-6 flex gap-1 overflow-x-auto border-b border-border">
        {(Object.keys(FAQ_PLACEMENTS) as FaqPlacement[]).map((key) => (
          <Link
            key={key}
            href={`/admin/faqs?page=${key}`}
            aria-current={key === placement ? "page" : undefined}
            className={cn(
              "-mb-px border-b-2 px-4 py-2 text-sm font-medium whitespace-nowrap transition",
              key === placement ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {FAQ_PLACEMENTS[key]} ({all.filter((f) => f.placement === key).length})
          </Link>
        ))}
      </nav>

      <div className="mt-6">
        <FaqManager key={placement} placement={placement} initial={rows} canDelete={profile.permissions.canDeleteContent} />
      </div>
    </div>
  );
}
