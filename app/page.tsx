import Container from "@/components/common/container";

export default function HomePage() {
  return (
    <section className="py-20">
      <Container>
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold text-slate-900">
            Find the Best Online MBA Colleges in India
          </h1>

          <p className="mt-6 text-lg text-slate-600">
            Compare universities, explore MBA specializations,
            and choose the right online MBA program for your
            career growth.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="rounded-lg bg-slate-900 px-6 py-3 text-white">
              Explore Universities
            </button>

            <button className="rounded-lg border px-6 py-3">
              Compare Colleges
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}