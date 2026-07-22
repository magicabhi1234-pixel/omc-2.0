"use client";

import { useState } from "react";
import Container from "@/components/landing/common/container";
import SectionHeading from "@/components/landing/common/section-heading";
import { FAQSection as FAQSectionType } from "@/types/landing";

export default function FAQ({ heading, description, faqs }: FAQSectionType) {
  const [open, setOpen] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="bg-slate-50 py-20">
      <Container>
        <SectionHeading
          badge="FAQ"
          title={heading}
          description={description}
        />

        <div className="mx-auto max-w-5xl space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <button
                onClick={() =>
                  setOpen(open === index ? null : index)
                }
                className="flex w-full items-center justify-between p-6 text-left font-semibold text-slate-900"
              >
                <span>{faq.question}</span>
                <span className="text-2xl text-slate-500">
                  {open === index ? "−" : "+"}
                </span>
              </button>

              {open === index && (
                <div className="border-t px-6 py-5 text-slate-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

