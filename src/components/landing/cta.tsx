"use client";

import React from "react";
import { CTASection } from "@/types/landing";

type Props = Partial<CTASection>;

export default function CTA(props: Props) {
  const {
    badge = "Admissions Open 2026",
    heading = "Still Confused About Choosing the Right MBA?",
    description = "Get personalized guidance from our MBA experts. Compare universities, fees, placements and specializations before taking admission.",
    primaryButton = { label: "Apply Now", variant: "primary" },
    secondaryButton = { label: "Get Free Counselling", variant: "outline" },
  } = props;

  const openPopup = () => {
    window.dispatchEvent(
      new Event("openLeadPopup")
    );
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0B3B68] via-[#123f6d] to-[#0F172A] py-24 text-white">

      {/* Background Effects */}
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-[#F47C45]/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-500/15 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-4 text-center">

        {badge && (
          <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-200 shadow-sm backdrop-blur-md">
            🎓 {badge}
          </span>
        )}

        <h2 className="mt-8 text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
          {heading}
        </h2>

        {description && (
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-slate-300 md:text-lg">
            {description}
          </p>
        )}

        {/* Benefits */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">

          <div className="rounded-full border border-white/5 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-200 backdrop-blur-md shadow-sm">
            ✅ Free Counselling
          </div>

          <div className="rounded-full border border-white/5 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-200 backdrop-blur-md shadow-sm">
            ✅ Scholarship Guidance
          </div>

          <div className="rounded-full border border-white/5 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-200 backdrop-blur-md shadow-sm">
            ✅ Admission Support
          </div>

          <div className="rounded-full border border-white/5 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-200 backdrop-blur-md shadow-sm">
            ✅ Career Guidance
          </div>

        </div>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">

          <button
            onClick={openPopup}
            aria-label={primaryButton.label}
            className="w-full cursor-pointer rounded-2xl bg-[#F47C45] px-10 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-[#F47C45]/25 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F47C45] focus-visible:ring-offset-2 focus-visible:ring-offset-[#123f6d] sm:w-auto"
          >
            {primaryButton.label}
          </button>

          {secondaryButton && (
            <button
              onClick={openPopup}
              aria-label={secondaryButton.label}
              className="w-full cursor-pointer rounded-2xl border-2 border-white bg-transparent px-10 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-[1.03] hover:bg-white hover:text-[#0B3B68] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#123f6d] sm:w-auto"
            >
              {secondaryButton.label}
            </button>
          )}

        </div>

        {/* Trust Stats */}
        <div className="mt-16 grid gap-6 grid-cols-2 md:grid-cols-4 border-t border-white/10 pt-12">

          <div className="p-2">
            <h3 className="text-3xl font-extrabold text-[#F47C45] md:text-4xl">50+</h3>
            <p className="mt-1.5 text-sm font-medium text-slate-400 uppercase tracking-wider">Universities</p>
          </div>

          <div className="p-2">
            <h3 className="text-3xl font-extrabold text-[#F47C45] md:text-4xl">100+</h3>
            <p className="mt-1.5 text-sm font-medium text-slate-400 uppercase tracking-wider">MBA Courses</p>
          </div>

          <div className="p-2">
            <h3 className="text-3xl font-extrabold text-[#F47C45] md:text-4xl">10,000+</h3>
            <p className="mt-1.5 text-sm font-medium text-slate-400 uppercase tracking-wider">Students Guided</p>
          </div>

          <div className="p-2">
            <h3 className="text-3xl font-extrabold text-[#F47C45] md:text-4xl">98%</h3>
            <p className="mt-1.5 text-sm font-medium text-slate-400 uppercase tracking-wider">Satisfaction Rate</p>
          </div>

        </div>

      </div>

    </section>
  );
}
