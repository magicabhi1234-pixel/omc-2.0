import HeroForm from "./hero-form";
import Container from "@/components/common/container";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50 py-20 lg:py-28">
      
      {/* Background Blur Effects */}
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />

      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" />

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          
          {/* Left Content */}
          <div>
            <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-[#0B3B68]">
              AI Powered MBA Discovery Platform
            </span>

            <h1 className="mt-6 text-5xl font-bold leading-tight text-slate-900 lg:text-6xl">
              Find Your Perfect
              <span className="block text-[#0B3B68]">
                Online MBA Program
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-slate-600">
              Compare fees, rankings, approvals, placements and
              specializations from India&apos;s leading online universities.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button className="rounded-xl bg-[#0B3B68] px-6 py-3 font-semibold text-white transition hover:opacity-90">
                Explore Universities
              </button>

              <button className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:bg-slate-50">
                Compare Colleges
              </button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              <div>
                <h3 className="text-3xl font-bold text-[#0B3B68]">
                  50+
                </h3>

                <p className="text-sm text-slate-600">
                  Universities
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-[#0B3B68]">
                  100+
                </h3>

                <p className="text-sm text-slate-600">
                  Programs
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-[#0B3B68]">
                  5000+
                </h3>

                <p className="text-sm text-slate-600">
                  Students Guided
                </p>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:pl-10">
            <HeroForm />
          </div>
        </div>
      </Container>
    </section>
  );
}