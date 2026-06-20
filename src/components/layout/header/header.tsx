import Link from "next/link";
import Container from "@/components/common/container";
import { navigationLinks } from "@/constants/navigation";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <Container>
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex flex-col">
            <span className="text-xl font-bold text-[#0B3B68]">
              Online MBA
            </span>
            <span className="text-xs font-medium text-slate-500">
              Colleges
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigationLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-700 transition hover:text-[#0B3B68]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <button className="rounded-xl bg-[#F47C45] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">
            Free Counseling
          </button>
        </div>
      </Container>
    </header>
  );
}