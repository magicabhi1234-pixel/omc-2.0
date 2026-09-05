import { Plus } from "lucide-react";
import { supabaseAdmin } from "@/lib/db/client";
import { requireProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LinkButton from "@/components/admin/link-button";
import UserRowActions from "@/components/admin/user-row-actions";
import type { Role } from "@/lib/auth/permissions";

export default async function UsersListPage() {
  const profile = await requireProfile();
  if (!profile.permissions.canManageUsers) redirect("/admin/dashboard");

  const { data } = await supabaseAdmin
    .from("profiles")
    .select("id, email, full_name, is_active, roles(name)")
    .order("email");

  const users = (data ?? []).map((u) => ({
    ...u,
    role: (Array.isArray(u.roles) ? u.roles[0]?.name : (u.roles as { name: Role } | null)?.name) as Role,
  }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          <p className="mt-1 text-slate-600">{users.length} total</p>
        </div>
        <LinkButton href="/admin/users/new"><Plus size={16} className="mr-2" /> New User</LinkButton>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Role / Status / Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.full_name}</TableCell>
                <TableCell className="text-slate-500">{u.email}</TableCell>
                <TableCell className="flex justify-end">
                  <UserRowActions userId={u.id} role={u.role} isActive={u.is_active} isSelf={u.id === profile.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
