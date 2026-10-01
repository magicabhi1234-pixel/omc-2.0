"use client";

import FormActionBar from "@/components/admin/form-action-bar";
import { submitWithoutReset } from "@/lib/admin/form-submit";
import { useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import MediaPickerField from "@/components/admin/media-picker-field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FaqEditor, { type FaqItem } from "@/components/admin/faq-editor";
import RepeatableItemsEditor, { type FieldDef } from "@/components/admin/repeatable-items-editor";
import MultiSelectPicker, { type PickableOption } from "@/components/admin/multi-select-picker";
import type { LandingPageFormState } from "../../../app/admin/(protected)/pages/actions";

const CATEGORIES = [
  "Online MBA",
  "Distance MBA",
  "MBA Specializations",
  "Executive MBA",
  "University Pages",
  "Bachelor Programs",
];

/** Matches the standard comparison rows used across every existing landing page. */
const STANDARD_COMPARE_FEATURES = [
  { id: "fees", label: "Course Fees", key: "startingFee" },
  { id: "duration", label: "Duration", key: "duration" },
  { id: "mode", label: "Study Mode", key: "studyMode" },
  { id: "eligibility", label: "Eligibility", key: "eligibility" },
  { id: "placement", label: "Placement Support", key: "placementSupport" },
];

type Json = Record<string, unknown>;

export interface LandingPageFormValues {
  title: string;
  slug: string;
  category: string;
  region: string | null;
  status: string;
  hero: Json;
  university_section: Json | null;
  compare_section: Json | null;
  why_choose: Json | null;
  stats: Json | null;
  specializations: Json | null;
  benefits: Json | null;
  career_scope: Json | null;
  highlight_banner: Json | null;
  faq: { heading?: string; description?: string; faqs?: FaqItem[] } | null;
  testimonials_heading: string | null;
  cta: Json;
  seo_meta_title: string | null;
  seo_meta_description: string | null;
  seo_keywords: string[] | null;
  seo_canonical_url: string | null;
  seo_og_image_url: string | null;
  seo_no_index: boolean;
}

type Action = (state: LandingPageFormState, formData: FormData) => Promise<LandingPageFormState>;

function str(obj: Json | null | undefined, key: string): string {
  return typeof obj?.[key] === "string" ? (obj[key] as string) : "";
}

function arr(obj: Json | null | undefined, key: string): Record<string, string>[] {
  const value = obj?.[key];
  return Array.isArray(value) ? (value as Record<string, string>[]) : [];
}

/** Every hidden JSON input below is controlled - its `value` is computed directly from React state at render time, so no ref/onSubmit assembly step is needed. */
function HiddenJson({ name, value }: { name: string; value: unknown }) {
  return <input type="hidden" name={name} value={value == null ? "" : JSON.stringify(value)} readOnly />;
}

export default function LandingPageForm({
  action,
  initial,
  universityOptions,
  testimonialOptions,
  initialUniversityIds,
  initialTestimonialIds,
  submitLabel,
}: {
  action: Action;
  initial?: Partial<LandingPageFormValues>;
  universityOptions: PickableOption[];
  testimonialOptions: PickableOption[];
  initialUniversityIds?: string[];
  initialTestimonialIds?: string[];
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const errors = state.fieldErrors ?? {};

  const [hero, setHero] = useState<Json>(initial?.hero ?? {});
  const [cta, setCta] = useState<Json>(initial?.cta ?? {});
  const [universitySection, setUniversitySection] = useState<Json>(initial?.university_section ?? {});
  const [compareHeading, setCompareHeading] = useState(str(initial?.compare_section, "heading"));
  const [compareBadge, setCompareBadge] = useState(str(initial?.compare_section, "badge"));
  const [compareDescription, setCompareDescription] = useState(str(initial?.compare_section, "description"));
  const [highlightBanner, setHighlightBanner] = useState<Json>(initial?.highlight_banner ?? {});
  const [faqMeta, setFaqMeta] = useState({
    heading: initial?.faq?.heading ?? "Frequently Asked Questions",
    description: initial?.faq?.description ?? "",
  });
  const [faqItems, setFaqItems] = useState<FaqItem[]>(initial?.faq?.faqs ?? []);

  const compareSectionValue = compareHeading
    ? { heading: compareHeading, badge: compareBadge, description: compareDescription, features: STANDARD_COMPARE_FEATURES }
    : null;
  const highlightBannerValue = highlightBanner.heading ? highlightBanner : null;
  const faqValue = faqMeta.heading || faqItems.length > 0 ? { ...faqMeta, faqs: faqItems } : null;

  return (
    <form onSubmit={submitWithoutReset(formAction)} className="space-y-6">
      {state.error && (
        <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">{state.error}</p>
      )}

      <section className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-[0_1px_2px_rgb(15_23_42/0.04)]">
        <div>
          <h2 className="text-[15px] font-semibold">Page details</h2>
          <p className="text-sm text-muted-foreground">Title, URL and where the page is listed.</p>
        </div>
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

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select name="category" defaultValue={initial?.category ?? CATEGORIES[0]}>
            <SelectTrigger id="category"><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="region">Region</Label>
          <Select name="region" defaultValue={initial?.region ?? "none"}>
            <SelectTrigger id="region"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Not Region-Specific</SelectItem>
              <SelectItem value="north">North</SelectItem>
              <SelectItem value="south">South</SelectItem>
              <SelectItem value="east">East</SelectItem>
              <SelectItem value="west">West</SelectItem>
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

      </section>

      <Tabs defaultValue="hero" className="w-full gap-0">
        <TabsList variant="line" className="sticky top-0 z-10 h-auto w-full justify-start gap-1 overflow-x-auto rounded-none border-b border-border bg-canvas/95 px-0 pt-1 backdrop-blur">
          <TabsTrigger value="hero" className="h-10 flex-none px-3">Hero</TabsTrigger>
          <TabsTrigger value="universities" className="h-10 flex-none px-3">Universities</TabsTrigger>
          <TabsTrigger value="compare" className="h-10 flex-none px-3">Compare</TabsTrigger>
          <TabsTrigger value="sections" className="h-10 flex-none px-3">Sections</TabsTrigger>
          <TabsTrigger value="faq" className="h-10 flex-none px-3">FAQ</TabsTrigger>
          <TabsTrigger value="testimonials" className="h-10 flex-none px-3">Testimonials</TabsTrigger>
          <TabsTrigger value="cta" className="h-10 flex-none px-3">CTA</TabsTrigger>
          <TabsTrigger value="seo" className="h-10 flex-none px-3">SEO</TabsTrigger>
        </TabsList>

        <TabsContent keepMounted value="hero" className="mt-4 space-y-4 rounded-xl border border-border bg-card p-5 shadow-[0_1px_2px_rgb(15_23_42/0.04)]">
          <HiddenJson name="hero" value={hero} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Badge</Label>
              <Input value={str(hero, "badge")} onChange={(e) => setHero({ ...hero, badge: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Heading</Label>
              <Input value={str(hero, "heading")} onChange={(e) => setHero({ ...hero, heading: e.target.value })} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea rows={2} value={str(hero, "description")} onChange={(e) => setHero({ ...hero, description: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <MediaPickerField
                label="Hero image"
                folder="landing-pages"
                value={(hero.image as { src?: string })?.src ?? ""}
                onChange={(src) => setHero({ ...hero, image: { src, alt: (hero.image as { alt?: string })?.alt ?? "" } })}
              />
            </div>
            <div className="space-y-2">
              <Label>Hero Image Alt</Label>
              <Input
                value={(hero.image as { alt?: string })?.alt ?? ""}
                onChange={(e) => setHero({ ...hero, image: { src: (hero.image as { src?: string })?.src ?? "", alt: e.target.value } })}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Primary Button Text</Label>
              <Input value={str(hero, "primaryButtonText")} onChange={(e) => setHero({ ...hero, primaryButtonText: e.target.value })} placeholder="Apply Now" />
            </div>
            <div className="space-y-2">
              <Label>Secondary Button Text</Label>
              <Input value={str(hero, "secondaryButtonText")} onChange={(e) => setHero({ ...hero, secondaryButtonText: e.target.value })} placeholder="Free Counselling" />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="space-y-2 rounded-lg border border-border p-3">
                <Label className="text-xs">Stat {n} Value</Label>
                <Input value={str(hero, `stat${n}Value`)} onChange={(e) => setHero({ ...hero, [`stat${n}Value`]: e.target.value })} />
                <Label className="text-xs">Stat {n} Label</Label>
                <Input value={str(hero, `stat${n}Label`)} onChange={(e) => setHero({ ...hero, [`stat${n}Label`]: e.target.value })} />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent keepMounted value="universities" className="mt-4 space-y-4 rounded-xl border border-border bg-card p-5 shadow-[0_1px_2px_rgb(15_23_42/0.04)]">
          <HiddenJson name="university_section" value={universitySection} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Section Badge</Label>
              <Input value={str(universitySection, "badge")} onChange={(e) => setUniversitySection({ ...universitySection, badge: e.target.value })} placeholder="Top Online Universities" />
            </div>
            <div className="space-y-2">
              <Label>Section Heading</Label>
              <Input value={str(universitySection, "heading")} onChange={(e) => setUniversitySection({ ...universitySection, heading: e.target.value })} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Section Description</Label>
            <Textarea rows={2} value={str(universitySection, "description")} onChange={(e) => setUniversitySection({ ...universitySection, description: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Universities (min 1)</Label>
            <MultiSelectPicker
              options={universityOptions}
              initial={initialUniversityIds ?? []}
              hiddenFieldName="universities"
              searchPlaceholder="Search universities..."
            />
            {errors.universities && <p className="text-xs text-destructive">{errors.universities}</p>}
          </div>
        </TabsContent>

        <TabsContent keepMounted value="compare" className="mt-4 space-y-4 rounded-xl border border-border bg-card p-5 shadow-[0_1px_2px_rgb(15_23_42/0.04)]">
          <HiddenJson name="compare_section" value={compareSectionValue} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Badge</Label>
              <Input value={compareBadge} onChange={(e) => setCompareBadge(e.target.value)} placeholder="Compare" />
            </div>
            <div className="space-y-2">
              <Label>Heading</Label>
              <Input value={compareHeading} onChange={(e) => setCompareHeading(e.target.value)} placeholder="Compare Universities Side by Side" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea rows={2} value={compareDescription} onChange={(e) => setCompareDescription(e.target.value)} />
          </div>
          <p className="text-xs text-muted-foreground">Comparison rows (Fees, Duration, Study Mode, Eligibility, Placement Support) use the standard set automatically.</p>
        </TabsContent>

        <TabsContent keepMounted value="sections" className="mt-4 space-y-6 rounded-xl border border-border bg-card p-5 shadow-[0_1px_2px_rgb(15_23_42/0.04)]">
          <SectionGroup
            title="Why Choose Us"
            fieldName="why_choose"
            initialHeading={str(initial?.why_choose, "heading")}
            initialDescription={str(initial?.why_choose, "description")}
            itemFields={[{ name: "title", label: "Title" }, { name: "description", label: "Description", type: "textarea" }, { name: "icon", label: "Icon key (optional)" }]}
            initialItems={arr(initial?.why_choose, "items")}
          />
          <SectionGroup
            title="Stats"
            fieldName="stats"
            itemsKey="stats"
            initialHeading={str(initial?.stats, "heading")}
            initialDescription={str(initial?.stats, "description")}
            itemFields={[{ name: "value", label: "Value" }, { name: "label", label: "Label" }]}
            initialItems={arr(initial?.stats, "stats")}
          />
          <SectionGroup
            title="Specializations"
            fieldName="specializations"
            initialHeading={str(initial?.specializations, "heading")}
            initialDescription={str(initial?.specializations, "description")}
            itemFields={[{ name: "title", label: "Title" }, { name: "description", label: "Description", type: "textarea" }, { name: "icon", label: "Icon key (optional)" }]}
            initialItems={arr(initial?.specializations, "items")}
          />
          <SectionGroup
            title="Benefits"
            fieldName="benefits"
            initialHeading={str(initial?.benefits, "heading")}
            initialDescription={str(initial?.benefits, "description")}
            itemFields={[{ name: "title", label: "Title" }, { name: "description", label: "Description", type: "textarea" }, { name: "icon", label: "Icon key (optional)" }]}
            initialItems={arr(initial?.benefits, "items")}
          />
          <SectionGroup
            title="Career Scope"
            fieldName="career_scope"
            itemsKey="roles"
            itemLabel="Role"
            initialHeading={str(initial?.career_scope, "heading")}
            initialDescription={str(initial?.career_scope, "description")}
            itemFields={[{ name: "title", label: "Role Title" }, { name: "salaryRange", label: "Salary Range" }, { name: "description", label: "Description", type: "textarea" }]}
            initialItems={arr(initial?.career_scope, "roles")}
          />

          <div className="space-y-3 rounded-lg border border-border p-4">
            <HiddenJson name="highlight_banner" value={highlightBannerValue} />
            <Label className="text-sm font-semibold">Highlight Banner</Label>
            <div className="space-y-2">
              <Label className="text-xs">Heading</Label>
              <Input value={str(highlightBanner, "heading")} onChange={(e) => setHighlightBanner({ ...highlightBanner, heading: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Description</Label>
              <Textarea rows={2} value={str(highlightBanner, "description")} onChange={(e) => setHighlightBanner({ ...highlightBanner, description: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Button Label</Label>
              <Input value={str(highlightBanner, "buttonLabel")} onChange={(e) => setHighlightBanner({ ...highlightBanner, buttonLabel: e.target.value })} placeholder="Get Placement Assistance" />
            </div>
          </div>
        </TabsContent>

        <TabsContent keepMounted value="faq" className="mt-4 space-y-4 rounded-xl border border-border bg-card p-5 shadow-[0_1px_2px_rgb(15_23_42/0.04)]">
          <HiddenJson name="faq" value={faqValue} />
          <div className="space-y-2">
            <Label>Heading</Label>
            <Input value={faqMeta.heading} onChange={(e) => setFaqMeta({ ...faqMeta, heading: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea rows={2} value={faqMeta.description} onChange={(e) => setFaqMeta({ ...faqMeta, description: e.target.value })} />
          </div>
          <FaqEditor initial={faqItems} onChange={setFaqItems} />
        </TabsContent>

        <TabsContent keepMounted value="testimonials" className="mt-4 space-y-4 rounded-xl border border-border bg-card p-5 shadow-[0_1px_2px_rgb(15_23_42/0.04)]">
          <div className="space-y-2">
            <Label htmlFor="testimonials_heading">Testimonials Heading</Label>
            <Input id="testimonials_heading" name="testimonials_heading" defaultValue={initial?.testimonials_heading ?? "What Our Students Say"} />
          </div>
          <div className="space-y-2">
            <Label>Testimonials (leave empty to show sitewide defaults)</Label>
            <MultiSelectPicker
              options={testimonialOptions}
              initial={initialTestimonialIds ?? []}
              hiddenFieldName="testimonials"
              searchPlaceholder="Search testimonials..."
            />
          </div>
        </TabsContent>

        <TabsContent keepMounted value="cta" className="mt-4 space-y-4 rounded-xl border border-border bg-card p-5 shadow-[0_1px_2px_rgb(15_23_42/0.04)]">
          <HiddenJson name="cta" value={cta} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Badge</Label>
              <Input value={str(cta, "badge")} onChange={(e) => setCta({ ...cta, badge: e.target.value })} placeholder="Admissions Open 2026-27" />
            </div>
            <div className="space-y-2">
              <Label>Heading</Label>
              <Input value={str(cta, "heading")} onChange={(e) => setCta({ ...cta, heading: e.target.value })} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea rows={3} value={str(cta, "description")} onChange={(e) => setCta({ ...cta, description: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Primary Button Text</Label>
              <Input value={str(cta, "primaryButtonText")} onChange={(e) => setCta({ ...cta, primaryButtonText: e.target.value })} placeholder="Apply Now" />
            </div>
            <div className="space-y-2">
              <Label>Secondary Button Text</Label>
              <Input value={str(cta, "secondaryButtonText")} onChange={(e) => setCta({ ...cta, secondaryButtonText: e.target.value })} placeholder="Talk to an Expert" />
            </div>
          </div>
        </TabsContent>

        <TabsContent keepMounted value="seo" className="mt-4 space-y-4 rounded-xl border border-border bg-card p-5 shadow-[0_1px_2px_rgb(15_23_42/0.04)]">
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
              <MediaPickerField name="seo_og_image_url" label="Social share image (1200×630)" folder="landing-pages" defaultValue={initial?.seo_og_image_url ?? ""} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="seo_keywords">Keywords (comma-separated)</Label>
            <Input id="seo_keywords" name="seo_keywords" defaultValue={initial?.seo_keywords?.join(", ") ?? ""} />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="seo_no_index" name="seo_no_index" defaultChecked={initial?.seo_no_index} />
            <Label htmlFor="seo_no_index" className="cursor-pointer font-normal">No Index</Label>
          </div>
        </TabsContent>
      </Tabs>

      <FormActionBar pending={pending} submitLabel={submitLabel} cancelHref="/admin/pages" />
    </form>
  );
}

function SectionGroup({
  title,
  fieldName,
  itemFields,
  initialItems,
  initialHeading,
  initialDescription,
  itemsKey = "items",
  itemLabel = "Item",
}: {
  title: string;
  fieldName: string;
  itemFields: FieldDef[];
  initialItems: Record<string, string>[];
  initialHeading: string;
  initialDescription: string;
  itemsKey?: string;
  itemLabel?: string;
}) {
  const [heading, setHeading] = useState(initialHeading);
  const [description, setDescription] = useState(initialDescription);
  const [items, setItems] = useState<Record<string, string>[]>(initialItems);

  const value = heading || items.length > 0 ? { heading, description, [itemsKey]: items } : null;

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <HiddenJson name={fieldName} value={value} />
      <Label className="text-sm font-semibold">{title}</Label>
      <div className="space-y-2">
        <Label className="text-xs">Heading</Label>
        <Input value={heading} onChange={(e) => setHeading(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label className="text-xs">Description</Label>
        <Textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <RepeatableItemsEditor fields={itemFields} initial={items} onChange={setItems} itemLabel={itemLabel} />
    </div>
  );
}
