"use client";

import LeadForm from "./lead-form";

export default function LeadPopup() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">

        <div className="mb-6 text-center">
          <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-[#F47C45]">
            Admission Open 2026
          </span>

          <h2 className="mt-4 text-3xl font-bold text-slate-900">
            Get Free MBA Counselling
          </h2>

          <p className="mt-2 text-slate-600">
            Compare universities, fees,
            placements and specializations
            before admission.
          </p>
        </div>

        <LeadForm />

      </div>
    </div>
  );
}