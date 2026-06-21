export default function FAQ() {
    const faqs = [
      {
        q: "Which is the best distance MBA university?",
        a: "Amity, Chandigarh, LPU and UPES are among the top choices.",
      },
      {
        q: "Is distance MBA valid?",
        a: "Yes, UGC-approved distance MBA degrees are valid in India.",
      },
      {
        q: "Can working professionals apply?",
        a: "Yes, distance MBA is designed for working professionals.",
      },
    ];
  
    return (
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4">
  
          <h2 className="mb-10 text-center text-4xl font-bold">
            Frequently Asked Questions
          </h2>
  
          <div className="space-y-5">
  
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-2xl border p-6"
              >
                <h3 className="font-semibold">
                  {faq.q}
                </h3>
  
                <p className="mt-3 text-slate-600">
                  {faq.a}
                </p>
              </div>
            ))}
  
          </div>
  
        </div>
      </section>
    );
  }