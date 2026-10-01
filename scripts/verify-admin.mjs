/**
 * Verifies an admin account end to end, exercising the same steps as
 * /omc-adminlogin (username -> email lookup, Supabase password sign-in,
 * active-profile + role check). Never prints the password.
 *
 * Usage: ADMIN_PASSWORD='...' node scripts/verify-admin.mjs <username>
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { config } from "dotenv";

config({ path: ".env.local", quiet: true });

const username = process.argv[2]?.toLowerCase();
const password = process.env.ADMIN_PASSWORD;
if (!username || !password) {
  console.error("Usage: ADMIN_PASSWORD='...' node scripts/verify-admin.mjs <username>");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const admin = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const anon = () => createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { auth: { persistSession: false } });

/** Reads the role's flags straight from src/lib/auth/permissions.ts - the file the app enforces. */
function permissionsFor(role) {
  const lines = readFileSync("src/lib/auth/permissions.ts", "utf8").split(/\r?\n/);
  const start = lines.indexOf(`  ${role}: {`);
  if (start < 0) return {};
  const flags = {};
  for (const line of lines.slice(start + 1)) {
    if (line.startsWith("  }")) break;
    const match = line.match(/^\s+(\w+): (true|false),?$/);
    if (match) flags[match[1]] = match[2] === "true";
  }
  return flags;
}

let failures = 0;
const check = (ok, label, detail = "") => {
  console.log(`  ${ok ? "✓" : "✗"} ${label}${detail ? ` - ${detail}` : ""}`);
  if (!ok) failures += 1;
  return ok;
};

async function signIn(email) {
  const client = anon();
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (!error) await client.auth.signOut();
  return { userId: data?.user?.id, error: error?.message };
}

async function main() {
  console.log(`Verifying admin "${username}"\n`);

  console.log("Schema:");
  const roles = await admin.from("roles").select("id, name");
  check(!roles.error, "roles table exists", roles.error?.message);
  const superRole = roles.data?.find((r) => r.name === "super_admin");
  check(Boolean(superRole), "super_admin role exists");
  const profilesProbe = await admin.from("profiles").select("username", { head: true, count: "exact" });
  check(!profilesProbe.error, "profiles table (with username column) exists", profilesProbe.error?.message);

  console.log("\nAccount:");
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("id, email, username, is_active, role_id, roles(name)")
    .eq("username", username)
    .maybeSingle();
  if (!check(Boolean(profile) && !profileError, "profile found by username", profileError?.message)) return;
  const roleName = Array.isArray(profile.roles) ? profile.roles[0]?.name : profile.roles?.name;
  check(profile.is_active, "profile is active");
  check(roleName === "super_admin" && profile.role_id === superRole?.id, "role is super_admin", roleName);

  const { data: authUser, error: authError } = await admin.auth.admin.getUserById(profile.id);
  check(Boolean(authUser?.user) && !authError, "auth.users record exists with the same id as the profile", authError?.message);
  check(authUser?.user?.email?.toLowerCase() === profile.email.toLowerCase(), "auth email matches profile email");
  check(Boolean(authUser?.user?.email_confirmed_at), "email is confirmed");

  console.log("\nLogin (same steps as /omc-adminlogin):");
  const byUsername = await signIn(profile.email); // username resolved to email above, exactly as loginAction does
  check(byUsername.userId === profile.id, `username login ("${username}")`, byUsername.error);
  const byEmail = await signIn(authUser?.user?.email ?? profile.email);
  check(byEmail.userId === profile.id, "email login", byEmail.error);
  const wrong = await anon().auth.signInWithPassword({ email: profile.email, password: `${password}-wrong` });
  check(Boolean(wrong.error), "wrong password is rejected");

  console.log("\nPermissions:");
  const perms = permissionsFor(roleName);
  check(Object.keys(perms).length > 0, `role definition found for ${roleName}`);
  for (const perm of ["canManageLeads", "canManageUsers", "canManageSettings", "canDeleteContent", "canPublish", "canViewActivityLogs"]) {
    check(perms[perm] === true, perm);
  }

  console.log(failures ? `\n${failures} check(s) failed.` : "\nAll checks passed.");
}

main()
  .catch((error) => {
    console.error(error.message ?? error);
    failures += 1;
  })
  .finally(() => process.exit(failures ? 1 : 0));
