import Container from "@/components/common/container";

const features = [
  {
    title: "AI Powered Comparison",
    description:
      "Compare universities, fees, rankings, approvals and placements instantly.",
  },
  {
    title: "Verified Universities",
    description:
      "Only UGC approved and NAAC accredited universities are listed.",
  },
  {
    title: "Expert Career Counseling",
    description:
      "Get free guidance from experienced education counselors.",
  },
  {
    title: "Admission Assistance",
    description:
      "End-to-end support from application to enrollment.",
  },
];

export default function WhyOMC() {
  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-[#F47C45]">
            Why Choose Us
          </span>

          <h2 className="mt-3 text-4xl font-bold text-slate-900">
            Why Students Trust Online MBA Colleges
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            We help students discover the right online university through
            transparent comparison and expert guidance.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-[#0B3B68] font-bold">
                ✓
              </div>

              <h3 className="text-xl font-semibold text-slate-900">
                {item.title}
              </h3>

              <p className="mt-3 text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}