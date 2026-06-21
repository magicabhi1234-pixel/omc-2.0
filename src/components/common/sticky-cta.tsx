"use client";

import LeadForm from "@/components/common/lead-form";

export default function StickyCTA() {
  return (
    <div className="fixed bottom-4 right-4 z-50 hidden lg:block">
      <LeadForm />
    </div>
  );
}