"use client";

import { submitWithoutReset } from "@/lib/admin/form-submit";
import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ROLES, ROLE_LABELS } from "@/lib/auth/permissions";
import { createUser, type UserFormState } from "../actions";

export default function NewUserPage() {
  const [state, formAction, pending] = useActionState(createUser, {} as UserFormState);
  const errors = state.fieldErrors ?? {};
  // React resets the form after every submit; refill it from the last attempt on error.
  const v = state.values ?? {};

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">New User</h1>
      <form onSubmit={submitWithoutReset(formAction)} className="mt-6 max-w-md space-y-4">
        {state.error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{state.error}</p>
        )}

        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input id="full_name" name="full_name" required defaultValue={v.full_name} key={`fn-${v.full_name}`} />
          {errors.full_name && <p className="text-xs text-red-600">{errors.full_name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required defaultValue={v.email} key={`em-${v.email}`} />
          {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username (optional)</Label>
          <Input id="username" name="username" autoCapitalize="none" defaultValue={v.username} key={`un-${v.username}`} placeholder="e.g. priya.sharma" />
          <p className="text-xs text-slate-500">Lets them sign in with a username instead of their email.</p>
          {errors.username && <p className="text-xs text-red-600">{errors.username}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Temporary Password</Label>
          <Input id="password" name="password" type="password" required minLength={12} autoComplete="new-password" />
          <p className="text-xs text-slate-500">At least 12 characters with upper-case, lower-case and digits.</p>
          {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select name="role" defaultValue={v.role || "author"}>
            <SelectTrigger id="role"><SelectValue /></SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" disabled={pending}>{pending ? "Creating..." : "Create User"}</Button>
      </form>
    </div>
  );
}
