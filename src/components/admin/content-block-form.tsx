"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ContentBlockFormState } from "../../../app/admin/(protected)/content/blocks/actions";

export interface ContentBlockFormValues {
  content_type: string;
  slug: string | null;
  title: string;
  data: unknown;
  status: string;
  seo_meta_title: string | null;
  seo_meta_description: string | null;
}

type Action = (state: ContentBlockFormState, formData: FormData) => Promise<ContentBlockFormState>;

export default function ContentBlockForm({
  action,
  initial,
  submitLabel,
}: {
  action: Action;
  initial?: Partial<ContentBlockFormValues>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{state.error}</p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="content_type">Content Type</Label>
          <Input id="content_type" name="content_type" defaultValue={initial?.content_type} placeholder="e.g. banner, promo_card" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug (optional)</Label>
          <Input id="slug" name="slug" defaultValue={initial?.slug ?? ""} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={initial?.title} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="data">Data (JSON)</Label>
        <Textarea
          id="data"
          name="data"
          rows={10}
          className="font-mono text-xs"
          defaultValue={initial?.data ? JSON.stringify(initial.data, null, 2) : "{}"}
        />
        <p className="text-xs text-slate-500">Any shape you need - this content type has no fixed schema.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="seo_meta_title">Meta Title</Label>
          <Input id="seo_meta_title" name="seo_meta_title" defaultValue={initial?.seo_meta_title ?? ""} maxLength={60} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={initial?.status ?? "draft"}>
            <SelectTrigger id="status"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="seo_meta_description">Meta Description</Label>
        <Textarea id="seo_meta_description" name="seo_meta_description" rows={2} defaultValue={initial?.seo_meta_description ?? ""} maxLength={160} />
      </div>

      <Button type="submit" disabled={pending}>{pending ? "Saving..." : submitLabel}</Button>
    </form>
  );
}
