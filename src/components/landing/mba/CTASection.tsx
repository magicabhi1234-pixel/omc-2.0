type Props = {
  badge?: string;
  heading?: string;
  description?: string;

  primaryButtonText?: string;
  secondaryButtonText?: string;

  onCTAClick?: () => void;
};

export default function CTASection({
  badge,
  heading,
  description,
  primaryButtonText,
  secondaryButtonText,
  onCTAClick,
}: Props) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#0B3B68] via-[#114A81] to-[#0B3B68] py-20">

      {/* Background Blur */}
      <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-white/5 blur-3xl"></div>
      <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#F47C45]/20 blur-3xl"></div>

      <div className="container relative mx-auto max-w-5xl px-4 text-center text-white">

        {badge && (
          <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
            {badge}
          </span>
        )}

        {heading && (
          <h2 className="mt-6 text-4xl font-bold leading-tight md:text-5xl">
            {heading}
          </h2>
        )}

        {description && (
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/90">
            {description}
          </p>
        )}

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">

          <button
            onClick={onCTAClick}
            className="cursor-pointer rounded-xl bg-[#F47C45] px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#e66f38]"
          >
            {primaryButtonText || "Apply Now"}
          </button>

          <button
            onClick={onCTAClick}
            className="cursor-pointer rounded-xl border-2 border-white px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-[#0B3B68]"
          >
            {secondaryButtonText || "Talk to an Expert"}
          </button>

        </div>

      </div>

    </section>
  );
}