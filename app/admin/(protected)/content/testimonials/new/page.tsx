import TestimonialForm from "@/components/admin/testimonial-form";
import { createTestimonial } from "../actions";

export default function NewTestimonialPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">New Testimonial</h1>
      <div className="mt-6">
        <TestimonialForm action={createTestimonial} submitLabel="Create Testimonial" />
      </div>
    </div>
  );
}
