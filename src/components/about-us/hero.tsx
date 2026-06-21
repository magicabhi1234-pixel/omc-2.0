import Container from "@/components/common/container";

export default function AboutHero() {
  return (
    <section className="bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 py-20">
      <Container>
        <div className="mx-auto max-w-4xl text-center">

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-[#0B3B68]">
            About Us
          </span>

          <h1 className="mt-6 text-5xl font-bold text-slate-900">
            Helping Students Find The
            <span className="block text-[#0B3B68]">
              Right Online MBA
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600">
            OnlineMBAColleges helps students compare universities,
            fees, rankings, placements and specializations to
            make smarter admission decisions.
          </p>

        </div>
      </Container>
    </section>
  );
}