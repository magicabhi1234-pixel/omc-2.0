import React from "react";

export default function HeroForm() {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-900">
          Get Free Career Guidance
        </h3>

        <p className="mt-2 text-sm text-slate-600">
          Talk to our MBA experts and find the best university for your goals.
        </p>
      </div>

      <form className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0B3B68]"
        />

        <input
          type="tel"
          placeholder="Phone Number"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0B3B68]"
        />

        <input
          type="email"
          placeholder="Email Address"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0B3B68]"
        />

        <select className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0B3B68]">
          <option>Select Program</option>
          <option>Online MBA</option>
          <option>Online MCA</option>
          <option>Online BBA</option>
          <option>Online BCA</option>
        </select>

        <button
          type="submit"
          className="w-full rounded-xl bg-[#F47C45] py-3 font-semibold text-white transition hover:opacity-90"
        >
          Get Free Counseling
        </button>
      </form>
    </div>
  );
}