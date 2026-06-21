"use client";

import HeroForm from "./hero-form";
import Container from "@/components/common/container";

export default function Hero() {
  const openPopup = () => {
    window.dispatchEvent(new Event("openLeadPopup"));
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 pt-[50px] pb-16 lg:pb-20">
      
      {/* Background Effects */}
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-orange-200/20 blur-3xl" />

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">

          {/* Left Content */}
          <div>

            <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-[#0B3B68]">
              🤖 AI Powered MBA Discovery Platform
            </span>

            <h1 className="mt-5 text-4xl font-bold leading-tight text-slate-900 lg:text-6xl">
              Find The Best
              <span className="block text-[#0B3B68]">
                Online MBA
              </span>
              For Your Career
            </h1>

            <p className="mt-5 max-w-xl text-lg text-slate-600">
              Compare 50+ UGC Approved Universities, MBA Fees,
              Placements, Rankings and Specializations using
              AI-powered recommendations.
            </p>

            {/* Trust Points */}
            <div className="mt-5 flex flex-wrap gap-4 text-sm font-medium text-slate-700">
              <span>✓ 50+ Universities</span>
              <span>✓ AI Comparison</span>
              <span>✓ UGC Approved</span>
              <span>✓ Free Counselling</span>
            </div>

            {/* CTA */}
            <div className="mt-7 flex flex-wrap gap-4">
              <button
                onClick={openPopup}
                className="cursor-pointer rounded-xl bg-[#0B3B68] px-6 py-3 font-semibold text-white transition hover:opacity-90"
              >
                Explore Universities
              </button>

              <button
                onClick={openPopup}
                className="cursor-pointer rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                Compare Colleges
              </button>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">

              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <h3 className="text-2xl font-bold text-[#0B3B68]">
                  50+
                </h3>
                <p className="text-sm text-slate-600">
                  Universities
                </p>
              </div>

              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <h3 className="text-2xl font-bold text-[#0B3B68]">
                  100+
                </h3>
                <p className="text-sm text-slate-600">
                  Programs
                </p>
              </div>

              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <h3 className="text-2xl font-bold text-[#0B3B68]">
                  5000+
                </h3>
                <p className="text-sm text-slate-600">
                  Students
                </p>
              </div>

              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <h3 className="text-2xl font-bold text-[#0B3B68]">
                  98%
                </h3>
                <p className="text-sm text-slate-600">
                  Satisfaction
                </p>
              </div>

            </div>

          </div>

          {/* Right Form */}
          <div>
            <HeroForm />
          </div>

        </div>
      </Container>
    </section>
  );
}