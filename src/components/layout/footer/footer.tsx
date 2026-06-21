import Link from "next/link";
import Container from "@/components/common/container";

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white">
      <Container>
        <div className="grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Logo & About */}
          <div>
            <h3 className="text-2xl font-bold">
              Online MBA Colleges
            </h3>

            <p className="mt-4 text-slate-400">
              India's AI-powered platform to compare online MBA
              universities, fees, rankings, placements and
              specializations.
            </p>

            <div className="mt-6 flex gap-3">
              <div className="h-10 w-10 rounded-full bg-white/10" />
              <div className="h-10 w-10 rounded-full bg-white/10" />
              <div className="h-10 w-10 rounded-full bg-white/10" />
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold">
              Company
            </h4>

            <ul className="mt-4 space-y-3 text-slate-400">
              <li>
                <Link href="/about-us">About Us</Link>
              </li>

              <li>
                <Link href="/contact-us">Contact Us</Link>
              </li>

              <li>
                <Link href="/blog">Blog</Link>
              </li>

              <li>
                <Link href="/privacy-policy">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Universities */}
          <div>
            <h4 className="text-lg font-semibold">
              Top Universities
            </h4>

            <ul className="mt-4 space-y-3 text-slate-400">
              <li>Amity University Online</li>
              <li>Manipal University Jaipur</li>
              <li>Jain University</li>
              <li>LPU Online</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold">
              Contact
            </h4>

            <ul className="mt-4 space-y-3 text-slate-400">
              <li>magicabhi1234@gmail.com</li>
              <li>8421903846</li>
              <li>Free MBA Counselling</li>
              <li>Mon - Sat | 9 AM - 7 PM</li>
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