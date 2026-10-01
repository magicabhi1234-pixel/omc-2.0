"use server";

import { supabaseAdmin } from "@/lib/db/client";
import { requireProfile } from "@/lib/auth/session";

export interface SearchHit {
  type: "Landing page" | "Blog post" | "University" | "Lead" | "FAQ";
  title: string;
  subtitle?: string;
  href: string;
}

/** Sanitise for PostgREST or-filters / ILIKE. */
const term = (q: string) => q.replace(/[,()*%_\\:"']/g, " ").replace(/\s+/g, " ").trim().slice(0, 60);

/** Command-palette search across content (and leads, for roles that can see them). */
export async function globalSearch(query: string): Promise<SearchHit[]> {
  const profile = await requireProfile();
  const q = term(query);
  if (q.length < 2) return [];
  const like = `%${q}%`;

  const [pages, posts, unis, faqs, leads] = await Promise.all([
    supabaseAdmin.from("landing_pages").select("id, title, slug, status").or(`title.ilike.${like},slug.ilike.${like}`).limit(5),
    supabaseAdmin.from("blog_posts").select("id, title, slug, status").or(`title.ilike.${like},slug.ilike.${like}`).limit(5),
    supabaseAdmin.from("universities").select("id, name, starting_fee").ilike("name", like).limit(5),
    supabaseAdmin.from("faqs").select("id, question, placement").ilike("question", like).limit(3),
    profile.permissions.canManageLeads
      ? supabaseAdmin.from("leads").select("id, name, email, mobile").or(`name.ilike.${like},email.ilike.${like},mobile.ilike.${like}`).order("created_at", { ascending: false }).limit(5)
      : Promise.resolve({ data: [] as { id: string; name: string; email: string; mobile: string }[] }),
  ]);

  return [
    ...(pages.data ?? []).map((p) => ({ type: "Landing page" as const, title: p.title, subtitle: `/${p.slug} · ${p.status}`, href: `/admin/pages/${p.id}` })),
    ...(posts.data ?? []).map((p) => ({ type: "Blog post" as const, title: p.title, subtitle: `${p.slug} · ${p.status}`, href: `/admin/blogs/${p.id}` })),
    ...(unis.data ?? []).map((u) => ({ type: "University" as const, title: u.name, subtitle: u.starting_fee, href: `/admin/content/universities/${u.id}` })),
    ...(faqs.data ?? []).map((f) => ({ type: "FAQ" as const, title: f.question, subtitle: f.placement, href: `/admin/faqs?page=${f.placement}` })),
    ...(leads.data ?? []).map((l) => ({ type: "Lead" as const, title: l.name, subtitle: `${l.mobile} · ${l.email}`, href: `/admin/leads?q=${encodeURIComponent(l.mobile)}` })),
  ];
}

const VERBS: Record<string, string> = {
  create: "created",
  update: "updated",
  delete: "deleted",
  publish: "published",
  unpublish: "unpublished",
  upload: "uploaded",
  export: "exported",
  user_create: "created user",
  user_update: "updated user",
  user_delete: "deleted user",
  password_reset: "reset the password of a",
};

export interface NotificationItem {
  id: string;
  kind: "lead" | "activity";
  title: string;
  detail: string;
  at: string;
  href: string;
}

/** Bell menu: newest leads (if permitted) and recent team activity (if permitted). */
export async function getNotifications(): Promise<NotificationItem[]> {
  const profile = await requireProfile();
  const [leads, logs] = await Promise.all([
    profile.permissions.canManageLeads
      ? supabaseAdmin.from("leads").select("id, name, specialization, created_at").order("created_at", { ascending: false }).limit(8)
      : Promise.resolve({ data: [] as { id: string; name: string; specialization: string; created_at: string }[] }),
    profile.permissions.canViewActivityLogs
      ? supabaseAdmin
          .from("activity_logs")
          .select("id, user_email, action, content_type, created_at")
          .neq("user_id", profile.id)
          .not("action", "in", "(login,logout)")
          .order("created_at", { ascending: false })
          .limit(6)
      : Promise.resolve({ data: [] as { id: string; user_email: string | null; action: string; content_type: string; created_at: string }[] }),
  ]);

  return [
    ...(leads.data ?? []).map((l) => ({ id: `lead-${l.id}`, kind: "lead" as const, title: `New lead: ${l.name}`, detail: l.specialization, at: l.created_at, href: "/admin/leads" })),
    ...(logs.data ?? []).map((a) => ({
      id: `log-${a.id}`,
      kind: "activity" as const,
      title: `${a.user_email ?? "Someone"} ${VERBS[a.action] ?? a.action} ${a.content_type.replace(/_/g, " ")}`,
      detail: a.content_type.replace(/_/g, " "),
      at: a.created_at,
      href: "/admin/activity-logs",
    })),
  ].sort((a, b) => b.at.localeCompare(a.at));
}
