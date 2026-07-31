import Container from "@/components/common/container";
import { getDefaultTestimonials } from "@/data/registry";

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

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-4 flex text-[#F47C45]" aria-hidden="true">
                {"★".repeat(item.rating)}
                {"☆".repeat(Math.max(0, 5 - item.rating))}
              </div>
              <span className="sr-only">Rated {item.rating} out of 5 stars</span>

              <p className="leading-7 text-slate-600">
                &ldquo;{item.review}&rdquo;
              </p>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <h4 className="font-semibold text-[#0F172A]">
                  {item.name}
                </h4>

                <p className="text-sm text-slate-500">
                  {[item.designation, item.university].filter(Boolean).join(" · ")}
                </p>
              </div>
            </div>
          ))}
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
