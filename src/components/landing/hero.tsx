"use client";

import LeadForm from "@/components/common/lead-form";

export default function Hero() {
  const openPopup = () => {
    window.dispatchEvent(
      new Event("openLeadPopup")
    );
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0B3B68] via-[#123f6d] to-[#0F172A] py-20 text-white">

      {/* Background Effects */}
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-[#F47C45]/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4">

        <div className="grid items-center gap-12 lg:grid-cols-2">

          {/* Left Content */}
          <div>

            <span className="rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
              🎓 Admissions Open 2026
            </span>

            <h1 className="mt-6 text-5xl font-bold leading-tight md:text-6xl">
              Top Distance MBA
              <span className="block text-[#F47C45]">
                Colleges & Universities
              </span>
              in North India
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-slate-300">
              Compare fees, NAAC grades, placements,
              scholarships and admission process from
              India's leading UGC-approved MBA universities.
            </p>

            {/* Highlights */}
            <div className="mt-8 flex flex-wrap gap-3">

              <div className="rounded-full bg-white/10 px-4 py-2 backdrop-blur">
                ✅ UGC Approved
              </div>

              <div className="rounded-full bg-white/10 px-4 py-2 backdrop-blur">
                ✅ EMI Available
              </div>

              <div className="rounded-full bg-white/10 px-4 py-2 backdrop-blur">
                ✅ Placement Support
              </div>

            </div>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-wrap gap-4">

              <button
                onClick={openPopup}
                className="rounded-xl bg-[#F47C45] px-8 py-4 font-semibold text-white transition hover:scale-105"
              >
                Apply Now
              </button>

              <button
                onClick={openPopup}
                className="rounded-xl border border-white px-8 py-4 font-semibold text-white transition hover:bg-white hover:text-[#0B3B68]"
              >
                Free Counselling
              </button>

            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6">

              <div>
                <h3 className="text-3xl font-bold">
                  50+
                </h3>

                <p className="text-slate-300">
                  Universities
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">
                  100+
                </h3>

                <p className="text-slate-300">
                  MBA Programs
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">
                  10K+
                </h3>

                <p className="text-slate-300">
                  Students Guided
                </p>
              </div>

            </div>

          </div>

          {/* Right Form */}
          <div>

            <div className="rounded-3xl bg-white p-8 shadow-2xl">
              <h3 className="mb-6 text-center text-2xl font-bold text-slate-900">
                Get Free MBA Counselling
              </h3>

              <LeadForm />
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}