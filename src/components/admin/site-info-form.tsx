"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { saveSiteInfo, type SettingsFormState } from "../../../app/admin/(protected)/settings/actions";

export default function SiteInfoForm({
  initial,
}: {
  initial: Partial<{
    site_name: string;
    tagline: string;
    email: string;
    phone: string;
    footer_about: string;
    footer_hours: string;
  }>;
}) {
  const [state, formAction, pending] = useActionState(saveSiteInfo, {} as SettingsFormState);

  useEffect(() => {
    if (state.success) toast.success("Settings saved.");
  }, [state.success]);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="site_name">Site Name</Label>
          <Input id="site_name" name="site_name" defaultValue={initial.site_name ?? "Online MBA Colleges"} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Input id="tagline" name="tagline" defaultValue={initial.tagline ?? ""} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Contact Email</Label>
          <Input id="email" name="email" type="email" defaultValue={initial.email ?? ""} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Contact Phone</Label>
          <Input id="phone" name="phone" defaultValue={initial.phone ?? ""} required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="footer_about">Footer About Text</Label>
        <Textarea id="footer_about" name="footer_about" rows={2} defaultValue={initial.footer_about ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="footer_hours">Footer Business Hours</Label>
        <Input id="footer_hours" name="footer_hours" defaultValue={initial.footer_hours ?? ""} placeholder="Mon - Sat | 9:00 AM - 7:00 PM" />
      </div>
      <Button type="submit" disabled={pending}>{pending ? "Saving..." : "Save Settings"}</Button>
    </form>
  );
}
