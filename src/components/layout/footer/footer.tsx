import Link from "next/link";
import Container from "@/components/common/container";

import {
  Mail,
  Phone,
  Clock3,
  GraduationCap,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white">
      <Container>
        <div className="grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">

          {/* About */}
          <div>
            <h3 className="text-2xl font-bold">
              Online MBA Colleges
            </h3>

            <p className="mt-4 leading-7 text-slate-400">
              India&apos;s AI-powered platform to compare online MBA
              universities, fees, rankings, placements and
              specializations.
            </p>

          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold">
              Quick Links
            </h4>

            <ul className="mt-4 space-y-3 text-slate-400">
              <li>
                <Link
                  href="/about-us"
                  className="transition hover:text-[#F47C45]"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="transition hover:text-[#F47C45]"
                >
                  Contact Us
                </Link>
              </li>

              <li>
                <Link
                  href="/blog"
                  className="transition hover:text-[#F47C45]"
                >
                  Blog
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy-policy"
                  className="transition hover:text-[#F47C45]"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/terms-and-conditions"
                  className="transition hover:text-[#F47C45]"
                >
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <Link
                  href="/landing-pages"
                  className="transition hover:text-[#F47C45]"
                >
                  All Landing Pages
                </Link>
              </li>
            </ul>
          </div>

          {/* Universities */}
          <div>
            <h4 className="text-lg font-semibold">
              Top Universities
            </h4>

            <ul className="mt-4 space-y-3 text-slate-400">
              <li className="flex items-center gap-2">
                <GraduationCap size={16} />
                Amity University Online
              </li>

              <li className="flex items-center gap-2">
                <GraduationCap size={16} />
                Manipal University Jaipur
              </li>

              <li>
                <Link
                  href="/top-10-online-mba-universities-colleges-north-zone"
                  className="flex items-center gap-2 transition hover:text-[#F47C45]"
                >
                  <GraduationCap size={16} />
                  Online North
                </Link>
              </li>

              <li>
                <Link
                  href="/top-10-distance-mba-universities-colleges-north-zone"
                  className="flex items-center gap-2 transition hover:text-[#F47C45]"
                >
                  <GraduationCap size={16} />
                  Distance North
                </Link>
              </li>

              <li>
                <Link
                  href="/top-colleges-university-in-north-zone"
                  className="flex items-center gap-2 transition hover:text-[#F47C45]"
                >
                  <GraduationCap size={16} />
                  North Landing Page
                </Link>
              </li>
            </ul>
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
                <a href="mailto:info@onlinembacolleges.com" className="transition hover:text-white">info@onlinembacolleges.com</a>
              </li>

              <li className="flex items-center gap-3">
                <Phone
                  size={18}
                  className="text-[#F47C45]"
                />
                <a href="tel:+918421903846" className="transition hover:text-white">+91 8421903846</a>
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
                  Mon - Sat | 9:00 AM - 7:00 PM
                </span>
              </li>

            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
          © 2026 Online MBA Colleges. All Rights Reserved.
        </div>
      </Container>
    </footer>
  );
}
