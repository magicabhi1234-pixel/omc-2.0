"use client";

import React from "react";
import { ScholarshipBanner as ScholarshipBannerType } from "@/types/landing";

type Props = Partial<ScholarshipBannerType>;

export default function ScholarshipBanner(props: Props) {
  const {
    heading = "Get Scholarship Up To ₹30,000",
    description = "Apply through Online MBA Colleges and get exclusive scholarship benefits, EMI options and admission assistance.",
    button = { label: "Apply For Scholarship", variant: "primary" },
  } = props;

  const openPopup = () => {
    window.dispatchEvent(
      new Event("openLeadPopup")
    );
  };

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0B3B68] via-[#123f6d] to-[#0F172A] px-8 py-16 text-white md:px-16 shadow-xl">

          {/* Background Glows */}
          <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-[#F47C45]/15 blur-3xl" />
          <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl" />

          <div className="relative grid items-center gap-12 lg:grid-cols-2">

            {/* Left Column */}
            <div className="space-y-6">

              <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-200 shadow-sm backdrop-blur-md">
                🎁 Limited Time Offer
              </span>

              <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl lg:leading-[1.15]">
                {heading}
              </h2>

              {description && (
                <p className="text-base leading-relaxed text-slate-300 md:text-lg">
                  {description}
                </p>
              )}

              <div className="flex flex-wrap gap-3 pt-2">

                <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur-md shadow-sm transition-all duration-300 hover:bg-white/10">
                  <span className="text-emerald-400 font-bold">✓</span> Scholarship Assistance
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur-md shadow-sm transition-all duration-300 hover:bg-white/10">
                  <span className="text-emerald-400 font-bold">✓</span> Easy EMI Options
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur-md shadow-sm transition-all duration-300 hover:bg-white/10">
                  <span className="text-emerald-400 font-bold">✓</span> Free Counselling
                </div>

              </div>

            </div>

            {/* Right Column (Interactive Scholarship Box) */}
            <div className="text-center lg:text-right">

              <div className="inline-block rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-2xl transition-all duration-500 hover:scale-[1.03] hover:shadow-orange-500/10">

                <h3 className="text-5xl font-extrabold tracking-tight text-[#F47C45] md:text-6xl">
                  ₹30K
                </h3>

                <p className="mt-2 text-base font-bold text-slate-800">
                  Scholarship Benefit
                </p>

                <p className="text-xs font-semibold text-slate-400 mt-1">
                  Guaranteed for eligible candidates
                </p>

                <button
                  onClick={openPopup}
                  aria-label={button.label}
                  className="mt-6 w-full cursor-pointer rounded-xl bg-[#F47C45] px-8 py-3.5 text-sm font-bold text-white shadow-md shadow-[#F47C45]/15 transition-all duration-300 hover:opacity-95 hover:shadow-[#F47C45]/25 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F47C45] focus-visible:ring-offset-2 lg:w-auto"
                >
                  {button.label}
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
