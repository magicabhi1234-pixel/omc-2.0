"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LeadForm from "./lead-form";

export default function LeadPopup() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  // Thank You page var popup show karaycha nahi
  if (pathname === "/thank-you") {
    return null;
  }

  // Route change zali ki popup reset
  useEffect(() => {
    setOpen(false);

    const timer = setTimeout(() => {
      setOpen(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [pathname]);

  // CTA trigger
  useEffect(() => {
    const openPopupHandler = () => {
      setOpen(true);
    };

    window.addEventListener(
      "openLeadPopup",
      openPopupHandler
    );

    return () => {
      window.removeEventListener(
        "openLeadPopup",
        openPopupHandler
      );
    };
  }, []);

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
        </div>

        {/* Common Form */}
        <LeadForm />
      </div>
    </div>
  );
}