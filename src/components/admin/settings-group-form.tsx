"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import MediaPickerField from "@/components/admin/media-picker-field";
import type { SettingsGroup } from "@/lib/site-settings";
import { saveSettingsGroup, type SettingsFormState } from "../../../app/admin/(protected)/settings/actions";

export interface SettingsField {
  name: string;
  label: string;
  type?: "text" | "email" | "url" | "textarea" | "media";
  placeholder?: string;
  help?: string;
  required?: boolean;
  folder?: string;
}

export default function SettingsGroupForm({
  group,
  fields,
  initial,
  submitLabel = "Save",
}: {
  group: SettingsGroup;
  fields: SettingsField[];
  initial: Record<string, string>;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(saveSettingsGroup.bind(null, group), {} as SettingsFormState);

  useEffect(() => {
    if (state.success) toast.success("Saved. Changes are live on the site.");
  }, [state]);

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {state.error}
        </p>
      )}
      <div className="grid gap-5 md:grid-cols-2">
        {fields.map((field) => {
          const error = state.fieldErrors?.[field.name];
          const full = field.type === "textarea" || field.type === "media";
          const describedBy = field.help || error ? `${group}-${field.name}-help` : undefined;
          return (
            <div key={field.name} className={full ? "space-y-2 md:col-span-2" : "space-y-2"}>
              {field.type === "media" ? (
                <MediaPickerField name={field.name} label={field.label} defaultValue={initial[field.name] ?? ""} folder={field.folder} error={error} />
              ) : (
                <>
                  <Label htmlFor={`${group}-${field.name}`}>
                    {field.label}
                    {field.required && <span className="text-red-600"> *</span>}
                  </Label>
                  {field.type === "textarea" ? (
                    <Textarea id={`${group}-${field.name}`} name={field.name} rows={3} defaultValue={initial[field.name] ?? ""} placeholder={field.placeholder} aria-invalid={Boolean(error)} aria-describedby={describedBy} />
                  ) : (
                    <Input
                      id={`${group}-${field.name}`}
                      name={field.name}
                      type={field.type === "email" ? "email" : "text"}
                      inputMode={field.type === "url" ? "url" : undefined}
                      defaultValue={initial[field.name] ?? ""}
                      placeholder={field.placeholder}
                      required={field.required}
                      aria-invalid={Boolean(error)}
                      aria-describedby={describedBy}
                    />
                  )}
                </>
              )}
              {(field.help || (error && field.type !== "media")) && (
                <p id={describedBy} className={`text-xs ${error ? "text-red-600" : "text-slate-500"}`}>
                  {error && field.type !== "media" ? error : field.help}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
