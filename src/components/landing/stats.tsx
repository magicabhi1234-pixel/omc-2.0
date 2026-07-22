import { StatsSection as StatsSectionType } from "@/types/landing";

type Props = Partial<StatsSectionType>;

const defaultStats = [
  { value: "50+", label: "UGC Approved Universities" },
  { value: "100+", label: "MBA Specializations" },
  { value: "10,000+", label: "Students Guided" },
  { value: "98%", label: "Student Satisfaction" },
];

export default function Stats({ stats }: Props) {
  const items = stats && stats.length > 0 ? stats : defaultStats;

  return (
    <section className="-mt-12 relative z-20 pb-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="group rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <h3 className="text-4xl font-bold text-[#0B3B68]">
                {item.value}
              </h3>
              <p className="mt-3 text-slate-600">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

