"use client";

import { usePathname } from "next/navigation";

export default function StickyCTA() {
  const pathname = usePathname();

  // Thank You page var CTA hide
  if (pathname === "/thank-you") {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() =>
        window.dispatchEvent(
          new Event("openLeadPopup")
        )
      }
      className="fixed right-0 top-1/2 z-50 -translate-y-1/2 cursor-pointer rounded-l-xl bg-[#0B3B68] px-3 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-[#082b4d]"
    >
      <span
        style={{
          writingMode: "vertical-rl",
          textOrientation: "mixed",
        }}
      >
        Enquire Now
      </span>
    </button>
  );
}