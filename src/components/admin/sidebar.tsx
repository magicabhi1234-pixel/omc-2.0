"use client";

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
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CurrentProfile } from "@/lib/auth/session";
import { ROLE_LABELS } from "@/lib/auth/permissions";
import { logoutAction } from "../../../app/admin/login/actions";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/pages", label: "Landing Pages", icon: FileText },
  { href: "/admin/blogs", label: "Blogs", icon: Newspaper },
  { href: "/admin/content/universities", label: "Universities", icon: GraduationCap },
  { href: "/admin/content/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/content", label: "All Content", icon: Layers },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/seo", label: "SEO", icon: Search },
  { href: "/admin/users", label: "Users", icon: Users, permission: "canManageUsers" as const },
  { href: "/admin/settings", label: "Settings", icon: Settings, permission: "canManageSettings" as const },
  { href: "/admin/activity-logs", label: "Activity Logs", icon: History, permission: "canViewActivityLogs" as const },
];

export default function AdminSidebar({ profile }: { profile: CurrentProfile }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-6 py-5">
        <p className="text-lg font-bold text-[#0B3B68]">OMC Admin</p>
        <p className="mt-0.5 text-xs text-slate-500">Content Management</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.filter((item) => !item.permission || profile.permissions[item.permission]).map(
          (item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-[#0B3B68] text-white"
                    : "text-slate-700 hover:bg-slate-100"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          }
        )}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <p className="truncate text-sm font-medium text-slate-900">{profile.fullName || profile.email}</p>
        <p className="text-xs text-slate-500">{ROLE_LABELS[profile.role]}</p>
        <form action={logoutAction} className="mt-3">
          <button
            type="submit"
            className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            <LogOut size={16} />
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
