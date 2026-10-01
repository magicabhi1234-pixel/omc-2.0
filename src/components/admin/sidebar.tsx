"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Newspaper,
  Image as ImageIcon,
  Search,
  Users,
  Settings,
  History,
  GraduationCap,
  MessageSquareQuote,
  LogOut,
  Layers,
  Inbox,
  HelpCircle,
  Menu as MenuIcon,
  ListTree,
  RefreshCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CurrentProfile } from "@/lib/auth/session";
import { ROLE_LABELS, type PermissionSet } from "@/lib/auth/permissions";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { logoutAction } from "../../../app/omc-adminlogin/actions";

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard; permission?: keyof PermissionSet };

const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/leads", label: "Leads", icon: Inbox, permission: "canManageLeads" },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/pages", label: "Landing Pages", icon: FileText },
      { href: "/admin/blogs", label: "Blogs", icon: Newspaper },
      { href: "/admin/content/universities", label: "Universities", icon: GraduationCap },
      { href: "/admin/content/testimonials", label: "Testimonials", icon: MessageSquareQuote },
      { href: "/admin/faqs", label: "FAQs", icon: HelpCircle, permission: "canPublish" },
      { href: "/admin/content", label: "All Content", icon: Layers },
      { href: "/admin/media", label: "Media Library", icon: ImageIcon, permission: "canUploadMedia" },
    ],
  },
  {
    label: "Site",
    items: [
      { href: "/admin/seo", label: "SEO", icon: Search },
      { href: "/admin/menus", label: "Menus", icon: ListTree, permission: "canManageSettings" },
      { href: "/admin/settings", label: "Global Settings", icon: Settings, permission: "canManageSettings" },
      { href: "/admin/sync", label: "Sanity Sync", icon: RefreshCcw, permission: "canManageSettings" },
    ],
  },
  {
    label: "Admin",
    items: [
      { href: "/admin/users", label: "Users", icon: Users, permission: "canManageUsers" },
      { href: "/admin/activity-logs", label: "Activity Logs", icon: History, permission: "canViewActivityLogs" },
    ],
  },
];

function NavContent({ profile, pathname, onNavigate }: { profile: CurrentProfile; pathname: string; onNavigate?: () => void }) {
  return (
    <>
      <nav aria-label="Dashboard" className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => {
          const items = group.items.filter((item) => !item.permission || profile.permissions[item.permission]);
          if (items.length === 0) return null;
          return (
            <div key={group.label}>
              <p className="px-3 pb-1 text-xs font-semibold tracking-wide text-slate-500 uppercase">{group.label}</p>
              <ul className="space-y-0.5">
                {items.map((item) => {
                  // "All Content" (/admin/content) shouldn't light up for its own sub-sections.
                  const active =
                    pathname === item.href ||
                    (pathname.startsWith(item.href + "/") && !(item.href === "/admin/content" && /\/admin\/content\/(universities|testimonials)/.test(pathname)));
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                          active ? "bg-[#0B3B68] text-white" : "text-slate-700 hover:bg-slate-100"
                        )}
                      >
                        <Icon size={18} aria-hidden="true" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <p className="truncate text-sm font-medium text-slate-900">{profile.fullName || profile.email}</p>
        <p className="text-xs text-slate-500">{ROLE_LABELS[profile.role]}</p>
        <form action={logoutAction} className="mt-3">
          <button
            type="submit"
            className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            <LogOut size={16} aria-hidden="true" />
            Log out
          </button>
        </form>
      </div>
    </>
  );
}

function Brand() {
  return (
    <div>
      <p className="text-lg font-bold text-[#0B3B68]">OMC Admin</p>
      <p className="mt-0.5 text-xs text-slate-500">Content Management</p>
    </div>
  );
}

/** Fixed sidebar on large screens; a top bar + slide-out drawer on phones and tablets. */
export default function AdminSidebar({ profile }: { profile: CurrentProfile }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="border-b border-slate-200 px-6 py-5">
          <Brand />
        </div>
        <NavContent profile={profile} pathname={pathname} />
      </aside>

      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <Brand />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open dashboard menu"
          aria-expanded={open}
          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-[#0B3B68] hover:bg-slate-100"
        >
          <MenuIcon size={22} />
        </button>
      </header>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 gap-0 p-0">
          <div className="border-b border-slate-200 px-6 py-5">
            <SheetTitle className="sr-only">Dashboard menu</SheetTitle>
            <Brand />
          </div>
          <NavContent profile={profile} pathname={pathname} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
