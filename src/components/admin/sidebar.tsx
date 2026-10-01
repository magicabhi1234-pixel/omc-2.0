"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CurrentProfile } from "@/lib/auth/session";
import { navItemFor, visibleNav } from "@/components/admin/shell/nav";

export function BrandMark({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <Link href="/admin/dashboard" className="flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-sm font-bold tracking-tight text-brand shadow-sm">
        OMC
      </span>
      {!collapsed && (
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-[15px] font-semibold text-white">Online MBA Colleges</span>
          <span className="block text-xs text-sidebar-foreground/70">Admin console</span>
        </span>
      )}
    </Link>
  );
}

/** Navigation list - shared by the desktop sidebar and the mobile drawer. */
export function SidebarNav({
  profile,
  collapsed = false,
  onNavigate,
}: {
  profile: CurrentProfile;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = navItemFor(pathname)?.href;

  return (
    <nav aria-label="Dashboard" className={cn("flex-1 space-y-4 overflow-y-auto py-3", collapsed ? "px-2" : "px-3")}>
      {visibleNav(profile.permissions).map((group) => (
        <div key={group.label}>
          {collapsed ? (
            <div className="mx-auto mb-2 h-px w-6 bg-sidebar-border" aria-hidden="true" />
          ) : (
            <p className="px-3 pb-1.5 text-[11px] font-semibold tracking-[0.08em] text-sidebar-foreground/55 uppercase">{group.label}</p>
          )}
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const isActive = item.href === active;
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={isActive ? "page" : undefined}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                      collapsed ? "justify-center px-0 py-2" : "px-3 py-[7px]",
                      isActive
                        ? "bg-white/[0.12] text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.06)]"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
                    )}
                  >
                    {isActive && <span className="absolute top-1/2 left-0 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-brand-accent" aria-hidden="true" />}
                    <Icon size={18} strokeWidth={isActive ? 2.25 : 1.9} aria-hidden="true" className={cn("shrink-0", isActive ? "text-brand-accent" : "text-sidebar-foreground/80 group-hover:text-white")} />
                    {collapsed ? <span className="sr-only">{item.label}</span> : <span className="truncate">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/** Desktop sidebar (lg+). Collapsed state lives in a cookie so it renders correctly on first paint. */
export default function AdminSidebar({
  profile,
  collapsed,
  onToggle,
}: {
  profile: CurrentProfile;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <aside
      className={cn(
        "relative hidden h-dvh shrink-0 flex-col border-r border-black/10 text-sidebar-foreground transition-[width] duration-200 lg:flex",
        collapsed ? "w-[72px]" : "w-64"
      )}
      style={{ backgroundImage: "var(--sidebar-gradient)" }}
    >
      <div className={cn("flex h-16 items-center border-b border-sidebar-border", collapsed ? "justify-center px-2" : "px-4")}>
        <BrandMark collapsed={collapsed} />
      </div>

      <SidebarNav profile={profile} collapsed={collapsed} />

      <div className={cn("space-y-1 border-t border-sidebar-border p-3", collapsed && "px-2")}>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          title={collapsed ? "View website" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-lg py-2 text-sm text-sidebar-foreground transition hover:bg-sidebar-accent hover:text-white",
            collapsed ? "justify-center" : "px-3"
          )}
        >
          <ExternalLink size={17} aria-hidden="true" />
          {!collapsed && <span>View website</span>}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar  [" : "Collapse sidebar  ["}
          className={cn(
            "flex w-full cursor-pointer items-center gap-3 rounded-lg py-2 text-sm text-sidebar-foreground transition hover:bg-sidebar-accent hover:text-white",
            collapsed ? "justify-center" : "px-3"
          )}
        >
          {collapsed ? <ChevronsRight size={17} aria-hidden="true" /> : <ChevronsLeft size={17} aria-hidden="true" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
