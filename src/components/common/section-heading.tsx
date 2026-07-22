import React from "react";

type SectionHeadingProps = {
  badge?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeading({
  badge,
  title,
  description,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const alignment =
    align === "left"
      ? "items-start text-left"
      : "items-center text-center";

  return (
    <div
      className={`mb-12 flex flex-col ${alignment} ${className}`}
    >
      {badge && (
        <span className="mb-4 inline-flex rounded-full bg-[#F47C45]/10 px-4 py-1.5 text-sm font-semibold text-[#F47C45]">
          {badge}
        </span>
      )}

      <h2 className="max-w-4xl text-3xl font-bold leading-tight text-slate-900 md:text-4xl lg:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}