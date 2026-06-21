import Container from "@/components/common/container";

export default function AboutStats() {
  return (
    <section className="bg-white py-20">
      <Container>

        <div className="grid gap-6 md:grid-cols-4">

          <div className="rounded-3xl border p-8 text-center">
            <h3 className="text-4xl font-bold text-[#0B3B68]">
              50+
            </h3>
            <p className="mt-2 text-slate-600">
              Universities
            </p>
          </div>

          <div className="rounded-3xl border p-8 text-center">
            <h3 className="text-4xl font-bold text-[#0B3B68]">
              100+
            </h3>
            <p className="mt-2 text-slate-600">
              Programs
            </p>
          </div>

          <div className="rounded-3xl border p-8 text-center">
            <h3 className="text-4xl font-bold text-[#0B3B68]">
              5000+
            </h3>
            <p className="mt-2 text-slate-600">
              Students Helped
            </p>
          </div>

          <div className="rounded-3xl border p-8 text-center">
            <h3 className="text-4xl font-bold text-[#0B3B68]">
              98%
            </h3>
            <p className="mt-2 text-slate-600">
              Satisfaction
            </p>
          </div>

        </div>

      </Container>
    </section>
  );
}