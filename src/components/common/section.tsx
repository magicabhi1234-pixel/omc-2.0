import { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export default function Section({
  children,
  className = "",
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`
        relative
        py-14
        md:py-20
        lg:py-24
        overflow-hidden
        ${className}
      `}
    >
      {children}
    </section>
  );
}