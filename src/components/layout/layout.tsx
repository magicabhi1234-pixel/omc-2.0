import Header from "./header/header";
import Footer from "./footer/footer";
import StickyCTA from "@/components/common/sticky-cta";
import LeadPopup from "@/components/common/lead-popup";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />

      <main>{children}</main>

      <StickyCTA />

      <Footer />
      <LeadPopup />
    </>
  );
}