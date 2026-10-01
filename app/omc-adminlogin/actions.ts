"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/db/client";
import { logActivity } from "@/lib/auth/activity-log";
import { getCurrentProfile } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { clientIp, safeAdminRedirect } from "@/lib/security/request";

export interface LoginState {
  error?: string;
}

const LOGIN_WINDOW_SECONDS = 15 * 60;
const GENERIC_ERROR = "Invalid username/email or password.";

/** Maps a username to its account email; returns null for unknown or deactivated usernames. */
async function emailForUsername(username: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("email, is_active")
    .eq("username", username)
    .maybeSingle();
  if (error) {
    console.error("[login] username lookup failed (is migration 0002 applied?):", error.message);
    return null;
  }
  return data?.is_active ? data.email : null;
}

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const identifier = String(formData.get("identifier") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const next = safeAdminRedirect(String(formData.get("next") || ""));

  if (!identifier || !password || identifier.length > 254 || password.length > 200) {
    return { error: "Please enter your username (or email) and password." };
  }

  // Two limits: per IP (one attacker spraying many accounts) and per account
  // (a distributed attack on one account). Supabase Auth adds its own on top.
  const ip = clientIp(await headers());
  const [ipOk, accountOk] = await Promise.all([
    checkRateLimit(`login-ip:${ip}`, 20, LOGIN_WINDOW_SECONDS),
    checkRateLimit(`login-account:${identifier}`, 5, LOGIN_WINDOW_SECONDS),
  ]);
  if (!ipOk || !accountOk) {
    return { error: "Too many sign-in attempts. Please wait 15 minutes and try again." };
  }

  const email = identifier.includes("@") ? identifier : await emailForUsername(identifier);
  if (!email) return { error: GENERIC_ERROR };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: GENERIC_ERROR };

  // A valid Supabase Auth user isn't enough - they need an active admin profile.
  const profile = await getCurrentProfile();
  if (!profile) {
    await supabase.auth.signOut();
    return { error: "This account doesn't have dashboard access. Contact a Super Admin." };
  }

  await logActivity({
    userId: data.user.id,
    userEmail: data.user.email ?? email,
    action: "login",
    contentType: "user",
    contentId: data.user.id,
  });

  redirect(next);
}

export async function logoutAction() {
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
  redirect("/omc-adminlogin");
}
