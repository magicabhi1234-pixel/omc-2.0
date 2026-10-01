import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Crumb } from "@/lib/structured-data";

/** Visible breadcrumb trail - pair with breadcrumbSchema() using the same crumbs. */
export default function Breadcrumbs({ crumbs, className = "" }: { crumbs: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={`mx-auto max-w-7xl px-4 pt-4 text-sm ${className}`}>
      <ol className="flex flex-wrap items-center gap-1 text-slate-600">
        {crumbs.map((crumb, index) => {
          const last = index === crumbs.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-1">
              {index > 0 && <ChevronRight size={14} aria-hidden="true" className="text-slate-400" />}
              {last ? (
                <span aria-current="page" className="line-clamp-1 font-medium text-slate-900">
                  {crumb.name}
                </span>
              ) : (
                <Link href={crumb.path} className="hover:text-[#0B3B68] hover:underline">
                  {crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
