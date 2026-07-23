"use client";

import { useState } from "react";
import { FAQSection } from "@/types/landing";

type Props = Partial<FAQSection>;

const defaultFaqs = [
  {
    question: "Which is the best Distance MBA University in North India?",
    answer: "Amity University, Chandigarh University, LPU, NMIMS and UPES are among the most popular Distance MBA universities.",
  },
  {
    question: "Is a Distance MBA degree valid in India?",
    answer: "Yes. A UGC-approved Distance MBA degree is valid for jobs, higher education and government opportunities.",
  },
  {
    question: "Can working professionals pursue a Distance MBA?",
    answer: "Yes. Distance MBA programs are specially designed for working professionals and business owners.",
  },
  {
    question: "What is the average fee for a Distance MBA?",
    answer: "The average fee ranges from ₹60,000 to ₹2,00,000 depending on the university and specialization.",
  },
  {
    question: "Are EMI options available?",
    answer: "Yes. Most universities provide easy EMI and scholarship options.",
  },
  {
    question: "Do universities provide placement assistance?",
    answer: "Many universities offer placement support, career guidance, resume building and interview preparation.",
  },
  {
    question: "What is the duration of a Distance MBA?",
    answer: "The standard duration is 2 years, which can be extended as per university regulations.",
  },
  {
    question: "Can I pursue a Distance MBA while doing a job?",
    answer: "Absolutely. Distance MBA offers flexibility so you can study alongside your job.",
  },
];

export default function FAQ(props: Props) {
  const {
    heading = "Frequently Asked Questions",
    description = "Get answers to the most common questions about Distance MBA admissions.",
    faqs,
  } = props;

  const [open, setOpen] = useState<number | null>(0);

  const items = faqs && faqs.length > 0 ? faqs : defaultFaqs;

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">

        {/* Section Header */}
        <div className="mb-14 text-center">
          <span className="inline-block rounded-full border border-orange-100 bg-orange-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#F47C45]">
            💭 Help Center
          </span>

          <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
            {heading}
          </h2>

          {description && (
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 md:text-lg">
              {description}
            </p>
          )}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {items.map((faq, index) => {
            const isOpen = open === index;
            return (
              <div
                key={index}
                className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "border-[#F47C45]/30 bg-white shadow-md ring-1 ring-[#F47C45]/20"
                    : "border-slate-200/80 bg-white shadow-sm hover:border-slate-300 hover:shadow-md"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-center justify-between p-6 text-left transition-colors duration-300"
                >
                  <span className={`pr-4 text-base font-bold transition-colors duration-300 ${isOpen ? "text-[#0B3B68]" : "text-slate-900"}`}>
                    {faq.question}
                  </span>

                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg font-bold transition-all duration-300 ${
                      isOpen
                        ? "bg-[#F47C45]/10 text-[#F47C45] rotate-180"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 px-6 py-5 text-sm font-medium leading-relaxed text-slate-600 bg-slate-50/30">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
