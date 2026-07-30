"use client";

import type { ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
};

/**
 * Shared client leaf for the sitewide "open the lead popup" button pattern -
 * lets the section around it stay a Server Component instead of the whole
 * file needing "use client" just for this one click handler. A native
 * <button> is used so Enter/Space activation is already keyboard-accessible
 * without extra handling.
 */
export default function OpenPopupButton({ className, children, ariaLabel }: Props) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("openLeadPopup"))}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
