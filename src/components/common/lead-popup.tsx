"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import LeadForm from "./lead-form";

export default function LeadPopup() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Route change zali ki popup reset
  useEffect(() => {
    // Thank You page var popup nahi
    if (pathname === "/thank-you") {
      return;
    }

    const closeTimer = setTimeout(() => setOpen(false), 0);
    const timer = setTimeout(() => {
      setOpen(true);
    }, 2000);

    return () => {
      clearTimeout(closeTimer);
      clearTimeout(timer);
    };
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

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  // Thank You page var popup hide
  if (pathname === "/thank-you") {
    return null;
  }

  // Popup closed asel tar render nako
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={closePopup}
      role="presentation"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-popup-title"
      >
        {/* Close Button */}
        <button
          type="button"
          ref={closeButtonRef}
          onClick={closePopup}
          aria-label="Close counselling form"
          className="absolute right-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-xl text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
        >
          <X size={20} aria-hidden="true" />
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-[#F47C45]">
            Admission Open 2026
          </span>

          <h2 id="lead-popup-title" className="mt-4 text-3xl font-bold text-slate-900">
            Get Free MBA Counselling
          </h2>
        </div>

        {/* Form */}
        <LeadForm />
      </div>
    </div>
  );
}
