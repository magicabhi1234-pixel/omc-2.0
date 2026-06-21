import Container from "@/components/common/container";

export default function AboutMission() {
  return (
    <section className="bg-slate-50 py-20">
      <Container>

        <div className="grid gap-8 md:grid-cols-2">

          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-[#0B3B68]">
              Our Mission
            </h3>

            <p className="mt-4 text-slate-600">
              To help students discover the best online MBA
              programs through trusted information, expert
              guidance and technology-driven comparisons.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-[#0B3B68]">
              Our Vision
            </h3>

            <p className="mt-4 text-slate-600">
              To become India's most trusted platform for
              online higher education discovery and career
              growth guidance.
            </p>
          </div>

        </div>

      </Container>
    </section>
  );
}