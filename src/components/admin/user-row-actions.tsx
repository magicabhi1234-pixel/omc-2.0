"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ROLES, ROLE_LABELS, type Role } from "@/lib/auth/permissions";
import { updateUserRole, toggleUserActive, deleteUser, resetUserPassword } from "../../../app/admin/(protected)/users/actions";
import DeleteButton from "@/components/admin/delete-button";

export default function UserRowActions({
  userId,
  role,
  isActive,
  isSelf,
}: {
  userId: string;
  role: Role;
  isActive: boolean;
  isSelf: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [newPassword, setNewPassword] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <Select
        defaultValue={role}
        disabled={isSelf || pending}
        onValueChange={(value: string | null) =>
          startTransition(async () => {
            if (!value) return;
            try {
              await updateUserRole(userId, value as Role);
              toast.success("Role updated.");
            } catch (error) {
              toast.error(error instanceof Error ? error.message : "Failed to update role.");
            }
          })
        }
      >
        <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
        <SelectContent>
          {ROLES.map((r) => <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>)}
        </SelectContent>
      </Select>

      <Switch
        checked={isActive}
        disabled={isSelf || pending}
        onCheckedChange={(checked: boolean) =>
          startTransition(async () => {
            try {
              await toggleUserActive(userId, checked);
              toast.success(checked ? "Account enabled." : "Account disabled.");
            } catch (error) {
              toast.error(error instanceof Error ? error.message : "Failed to update account.");
            }
          })
        }
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger render={<Button type="button" variant="outline" size="sm" />}>
          Reset Password
        </DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Reset Password</DialogTitle></DialogHeader>
          <Input
            type="password"
            placeholder="New password (min 8 characters)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <DialogFooter>
            <Button
              type="button"
              disabled={pending || newPassword.length < 8}
              onClick={() =>
                startTransition(async () => {
                  try {
                    await resetUserPassword(userId, newPassword);
                    toast.success("Password reset.");
                    setNewPassword("");
                    setDialogOpen(false);
                  } catch (error) {
                    toast.error(error instanceof Error ? error.message : "Failed to reset password.");
                  }
                })
              }
            >
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {!isSelf && (
        <DeleteButton
          action={async () => {
            await deleteUser(userId);
          }}
          confirmMessage="Delete this user? This cannot be undone."
        />
      )}
    </div>
  );
}
