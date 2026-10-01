"use client";

import { submitWithoutReset } from "@/lib/admin/form-submit";
import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import MediaPickerField from "@/components/admin/media-picker-field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TestimonialFormState } from "../../../app/admin/(protected)/content/testimonials/actions";

export interface TestimonialFormValues {
  name: string;
  designation: string | null;
  university: string | null;
  image_url: string | null;
  review: string;
  rating: number;
  status: string;
}

type Action = (state: TestimonialFormState, formData: FormData) => Promise<TestimonialFormState>;

export default function TestimonialForm({
  action,
  initial,
  submitLabel,
}: {
  action: Action;
  initial?: Partial<TestimonialFormValues>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const errors = state.fieldErrors ?? {};

  return (
    <form onSubmit={submitWithoutReset(formAction)} className="max-w-2xl space-y-6">
      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{state.error}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Student Name</Label>
          <Input id="name" name="name" defaultValue={initial?.name} required />
          {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="designation">Designation</Label>
          <Input id="designation" name="designation" defaultValue={initial?.designation ?? ""} placeholder="Marketing Manager" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="university">University Attended</Label>
          <Input id="university" name="university" defaultValue={initial?.university ?? ""} />
        </div>
        <div className="space-y-2">
          <MediaPickerField name="image_url" label="Photo" folder="testimonials" defaultValue={initial?.image_url ?? ""} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="review">Review</Label>
        <Textarea id="review" name="review" rows={4} defaultValue={initial?.review} required />
        {errors.review && <p className="text-xs text-red-600">{errors.review}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="rating">Rating</Label>
          <Select name="rating" defaultValue={String(initial?.rating ?? 5)}>
            <SelectTrigger id="rating"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((n) => (
                <SelectItem key={n} value={String(n)}>{n} star{n > 1 ? "s" : ""}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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

      <Button type="submit" disabled={pending}>{pending ? "Saving..." : submitLabel}</Button>
    </form>
  );
}
