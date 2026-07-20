import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost";

type ButtonSize =
  | "sm"
  | "md"
  | "lg";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[#0B3B68] text-white hover:bg-[#082c4d]",

  secondary:
    "bg-[#F47C45] text-white hover:bg-[#e06c35]",

  outline:
    "border border-[#0B3B68] bg-white text-[#0B3B68] hover:bg-[#0B3B68] hover:text-white",

  ghost:
    "bg-transparent text-[#0B3B68] hover:bg-slate-100",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",

  md: "px-6 py-3 text-base",

  lg: "px-8 py-4 text-lg",
};

export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const classes = `
    inline-flex
    items-center
    justify-center
    rounded-xl
    font-semibold
    transition-all
    duration-300
    cursor-pointer
    focus:outline-none
    focus:ring-2
    focus:ring-[#0B3B68]
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}