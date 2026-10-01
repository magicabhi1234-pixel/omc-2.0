import Header from "./header/header";
import Footer from "./footer/footer";
import FloatingSelectUniversity from "@/components/common/FloatingSelectUniversity";
import DeferredWidgets from "./deferred-widgets";
import TrackingScripts from "./tracking-scripts";
import { getNavigationItems, getSettings } from "@/lib/db/queries";
import { JsonLd, organizationSchema, websiteSchema } from "@/lib/structured-data";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [headerNav, mobileNav, footerNav, siteInfo, branding, social, tracking] = await Promise.all([
    getNavigationItems("header"),
    getNavigationItems("mobile"),
    getNavigationItems("footer-quick-links"),
    getSettings("site_info"),
    getSettings("branding"),
    getSettings("social_links"),
    getSettings("tracking"),
  ]);

  return (
    <>
      {/* Declared once per page; every other schema references these by @id. */}
      <JsonLd data={[organizationSchema(siteInfo, branding, social), websiteSchema(siteInfo)]} />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#0B3B68] focus:shadow"
      >
        Skip to content
      </a>

      <Header
        navItems={headerNav}
        mobileNavItems={mobileNav.length > 0 ? mobileNav : headerNav}
        logo={{ src: branding.logo_url, alt: branding.logo_alt }}
      />

      <main id="main-content">{children}</main>

      <Footer quickLinks={footerNav} siteInfo={siteInfo} social={social} />
      <FloatingSelectUniversity />
      <DeferredWidgets />
      <TrackingScripts tracking={tracking} />
    </>
  );
}
