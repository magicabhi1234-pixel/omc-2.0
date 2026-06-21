"use client";

import React from "react";
import LeadForm from "@/components/common/lead-form";

export default function HeroForm() {
  return (
    <div className="relative mx-auto max-w-md overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl">

      {/* Badge */}
      <div className="mb-4 inline-flex rounded-full bg-orange-100 px-4 py-2 text-xs font-semibold text-[#F47C45]">
        🎓 Admission Open 2026
      </div>

      {/* Heading */}
      <div className="mb-5">
        <h3 className="text-xl font-bold text-slate-900">
          Talk To MBA Experts
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Free Admission Guidance & University Comparison
        </p>
      </div>

      {/* Common Form */}
      <LeadForm />

      {/* Trust Line */}
      <div className="mt-4 text-center text-xs text-slate-500">
        🔒 Your information is safe and secure.
      </div>

    </div>
  );
}