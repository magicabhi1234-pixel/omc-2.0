import TestimonialForm from "@/components/admin/testimonial-form";
import { createTestimonial } from "../actions";
import { PageHeader } from "@/components/admin/page-kit";

export default function NewTestimonialPage() {
  return (
    <div>
      <PageHeader title="New Testimonial" />
      <div>
        <TestimonialForm action={createTestimonial} submitLabel="Create Testimonial" />
      </div>
    </div>
  );
}
