export default function WhyChoose() {
    const features = [
      "UGC Approved Universities",
      "Flexible Learning",
      "Affordable Fees",
      "Career Growth",
      "Placement Assistance",
      "Industry Relevant Curriculum",
    ];
  
    return (
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
  
          <h2 className="mb-10 text-center text-4xl font-bold">
            Why Choose Distance MBA
          </h2>
  
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
  
            {features.map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                ✓ {item}
              </div>
            ))}
  
          </div>
  
        </div>
      </section>
    );
  }