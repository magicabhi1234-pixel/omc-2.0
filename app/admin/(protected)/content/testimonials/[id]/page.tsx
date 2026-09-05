import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/db/client";
import TestimonialForm from "@/components/admin/testimonial-form";
import { updateTestimonial } from "../actions";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data } = await supabaseAdmin.from("testimonials").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Edit Testimonial</h1>
      <div className="mt-6">
        <TestimonialForm action={updateTestimonial.bind(null, id)} initial={data} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
