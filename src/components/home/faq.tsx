import Container from "@/components/common/container";

const faqs = [
  {
    question: "Is Online MBA Valid In India?",
    answer:
      "Yes. Online MBA programs approved by UGC are valid across India.",
  },
  {
    question: "Can I Get Placement Support?",
    answer:
      "Most leading online universities provide placement assistance and career services.",
  },
  {
    question: "What Is The Average MBA Fee?",
    answer:
      "Online MBA fees generally range from ₹60,000 to ₹2,00,000 depending on the university.",
  },
];

export default function FAQ() {
  return (
    <section className="py-20 bg-slate-50">
      <Container>
        <div className="text-center mb-12">
          <p className="text-[#F47C45] font-semibold uppercase">
            FAQs
          </p>

          <h2 className="mt-3 text-4xl font-bold text-[#0F172A]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-2xl border bg-white p-6"
            >
              <h3 className="font-semibold text-lg">
                {faq.question}
              </h3>

              <p className="mt-3 text-slate-600">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}