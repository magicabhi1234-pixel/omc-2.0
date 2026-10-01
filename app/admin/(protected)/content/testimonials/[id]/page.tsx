import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/db/client";
import TestimonialForm from "@/components/admin/testimonial-form";
import { updateTestimonial } from "../actions";
import { PageHeader } from "@/components/admin/page-kit";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data } = await supabaseAdmin.from("testimonials").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  return (
    <div>
      <PageHeader title="Edit Testimonial" />
      <div>
        <TestimonialForm action={updateTestimonial.bind(null, id)} initial={data} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
