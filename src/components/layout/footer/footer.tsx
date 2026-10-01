import Link from "next/link";
import Container from "@/components/common/container";
import NewsletterForm from "./newsletter-form";
import type { SocialLinks } from "@/lib/site-settings";

import {
  Mail,
  Phone,
  Clock3,
  GraduationCap,
} from "lucide-react";

export interface FooterQuickLink {
  label: string;
  href: string;
  is_external?: boolean;
  opens_new_tab?: boolean;
}

const SOCIAL_LABELS: Record<keyof SocialLinks, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  twitter: "X (Twitter)",
  youtube: "YouTube",
};

export interface FooterSiteInfo {
  footer_about?: string;
  email?: string;
  phone?: string;
  footer_hours?: string;
}

const DEFAULT_QUICK_LINKS: FooterQuickLink[] = [
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/contact" },
  { label: "Blog", href: "/blog" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "All Landing Pages", href: "/landing-pages" },
];

const DEFAULTS = {
  about:
    "India's AI-powered platform to compare online MBA universities, fees, rankings, placements and specializations.",
  email: "info@onlinembacolleges.com",
  phone: "+91 8421903846",
  hours: "Mon - Sat | 9:00 AM - 7:00 PM",
};

export default function Footer({
  quickLinks,
  siteInfo,
  social,
}: {
  quickLinks?: FooterQuickLink[];
  siteInfo?: FooterSiteInfo;
  social?: Partial<SocialLinks>;
}) {
  const socialLinks = (Object.keys(SOCIAL_LABELS) as (keyof SocialLinks)[]).filter((key) => social?.[key]);
  // Falls back to the original hardcoded content if the CMS-managed settings
  // haven't been configured yet - same content either way.
  const links = quickLinks && quickLinks.length > 0 ? quickLinks : DEFAULT_QUICK_LINKS;
  const about = siteInfo?.footer_about || DEFAULTS.about;
  const email = siteInfo?.email || DEFAULTS.email;
  const phone = siteInfo?.phone || DEFAULTS.phone;
  const hours = siteInfo?.footer_hours || DEFAULTS.hours;
  const phoneHref = phone.replace(/[^+\d]/g, "");

  return (
    <footer className="bg-[#0F172A] text-white">
      <Container>
        <div className="grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-3">

          {/* About */}
          <div>
            <h3 className="text-2xl font-bold">
              Online MBA Colleges
            </h3>

            <p className="mt-4 leading-7 text-slate-400">
              {about}
            </p>

            <NewsletterForm />

          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold">
              Quick Links
            </h4>

            <ul className="mt-4 gap-x-8 space-y-3 text-slate-300 sm:columns-2">
              {links.map((link, index) => (
                <li key={`${link.href}-${index}`} className="break-inside-avoid">
                  {link.is_external || link.opens_new_tab || /^https?:/.test(link.href) ? (
                    <a
                      href={link.href}
                      className="transition hover:text-[#F47C45]"
                      {...(link.opens_new_tab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="transition hover:text-[#F47C45]">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {socialLinks.length > 0 && (
              <>
                <h4 className="mt-8 text-lg font-semibold">Follow Us</h4>
                <ul className="mt-3 flex flex-wrap gap-3 text-sm text-slate-300">
                  {socialLinks.map((key) => (
                    <li key={key}>
                      <a
                        href={social![key]}
                        target="_blank"
                        rel="noopener noreferrer me"
                        className="inline-flex rounded-lg border border-slate-700 px-3 py-1.5 transition hover:border-[#F47C45] hover:text-white"
                      >
                        {SOCIAL_LABELS[key]}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold">
              Contact Information
            </h4>

            <ul className="mt-4 space-y-4 text-slate-400">

              <li className="flex items-center gap-3">
                <Mail
                  size={18}
                  className="text-[#F47C45]"
                />
                <a href={`mailto:${email}`} className="transition hover:text-white">{email}</a>
              </li>

              <li className="flex items-center gap-3">
                <Phone
                  size={18}
                  className="text-[#F47C45]"
                />
                <a href={`tel:${phoneHref}`} className="transition hover:text-white">{phone}</a>
              </li>

              <li className="flex items-center gap-3">
                <GraduationCap
                  size={18}
                  className="text-[#F47C45]"
                />
                <span>
                  Free MBA Counselling
                </span>
              </li>

              <li className="flex items-center gap-3">
                <Clock3
                  size={18}
                  className="text-[#F47C45]"
                />
                <span>
                  {hours}
                </span>
              </li>

            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 py-6 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} Online MBA Colleges. All Rights Reserved.
        </div>
      </Container>
    </footer>
  );
}
