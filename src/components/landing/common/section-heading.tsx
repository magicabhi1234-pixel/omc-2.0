type SectionHeadingProps = {
  badge?: string;
  title: string;
  description?: string;
  className?: string;
};

export default function SectionHeading({
  badge,
  title,
  description,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`mb-14 text-center ${className}`}>
      {badge && (
        <span className="inline-block rounded-full border border-orange-200/50 bg-orange-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#F47C45] shadow-sm">
          {badge}
        </span>
      )}

      <h2 className="mx-auto mt-5 max-w-4xl text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl lg:text-5xl lg:leading-[1.15]">
        {title}
      </h2>

      {description && (
        <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
