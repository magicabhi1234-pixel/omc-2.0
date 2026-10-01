import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/db/client";
import { canAccessContent, permissionsFor, type PermissionSet, type Role } from "./permissions";

export interface CurrentProfile {
  id: string;
  email: string;
  fullName: string | null;
  role: Role;
  isActive: boolean;
  permissions: PermissionSet;
}

/**
 * Null if not logged in, or if their profile has been deactivated/deleted.
 * Memoized per request: layout, page and actions share one lookup.
 */
export const getCurrentProfile = cache(async function getCurrentProfile(): Promise<CurrentProfile | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Profile lookup uses the service-role client (not the anon/RLS-scoped
  // one above) so it can join role name in one query regardless of RLS.
  const { data } = await supabaseAdmin
    .from("profiles")
    .select("id, email, full_name, is_active, roles(name)")
    .eq("id", user.id)
    .maybeSingle();

  if (!data || !data.is_active) return null;

  const roleName = (data.roles as unknown as { name: Role } | { name: Role }[] | null);
  const role = Array.isArray(roleName) ? roleName[0]?.name : roleName?.name;
  if (!role) return null;

  return {
    id: data.id,
    email: data.email,
    fullName: data.full_name,
    role,
    isActive: data.is_active,
    permissions: permissionsFor(role),
  };
});

/** Redirects to the login page if not signed in or if the account has no active profile. */
export async function requireProfile(): Promise<CurrentProfile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/omc-adminlogin");
  return profile;
}

/** Redirects away (to the dashboard) if the current user lacks a required permission - use in Server Components for page-level gating. */
export async function requirePermission(
  check: (permissions: PermissionSet) => boolean
): Promise<CurrentProfile> {
  const profile = await requireProfile();
  if (!check(profile.permissions)) redirect("/admin/dashboard");
  return profile;
}

/**
 * Ownership check for "own"-scoped roles (authors): returns an error message
 * if `profile` may not modify row `id` of `table`, otherwise null.
 */
export async function contentAccessError(
  profile: CurrentProfile,
  table: "blog_posts" | "landing_pages" | "universities" | "testimonials" | "content_blocks",
  id: string
): Promise<string | null> {
  const { data } = await supabaseAdmin.from(table).select("created_by").eq("id", id).maybeSingle();
  if (!data) return "This item no longer exists.";
  return canAccessContent(profile.permissions, profile.id, data.created_by)
    ? null
    : "You can only change content you created.";
}
