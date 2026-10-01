import type { Metadata } from "next";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/db/client";
import { requirePermission } from "@/lib/auth/session";
import SettingsGroupForm, { type SettingsField } from "@/components/admin/settings-group-form";
import { cn } from "@/lib/utils";
import { SETTINGS_GROUPS, parseSettings, type SettingsGroup } from "@/lib/site-settings";

export const metadata: Metadata = { title: "Global Settings" };

const TABS: { group: SettingsGroup; label: string; description: string; fields: SettingsField[] }[] = [
  {
    group: "site_info",
    label: "General",
    description: "Site name and contact details used in the header, footer, contact page and structured data.",
    fields: [
      { name: "site_name", label: "Site name", required: true },
      { name: "tagline", label: "Tagline" },
      { name: "email", label: "Contact email", type: "email", required: true },
      { name: "phone", label: "Contact phone", required: true, placeholder: "+91 98765 43210" },
      { name: "whatsapp", label: "WhatsApp number", placeholder: "+91 98765 43210", help: "Optional. Shown on the contact page." },
      { name: "footer_hours", label: "Business hours", placeholder: "Mon - Sat | 9:00 AM - 7:00 PM" },
      { name: "address", label: "Office address", type: "textarea", help: "Optional. Shown on the contact page and in Organization schema." },
      { name: "footer_about", label: "Footer about text", type: "textarea" },
    ],
  },
  {
    group: "branding",
    label: "Branding",
    description: "Logo, favicon and the default image used when pages are shared on social media.",
    fields: [
      { name: "logo_url", label: "Logo", type: "media", folder: "logos" },
      { name: "logo_alt", label: "Logo alt text" },
      { name: "favicon_url", label: "Favicon", type: "media", folder: "logos", help: "Square PNG, at least 192×192. Leave empty to use the built-in favicon." },
      { name: "og_image_url", label: "Default social share image", type: "media", folder: "logos", help: "1200×630 JPG or PNG. Used by pages without their own image." },
    ],
  },
  {
    group: "social_links",
    label: "Social Links",
    description: "Shown in the footer and published as the organization's official profiles (schema.org sameAs).",
    fields: [
      { name: "facebook", label: "Facebook", type: "url", placeholder: "https://facebook.com/..." },
      { name: "instagram", label: "Instagram", type: "url", placeholder: "https://instagram.com/..." },
      { name: "linkedin", label: "LinkedIn", type: "url", placeholder: "https://linkedin.com/company/..." },
      { name: "twitter", label: "X (Twitter)", type: "url", placeholder: "https://x.com/..." },
      { name: "youtube", label: "YouTube", type: "url", placeholder: "https://youtube.com/@..." },
    ],
  },
  {
    group: "tracking",
    label: "Analytics & Verification",
    description: "Enter IDs only - the site renders the official snippets itself. Leave a field empty to disable it.",
    fields: [
      { name: "ga4_id", label: "Google Analytics 4 measurement ID", placeholder: "G-XXXXXXXXXX" },
      { name: "gtm_id", label: "Google Tag Manager container ID", placeholder: "GTM-XXXXXXX", help: "If GA4 is configured inside GTM, leave the GA4 field empty to avoid double counting." },
      { name: "meta_pixel_id", label: "Meta Pixel ID", placeholder: "123456789012345" },
      { name: "clarity_id", label: "Microsoft Clarity project ID", placeholder: "abcd1234ef" },
      { name: "google_site_verification", label: "Google Search Console verification", placeholder: "content value only", help: 'From <meta name="google-site-verification" content="THIS_PART">' },
      { name: "bing_site_verification", label: "Bing Webmaster verification", placeholder: "content value only" },
      { name: "meta_domain_verification", label: "Meta domain verification", placeholder: "content value only" },
    ],
  },
];

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  await requirePermission((p) => p.canManageSettings);
  const { tab } = await searchParams;
  const active = TABS.find((t) => t.group === tab) ?? TABS[0];

  const { data: row } = await supabaseAdmin.from("site_settings").select("value").eq("key", active.group).maybeSingle();
  // Show stored values; for never-saved groups show the defaults the site is using.
  const stored = (row?.value ?? null) as Record<string, string> | null;
  const effective = parseSettings(active.group, stored ?? {}) as Record<string, string>;
  const initial = Object.fromEntries(
    Object.keys(SETTINGS_GROUPS[active.group].shape).map((key) => [key, stored ? (stored[key] ?? "") : (effective[key] ?? "")])
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Global Settings</h1>
      <p className="mt-1 text-slate-600">Changes go live immediately across the site.</p>

      <nav aria-label="Settings sections" className="mt-6 flex gap-1 overflow-x-auto border-b border-slate-200">
        {TABS.map((t) => (
          <Link
            key={t.group}
            href={`/admin/settings?tab=${t.group}`}
            aria-current={t.group === active.group ? "page" : undefined}
            className={cn(
              "-mb-px border-b-2 px-4 py-2 text-sm font-medium whitespace-nowrap transition",
              t.group === active.group ? "border-[#0B3B68] text-[#0B3B68]" : "border-transparent text-slate-500 hover:text-slate-900"
            )}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
        <h2 className="font-semibold text-slate-900">{active.label}</h2>
        <p className="mt-1 mb-5 text-sm text-slate-500">{active.description}</p>
        <SettingsGroupForm key={active.group} group={active.group} fields={active.fields} initial={initial} />
      </section>
    </div>
  );
}
