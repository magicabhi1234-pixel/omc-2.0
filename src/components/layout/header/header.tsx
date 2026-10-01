"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import Container from "@/components/common/container";
import { navigationLinks } from "@/constants/navigation";
import { isOptimizableImage } from "@/lib/image-host";

export interface HeaderNavItem {
  label: string;
  href: string;
  is_external?: boolean;
  opens_new_tab?: boolean;
}

/** Internal links use next/link; external or new-tab links are plain anchors with a safe rel. */
function NavLink({ item, className, onClick, current }: { item: HeaderNavItem; className: string; onClick?: () => void; current: boolean }) {
  if (item.is_external || item.opens_new_tab || /^(https?:|mailto:|tel:)/.test(item.href)) {
    return (
      <a href={item.href} className={className} onClick={onClick} {...(item.opens_new_tab ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {item.label}
        {item.opens_new_tab && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    );
  }
  return (
    <Link href={item.href} className={className} onClick={onClick} aria-current={current ? "page" : undefined}>
      {item.label}
    </Link>
  );
}

export default function Header({
  navItems,
  mobileNavItems,
  logo,
}: {
  navItems?: HeaderNavItem[];
  mobileNavItems?: HeaderNavItem[];
  logo?: { src: string; alt: string };
}) {
  const pathname = usePathname();
  // Falls back to the hardcoded list if the CMS-managed nav table is empty
  // (e.g. before it's ever been configured) - same content either way.
  const links = navItems && navItems.length > 0 ? navItems : navigationLinks;
  const mobileLinks = mobileNavItems && mobileNavItems.length > 0 ? mobileNavItems : links;
  const logoSrc = logo?.src || "/universities/omc_logo.avif";
  const logoAlt = logo?.alt || "Online MBA Colleges";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  const isThankYouPage =
    pathname === "/thank-you";

  // Close the mobile menu whenever the route changes (adjusting state during
  // render, per React's guidance, instead of an effect + setState).
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  }

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileMenuOpen]);

  const openPopup = () => {
    setMobileMenuOpen(false);
    window.dispatchEvent(
      new Event("openLeadPopup")
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <Container>
        <div className="flex h-20 items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="Online MBA Colleges home"
          >
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={220}
              height={80}
              className="h-16 w-auto object-contain"
              unoptimized={!isOptimizableImage(logoSrc)}
              priority
            />
          </Link>

          {/* Navigation */}
          {!isThankYouPage && (
            <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
              {links.map((item, index) => (
                <NavLink
                  key={`${item.href}-${index}`}
                  item={item}
                  current={pathname === item.href}
                  className={`text-sm font-medium transition hover:text-[#0B3B68] ${pathname === item.href ? "text-[#0B3B68]" : "text-slate-700"}`}
                />
              ))}
            </nav>
          )}

          <div className="flex items-center gap-2">
            {!isThankYouPage ? (
              <button type="button" onClick={openPopup} className="hidden cursor-pointer rounded-xl bg-[#C2410C] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 sm:inline-flex">Free Counseling</button>
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
              {mobileLinks.map((item, index) => (
                <NavLink key={`${item.href}-${index}`} item={item} current={pathname === item.href} onClick={() => setMobileMenuOpen(false)} className={`rounded-lg px-3 py-3 text-sm font-medium transition hover:bg-slate-50 hover:text-[#0B3B68] ${pathname === item.href ? "bg-slate-50 text-[#0B3B68]" : "text-slate-700"}`} />
              ))}
              <button type="button" onClick={openPopup} className="mt-2 cursor-pointer rounded-xl bg-[#C2410C] px-4 py-3 text-sm font-semibold text-white">Free Counseling</button>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
