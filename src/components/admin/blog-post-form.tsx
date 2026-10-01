"use client";

import FormActionBar from "@/components/admin/form-action-bar";
import { submitWithoutReset } from "@/lib/admin/form-submit";
import { useActionState, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import MediaPickerField from "@/components/admin/media-picker-field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RichTextEditor from "@/components/admin/rich-text-editor";
import FaqEditor, { type FaqItem } from "@/components/admin/faq-editor";
import { portableTextToHtml, htmlToPortableText, type PortableTextJson } from "@/lib/portable-text";
import type { BlogPostFormState } from "../../../app/admin/(protected)/blogs/actions";

export interface BlogPostFormValues {
  title: string;
  h1: string | null;
  slug: string;
  featured_image_url: string;
  featured_image_alt: string;
  excerpt: string;
  content: PortableTextJson;
  author: string;
  published_date: string;
  category: string | null;
  tags: string[] | null;
  faqs: FaqItem[] | null;
  seo_meta_title: string | null;
  seo_meta_description: string | null;
  seo_keywords: string[] | null;
  seo_canonical_url: string | null;
  seo_og_image_url: string | null;
  seo_no_index: boolean;
  status: string;
}

type Action = (state: BlogPostFormState, formData: FormData) => Promise<BlogPostFormState>;

export default function BlogPostForm({
  action,
  initial,
  otherPosts,
  initialRelatedIds,
  submitLabel,
}: {
  action: Action;
  initial?: Partial<BlogPostFormValues>;
  otherPosts: { id: string; title: string }[];
  initialRelatedIds?: string[];
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const errors = state.fieldErrors ?? {};

  const [html, setHtml] = useState(() => portableTextToHtml(initial?.content ?? []));
  const contentInputRef = useRef<HTMLInputElement>(null);
  const [relatedIds, setRelatedIds] = useState<string[]>(initialRelatedIds ?? []);

  return (
    <form
      onSubmit={(event) => {
        if (contentInputRef.current) {
          contentInputRef.current.value = JSON.stringify(htmlToPortableText(html));
        }
        submitWithoutReset(formAction)(event);
      }}
      className="max-w-4xl space-y-6 rounded-xl border border-border bg-card p-5 shadow-[0_1px_2px_rgb(15_23_42/0.04)] sm:p-6"
    >
      {state.error && (
        <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">{state.error}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={initial?.title} required />
          {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={initial?.slug} required />
          {errors.slug && <p className="text-xs text-destructive">{errors.slug}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="h1">H1 Heading (optional, defaults to Title)</Label>
        <Input id="h1" name="h1" defaultValue={initial?.h1 ?? ""} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <MediaPickerField name="featured_image_url" label="Featured image" folder="blog" required defaultValue={initial?.featured_image_url ?? ""} error={errors.featured_image_url} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="featured_image_alt">Featured Image Alt Text</Label>
          <Input id="featured_image_alt" name="featured_image_alt" defaultValue={initial?.featured_image_alt} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" name="excerpt" rows={2} defaultValue={initial?.excerpt} required maxLength={300} />
        {errors.excerpt && <p className="text-xs text-destructive">{errors.excerpt}</p>}
      </div>

      <div className="space-y-2">
        <Label>Content</Label>
        <input ref={contentInputRef} type="hidden" name="content" />
        <RichTextEditor initialHtml={html} onChange={setHtml} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input id="author" name="author" defaultValue={initial?.author ?? "Admin"} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="published_date">Published Date</Label>
          <Input
            id="published_date"
            name="published_date"
            type="date"
            defaultValue={initial?.published_date ? initial.published_date.slice(0, 10) : new Date().toISOString().slice(0, 10)}
            required
          />
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" name="category" defaultValue={initial?.category ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input id="tags" name="tags" defaultValue={initial?.tags?.join(", ") ?? ""} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>FAQs</Label>
        <FaqEditor initial={initial?.faqs ?? []} hiddenFieldName="faqs" />
      </div>

      <div className="space-y-2">
        <Label>Related Posts (max 6)</Label>
        <input type="hidden" name="related_posts" value={relatedIds.join(",")} />
        <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-border p-3">
          {otherPosts.length === 0 && <p className="text-sm text-muted-foreground">No other posts yet.</p>}
          {otherPosts.map((post) => (
            <label key={post.id} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={relatedIds.includes(post.id)}
                onCheckedChange={(checked: boolean) => {
                  if (checked) {
                    if (relatedIds.length < 6) setRelatedIds([...relatedIds, post.id]);
                  } else {
                    setRelatedIds(relatedIds.filter((id) => id !== post.id));
                  }
                }}
              />
              {post.title}
            </label>
          ))}
        </div>
      </div>

      <fieldset className="space-y-4 rounded-lg border border-border p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">SEO</legend>
        <div className="space-y-2">
          <Label htmlFor="seo_meta_title">Meta Title</Label>
          <Input id="seo_meta_title" name="seo_meta_title" defaultValue={initial?.seo_meta_title ?? ""} maxLength={60} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="seo_meta_description">Meta Description</Label>
          <Textarea id="seo_meta_description" name="seo_meta_description" rows={2} defaultValue={initial?.seo_meta_description ?? ""} maxLength={160} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="seo_canonical_url">Canonical URL</Label>
            <Input id="seo_canonical_url" name="seo_canonical_url" defaultValue={initial?.seo_canonical_url ?? ""} />
          </div>
          <div className="space-y-2">
            <MediaPickerField name="seo_og_image_url" label="Social share image (1200×630)" folder="blog" defaultValue={initial?.seo_og_image_url ?? ""} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="seo_keywords">Keywords (comma-separated)</Label>
          <Input id="seo_keywords" name="seo_keywords" defaultValue={initial?.seo_keywords?.join(", ") ?? ""} />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="seo_no_index" name="seo_no_index" defaultChecked={initial?.seo_no_index} />
          <Label htmlFor="seo_no_index" className="cursor-pointer font-normal">No Index (hide from search engines)</Label>
        </div>
      </fieldset>

      <FormActionBar pending={pending} submitLabel={submitLabel} cancelHref="/admin/blogs" />
    </form>
  );
}
