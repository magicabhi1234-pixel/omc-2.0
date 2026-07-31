import Image from "next/image";
import { HeroSection, University } from "@/types/landing";
import OpenPopupButton from "@/components/common/open-popup-button";
import UniversitySearch from "@/components/landing/university-search";

type Props = Partial<HeroSection> & {
  universities?: University[];
};

export default function Hero(props: Props) {
  const {
    badge = "🎓 Admissions Open 2026",
    heading = "Top Distance MBA",
    description = "Compare fees, rankings, scholarships, placements and admission process from India's leading UGC-approved MBA universities.",
    primaryButton = { label: "Apply Now", variant: "primary" },
    secondaryButton = { label: "Free Counselling", variant: "outline" },
    heroImage,
    stats = [],
    universities: pageUniversities = [],
  } = props;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0B3B68] via-[#123f6d] to-[#0F172A] py-20 text-white">

      {/* Background Effects */}
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-[#F47C45]/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4">

        <div className="grid items-center gap-14 lg:grid-cols-2">

          {/* Left Content */}
          <div>

            <span className="rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
              {badge}
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight md:text-5xl">
              {heading}
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-slate-300">
              {description}
            </p>

            <UniversitySearch universities={pageUniversities} />

            <div className="mt-8 flex flex-wrap gap-3">

              <div className="rounded-full bg-white/10 px-4 py-2 backdrop-blur">
                <span aria-hidden="true">✅</span> UGC Approved
              </div>

              <div className="rounded-full bg-white/10 px-4 py-2 backdrop-blur">
                <span aria-hidden="true">✅</span> EMI Available
              </div>

              <div className="rounded-full bg-white/10 px-4 py-2 backdrop-blur">
                <span aria-hidden="true">✅</span> Placement Support
              </div>

            </div>

            <div className="mt-10 flex flex-wrap gap-4">

              <OpenPopupButton className="cursor-pointer rounded-xl bg-[#F47C45] px-8 py-4 font-semibold text-white transition hover:scale-105">
                {primaryButton.label}
              </OpenPopupButton>

              {secondaryButton && (
                <OpenPopupButton className="cursor-pointer rounded-xl border border-white px-8 py-4 font-semibold text-white transition hover:bg-white hover:text-[#0B3B68]">
                  {secondaryButton.label}
                </OpenPopupButton>
              )}

            </div>

          </div>

          {/* Right: Hero Image + Stats */}
          {(heroImage?.src || stats.length > 0) && (
            <div>

              <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl">

                {heroImage?.src && (
                  <div className="relative h-64 w-full sm:h-80">
                    <Image
                      src={heroImage.src}
                      alt={heroImage.alt || heading}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                )}

                {stats.length > 0 && (
                  <div className={`grid gap-4 p-6 ${stats.length >= 3 ? "grid-cols-3" : "grid-cols-2"}`}>
                    {stats.map((stat) => (
                      <div key={stat.label} className="rounded-xl bg-white/10 p-4 text-center">
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="mt-1 text-sm text-slate-300">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                )}

              </div>

            </div>
          )}

        </div>

      </div>

    </section>
  );
}
