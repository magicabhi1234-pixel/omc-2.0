"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Container from "@/components/common/container";
import { navigationLinks } from "@/constants/navigation";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isThankYouPage =
    pathname === "/thank-you";

  const openPopup = () => {
    setMobileMenuOpen(false);
    window.dispatchEvent(
      new Event("openLeadPopup")
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <Container>
        <div className="flex h-20 items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="Online MBA Colleges home"
          >
            <Image
              src="/universities/omc_logo.avif"
              alt="Online MBA Colleges"
              width={220}
              height={80}
              className="h-16 w-auto object-contain"
              priority
            />
          </Link>

          {/* Navigation */}
          {!isThankYouPage && (
            <nav className="hidden items-center gap-8 md:flex">
              {navigationLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={`text-sm font-medium transition hover:text-[#0B3B68] ${pathname === item.href ? "text-[#0B3B68]" : "text-slate-700"}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-2">
            {!isThankYouPage ? (
              <button onClick={openPopup} className="hidden cursor-pointer rounded-xl bg-[#F47C45] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 sm:inline-flex">Free Counseling</button>
            ) : (
              <Link href="/" className="rounded-xl bg-[#0B3B68] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 sm:px-5">Back To Home</Link>
            )}
            {!isThankYouPage && (
              <button type="button" aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((open) => !open)} className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-[#0B3B68] transition hover:bg-slate-100 md:hidden">
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            )}
          </div>

        </div>
      </Container>
      {!isThankYouPage && mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <Container>
            <nav aria-label="Mobile navigation" className="flex flex-col py-3">
              {navigationLinks.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} aria-current={pathname === item.href ? "page" : undefined} className={`rounded-lg px-3 py-3 text-sm font-medium transition hover:bg-slate-50 hover:text-[#0B3B68] ${pathname === item.href ? "bg-slate-50 text-[#0B3B68]" : "text-slate-700"}`}>{item.label}</Link>
              ))}
              <button onClick={openPopup} className="mt-2 cursor-pointer rounded-xl bg-[#F47C45] px-4 py-3 text-sm font-semibold text-white">Free Counseling</button>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
