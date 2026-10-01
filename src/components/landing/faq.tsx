import { ChevronDown } from "lucide-react";
import type { FAQSection } from "@/types/landing";

type Props = Partial<FAQSection> & { id?: string };

/**
 * Native <details> accordion: every answer is in the server-rendered HTML
 * (so the FAQPage schema matches visible content and crawlers/answer engines
 * can read all of it), keyboard/screen-reader accessible, and zero JS.
 */
export default function FAQ({
  heading = "Frequently Asked Questions",
  description,
  faqs,
  id = "faq",
}: Props) {
  const items = (faqs ?? []).filter((f) => f.question?.trim() && f.answer?.trim());
  if (items.length === 0) return null;

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-24 bg-slate-50 py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-10 text-center md:mb-14">
          <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-800">FAQ</span>
          <h2 id={`${id}-heading`} className="mt-5 text-3xl font-bold text-slate-900 md:text-5xl">
            {heading}
          </h2>
          {description && <p className="mt-5 text-lg text-slate-600">{description}</p>}
        </div>

        <div className="space-y-4">
          {items.map((faq, index) => (
            <details
              key={`${faq.question}-${index}`}
              open={index === 0}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-left md:p-6 [&::-webkit-details-marker]:hidden">
                <h3 className="text-base font-semibold text-slate-900 md:text-lg">{faq.question}</h3>
                <ChevronDown size={20} aria-hidden="true" className="shrink-0 text-slate-500 transition group-open:rotate-180" />
              </summary>
              <div className="border-t px-5 py-4 leading-7 text-slate-700 md:px-6 md:py-5">{faq.answer}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
