"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UniversityFormState } from "../../../app/admin/(protected)/content/universities/actions";

export interface UniversityFormValues {
  name: string;
  slug: string;
  logo_url: string | null;
  logo_alt: string | null;
  featured: boolean;
  study_mode: string;
  duration: string;
  eligibility: string;
  starting_fee: string;
  emi: string | null;
  placement_support: string | null;
  rating: number | null;
  review_count: number | null;
  approvals: string[] | null;
  brochure_url: string | null;
  website_url: string | null;
  status: string;
}

type Action = (state: UniversityFormState, formData: FormData) => Promise<UniversityFormState>;

export default function UniversityForm({
  action,
  initial,
  submitLabel,
}: {
  action: Action;
  initial?: Partial<UniversityFormValues>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {state.error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={initial?.name} required />
          {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={initial?.slug} required />
          {errors.slug && <p className="text-xs text-red-600">{errors.slug}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="logo_url">Logo URL</Label>
          <Input id="logo_url" name="logo_url" defaultValue={initial?.logo_url ?? ""} placeholder="Pick from Media Library" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="logo_alt">Logo Alt Text</Label>
          <Input id="logo_alt" name="logo_alt" defaultValue={initial?.logo_alt ?? ""} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="study_mode">Study Mode</Label>
          <Select name="study_mode" defaultValue={initial?.study_mode ?? "Online & Distance"}>
            <SelectTrigger id="study_mode"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Online">Online</SelectItem>
              <SelectItem value="Distance">Distance</SelectItem>
              <SelectItem value="Online & Distance">Online & Distance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input id="duration" name="duration" defaultValue={initial?.duration ?? "2 Years"} required />
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
        <Label htmlFor="eligibility">Eligibility</Label>
        <Textarea id="eligibility" name="eligibility" rows={2} defaultValue={initial?.eligibility} required />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="starting_fee">Starting Fee</Label>
          <Input id="starting_fee" name="starting_fee" defaultValue={initial?.starting_fee} required placeholder="e.g. 2,25,000" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emi">EMI</Label>
          <Input id="emi" name="emi" defaultValue={initial?.emi ?? ""} placeholder="e.g. 8,292/Month" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="placement_support">Placement Support</Label>
          <Input id="placement_support" name="placement_support" defaultValue={initial?.placement_support ?? ""} placeholder="Yes" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rating">Rating (0-5)</Label>
          <Input id="rating" name="rating" type="number" step="0.1" min="0" max="5" defaultValue={initial?.rating ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="review_count">Review Count</Label>
          <Input id="review_count" name="review_count" type="number" min="0" defaultValue={initial?.review_count ?? ""} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="approvals">Approvals (comma-separated)</Label>
        <Input
          id="approvals"
          name="approvals"
          defaultValue={initial?.approvals?.join(", ") ?? ""}
          placeholder="UGC, AICTE, NAAC A+"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="brochure_url">Brochure URL</Label>
          <Input id="brochure_url" name="brochure_url" defaultValue={initial?.brochure_url ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website_url">Website URL</Label>
          <Input id="website_url" name="website_url" defaultValue={initial?.website_url ?? ""} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox id="featured" name="featured" defaultChecked={initial?.featured} />
        <Label htmlFor="featured" className="cursor-pointer font-normal">Featured university</Label>
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
