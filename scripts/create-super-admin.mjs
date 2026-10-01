/**
 * Creates (or upgrades) a Super Admin account for the OMC dashboard.
 * Run after applying supabase/migrations/0001 + 0002 (0002 adds usernames).
 *
 * Usage:
 *   ADMIN_PASSWORD='...' node scripts/create-super-admin.mjs <email> [--username <name>] [--name "Full Name"]
 *
 * The password is read from the ADMIN_PASSWORD env var (not argv) so it never
 * lands in shell history or process listings. If an auth user with <email>
 * already exists, its password, username and role are updated instead.
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const email = args.find((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"))?.toLowerCase();
const username = flag("username")?.toLowerCase();
const fullName = flag("name");
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error(
    "Usage: ADMIN_PASSWORD='...' node scripts/create-super-admin.mjs <email> [--username <name>] [--name \"Full Name\"]"
  );
  process.exit(1);
}
if (password.length < 12 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
  console.error("Password must be at least 12 characters and mix upper-case, lower-case and digits.");
  process.exit(1);
}
if (username && !/^[a-z0-9_.-]{3,40}$/.test(username)) {
  console.error("Username must be 3-40 characters: a-z, 0-9, dot, dash or underscore.");
  process.exit(1);
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findAuthUserByEmail(target) {
  for (let page = 1; ; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const match = data.users.find((u) => u.email?.toLowerCase() === target);
    if (match || data.users.length < 200) return match ?? null;
  }
}

async function main() {
  const { data: role, error: roleError } = await supabase.from("roles").select("id").eq("name", "super_admin").single();
  if (roleError || !role) {
    console.error("Could not find the super_admin role - has 0001_cms_schema.sql been applied?", roleError?.message);
    process.exit(1);
  }

  let userId;
  let created = false;
  const existing = await findAuthUserByEmail(email);
  if (existing) {
    const { error } = await supabase.auth.admin.updateUserById(existing.id, { password, email_confirm: true });
    if (error) throw new Error(`Failed to update existing auth user: ${error.message}`);
    userId = existing.id;
  } else {
    const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
    if (error || !data.user) throw new Error(`Failed to create auth user: ${error?.message}`);
    userId = data.user.id;
    created = true;
  }

  const profile = {
    id: userId,
    email,
    full_name: fullName || username || email,
    role_id: role.id,
    is_active: true,
    ...(username ? { username } : {}),
  };
  const { error: profileError } = await supabase.from("profiles").upsert(profile, { onConflict: "id" });
  if (profileError) {
    if (created) await supabase.auth.admin.deleteUser(userId);
    const hint = profileError.message.includes("username")
      ? " (apply supabase/migrations/0002_security_leads.sql first, or the username is taken)"
      : "";
    throw new Error(`Failed to save profile: ${profileError.message}${hint}`);
  }

  console.log(`Super Admin ${created ? "created" : "updated"} successfully.`);
  console.log("  Email:    ", email);
  if (username) console.log("  Username: ", username);
  console.log("  Login at:  /omc-adminlogin");
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exit(1);
});
