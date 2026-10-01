"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { ROLES, ROLE_LABELS, type Role } from "@/lib/auth/permissions";
import { updateUserRole, toggleUserActive, deleteUser, resetUserPassword, updateUsername } from "../../../app/admin/(protected)/users/actions";
import DeleteButton from "@/components/admin/delete-button";

export default function UserRowActions({
  userId,
  role,
  username,
  isActive,
  isSelf,
  canManageRoles,
}: {
  userId: string;
  role: Role;
  username: string | null;
  isActive: boolean;
  isSelf: boolean;
  canManageRoles: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [currentRole, setCurrentRole] = useState<Role>(role);
  const [active, setActive] = useState(isActive);
  const [newPassword, setNewPassword] = useState("");
  const [usernameDraft, setUsernameDraft] = useState(username ?? "");
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [usernameOpen, setUsernameOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Select
        value={currentRole}
        disabled={isSelf || pending || !canManageRoles}
        onValueChange={(value: string | null) => {
          if (!value || value === currentRole) return;
          const previous = currentRole;
          setCurrentRole(value as Role);
          startTransition(async () => {
            const result = await updateUserRole(userId, value as Role);
            if (result.error) {
              setCurrentRole(previous);
              toast.error(result.error);
            } else toast.success("Role updated.");
          });
        }}
      >
        <SelectTrigger className="w-36" aria-label="Role"><SelectValue /></SelectTrigger>
        <SelectContent>
          {ROLES.map((r) => <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>)}
        </SelectContent>
      </Select>

      <Switch
        checked={active}
        aria-label={active ? "Account active - click to deactivate" : "Account inactive - click to activate"}
        disabled={isSelf || pending}
        onCheckedChange={(checked: boolean) => {
          setActive(checked);
          startTransition(async () => {
            const result = await toggleUserActive(userId, checked);
            if (result.error) {
              setActive(!checked);
              toast.error(result.error);
            } else toast.success(checked ? "Account enabled." : "Account disabled and signed out.");
          });
        }}
      />

      <Dialog open={usernameOpen} onOpenChange={setUsernameOpen}>
        <DialogTrigger render={<Button type="button" variant="outline" size="sm" />}>Username</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login username</DialogTitle>
            <DialogDescription>Lets this person sign in at /omc-adminlogin with a username instead of their email.</DialogDescription>
          </DialogHeader>
          <Label htmlFor={`username-${userId}`}>Username</Label>
          <Input id={`username-${userId}`} value={usernameDraft} onChange={(e) => setUsernameDraft(e.target.value)} placeholder="e.g. priya.sharma" autoCapitalize="none" />
          <DialogFooter>
            <Button
              type="button"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  const result = await updateUsername(userId, usernameDraft);
                  if (result.error) toast.error(result.error);
                  else {
                    toast.success(usernameDraft ? "Username saved." : "Username removed.");
                    setUsernameOpen(false);
                  }
                })
              }
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogTrigger render={<Button type="button" variant="outline" size="sm" />}>Reset password</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset password</DialogTitle>
            <DialogDescription>At least 12 characters, mixing upper-case, lower-case and digits. Share it with the user securely.</DialogDescription>
          </DialogHeader>
          <Input type="password" aria-label="New password" autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <DialogFooter>
            <Button
              type="button"
              disabled={pending || newPassword.length < 12}
              onClick={() =>
                startTransition(async () => {
                  const result = await resetUserPassword(userId, newPassword);
                  if (result.error) toast.error(result.error);
                  else {
                    toast.success("Password reset.");
                    setNewPassword("");
                    setPasswordOpen(false);
                  }
                })
              }
            >
              Reset password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {!isSelf && <DeleteButton action={() => deleteUser(userId)} confirmMessage="Delete this user? This cannot be undone." />}
    </div>
  );
}
