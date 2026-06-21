"use client";

import { useState } from "react";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  const faqs = [
    {
      question:
        "Which is the best Distance MBA University in North India?",
      answer:
        "Amity University, Chandigarh University, LPU, NMIMS and UPES are among the most popular Distance MBA universities.",
    },
    {
      question:
        "Is a Distance MBA degree valid in India?",
      answer:
        "Yes. A UGC-approved Distance MBA degree is valid for jobs, higher education and government opportunities.",
    },
    {
      question:
        "Can working professionals pursue a Distance MBA?",
      answer:
        "Yes. Distance MBA programs are specially designed for working professionals and business owners.",
    },
    {
      question:
        "What is the average fee for a Distance MBA?",
      answer:
        "The average fee ranges from ₹60,000 to ₹2,00,000 depending on the university and specialization.",
    },
    {
      question:
        "Are EMI options available?",
      answer:
        "Yes. Most universities provide easy EMI and scholarship options.",
    },
    {
      question:
        "Do universities provide placement assistance?",
      answer:
        "Many universities offer placement support, career guidance, resume building and interview preparation.",
    },
    {
      question:
        "What is the duration of a Distance MBA?",
      answer:
        "The standard duration is 2 years, which can be extended as per university regulations.",
    },
    {
      question:
        "Can I pursue a Distance MBA while doing a job?",
      answer:
        "Absolutely. Distance MBA offers flexibility so you can study alongside your job.",
    },
  ];

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-5xl px-4">

        <div className="mb-14 text-center">

          <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-[#F47C45]">
            FAQ
          </span>

          <h2 className="mt-5 text-4xl font-bold text-slate-900 md:text-5xl">
            Frequently Asked Questions
          </h2>

          <p className="mt-5 text-lg text-slate-600">
            Get answers to the most common questions
            about Distance MBA admissions.
          </p>

        </div>

        <div className="space-y-4">

          {faqs.map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >

              <button
                onClick={() =>
                  setOpen(
                    open === index ? null : index
                  )
                }
                className="flex w-full items-center justify-between p-6 text-left font-semibold"
              >

                <span>
                  {faq.question}
                </span>

                <span className="text-2xl">
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

      </div>
    </section>
  );
}