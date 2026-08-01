import Container from "@/components/common/container";
import { getDefaultTestimonials } from "@/data/registry";
import TestimonialCarousel from "@/components/common/testimonial-carousel";

export default async function Testimonials() {
  const testimonials = await getDefaultTestimonials();

  if (testimonials.length === 0) return null;

  return (
    <section className="bg-white py-20">
      <Container>
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-[#F47C45]">
            Student Reviews
          </span>

          <h2 className="mt-3 text-4xl font-bold text-[#0F172A]">
            Trusted By MBA Aspirants Across India
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Thousands of students have used Online MBA Colleges to
            compare universities, explore programs and make better
            admission decisions.
          </p>
        </div>

        <div className="mt-14">
          <TestimonialCarousel testimonials={testimonials} />
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 grid gap-6 rounded-3xl bg-slate-50 p-8 text-center md:grid-cols-4">
          <div>
            <h3 className="text-3xl font-bold text-[#0B3B68]">
              5000+
            </h3>
            <p className="mt-1 text-slate-600">
              Students Guided
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-[#0B3B68]">
              50+
            </h3>
            <p className="mt-1 text-slate-600">
              Universities
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-[#0B3B68]">
              100+
            </h3>
            <p className="mt-1 text-slate-600">
              Programs
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-[#0B3B68]">
              98%
            </h3>
            <p className="mt-1 text-slate-600">
              Satisfaction Rate
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
