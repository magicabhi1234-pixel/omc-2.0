import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist } from "next/font/google";
import { requireProfile } from "@/lib/auth/session";
import AdminShell, { SIDEBAR_COOKIE } from "@/components/admin/shell/admin-shell";

// Dashboard typeface. Loaded only by admin routes, so the public site's
// font payload and performance are unaffected.
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });

export const metadata: Metadata = {
  title: { template: "%s | OMC Admin", default: "OMC Admin" },
  robots: { index: false, follow: false },
};

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, cookieStore] = await Promise.all([requireProfile(), cookies()]);
  const collapsed = cookieStore.get(SIDEBAR_COOKIE)?.value === "collapsed";

  return (
    <div className={`${geist.variable} admin-ui`}>
      <AdminShell profile={profile} initialCollapsed={collapsed}>
        {children}
      </AdminShell>
    </div>
  );
}
