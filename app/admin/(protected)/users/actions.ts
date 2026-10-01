"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/db/client";
import { requirePermission, type CurrentProfile } from "@/lib/auth/session";
import { logActivity } from "@/lib/auth/activity-log";
import { ROLES, type Role } from "@/lib/auth/permissions";

type Result = { error?: string };

const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9_.-]{3,40}$/, "Username: 3-40 characters, a-z, 0-9, dot, dash or underscore");
const passwordSchema = z
  .string()
  .min(12, "Password must be at least 12 characters")
  .max(200)
  .refine((v) => /[a-z]/.test(v) && /[A-Z]/.test(v) && /\d/.test(v), "Password must mix upper-case, lower-case and digits");
const idSchema = z.string().uuid();

const createUserSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  username: usernameSchema.optional().or(z.literal("")),
  full_name: z.string().trim().min(1).max(150),
  password: passwordSchema,
  role: z.enum(ROLES),
});

export interface UserFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
  values?: Record<string, string>;
}

async function roleOf(userId: string): Promise<Role | null> {
  const { data } = await supabaseAdmin.from("profiles").select("roles(name)").eq("id", userId).maybeSingle();
  const roles = data?.roles as { name: Role } | { name: Role }[] | null | undefined;
  return (Array.isArray(roles) ? roles[0]?.name : roles?.name) ?? null;
}

/** Blocks changes that would leave the site with no active Super Admin. */
async function lastSuperAdminError(userId: string): Promise<string | null> {
  if ((await roleOf(userId)) !== "super_admin") return null;
  const { data: role } = await supabaseAdmin.from("roles").select("id").eq("name", "super_admin").single();
  const { count } = await supabaseAdmin
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role_id", role?.id ?? "")
    .eq("is_active", true);
  return (count ?? 0) <= 1 ? "This is the only active Super Admin - promote someone else first." : null;
}

function selfError(profile: CurrentProfile, userId: string, what: string) {
  return userId === profile.id ? `You can't ${what} your own account.` : null;
}

export async function createUser(_prevState: UserFormState, formData: FormData): Promise<UserFormState> {
  const profile = await requirePermission((p) => p.canManageUsers);
  const values = Object.fromEntries(["email", "username", "full_name", "role"].map((k) => [k, String(formData.get(k) ?? "")]));
  const parsed = createUserSchema.safeParse({ ...values, password: String(formData.get("password") ?? "") });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
    return { error: "Please fix the highlighted fields.", fieldErrors, values };
  }
  const { email, username, full_name, password, role } = parsed.data;
  if (role === "super_admin" && !profile.permissions.canManageRoles) return { error: "Only Super Admins can create Super Admins.", values };

  if (username) {
    const { data: taken } = await supabaseAdmin.from("profiles").select("id").eq("username", username).maybeSingle();
    if (taken) return { error: "Please fix the highlighted fields.", fieldErrors: { username: "That username is already taken" }, values };
  }

  const { data: roleRow } = await supabaseAdmin.from("roles").select("id").eq("name", role).single();
  if (!roleRow) return { error: "Invalid role.", values };

  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({ email, password, email_confirm: true });
  if (authError || !authUser.user) return { error: authError?.message ?? "Failed to create user.", values };

  const { error: profileError } = await supabaseAdmin.from("profiles").insert({
    id: authUser.user.id,
    email,
    full_name,
    role_id: roleRow.id,
    is_active: true,
    ...(username ? { username } : {}),
  });
  if (profileError) {
    await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
    return { error: profileError.message, values };
  }

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: "user_create",
    contentType: "user",
    contentId: authUser.user.id,
    newValue: { email, username: username || null, full_name, role },
  });

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function updateUserRole(userId: string, role: Role): Promise<Result> {
  const profile = await requirePermission((p) => p.canManageRoles);
  if (!idSchema.safeParse(userId).success || !(ROLES as readonly string[]).includes(role)) return { error: "Invalid input." };
  const blocked = selfError(profile, userId, "change the role of") ?? (role !== "super_admin" ? await lastSuperAdminError(userId) : null);
  if (blocked) return { error: blocked };

  const { data: roleRow } = await supabaseAdmin.from("roles").select("id").eq("name", role).single();
  if (!roleRow) return { error: "Invalid role." };
  const previous = await roleOf(userId);
  const { error } = await supabaseAdmin.from("profiles").update({ role_id: roleRow.id }).eq("id", userId);
  if (error) return { error: error.message };

  await logActivity({ userId: profile.id, userEmail: profile.email, action: "user_update", contentType: "user", contentId: userId, previousValue: { role: previous }, newValue: { role } });
  revalidatePath("/admin/users");
  return {};
}

export async function updateUsername(userId: string, username: string): Promise<Result> {
  const profile = await requirePermission((p) => p.canManageUsers);
  if (!idSchema.safeParse(userId).success) return { error: "Invalid user." };
  const parsed = usernameSchema.optional().or(z.literal("")).safeParse(username);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid username." };
  const value = parsed.data || null;
  if (value) {
    const { data: taken } = await supabaseAdmin.from("profiles").select("id").eq("username", value).neq("id", userId).maybeSingle();
    if (taken) return { error: "That username is already taken." };
  }
  const { error } = await supabaseAdmin.from("profiles").update({ username: value }).eq("id", userId);
  if (error) return { error: error.message };
  await logActivity({ userId: profile.id, userEmail: profile.email, action: "user_update", contentType: "user", contentId: userId, newValue: { username: value } });
  revalidatePath("/admin/users");
  return {};
}

export async function toggleUserActive(userId: string, isActive: boolean): Promise<Result> {
  const profile = await requirePermission((p) => p.canManageUsers);
  if (!idSchema.safeParse(userId).success) return { error: "Invalid user." };
  const blocked = selfError(profile, userId, "deactivate") ?? (!isActive ? await lastSuperAdminError(userId) : null);
  if (blocked) return { error: blocked };
  if ((await roleOf(userId)) === "super_admin" && !profile.permissions.canManageRoles) return { error: "Only Super Admins can change a Super Admin." };

  const { error } = await supabaseAdmin.from("profiles").update({ is_active: isActive }).eq("id", userId);
  if (error) return { error: error.message };
  // Deactivated users are also signed out everywhere.
  if (!isActive) await supabaseAdmin.auth.admin.signOut(userId).catch(() => undefined);

  await logActivity({ userId: profile.id, userEmail: profile.email, action: "user_update", contentType: "user", contentId: userId, newValue: { is_active: isActive } });
  revalidatePath("/admin/users");
  return {};
}

export async function deleteUser(userId: string): Promise<Result> {
  const profile = await requirePermission((p) => p.canManageUsers);
  if (!idSchema.safeParse(userId).success) return { error: "Invalid user." };
  const blocked = selfError(profile, userId, "delete") ?? (await lastSuperAdminError(userId));
  if (blocked) return { error: blocked };
  if ((await roleOf(userId)) === "super_admin" && !profile.permissions.canManageRoles) return { error: "Only Super Admins can delete a Super Admin." };

  const { data: previous } = await supabaseAdmin.from("profiles").select("email, full_name, username").eq("id", userId).maybeSingle();
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) return { error: error.message };
  // profiles row cascades via FK ON DELETE CASCADE to auth.users

  await logActivity({ userId: profile.id, userEmail: profile.email, action: "user_delete", contentType: "user", contentId: userId, previousValue: previous });
  revalidatePath("/admin/users");
  return {};
}

export async function resetUserPassword(userId: string, newPassword: string): Promise<Result> {
  const profile = await requirePermission((p) => p.canManageUsers);
  if (!idSchema.safeParse(userId).success) return { error: "Invalid user." };
  const parsed = passwordSchema.safeParse(newPassword);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid password." };
  if ((await roleOf(userId)) === "super_admin" && userId !== profile.id && !profile.permissions.canManageRoles) {
    return { error: "Only Super Admins can reset a Super Admin's password." };
  }

  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, { password: parsed.data });
  if (error) return { error: error.message };

  await logActivity({ userId: profile.id, userEmail: profile.email, action: "password_reset", contentType: "user", contentId: userId });
  return {};
}
