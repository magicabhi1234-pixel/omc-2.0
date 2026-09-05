import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/db/client";
import { requireProfile } from "@/lib/auth/session";
import SiteInfoForm from "@/components/admin/site-info-form";
import NavigationEditor from "@/components/admin/navigation-editor";

interface SiteInfo {
  site_name: string;
  tagline: string;
  email: string;
  phone: string;
  footer_about: string;
  footer_hours: string;
}

export default async function SettingsPage() {
  const profile = await requireProfile();
  if (!profile.permissions.canManageSettings) redirect("/admin/dashboard");

  const [{ data: settingRow }, { data: headerNav }, { data: footerNav }] = await Promise.all([
    supabaseAdmin.from("site_settings").select("value").eq("key", "site_info").maybeSingle(),
    supabaseAdmin.from("navigation_items").select("label, href").eq("menu_key", "header").order("sort_order"),
    supabaseAdmin.from("navigation_items").select("label, href").eq("menu_key", "footer-quick-links").order("sort_order"),
  ]);

  const siteInfo = (settingRow?.value ?? {}) as Partial<SiteInfo>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>

      <div className="mt-6 space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="font-semibold text-slate-900">Site Information</h3>
          <div className="mt-3">
            <SiteInfoForm initial={siteInfo} />
          </div>
        </div>

        <NavigationEditor menuKey="header" title="Header Navigation" initial={headerNav ?? []} />
        <NavigationEditor menuKey="footer-quick-links" title="Footer Quick Links" initial={footerNav ?? []} />
      </div>
    </div>
  );
}
