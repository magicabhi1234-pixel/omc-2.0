import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/db/client";
import LandingPageForm from "@/components/admin/landing-page-form";
import { updateLandingPage } from "../actions";

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
      <h1 className="text-2xl font-bold text-slate-900">Edit Landing Page</h1>
      <div className="mt-6">
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
