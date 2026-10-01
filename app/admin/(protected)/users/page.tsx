import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { supabaseAdmin } from "@/lib/db/client";
import { requirePermission } from "@/lib/auth/session";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LinkButton from "@/components/admin/link-button";
import UserRowActions from "@/components/admin/user-row-actions";
import type { Role } from "@/lib/auth/permissions";

export const metadata: Metadata = { title: "Users" };

export default async function UsersListPage() {
  const profile = await requirePermission((p) => p.canManageUsers);

  const { data } = await supabaseAdmin
    .from("profiles")
    .select("id, email, username, full_name, is_active, roles(name)")
    .order("email");

  const users = (data ?? []).map((u) => ({
    ...u,
    role: (Array.isArray(u.roles) ? u.roles[0]?.name : (u.roles as { name: Role } | null)?.name) as Role,
  }));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
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
              <TableHead>Email / Username</TableHead>
              <TableHead className="text-right">Role / Status / Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.full_name}</TableCell>
                <TableCell className="text-slate-500">
                  <span className="block">{u.email}</span>
                  {u.username && <span className="block text-xs">@{u.username}</span>}
                </TableCell>
                <TableCell className="text-right"><div className="flex justify-end">
                  <UserRowActions userId={u.id} role={u.role} username={u.username ?? null} isActive={u.is_active} isSelf={u.id === profile.id} canManageRoles={profile.permissions.canManageRoles} />
                </div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
