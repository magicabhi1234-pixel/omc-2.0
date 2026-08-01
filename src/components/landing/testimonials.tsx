import { TestimonialsSection as TestimonialsSectionType } from "@/types/landing";
import TestimonialCarousel from "@/components/common/testimonial-carousel";

type Props = Partial<TestimonialsSectionType>;

export default function Testimonials({ heading, description, testimonials }: Props) {
  if (!testimonials || testimonials.length === 0) return null;

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
        <TestimonialCarousel testimonials={testimonials} />
      </div>
    </section>
  );
}
