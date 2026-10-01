import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Geist } from "next/font/google";
import { BarChart3, Inbox, LayoutTemplate, ShieldCheck } from "lucide-react";
import { getCurrentProfile } from "@/lib/auth/session";
import { safeAdminRedirect } from "@/lib/security/request";
import { AdminThemeProvider } from "@/components/admin/shell/admin-shell";
import LoginForm from "./login-form";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false },
};

const FEATURES = [
  { icon: Inbox, title: "Lead manager", body: "Every enquiry in one place, with status, notes and exports." },
  { icon: LayoutTemplate, title: "Pages & content", body: "Edit landing pages, blogs, FAQs and menus without code." },
  { icon: BarChart3, title: "Live insights", body: "Lead trends, content health and SEO checks at a glance." },
];

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const destination = safeAdminRedirect(next);

  // Checked here rather than in the proxy: only an *active profile* counts as
  // signed in. A session without one (deactivated user) must still see the
  // form, otherwise login <-> dashboard redirect each other forever.
  if (await getCurrentProfile()) redirect(destination);

  return (
    <AdminThemeProvider>
      <div className={`${geist.variable} admin-ui grid min-h-dvh bg-canvas lg:grid-cols-[1.05fr_1fr]`}>
        {/* Brand panel */}
        <aside className="relative hidden overflow-hidden p-10 text-white lg:flex lg:flex-col" style={{ backgroundImage: "var(--sidebar-gradient)" }}>
          <div className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-brand-accent/30 soft-glow" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 size-96 rounded-full bg-[#3b82c4]/30 soft-glow" aria-hidden="true" />
          <div className="relative flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-white text-sm font-bold text-brand shadow">OMC</span>
            <span className="leading-tight">
              <span className="block font-semibold">Online MBA Colleges</span>
              <span className="block text-sm text-white/70">Admin console</span>
            </span>
          </div>
          <div className="relative mt-auto max-w-md">
            <h2 className="text-3xl leading-tight font-semibold tracking-tight">Run the whole site from one calm, fast workspace.</h2>
            <ul className="mt-8 space-y-5">
              {FEATURES.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 ring-1 ring-white/15">
                    <Icon size={18} className="text-brand-accent" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-medium">{title}</span>
                    <span className="block text-sm text-white/70">{body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <p className="relative mt-12 flex items-center gap-2 text-xs text-white/60">
            <ShieldCheck size={14} aria-hidden="true" /> Protected area · sign-in attempts are rate limited and logged
          </p>
        </aside>

        {/* Form */}
        <main className="flex items-center justify-center px-4 py-12 sm:px-8">
          <div className="w-full max-w-sm">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <span className="grid size-10 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">OMC</span>
              <span className="font-semibold">Online MBA Colleges</span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Welcome back</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Sign in with your username or email to manage the site.</p>
            <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-[0_1px_3px_rgb(15_23_42/0.06)]">
              <LoginForm next={destination} />
            </div>
            <p className="mt-6 text-center text-xs text-muted-foreground">Forgot your password? Ask a Super Admin to reset it from Users.</p>
          </div>
        </main>
      </div>
    </AdminThemeProvider>
  );
}
