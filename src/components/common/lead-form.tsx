import React from "react";

export default function LeadForm() {
  return (
    <form className="space-y-4">
  <input
    type="text"
    placeholder="Full Name *"
    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0B3B68]"
    required
  />

  <input
    type="tel"
    placeholder="Mobile Number *"
    maxLength={10}
    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0B3B68]"
    required
  />

  <input
    type="email"
    placeholder="Email Address *"
    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0B3B68]"
    required
  />

  <input
    type="text"
    placeholder="City *"
    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0B3B68]"
    required
  />

  <select
    defaultValue=""
    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0B3B68]"
    required
  >
    <option value="" disabled>
      Select Specialization
    </option>

    <option value="Finance Management">
      Finance Management
    </option>

    <option value="Marketing Management">
      Marketing Management
    </option>

    <option value="Operations Management">
      Operations Management
    </option>

    <option value="Information Technology and System Management">
      Information Technology and System Management
    </option>

    <option value="Supply Chain Management">
      Supply Chain Management
    </option>

    <option value="Human Resource Management">
      Human Resource Management
    </option>

    <option value="International Business Management">
      International Business Management
    </option>

    <option value="Retail Management">
      Retail Management
    </option>
  </select>

  <button
  type="submit"
  className="w-full cursor-pointer rounded-xl bg-[#F47C45] py-3 font-semibold text-white transition hover:opacity-90"
>
  Get Free Counselling
</button>

  <p className="text-center text-xs text-slate-500">
    By submitting this form, you agree to receive
    admission assistance and counselling support.
  </p>
    </form>
  );
}