import Container from "@/components/common/container";
import type { FaqItem } from "@/lib/db/queries";

/** Homepage FAQs, managed in the dashboard (FAQ Manager > Homepage). All answers are server-rendered. */
export default function FAQ({ faqs, heading = "Frequently Asked Questions" }: { faqs: FaqItem[]; heading?: string }) {
  if (faqs.length === 0) return null;

  return (
    <section id="faq" aria-labelledby="home-faq-heading" className="scroll-mt-24 bg-slate-50 py-16 md:py-20">
      <Container>
        <div className="mb-10 text-center md:mb-12">
          <p className="font-semibold text-orange-800 uppercase">FAQs</p>
          <h2 id="home-faq-heading" className="mt-3 text-3xl font-bold text-[#0F172A] md:text-4xl">
            {heading}
          </h2>
        </div>

        <div className="mx-auto max-w-4xl space-y-4">
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-2xl border bg-white p-5 md:p-6">
              <h3 className="text-lg font-semibold text-slate-900">{faq.question}</h3>
              <p className="mt-3 leading-7 text-slate-700">{faq.answer}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/** Shown until FAQs are added in the dashboard (and if the database is unreachable). */
export const DEFAULT_HOME_FAQS: FaqItem[] = [
  {
    question: "Is an online MBA valid in India?",
    answer:
      "Yes. Online MBA programs from UGC-entitled universities are valid across India and are treated on par with regular MBA degrees for jobs, promotions and higher studies.",
  },
  {
    question: "Do online MBA universities offer placement support?",
    answer:
      "Most leading online universities provide placement assistance and career services, such as resume reviews, interview preparation, virtual job fairs and access to hiring partners.",
  },
  {
    question: "What is the average online MBA fee in India?",
    answer:
      "Online MBA fees in India generally range from ₹60,000 to ₹2,00,000 for the full program, depending on the university, its rankings and the specialization.",
  },
];
