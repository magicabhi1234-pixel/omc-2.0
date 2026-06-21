import Container from "@/components/common/container";

export default function AboutStory() {
  return (
    <section className="bg-white py-20">
      <Container>

        <div className="grid items-center gap-12 lg:grid-cols-2">

          {/* Left Content */}
          <div>
            <span className="font-semibold uppercase tracking-wider text-[#F47C45]">
              Who We Are
            </span>

            <h2 className="mt-4 text-4xl font-bold text-slate-900">
              Your Trusted MBA Discovery Platform
            </h2>

            <p className="mt-6 leading-8 text-slate-600">
              Choosing the right online MBA can be confusing.
              We simplify the process by helping students
              compare universities, fees, accreditations,
              placements and career opportunities in one place.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              Our goal is to provide transparent information,
              expert guidance and AI-powered comparisons that
              help students make informed decisions.
            </p>
          </div>

          {/* Right Cards */}
          <div className="rounded-3xl bg-slate-50 p-8">

            <div className="grid gap-4">

              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-[#0B3B68]">
                  🎓 50+ Universities
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Compare top UGC-approved online MBA universities.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-[#0B3B68]">
                  🤖 AI Powered Comparison
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Compare fees, rankings and placements instantly.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-[#0B3B68]">
                  📈 Career Guidance
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Get expert counselling before admission.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-[#0B3B68]">
                  🏆 Trusted Platform
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Helping thousands of students choose the right MBA.
                </p>
              </div>

            </div>

          </div>

        </div>

      </Container>
    </section>
  );
}