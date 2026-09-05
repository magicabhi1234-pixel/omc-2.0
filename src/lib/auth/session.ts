import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/db/client";
import { permissionsFor, type PermissionSet, type Role } from "./permissions";

export interface CurrentProfile {
  id: string;
  email: string;
  fullName: string | null;
  role: Role;
  isActive: boolean;
  permissions: PermissionSet;
}

/** Null if not logged in, or if their profile has been deactivated/deleted. */
export async function getCurrentProfile(): Promise<CurrentProfile | null> {
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
}

/** Redirects to /admin/login if not authenticated, or to /admin/dashboard with no further access if the account is deactivated. */
export async function requireProfile(): Promise<CurrentProfile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/admin/login");
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
