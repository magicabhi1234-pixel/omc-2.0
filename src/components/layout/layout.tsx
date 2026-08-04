import Header from "./header/header";
import Footer from "./footer/footer";
import FloatingSelectUniversity from "@/components/common/FloatingSelectUniversity";
import DeferredWidgets from "./deferred-widgets";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />

      <main>{children}</main>

      <Footer />
      <FloatingSelectUniversity />
      <DeferredWidgets />
    </>
  );
}