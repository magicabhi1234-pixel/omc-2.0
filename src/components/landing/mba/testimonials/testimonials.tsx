import Container from "@/components/landing/common/container";
import SectionHeading from "@/components/landing/common/section-heading";
import { TestimonialsSection as TestimonialsSectionType } from "@/types/landing";

export default function Testimonials({
  heading,
  description,
  testimonials,
}: TestimonialsSectionType) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          badge="Testimonials"
          title={heading}
          description={description}
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:shadow-xl"
            >
              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < testimonial.rating
                        ? "text-yellow-400"
                        : "text-slate-200"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>

              <p className="leading-relaxed text-slate-600">
                &ldquo;{testimonial.review}&rdquo;
              </p>

              <div className="mt-6 flex items-center gap-3 border-t pt-6">
                <div>
                  <p className="font-bold text-slate-900">
                    {testimonial.name}
                  </p>
                  {testimonial.designation && (
                    <p className="text-sm text-slate-500">
                      {testimonial.designation}
                    </p>
                  )}
                  {testimonial.university && (
                    <p className="text-sm text-slate-400">
                      {testimonial.university}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

