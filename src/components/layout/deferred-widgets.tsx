"use client";

import dynamic from "next/dynamic";

// Deferred client-only widgets: neither renders SEO-relevant content, and
// neither affects the layout of surrounding content (StickyCTA is
// fixed-position; LeadPopup renders nothing until its 2s auto-open timer or
// a CTA click fires). Skipping SSR keeps both out of the initial hydration
// pass - reducing main-thread work/TBT on first load - with no layout shift
// once they mount a moment later. `ssr: false` requires a Client Component
// boundary, hence this wrapper around the Server Component layout.
const StickyCTA = dynamic(() => import("@/components/common/sticky-cta"), { ssr: false });
const LeadPopup = dynamic(() => import("@/components/common/lead-popup"), { ssr: false });

export default function DeferredWidgets() {
  return (
    <>
      <StickyCTA />
      <LeadPopup />
    </>
  );
}
