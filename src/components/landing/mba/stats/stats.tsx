import Container from "@/components/landing/common/container";
import { StatsSection as StatsSectionType } from "@/types/landing";

export default function StatsSection({
  heading,
  stats,
}: StatsSectionType) {
  if (!stats || stats.length === 0) return null;

  return (
    <section className="relative z-20 -mt-12 pb-16">
      <Container>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <h3 className="text-4xl font-bold text-[#0B3B68]">
                {stat.value}
              </h3>
              <p className="mt-3 text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

