"use client";

import Container from "@/components/common/container";

export default function CTA() {
  return (
    <section className="py-20">
      <Container>
        <div className="relative overflow-hidden rounded-[32px] bg-[#0B3B68]">
          
          {/* Background Effects */}
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[#F47C45]/20 blur-3xl" />

          <div className="relative z-10 px-8 py-16 md:px-16">
            <div className="grid items-center gap-12 lg:grid-cols-2">

              {/* Left Content */}
              <div>
                <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
                  AI Powered MBA Discovery
                </span>

                <h2 className="mt-6 text-4xl font-bold leading-tight text-white md:text-5xl">
                  Discover The Best
                  <span className="block text-[#F47C45]">
                    Online MBA For Your Career
                  </span>
                </h2>

                <p className="mt-5 max-w-xl text-slate-200">
                  Compare universities, fees, placements, rankings and
                  specializations with expert guidance before taking admission.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3 text-white">
                    <span>✓</span>
                    <span>50+ UGC Approved Universities</span>
                  </div>

                  <div className="flex items-center gap-3 text-white">
                    <span>✓</span>
                    <span>AI Based Comparison</span>
                  </div>

                  <div className="flex items-center gap-3 text-white">
                    <span>✓</span>
                    <span>Free Career Counselling</span>
                  </div>

                  <div className="flex items-center gap-3 text-white">
                    <span>✓</span>
                    <span>Placement Insights</span>
                  </div>
                </div>
              </div>

              {/* Right Card */}
              <div className="mx-auto w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-2xl">

                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-4xl">
                  🎓
                </div>

                <h3 className="text-3xl font-bold text-[#0F172A]">
                  Free MBA Counselling
                </h3>

                <p className="mt-4 text-slate-600">
                  Get personalized university recommendations,
                  fee comparisons and career guidance from our experts.
                </p>

                <div className="mt-8 space-y-4">
                  <button
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        window.dispatchEvent(
                          new Event("openLeadPopup")
                        );
                      }
                    }}
                    className="w-full cursor-pointer rounded-xl bg-[#F47C45] py-4 font-semibold text-white transition hover:opacity-90"
                  >
                    Get Free Counselling
                  </button>

                  <button
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        window.dispatchEvent(
                          new Event("openLeadPopup")
                        );
                      }
                    }}
                    className="w-full cursor-pointer rounded-xl border border-slate-200 py-4 font-semibold text-slate-800 transition hover:bg-slate-50"
                  >
                    Compare Universities
                  </button>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
                  <span>⭐</span>
                  <span>5000+ Students Guided Successfully</span>
                </div>

                <div className="mt-8 rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">
                    🎯 Trusted by students across India for MBA admissions,
                    university comparison and career guidance.
                  </p>
                </div>

              </div>

            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}