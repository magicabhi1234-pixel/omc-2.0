import {
  LayoutDashboard,
  FileText,
  Newspaper,
  Image as ImageIcon,
  SearchCheck,
  Users,
  Settings,
  History,
  GraduationCap,
  MessageSquareQuote,
  Layers,
  Inbox,
  HelpCircle,
  ListTree,
  RefreshCcw,
  type LucideIcon,
} from "lucide-react";
import type { PermissionSet } from "@/lib/auth/permissions";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  permission?: keyof PermissionSet;
  /** Extra words the command palette matches on. */
  keywords?: string;
}

/** Single source of truth for the sidebar, breadcrumbs and command palette. */
export const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, keywords: "home overview analytics" },
      { href: "/admin/leads", label: "Leads", icon: Inbox, permission: "canManageLeads", keywords: "enquiries inquiries contacts newsletter export" },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/pages", label: "Landing Pages", icon: FileText, keywords: "programs comparisons" },
      { href: "/admin/blogs", label: "Blogs", icon: Newspaper, keywords: "articles posts guides" },
      { href: "/admin/content/universities", label: "Universities", icon: GraduationCap, keywords: "colleges fees" },
      { href: "/admin/content/testimonials", label: "Testimonials", icon: MessageSquareQuote, keywords: "reviews students" },
      { href: "/admin/faqs", label: "FAQs", icon: HelpCircle, permission: "canPublish", keywords: "questions answers" },
      { href: "/admin/content", label: "All Content", icon: Layers, keywords: "blocks" },
      { href: "/admin/media", label: "Media Library", icon: ImageIcon, permission: "canUploadMedia", keywords: "images uploads files" },
    ],
  },
  {
    label: "Site",
    items: [
      { href: "/admin/seo", label: "SEO", icon: SearchCheck, keywords: "meta titles descriptions" },
      { href: "/admin/menus", label: "Menus", icon: ListTree, permission: "canManageSettings", keywords: "navigation header footer mobile" },
      { href: "/admin/settings", label: "Global Settings", icon: Settings, permission: "canManageSettings", keywords: "logo favicon analytics gtm ga4 social contact" },
      { href: "/admin/sync", label: "Sanity Sync", icon: RefreshCcw, permission: "canManageSettings", keywords: "import cms" },
    ],
  },
  {
    label: "Admin",
    items: [
      { href: "/admin/users", label: "Users", icon: Users, permission: "canManageUsers", keywords: "team roles accounts" },
      { href: "/admin/activity-logs", label: "Activity Logs", icon: History, permission: "canViewActivityLogs", keywords: "audit history" },
    ],
  },
];

export function visibleNav(permissions: PermissionSet) {
  return NAV_GROUPS.map((g) => ({ ...g, items: g.items.filter((i) => !i.permission || permissions[i.permission]) })).filter((g) => g.items.length > 0);
}

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

/** The nav item a pathname belongs to (longest matching prefix). */
export function navItemFor(pathname: string): NavItem | undefined {
  return ALL_ITEMS.filter((i) => pathname === i.href || pathname.startsWith(i.href + "/")).sort((a, b) => b.href.length - a.href.length)[0];
}

const SEGMENT_LABELS: Record<string, string> = { new: "New", content: "Content", blocks: "Content Blocks" };

/** Breadcrumb trail for an admin pathname, e.g. Dashboard / Landing Pages / Edit. */
export function breadcrumbsFor(pathname: string): { label: string; href?: string }[] {
  const item = navItemFor(pathname);
  const crumbs: { label: string; href?: string }[] = [];
  if (!item) return [{ label: "Dashboard", href: "/admin/dashboard" }];
  if (item.href !== "/admin/dashboard") crumbs.push({ label: item.label, href: item.href });
  else crumbs.push({ label: "Dashboard" });
  const rest = pathname.slice(item.href.length).split("/").filter(Boolean);
  for (const segment of rest) crumbs.push({ label: SEGMENT_LABELS[segment] ?? (/^[0-9a-f-]{20,}$/.test(segment) ? "Edit" : segment.replace(/-/g, " ")) });
  if (crumbs.length > 0) delete crumbs[crumbs.length - 1].href;
  return crumbs;
}
