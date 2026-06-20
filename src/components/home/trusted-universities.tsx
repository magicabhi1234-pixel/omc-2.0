import Container from "@/components/common/container";

const universities = [
  {
    name: "Amity University Online",
    grade: "NAAC A+",
  },
  {
    name: "Manipal University Jaipur",
    grade: "NAAC A+",
  },
  {
    name: "Jain University",
    grade: "NAAC A++",
  },
  {
    name: "LPU Online",
    grade: "NAAC A++",
  },
];

export default function TrustedUniversities() {
  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="text-center">
          <span className="text-sm font-semibold text-[#F47C45] uppercase tracking-wider">
            Trusted Universities
          </span>

          <h2 className="mt-3 text-4xl font-bold text-slate-900">
            Learn From India's Top Universities
          </h2>

          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            Compare fees, rankings, approvals and placements from
            India's most trusted online universities.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {universities.map((university) => (
            <div
              key={university.name}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="h-14 w-14 rounded-2xl bg-blue-100" />

              <h3 className="mt-5 font-semibold text-slate-900">
                {university.name}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {university.grade}
              </p>

              <button className="mt-5 text-sm font-semibold text-[#0B3B68]">
                View Details →
              </button>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}