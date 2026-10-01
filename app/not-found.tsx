import Layout from "@/components/layout/layout";
import SiteNotFound from "./(site)/not-found";

/**
 * Catches unknown URLs that never reach a (site) route segment (e.g. deep
 * multi-segment paths), so every 404 keeps the site header, footer and
 * navigation instead of Next's bare default page.
 */
export default function NotFound() {
  return (
    <Layout>
      <SiteNotFound />
    </Layout>
  );
}
