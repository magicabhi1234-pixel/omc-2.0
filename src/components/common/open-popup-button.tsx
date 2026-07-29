"use client";

import type { ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
};

/**
 * Shared client leaf for the sitewide "open the lead popup" button pattern -
 * lets the section around it stay a Server Component instead of the whole
 * file needing "use client" just for this one click handler.
 */
export default function OpenPopupButton({ className, children }: Props) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("openLeadPopup"))}
      className={className}
    >
      {children}
    </button>
  );
}
