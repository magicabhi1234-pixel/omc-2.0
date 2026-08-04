"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import LeadForm from "./lead-form";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function LeadPopup() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Route change zali ki popup reset
  useEffect(() => {
    // Thank You page var popup nahi
    if (pathname === "/thank-you") {
      return;
    }

    const closeTimer = setTimeout(() => setOpen(false), 0);

    // Landing Pages listing: no auto-popup, but the click-trigger
    // (openLeadPopup event, handled in a separate effect below) still works.
    if (pathname === "/landing-pages") {
      return () => clearTimeout(closeTimer);
    }

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

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
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
        ref={panelRef}
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
          <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
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
