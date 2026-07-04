import Image from "next/image";

type HeroProps = {
  badge?: string;
  heading?: string;
  description?: string;
  image?: string;

  primaryButtonText?: string;
  secondaryButtonText?: string;

  stat1Value?: string;
  stat1Label?: string;

  stat2Value?: string;
  stat2Label?: string;

  stat3Value?: string;
  stat3Label?: string;

  onCTAClick?: () => void;
};

export default function Hero({
  badge,
  heading,
  description,
  image,

  primaryButtonText,
  secondaryButtonText,

  stat1Value,
  stat1Label,

  stat2Value,
  stat2Label,

  stat3Value,
  stat3Label,

  onCTAClick,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#F7FAFF] via-[#EEF5FF] to-[#E8F2FF] py-16 lg:py-24">

      <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-[#0B3B68]/10 blur-3xl"></div>
      <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#F47C45]/10 blur-3xl"></div>

      <div className="container relative mx-auto grid grid-cols-1 items-center gap-12 px-4 lg:grid-cols-2">

        {/* Left */}

        <div>

          {badge && (
            <span className="inline-flex rounded-full bg-[#0B3B68]/10 px-4 py-2 text-sm font-semibold text-[#0B3B68]">
              {badge}
            </span>
          )}

          {heading && (
            <h1 className="mt-6 text-4xl font-bold leading-tight text-[#0F172A] md:text-5xl lg:text-6xl">
              {heading}
            </h1>
          )}

          {description && (
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              {description}
            </p>
          )}

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">

            <button
              onClick={onCTAClick}
              className="cursor-pointer rounded-xl bg-[#F47C45] px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#e66f38]"
            >
              {primaryButtonText || "Apply Now"}
            </button>

            <button
              onClick={onCTAClick}
              className="cursor-pointer rounded-xl border-2 border-[#0B3B68] px-8 py-4 font-semibold text-[#0B3B68] transition-all duration-300 hover:bg-[#0B3B68] hover:text-white"
            >
              {secondaryButtonText || "Free Counselling"}
            </button>

          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-slate-200 pt-8">

            <div>
              <h3 className="text-3xl font-bold text-[#0B3B68]">
                {stat1Value}
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                {stat1Label}
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-[#0B3B68]">
                {stat2Value}
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                {stat2Label}
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-[#0B3B68]">
                {stat3Value}
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                {stat3Label}
              </p>
            </div>

          </div>

        </div>

        {/* Right */}

        <div className="relative flex justify-center">

          {image && (
            <Image
              src={image}
              alt={heading || "Hero"}
              width={700}
              height={550}
              priority
              className="w-full max-w-xl rounded-3xl object-cover shadow-2xl"
            />
          )}

        </div>

      </div>

    </section>
  );
}