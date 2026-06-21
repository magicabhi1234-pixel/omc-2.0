"use client";

import { useEffect, useState } from "react";

export default function LeadPopup() {
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    const showPopup = () => {
      if (hasOpened) return;

      setHasOpened(true);
      setOpen(true);
    };

    // Auto Popup After 2 Seconds
    const timer = setTimeout(() => {
      showPopup();
    }, 2000);

    // CTA Popup Trigger
    const openPopupHandler = () => {
      setOpen(true);
    };

    window.addEventListener(
      "openLeadPopup",
      openPopupHandler
    );

    return () => {
      clearTimeout(timer);

      window.removeEventListener(
        "openLeadPopup",
        openPopupHandler
      );
    };
  }, [hasOpened]);

  const closePopup = () => {
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={closePopup}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closePopup}
          className="absolute right-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-xl text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
        >
          ×
        </button>

        {/* Header */}
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

        {/* Form */}
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Full Name *"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0B3B68]"
          />

          <input
            type="tel"
            placeholder="Phone Number *"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0B3B68]"
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0B3B68]"
          />

          <select
            defaultValue=""
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0B3B68]"
          >
            <option value="" disabled>
              Select Program
            </option>

            <option>Online MBA</option>
            <option>Executive MBA</option>
            <option>Online MCA</option>
            <option>Online BBA</option>
            <option>Online BCA</option>
          </select>

          <textarea
            rows={3}
            placeholder="Tell us your requirements (Optional)"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0B3B68]"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-[#F47C45] py-3 font-semibold text-white transition hover:opacity-90"
          >
            Get Free Counselling
          </button>

          <p className="text-center text-xs text-slate-500">
            By submitting this form, you agree to receive
            admission assistance and counselling support.
          </p>
        </form>
      </div>
    </div>
  );
}