"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/auth/activity-log";

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/admin/dashboard");

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { error: "Invalid email or password." };
  }

  await logActivity({
    userId: data.user.id,
    userEmail: data.user.email ?? email,
    action: "login",
    contentType: "user",
    contentId: data.user.id,
  });

  redirect(next.startsWith("/admin") ? next : "/admin/dashboard");
}

export async function logoutAction() {
  "use server";
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await logActivity({
      userId: user.id,
      userEmail: user.email ?? null,
      action: "logout",
      contentType: "user",
      contentId: user.id,
    });
  }

  await supabase.auth.signOut();
  redirect("/admin/login");
}
