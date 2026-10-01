import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/db/client";
import { requirePermission } from "@/lib/auth/session";
import NavigationEditor from "@/components/admin/navigation-editor";
import { MENU_KEYS, type MenuKey } from "@/lib/site-settings";
import { PageHeader } from "@/components/admin/page-kit";

export const metadata: Metadata = { title: "Menus" };

const DESCRIPTIONS: Record<MenuKey, string> = {
  header: "Links in the top navigation bar on tablets and desktops.",
  mobile: "Links in the slide-down menu on phones. Leave empty to reuse the header menu.",
  "footer-quick-links": "The Quick Links column in the site footer.",
};

export default async function MenusPage() {
  await requirePermission((p) => p.canManageSettings);
  const { data, error } = await supabaseAdmin
    .from("navigation_items")
    .select("menu_key, label, href, opens_new_tab, sort_order")
    .order("sort_order");

  return (
    <div>
      <PageHeader title="Menus" description={<>Drag rows (or use the arrows) to reorder. Changes go live as soon as you save.</>} />
      {error && <p className="mt-4 rounded-lg bg-destructive/10 p-4 text-sm text-destructive" role="alert">Couldn&apos;t load menus: {error.message}</p>}
      <div className="mt-6 space-y-6">
        {(Object.keys(MENU_KEYS) as MenuKey[]).map((key) => (
          <NavigationEditor
            key={key}
            menuKey={key}
            title={MENU_KEYS[key]}
            description={DESCRIPTIONS[key]}
            initial={(data ?? []).filter((i) => i.menu_key === key).map(({ label, href, opens_new_tab }) => ({ label, href, opens_new_tab }))}
          />
        ))}
      </div>
    </div>
  );
}
