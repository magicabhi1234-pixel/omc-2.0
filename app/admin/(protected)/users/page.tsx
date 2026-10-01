import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { supabaseAdmin } from "@/lib/db/client";
import { requirePermission } from "@/lib/auth/session";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LinkButton from "@/components/admin/link-button";
import UserRowActions from "@/components/admin/user-row-actions";
import { ROLE_LABELS, type Role } from "@/lib/auth/permissions";
import { PageHeader } from "@/components/admin/page-kit";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Users" };

const ROLE_TONE: Record<Role, string> = {
  super_admin: "bg-secondary text-secondary-foreground",
  admin: "bg-info-soft text-primary",
  editor: "bg-success-soft text-success",
  author: "bg-muted text-muted-foreground",
};

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
  const active = users.filter((u) => u.is_active).length;

  return (
    <div>
      <PageHeader
        title="Users"
        description={`${users.length} team members · ${active} active. Roles control what each person can see and change.`}
        actions={
          <LinkButton href="/admin/users/new">
            <Plus size={16} /> Invite user
          </LinkButton>
        }
      />

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_2px_rgb(15_23_42/0.04)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead className="hidden md:table-cell">Role</TableHead>
              <TableHead className="text-right">Manage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => {
              const name = u.full_name || u.email;
              return (
                <TableRow key={u.id} className={cn(!u.is_active && "opacity-60")}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-[#1d5a94] text-xs font-semibold text-white" aria-hidden="true">
                        {name.slice(0, 1).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 font-medium text-foreground">
                          <span className="truncate">{name}</span>
                          {u.id === profile.id && <span className="rounded-full bg-muted px-1.5 text-[10px] font-semibold text-muted-foreground uppercase">You</span>}
                          {!u.is_active && <span className="rounded-full bg-destructive/10 px-1.5 text-[10px] font-semibold text-destructive uppercase">Inactive</span>}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {u.email}
                          {u.username && <> · @{u.username}</>}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", ROLE_TONE[u.role])}>{ROLE_LABELS[u.role]}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <UserRowActions userId={u.id} role={u.role} username={u.username ?? null} isActive={u.is_active} isSelf={u.id === profile.id} canManageRoles={profile.permissions.canManageRoles} />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
