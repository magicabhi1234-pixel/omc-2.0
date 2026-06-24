import Layout from "@/components/layout/layout";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}