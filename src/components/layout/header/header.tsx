import Link from "next/link";
import Container from "@/components/common/container";
import { navigationLinks } from "@/constants/navigation";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-slate-900"
          >
            OMC 2.0
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navigationLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">
            Apply Now
          </button>
        </div>
      </Container>
    </header>
  );
}