import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, Newspaper, GraduationCap, MessageSquareQuote, Layers, HelpCircle } from "lucide-react";
import { supabaseAdmin } from "@/lib/db/client";
import { requireProfile } from "@/lib/auth/session";
import { PageHeader } from "@/components/admin/page-kit";

export const metadata: Metadata = { title: "All Content" };

async function counts(table: string) {
  const [total, published] = await Promise.all([
    supabaseAdmin.from(table).select("*", { count: "exact", head: true }),
    supabaseAdmin.from(table).select("*", { count: "exact", head: true }).eq("status", "published"),
  ]);
  return { total: total.count ?? 0, published: published.count ?? 0 };
}

export default async function ContentHubPage() {
  await requireProfile();
  const [pages, blogs, universities, testimonials, faqs, blocks] = await Promise.all(
    ["landing_pages", "blog_posts", "universities", "testimonials", "faqs", "content_blocks"].map(counts)
  );

  const types = [
    { label: "Landing Pages", ...pages, href: "/admin/pages", icon: FileText, description: "Program and university comparison pages" },
    { label: "Blog Posts", ...blogs, href: "/admin/blogs", icon: Newspaper, description: "Articles with rich-text content" },
    { label: "Universities", ...universities, href: "/admin/content/universities", icon: GraduationCap, description: "Profiles, fees and approvals" },
    { label: "Testimonials", ...testimonials, href: "/admin/content/testimonials", icon: MessageSquareQuote, description: "Student reviews" },
    { label: "FAQs", ...faqs, href: "/admin/faqs", icon: HelpCircle, description: "Homepage, contact and about FAQs" },
    { label: "Content Blocks", ...blocks, href: "/admin/content/blocks", icon: Layers, description: "Flexible content for future types" },
  ];

  return (
    <div>
      <PageHeader title="All Content" description="Every content type you can manage from this dashboard." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {types.map(({ label, total, published, href, icon: Icon, description }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col rounded-xl border border-border bg-card p-5 shadow-[0_1px_2px_rgb(15_23_42/0.04)] transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
                <Icon size={19} aria-hidden="true" />
              </span>
              <ArrowRight size={16} className="text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
            </div>
            <p className="mt-4 font-semibold text-foreground">{label}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
            <div className="mt-4 flex items-end gap-3">
              <span className="text-2xl font-semibold tracking-tight tabular-nums">{total}</span>
              <span className="pb-1 text-xs text-muted-foreground">
                {published} published · {total - published} draft
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
              <div className="h-full rounded-full bg-primary" style={{ width: `${total ? (published / total) * 100 : 0}%` }} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
