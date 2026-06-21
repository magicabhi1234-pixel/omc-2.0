"use client";

import Container from "@/components/common/container";

const testimonials = [
  {
    name: "Rahul Sharma",
    city: "Pune",
    review:
      "OMC helped me compare multiple universities in one place. I saved a lot of time and got admission in the right MBA program.",
  },
  {
    name: "Priya Verma",
    city: "Mumbai",
    review:
      "The counselling team guided me throughout the admission process. Their university comparison feature was very helpful.",
  },
  {
    name: "Amit Singh",
    city: "Delhi",
    review:
      "I was confused between Amity and Manipal. The platform helped me understand fees, placements and approvals easily.",
  },
];

export default function Testimonials() {
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
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-4 flex text-[#F47C45]">
                ⭐⭐⭐⭐⭐
              </div>

              <p className="leading-7 text-slate-600">
                "{item.review}"
              </p>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <h4 className="font-semibold text-[#0F172A]">
                  {item.name}
                </h4>

                <p className="text-sm text-slate-500">
                  {item.city}
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