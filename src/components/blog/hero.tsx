import Container from "@/components/common/container";

export default function BlogHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 py-20">

      {/* Background Blur */}
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-orange-200/20 blur-3xl" />

      <Container>
        <div className="relative z-10 mx-auto max-w-4xl text-center">

          <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-[#0B3B68]">
            📚 MBA Resources & Insights
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-tight text-slate-900 md:text-6xl">
            Learn, Compare &
            <span className="block text-[#0B3B68]">
              Grow Your Career
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            Explore MBA admissions, university comparisons,
            career guidance, specializations, placements and
            industry insights from experts.
          </p>

          {/* Search */}
          <div className="mx-auto mt-10 flex max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
            <input
              type="text"
              placeholder="Search articles, universities, MBA programs..."
              className="flex-1 px-5 py-4 outline-none"
            />

            <button className="cursor-pointer bg-[#0B3B68] px-8 font-semibold text-white">
              Search
            </button>
          </div>

          {/* Quick Categories */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              "MBA Admissions",
              "University Comparison",
              "Career Growth",
              "Online MBA",
              "Placements",
              "Specializations",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>

        </div>
      </Container>
    </section>
  );
}