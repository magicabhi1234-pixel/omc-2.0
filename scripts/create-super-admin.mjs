/**
 * Creates the first Super Admin account. Run once, after applying
 * supabase/migrations/0001_cms_schema.sql (which seeds the `roles` table).
 *
 * Usage: node scripts/create-super-admin.mjs <email> <password> ["Full Name"]
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const [, , email, password, fullName] = process.argv;

if (!email || !password) {
  console.error('Usage: node scripts/create-super-admin.mjs <email> <password> ["Full Name"]');
  process.exit(1);
}
if (password.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function main() {
  const { data: role, error: roleError } = await supabase
    .from("roles")
    .select("id")
    .eq("name", "super_admin")
    .single();

  if (roleError || !role) {
    console.error(
      "Could not find the super_admin role - has supabase/migrations/0001_cms_schema.sql been run yet?",
      roleError?.message
    );
    process.exit(1);
  }

  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError || !authUser.user) {
    console.error("Failed to create auth user:", authError?.message);
    process.exit(1);
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: authUser.user.id,
    email,
    full_name: fullName || email,
    role_id: role.id,
    is_active: true,
  });

  if (profileError) {
    console.error("Failed to create profile row:", profileError.message);
    await supabase.auth.admin.deleteUser(authUser.user.id);
    process.exit(1);
  }

  console.log("Super Admin created successfully.");
  console.log("  Email:   ", email);
  console.log("  Login at: /admin/login");
}

main();
