import React from "react";
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="group rounded-2xl border border-slate-100 bg-white/95 p-8 text-center shadow-md backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-orange-200 hover:shadow-xl"
            >
              <h3 className="text-4xl font-extrabold tracking-tight text-[#0B3B68] transition-colors duration-300 group-hover:text-[#F47C45] md:text-5xl">
                {item.value}
              </h3>
              <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
