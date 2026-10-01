import Link from "next/link";
import { ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Page title row: title + description on the left, actions on the right (stacks on phones). */
export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
}: {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="mb-1 text-xs font-semibold tracking-wider text-brand-accent-strong uppercase dark:text-brand-accent">{eyebrow}</p>}
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">{title}</h1>
        {description && <p className="mt-1.5 max-w-3xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/** White card section with an optional header row. */
export function Panel({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("rounded-xl border border-border bg-card shadow-[0_1px_2px_rgb(15_23_42/0.04)]", className)}>
      {(title || actions) && (
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0">
            {title && <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>}
            {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  href,
  hint,
  tone = "brand",
  trend,
}: {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  href?: string;
  hint?: React.ReactNode;
  tone?: "brand" | "accent" | "success" | "neutral";
  trend?: { value: string; positive: boolean } | null;
}) {
  const toneClass = {
    brand: "bg-secondary text-primary",
    accent: "bg-warning-soft text-brand-accent-strong dark:text-brand-accent",
    success: "bg-success-soft text-success",
    neutral: "bg-muted text-muted-foreground",
  }[tone];
  const body = (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-[0_1px_2px_rgb(15_23_42/0.04)] transition group-hover:-translate-y-0.5 group-hover:border-primary/25 group-hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", toneClass)}>
          <Icon size={18} aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-[28px] leading-none font-semibold tracking-tight text-foreground tabular-nums">{value}</p>
      <div className="mt-2 flex min-h-5 items-center gap-2 text-xs">
        {trend && (
          <span className={cn("rounded-full px-1.5 py-0.5 font-medium", trend.positive ? "bg-success-soft text-success" : "bg-muted text-muted-foreground")}>{trend.value}</span>
        )}
        {hint && <span className="truncate text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
  return href ? (
    <Link href={href} className="group rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring/40">
      {body}
    </Link>
  ) : (
    <div className="group">{body}</div>
  );
}

export function EmptyState({
  icon: Icon,
  iconNode,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  /** Pre-rendered icon - use from client components (component functions can't cross the server/client boundary). */
  iconNode?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary">
        {iconNode ?? (Icon ? <Icon size={22} aria-hidden="true" /> : null)}
      </span>
      <p className="mt-4 text-[15px] font-semibold text-foreground">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/** Numbered pagination for server-paginated lists (builds hrefs) - shows a window around the current page. */
export function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  hrefFor,
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  hrefFor: (page: number) => string;
}) {
  if (totalItems === 0) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(totalItems, page * pageSize);
  const pages = Array.from(new Set([1, page - 1, page, page + 1, totalPages].filter((p) => p >= 1 && p <= totalPages))).sort((a, b) => a - b);
  const link = "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm transition";
  return (
    <nav aria-label="Pagination" className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm sm:flex-row">
      <p className="text-muted-foreground">
        Showing <span className="font-medium text-foreground tabular-nums">{from}–{to}</span> of <span className="font-medium text-foreground tabular-nums">{totalItems}</span>
      </p>
      <div className="flex items-center gap-1">
        {page > 1 ? (
          <Link href={hrefFor(page - 1)} className={cn(link, "border border-input bg-card hover:bg-accent")} aria-label="Previous page">
            <ChevronLeft size={15} />
          </Link>
        ) : (
          <span className={cn(link, "border border-input text-muted-foreground/50")} aria-hidden="true"><ChevronLeft size={15} /></span>
        )}
        {pages.map((p, i) => (
          <span key={p} className="flex items-center">
            {i > 0 && p - pages[i - 1] > 1 && <span className="px-1 text-muted-foreground">…</span>}
            <Link href={hrefFor(p)} aria-current={p === page ? "page" : undefined} className={cn(link, p === page ? "bg-primary font-medium text-primary-foreground" : "hover:bg-accent")}>
              {p}
            </Link>
          </span>
        ))}
        {page < totalPages ? (
          <Link href={hrefFor(page + 1)} className={cn(link, "border border-input bg-card hover:bg-accent")} aria-label="Next page">
            <ChevronRight size={15} />
          </Link>
        ) : (
          <span className={cn(link, "border border-input text-muted-foreground/50")} aria-hidden="true"><ChevronRight size={15} /></span>
        )}
      </div>
    </nav>
  );
}

/** Small dot + label status, consistent across tables. */
export function StatusDot({ status }: { status: string }) {
  const map: Record<string, string> = {
    published: "bg-success",
    draft: "bg-muted-foreground/50",
    new: "bg-primary",
    contacted: "bg-warning",
    qualified: "bg-violet-500",
    converted: "bg-success",
    closed: "bg-muted-foreground/50",
    spam: "bg-destructive",
    subscribed: "bg-success",
    unsubscribed: "bg-muted-foreground/50",
  };
  return (
    <span className="inline-flex items-center gap-1.5 text-sm capitalize">
      <span className={cn("size-2 rounded-full", map[status] ?? "bg-muted-foreground/50")} aria-hidden="true" />
      {status}
    </span>
  );
}
