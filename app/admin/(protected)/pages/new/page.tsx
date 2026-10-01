import { supabaseAdmin } from "@/lib/db/client";
import LandingPageForm from "@/components/admin/landing-page-form";
import { createLandingPage } from "../actions";
import { PageHeader } from "@/components/admin/page-kit";

export default async function NewLandingPagePage() {
  const [{ data: universities }, { data: testimonials }] = await Promise.all([
    supabaseAdmin.from("universities").select("id, name").order("name"),
    supabaseAdmin.from("testimonials").select("id, name").order("name"),
  ]);

  return (
    <div>
      <PageHeader title="New Landing Page" />
      <div>
        <LandingPageForm
          action={createLandingPage}
          universityOptions={(universities ?? []).map((u) => ({ id: u.id, label: u.name }))}
          testimonialOptions={(testimonials ?? []).map((t) => ({ id: t.id, label: t.name }))}
          submitLabel="Create Landing Page"
        />
      </div>
    </div>
  );
}
