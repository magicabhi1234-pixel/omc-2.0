import Container from "@/components/common/container";

export default function ContactHero() {
  return (
    <section className="bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 py-20">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-[#0B3B68]">
            Contact Us
          </span>

          <h1 className="mt-6 text-5xl font-bold text-slate-900">
            Get Free MBA Guidance
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
            Talk to our admission experts and find the best
            online MBA university for your career goals.
          </p>
        </div>
      </Container>
    </section>
  );
}