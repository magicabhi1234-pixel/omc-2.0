import { TestimonialsSection as TestimonialsSectionType } from "@/types/landing";

type Props = Partial<TestimonialsSectionType>;

export default function Testimonials({ heading, description, testimonials }: Props) {
  if (!testimonials || testimonials.length === 0) return null;

  const items = testimonials;
  const title = heading || "What Our Students Say";

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-14 text-center">
          <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-[#F47C45]">
            Testimonials
          </span>
          <h2 className="mt-5 text-4xl font-bold text-slate-900 md:text-5xl">
            {title}
          </h2>
          {description && <p className="mx-auto mt-5 max-w-3xl text-lg text-slate-600">{description}</p>}
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:shadow-xl"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${i < testimonial.rating ? "text-yellow-400" : "text-slate-200"}`}
                  >
                    &#9733;
                  </span>
                ))}
              </div>
              <p className="leading-relaxed text-slate-600">&ldquo;{testimonial.review}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3 border-t pt-6">
                <div>
                  <p className="font-bold text-slate-900">{testimonial.name}</p>
                  {testimonial.designation && (
                    <p className="text-sm text-slate-500">{testimonial.designation}</p>
                  )}
                  {testimonial.university && (
                    <p className="text-sm text-slate-400">{testimonial.university}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

