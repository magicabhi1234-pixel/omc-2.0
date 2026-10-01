"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Bell, ChevronRight, ExternalLink, Inbox, LogOut, Menu, Monitor, Moon, Search, Settings, Sun, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CurrentProfile } from "@/lib/auth/session";
import { ROLE_LABELS } from "@/lib/auth/permissions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { breadcrumbsFor } from "./nav";
import { getNotifications, type NotificationItem } from "../../../../app/admin/(protected)/shell-actions";
import { logoutAction } from "../../../../app/omc-adminlogin/actions";

const SEEN_KEY = "omc-admin-notifications-seen";

function initials(name: string) {
  return name
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

function timeAgo(iso: string) {
  const s = Math.max(1, Math.round((Date.now() - Date.parse(iso)) / 1000));
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

const iconButton =
  "relative inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 outline-none";

function Notifications() {
  const [items, setItems] = useState<NotificationItem[] | null>(null);
  const [seenAt, setSeenAt] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    try {
      return localStorage.getItem(SEEN_KEY) ?? "";
    } catch {
      return "";
    }
  });
  const [, startLoad] = useTransition();

  useEffect(() => {
    startLoad(async () => setItems(await getNotifications()));
  }, []);

  const unread = (items ?? []).filter((i) => i.at > seenAt).length;

  return (
    <Popover
      onOpenChange={(open) => {
        if (!open) return;
        startLoad(async () => setItems(await getNotifications()));
        const now = new Date().toISOString();
        // Mark as seen after the panel has rendered with the current unread state.
        setTimeout(() => {
          try {
            localStorage.setItem(SEEN_KEY, now);
          } catch {}
          setSeenAt(now);
        }, 1500);
      }}
    >
      <PopoverTrigger className={iconButton} aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}>
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 grid min-w-4 place-items-center rounded-full bg-brand-accent-strong px-1 text-[10px] leading-4 font-semibold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(92vw,380px)] gap-0 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          {unread > 0 && <span className="text-xs text-muted-foreground">{unread} new</span>}
        </div>
        <ul className="max-h-96 overflow-y-auto py-1">
          {items === null && <li className="px-4 py-6 text-center text-sm text-muted-foreground">Loading…</li>}
          {items?.length === 0 && <li className="px-4 py-8 text-center text-sm text-muted-foreground">You&apos;re all caught up.</li>}
          {items?.map((item) => (
            <li key={item.id}>
              <Link href={item.href} className="flex gap-3 px-4 py-3 transition hover:bg-accent">
                <span className={cn("mt-0.5 grid size-8 shrink-0 place-items-center rounded-full", item.kind === "lead" ? "bg-warning-soft text-warning" : "bg-info-soft text-primary")}>
                  {item.kind === "lead" ? <Inbox size={15} /> : <User size={15} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-foreground">{item.title}</span>
                    {item.at > seenAt && <span className="size-1.5 shrink-0 rounded-full bg-brand-accent" aria-label="unread" />}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {item.detail} · {timeAgo(item.at)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

function ThemeMenuItems() {
  const { theme, setTheme } = useTheme();
  const options = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "system", label: "System", icon: Monitor },
  ] as const;
  return (
    <div className="px-1.5 py-1.5">
      <p className="px-0.5 pb-1.5 text-xs font-medium text-muted-foreground">Theme</p>
      <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1" role="radiogroup" aria-label="Theme">
        {options.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={theme === id}
            onClick={() => setTheme(id)}
            className={cn(
              "flex cursor-pointer flex-col items-center gap-1 rounded-md py-1.5 text-[11px] transition",
              theme === id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon size={15} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button type="button" className={iconButton} onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} aria-label="Toggle dark mode" title="Toggle theme">
      <Moon size={18} className="dark:hidden" aria-hidden="true" />
      <Sun size={18} className="hidden dark:block" aria-hidden="true" />
    </button>
  );
}

export default function Topbar({
  profile,
  onOpenMenu,
  onOpenSearch,
}: {
  profile: CurrentProfile;
  onOpenMenu: () => void;
  onOpenSearch: () => void;
}) {
  const pathname = usePathname();
  const crumbs = breadcrumbsFor(pathname);
  const name = profile.fullName || profile.email;

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-card/85 px-3 backdrop-blur supports-[backdrop-filter]:bg-card/75 sm:px-5">
      <button type="button" onClick={onOpenMenu} className={cn(iconButton, "lg:hidden")} aria-label="Open navigation">
        <Menu size={20} />
      </button>

      <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
        <ol className="flex min-w-0 items-center gap-1.5 text-sm">
          <li className="hidden sm:block">
            <Link href="/admin/dashboard" className="text-muted-foreground transition hover:text-foreground">
              Admin
            </Link>
          </li>
          {crumbs.map((crumb, i) => (
            <li key={`${crumb.label}-${i}`} className={cn("flex min-w-0 items-center gap-1.5", i < crumbs.length - 1 && "hidden md:flex")}>
              <ChevronRight size={14} className="hidden shrink-0 text-muted-foreground/60 sm:block" aria-hidden="true" />
              {crumb.href ? (
                <Link href={crumb.href} className="truncate text-muted-foreground transition hover:text-foreground">
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current="page" className="truncate font-medium text-foreground capitalize">
                  {crumb.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <button
        type="button"
        onClick={onOpenSearch}
        className="hidden h-9 w-64 cursor-pointer items-center gap-2 rounded-lg border border-input bg-muted/60 px-3 text-sm text-muted-foreground transition hover:border-muted-foreground/40 hover:bg-muted md:flex"
      >
        <Search size={15} aria-hidden="true" />
        <span className="flex-1 text-left">Search…</span>
        <kbd className="rounded border border-border bg-card px-1.5 text-[11px]">Ctrl K</kbd>
      </button>
      <button type="button" onClick={onOpenSearch} className={cn(iconButton, "md:hidden")} aria-label="Search">
        <Search size={18} />
      </button>

      <ThemeToggle />
      <Notifications />

      <DropdownMenu>
        <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 rounded-lg p-1 pr-1.5 transition outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/40" aria-label="Account menu">
          <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-brand to-[#1d5a94] text-xs font-semibold text-white">{initials(name)}</span>
          <span className="hidden text-left leading-tight xl:block">
            <span className="block max-w-36 truncate text-sm font-medium text-foreground">{name}</span>
            <span className="block text-xs text-muted-foreground">{ROLE_LABELS[profile.role]}</span>
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 p-1.5">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-2 py-2">
              <span className="block truncate text-sm font-semibold text-foreground">{name}</span>
              <span className="block truncate text-xs font-normal text-muted-foreground">{profile.email}</span>
              <span className="mt-1.5 inline-flex rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">{ROLE_LABELS[profile.role]}</span>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <ThemeMenuItems />
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<a href="/" target="_blank" rel="noopener noreferrer" />} className="px-2 py-2">
            <ExternalLink /> View website
          </DropdownMenuItem>
          {profile.permissions.canManageSettings && (
            <DropdownMenuItem render={<Link href="/admin/settings" />} className="px-2 py-2">
              <Settings /> Global settings
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" className="px-2 py-2" onClick={() => logoutAction()}>
            <LogOut /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
