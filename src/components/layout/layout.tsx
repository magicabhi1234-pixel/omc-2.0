import Header from "./header/header";
import Footer, { type FooterSiteInfo } from "./footer/footer";
import FloatingSelectUniversity from "@/components/common/FloatingSelectUniversity";
import DeferredWidgets from "./deferred-widgets";
import { getNavigationItems, getSiteSetting } from "@/lib/db/queries";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [headerNav, footerNav, siteInfo] = await Promise.all([
    getNavigationItems("header"),
    getNavigationItems("footer-quick-links"),
    getSiteSetting<FooterSiteInfo>("site_info", {}),
  ]);

  return (
    <>
      <Header navItems={headerNav} />

      <main>{children}</main>

      <Footer quickLinks={footerNav} siteInfo={siteInfo} />
      <FloatingSelectUniversity />
      <DeferredWidgets />
    </>
  );
}
