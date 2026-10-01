import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquareQuote, Pencil, Plus, Star } from "lucide-react";
import { supabaseAdmin } from "@/lib/db/client";
import { requireProfile } from "@/lib/auth/session";
import LinkButton from "@/components/admin/link-button";
import PublishToggle from "@/components/admin/publish-toggle";
import DeleteButton from "@/components/admin/delete-button";
import ContentTable from "@/components/admin/content-table";
import { PageHeader } from "@/components/admin/page-kit";
import { runAction } from "@/lib/admin/run-action";
import { deleteTestimonial, toggleTestimonialStatus } from "./actions";
import { bulkTestimonials } from "../../bulk-actions";

export const metadata: Metadata = { title: "Testimonials" };

export default async function TestimonialsListPage() {
  const profile = await requireProfile();

  const { data } = await supabaseAdmin
    .from("testimonials")
    .select("id, name, designation, university, rating, status, review, image_url")
    .order("created_at", { ascending: false });
  const testimonials = data ?? [];

  return (
    <div>
      <PageHeader
        title="Testimonials"
        description="Student reviews shown on the homepage and landing pages."
        actions={
          <LinkButton href="/admin/content/testimonials/new">
            <Plus size={16} /> New testimonial
          </LinkButton>
        }
      />
      <ContentTable
        noun={{ one: "testimonial", many: "testimonials" }}
        emptyIcon={<MessageSquareQuote size={22} aria-hidden="true" />}
        searchPlaceholder="Search by name, university or review text…"
        canDelete={profile.permissions.canDeleteContent}
        canPublish={profile.permissions.canPublish}
        bulkAction={bulkTestimonials}
        columns={[{ label: "Student" }, { label: "Review", className: "hidden lg:table-cell" }, { label: "Rating", className: "hidden sm:table-cell" }, { label: "Status" }, { label: "", className: "text-right" }]}
        rows={testimonials.map((t) => ({
          id: t.id,
          status: t.status,
          search: `${t.name} ${t.university ?? ""} ${t.review}`.toLowerCase(),
          cells: [
            <div key="n" className="flex min-w-0 items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                {t.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail
                  <img src={t.image_url} alt="" loading="lazy" className="size-full object-cover" />
                ) : (
                  t.name.slice(0, 1)
                )}
              </span>
              <span className="min-w-0">
                <Link href={`/admin/content/testimonials/${t.id}`} className="block truncate font-medium text-foreground hover:text-primary hover:underline">{t.name}</Link>
                <span className="block truncate text-xs text-muted-foreground">{[t.designation, t.university].filter(Boolean).join(" · ") || "—"}</span>
              </span>
            </div>,
            <p key="r" className="line-clamp-2 max-w-md text-sm text-muted-foreground">{t.review}</p>,
            <span key="s" className="inline-flex items-center gap-1 text-sm tabular-nums" aria-label={`${t.rating} out of 5`}>
              <Star size={13} className="fill-brand-accent text-brand-accent" aria-hidden="true" /> {t.rating}.0
            </span>,
            <PublishToggle
              key="p"
              status={t.status as "draft" | "published"}
              action={async (next) => {
                "use server";
                return runAction(() => toggleTestimonialStatus(t.id, next));
              }}
            />,
            <div key="x" className="flex justify-end gap-1">
              <LinkButton href={`/admin/content/testimonials/${t.id}`} variant="ghost" size="icon-sm" className="text-muted-foreground">
                <Pencil size={15} />
                <span className="sr-only">Edit testimonial from {t.name}</span>
              </LinkButton>
              {profile.permissions.canDeleteContent && (
                <DeleteButton
                  action={async () => {
                    "use server";
                    return runAction(() => deleteTestimonial(t.id));
                  }}
                  confirmMessage={`Delete testimonial from "${t.name}"?`}
                />
              )}
            </div>,
          ],
        }))}
      />
    </div>
  );
}
