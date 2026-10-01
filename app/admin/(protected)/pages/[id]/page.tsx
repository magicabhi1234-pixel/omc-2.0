import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { supabaseAdmin } from "@/lib/db/client";
import LandingPageForm from "@/components/admin/landing-page-form";
import { updateLandingPage } from "../actions";
import { PageHeader } from "@/components/admin/page-kit";

export default async function EditLandingPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [{ data: page }, { data: universities }, { data: testimonials }, { data: uniLinks }, { data: testimonialLinks }] =
    await Promise.all([
      supabaseAdmin.from("landing_pages").select("*").eq("id", id).maybeSingle(),
      supabaseAdmin.from("universities").select("id, name").order("name"),
      supabaseAdmin.from("testimonials").select("id, name").order("name"),
      supabaseAdmin.from("landing_page_universities").select("university_id").eq("landing_page_id", id).order("sort_order"),
      supabaseAdmin.from("landing_page_testimonials").select("testimonial_id").eq("landing_page_id", id).order("sort_order"),
    ]);

  if (!page) notFound();

  return (
    <div>
      <PageHeader
        eyebrow="Landing page"
        title={page.title}
        description={<>/{page.slug} · {page.status === "published" ? "Published" : "Draft"}</>}
        actions={
          page.status === "published" ? (
            <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "outline" })}>
              <ExternalLink size={15} /> View live
            </a>
          ) : null
        }
      />
      <div>
        <LandingPageForm
          action={updateLandingPage.bind(null, id)}
          initial={page}
          universityOptions={(universities ?? []).map((u) => ({ id: u.id, label: u.name }))}
          testimonialOptions={(testimonials ?? []).map((t) => ({ id: t.id, label: t.name }))}
          initialUniversityIds={(uniLinks ?? []).map((r) => r.university_id)}
          initialTestimonialIds={(testimonialLinks ?? []).map((r) => r.testimonial_id)}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
