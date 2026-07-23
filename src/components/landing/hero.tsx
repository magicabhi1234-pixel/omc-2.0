"use client";

import React from "react";
import { HeroSection } from "@/types/landing";

type Props = Partial<HeroSection>;

export default function Hero(props: Props) {
  const {
    badge = "Admissions Open 2026",
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
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0B3B68] via-[#123f6d] to-[#0F172A] py-24 text-white">

      {/* Background Glows */}
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-[#F47C45]/15 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-500/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* Left Content */}
          <div className="space-y-6">

            {badge && (
              <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-200 shadow-sm backdrop-blur-md">
                🎓 {badge}
              </span>
            )}

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl lg:leading-[1.15]">
              {heading}
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
              {description}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">

              <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 backdrop-blur-md shadow-sm transition-all duration-300 hover:bg-white/10">
                <span className="text-emerald-400 font-bold">✓</span> UGC Approved
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 backdrop-blur-md shadow-sm transition-all duration-300 hover:bg-white/10">
                <span className="text-emerald-400 font-bold">✓</span> EMI Available
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 backdrop-blur-md shadow-sm transition-all duration-300 hover:bg-white/10">
                <span className="text-emerald-400 font-bold">✓</span> Placement Support
              </div>

            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:gap-5 pt-4">

              <button
                onClick={openPopup}
                aria-label={primaryButton.label}
                className="w-full cursor-pointer rounded-2xl bg-[#F47C45] px-8 py-4 text-center font-bold text-white shadow-lg shadow-[#F47C45]/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-[#F47C45]/30 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F47C45] focus-visible:ring-offset-2 focus-visible:ring-offset-[#123f6d] sm:w-auto"
              >
                {primaryButton.label}
              </button>

              {secondaryButton && (
                <button
                  onClick={openPopup}
                  aria-label={secondaryButton.label}
                  className="w-full cursor-pointer rounded-2xl border-2 border-white/30 bg-transparent px-8 py-4 text-center font-bold text-white transition-all duration-300 hover:scale-[1.03] hover:border-white hover:bg-white hover:text-[#0B3B68] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#123f6d] sm:w-auto"
                >
                  {secondaryButton.label}
                </button>
              )}

            </div>

          </div>

          {/* Right Dashboard Card */}
          <div className="relative">

            {/* Glowing background decoration */}
            <div className="absolute inset-0 -m-4 rounded-3xl bg-gradient-to-tr from-[#F47C45]/10 to-blue-500/10 blur-xl" />

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:border-white/20">

              <h3 className="mb-6 text-center text-xl font-extrabold tracking-tight md:text-2xl">
                🏆 Top MBA Universities
              </h3>

              <div className="space-y-3">

                <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4 transition-all duration-300 hover:scale-[1.02] hover:bg-white/10">
                  <span className="font-semibold text-slate-100">Amity University</span>
                  <span className="rounded-lg bg-orange-500/20 px-3 py-1.5 text-xs font-bold text-orange-200">
                    ₹1.99L | NAAC A+
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4 transition-all duration-300 hover:scale-[1.02] hover:bg-white/10">
                  <span className="font-semibold text-slate-100">LPU Online</span>
                  <span className="rounded-lg bg-orange-500/20 px-3 py-1.5 text-xs font-bold text-orange-200">
                    ₹1.80L | NAAC A++
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4 transition-all duration-300 hover:scale-[1.02] hover:bg-white/10">
                  <span className="font-semibold text-slate-100">Chandigarh University</span>
                  <span className="rounded-lg bg-orange-500/20 px-3 py-1.5 text-xs font-bold text-orange-200">
                    ₹1.58L | NAAC A+
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4 transition-all duration-300 hover:scale-[1.02] hover:bg-white/10">
                  <span className="font-semibold text-slate-100">UPES Online</span>
                  <span className="rounded-lg bg-orange-500/20 px-3 py-1.5 text-xs font-bold text-orange-200">
                    ₹1.50L | NAAC A
                  </span>
                </div>

              </div>

              {/* Scholarship */}
              <div className="mt-6 rounded-2xl bg-gradient-to-r from-[#F47C45] to-[#f58d5c] p-6 text-center shadow-lg transition-transform duration-300 hover:scale-[1.01]">

                <p className="text-xs font-bold uppercase tracking-wider text-orange-100">
                  Scholarship Available
                </p>

                <h4 className="mt-2 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                  ₹30,000
                </h4>

                <p className="mt-2 text-xs font-semibold text-orange-100">
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
