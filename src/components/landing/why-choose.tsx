export default function WhyChoose() {
    const features = [
      {
        icon: "🎓",
        title: "UGC Approved Universities",
        desc: "Choose from India's top recognized and accredited universities.",
      },
      {
        icon: "⏰",
        title: "Flexible Learning",
        desc: "Study anytime, anywhere without affecting your job or business.",
      },
      {
        icon: "💰",
        title: "Affordable Fees",
        desc: "Low-cost MBA programs with EMI and scholarship options.",
      },
      {
        icon: "📈",
        title: "Career Growth",
        desc: "Boost promotions, salary hikes and leadership opportunities.",
      },
      {
        icon: "💼",
        title: "Placement Support",
        desc: "Career assistance, resume building and interview preparation.",
      },
      {
        icon: "📚",
        title: "Industry Curriculum",
        desc: "Updated syllabus aligned with modern business requirements.",
      },
    ];
  
    return (
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
  
          <div className="mb-14 text-center">
  
            <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-[#F47C45]">
              Why Choose Us
            </span>
  
            <h2 className="mt-5 text-4xl font-bold text-slate-900 md:text-5xl">
              Why Choose Distance MBA
            </h2>
  
            <p className="mx-auto mt-5 max-w-3xl text-lg text-slate-600">
              Build your career with flexible learning,
              industry-relevant curriculum and globally
              recognized MBA programs.
            </p>
  
          </div>
  
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
  
            {features.map((item) => (
              <div
                key={item.title}
                className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#F47C45] hover:shadow-2xl"
              >
  
                <div className="mb-5 text-5xl">
                  {item.icon}
                </div>
  
                <h3 className="text-xl font-bold text-slate-900">
                  {item.title}
                </h3>
  
                <p className="mt-4 leading-7 text-slate-600">
                  {item.desc}
                </p>
  
              </div>
            ))}
  
          </div>
  
        </div>
      </section>
    );
  }