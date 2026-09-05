"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/db/client";
import { requirePermission } from "@/lib/auth/session";
import { logActivity } from "@/lib/auth/activity-log";
import { ROLES, type Role } from "@/lib/auth/permissions";

const createUserSchema = z.object({
  email: z.string().trim().email(),
  full_name: z.string().trim().min(1).max(150),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(ROLES),
});

export interface UserFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function createUser(
  _prevState: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  const profile = await requirePermission((p) => p.canManageUsers);
  const parsed = createUserSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
    return { error: "Please fix the highlighted fields.", fieldErrors };
  }
  const { email, full_name, password, role } = parsed.data;

  const { data: roleRow } = await supabaseAdmin.from("roles").select("id").eq("name", role).single();
  if (!roleRow) return { error: "Invalid role." };

  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (authError || !authUser.user) {
    return { error: authError?.message ?? "Failed to create user." };
  }

  const { error: profileError } = await supabaseAdmin.from("profiles").insert({
    id: authUser.user.id,
    email,
    full_name,
    role_id: roleRow.id,
    is_active: true,
  });
  if (profileError) {
    await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
    return { error: profileError.message };
  }

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: "user_create",
    contentType: "user",
    contentId: authUser.user.id,
    newValue: { email, full_name, role },
  });

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function updateUserRole(userId: string, role: Role): Promise<void> {
  const profile = await requirePermission((p) => p.canManageRoles);
  const { data: roleRow } = await supabaseAdmin.from("roles").select("id").eq("name", role).single();
  if (!roleRow) throw new Error("Invalid role.");

  const { error } = await supabaseAdmin.from("profiles").update({ role_id: roleRow.id }).eq("id", userId);
  if (error) throw new Error(error.message);

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: "user_update",
    contentType: "user",
    contentId: userId,
    newValue: { role },
  });

  revalidatePath("/admin/users");
}

export async function toggleUserActive(userId: string, isActive: boolean): Promise<void> {
  const profile = await requirePermission((p) => p.canManageUsers);
  const { error } = await supabaseAdmin.from("profiles").update({ is_active: isActive }).eq("id", userId);
  if (error) throw new Error(error.message);

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: "user_update",
    contentType: "user",
    contentId: userId,
    newValue: { is_active: isActive },
  });

  revalidatePath("/admin/users");
}

export async function deleteUser(userId: string): Promise<void> {
  const profile = await requirePermission((p) => p.canManageUsers);
  if (userId === profile.id) throw new Error("You can't delete your own account.");

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) throw new Error(error.message);
  // profiles row cascades via FK ON DELETE CASCADE to auth.users

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: "user_delete",
    contentType: "user",
    contentId: userId,
  });

  revalidatePath("/admin/users");
}

export async function resetUserPassword(userId: string, newPassword: string): Promise<void> {
  const profile = await requirePermission((p) => p.canManageUsers);
  if (newPassword.length < 8) throw new Error("Password must be at least 8 characters.");

  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, { password: newPassword });
  if (error) throw new Error(error.message);

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: "password_reset",
    contentType: "user",
    contentId: userId,
  });
}
