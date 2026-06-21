export default function Stats() {
    const stats = [
      {
        number: "50+",
        title: "UGC Approved Universities",
        icon: "🎓",
      },
      {
        number: "100+",
        title: "MBA Specializations",
        icon: "📚",
      },
      {
        number: "10,000+",
        title: "Students Guided",
        icon: "👨‍🎓",
      },
      {
        number: "98%",
        title: "Student Satisfaction",
        icon: "⭐",
      },
    ];
  
    return (
      <section className="-mt-12 relative z-20 pb-16">
        <div className="mx-auto max-w-7xl px-4">
  
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
  
            {stats.map((item) => (
              <div
                key={item.title}
                className="group rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
  
                <div className="mb-4 text-5xl">
                  {item.icon}
                </div>
  
                <h3 className="text-4xl font-bold text-[#0B3B68]">
                  {item.number}
                </h3>
  
                <p className="mt-3 text-slate-600">
                  {item.title}
                </p>
  
              </div>
            ))}
  
          </div>
  
        </div>
      </section>
    );
  }