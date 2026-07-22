"use client";

import { HeroSection } from "@/types/landing";

type Props = Partial<HeroSection>;

export default function Hero(props: Props) {
  const {
    badge = "🎓 Admissions Open 2026",
    heading = "Top Distance MBA",
    description = "Compare fees, rankings, scholarships, placements and admission process from India's leading UGC-approved MBA universities.",
    primaryButton = { label: "Apply Now", variant: "primary" },
    secondaryButton = { label: "Free Counselling", variant: "outline" },
  } = props;

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

        <div className="grid items-center gap-14 lg:grid-cols-2">

          {/* Left Content */}
          <div>

            <span className="rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
              {badge}
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight md:text-5xl">
              {heading}
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-slate-300">
              {description}
            </p>

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

            <div className="mt-10 flex flex-wrap gap-4">

              <button
                onClick={openPopup}
                className="cursor-pointer rounded-xl bg-[#F47C45] px-8 py-4 font-semibold text-white transition hover:scale-105"
              >
                {primaryButton.label}
              </button>

              {secondaryButton && (
                <button
                  onClick={openPopup}
                  className="cursor-pointer rounded-xl border border-white px-8 py-4 font-semibold text-white transition hover:bg-white hover:text-[#0B3B68]"
                >
                  {secondaryButton.label}
                </button>
              )}

            </div>

          </div>

          {/* Right Dashboard Card */}
          <div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl shadow-2xl">

              <h3 className="mb-6 text-center text-2xl font-bold">
                Top MBA Universities
              </h3>

              <div className="space-y-4">

                <div className="flex items-center justify-between rounded-xl bg-white/10 p-4">
                  <span>Amity University</span>
                  <span className="font-semibold">
                    ₹1.99L | A+
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-white/10 p-4">
                  <span>LPU Online</span>
                  <span className="font-semibold">
                    ₹1.80L | A++
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-white/10 p-4">
                  <span>Chandigarh University</span>
                  <span className="font-semibold">
                    ₹1.58L | A+
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-white/10 p-4">
                  <span>UPES Online</span>
                  <span className="font-semibold">
                    ₹1.50L | A
                  </span>
                </div>

              </div>

              {/* Scholarship */}
              <div className="mt-6 rounded-2xl bg-[#F47C45] p-5 text-center">

                <p className="text-sm uppercase tracking-wider">
                  Scholarship Available
                </p>

                <h4 className="mt-2 text-4xl font-bold">
                  ₹30,000
                </h4>

                <p className="mt-2 text-sm">
                  Limited Time Admission Benefit
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

