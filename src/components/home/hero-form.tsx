"use client";

import React from "react";

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

      {/* Form */}
      <form className="space-y-4">

        <input
          type="text"
          placeholder="Full Name *"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#0B3B68]"
        />

        <input
          type="tel"
          placeholder="Phone Number *"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#0B3B68]"
        />

        <input
          type="email"
          placeholder="Email Address"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#0B3B68]"
        />

        <select className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#0B3B68]">
          <option>Select Program</option>
          <option>Online MBA</option>
          <option>Executive MBA</option>
          <option>Online MCA</option>
          <option>Online BBA</option>
          <option>Online BCA</option>
        </select>

        <button
          type="submit"
          className="w-full cursor-pointer rounded-xl bg-[#F47C45] py-3 font-semibold text-white transition hover:opacity-90"
        >
          Get Free Counselling
        </button>

      </form>

      {/* Trust Line */}
      <div className="mt-4 text-center text-xs text-slate-500">
        🔒 Your information is safe and secure.
      </div>

    </div>
  );
}