import { HighlightBanner as HighlightBannerType } from "@/types/landing";
import OpenPopupButton from "@/components/common/open-popup-button";

type Props = Partial<HighlightBannerType>;

export default function HighlightBanner(props: Props) {
  const {
    heading = "Get 100% Placement Support & Career Guidance",
    description = "Every university on this page offers placement assistance, career guidance and industry-relevant curriculum to help you make the most of your MBA.",
    button = { label: "Get Placement Assistance", variant: "primary" },
  } = props;

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">

        <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-r from-[#0B3B68] via-[#123f6d] to-[#0F172A] px-8 py-16 text-white md:px-16">

          {/* Background Effects */}
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#F47C45]/20 blur-3xl" />
          <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative grid items-center gap-10 lg:grid-cols-2">

            {/* Left */}
            <div>

              <span className="rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
                <span aria-hidden="true">🎯</span> Career-Focused Support
              </span>

              <h2 className="mt-6 text-4xl font-bold md:text-5xl">
                {heading}
              </h2>

              {description && (
                <p className="mt-5 text-lg text-slate-300">
                  {description}
                </p>
              )}

              <div className="mt-8 flex flex-wrap gap-4">

                <div className="rounded-full bg-white/10 px-4 py-3 backdrop-blur">
                  <span aria-hidden="true">✅</span> Placement Support
                </div>

                <div className="rounded-full bg-white/10 px-4 py-3 backdrop-blur">
                  <span aria-hidden="true">✅</span> Career Guidance
                </div>

                <div className="rounded-full bg-white/10 px-4 py-3 backdrop-blur">
                  <span aria-hidden="true">✅</span> Free Counselling
                </div>

              </div>

            </div>

            {/* Right */}
            <div className="text-center lg:text-right">

              <div className="inline-block rounded-3xl bg-white p-8 shadow-2xl">

                <p className="text-6xl font-bold text-[#F47C45]">
                  100%
                </p>

                <p className="mt-2 text-lg font-semibold text-slate-800">
                  Placement Support
                </p>

                <OpenPopupButton className="mt-6 cursor-pointer rounded-xl bg-[#F47C45] px-8 py-4 font-semibold text-white transition hover:scale-105">
                  {button.label}
                </OpenPopupButton>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
