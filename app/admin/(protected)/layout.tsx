import type { Metadata } from "next";
import { requireProfile } from "@/lib/auth/session";
import AdminSidebar from "@/components/admin/sidebar";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: { template: "%s | OMC Admin", default: "OMC Admin" },
  robots: { index: false, follow: false },
};

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireProfile();

  return (
    <div className="flex h-dvh flex-col bg-slate-50 lg:flex-row">
      <AdminSidebar profile={profile} />
      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
      </main>
      <Toaster />
    </div>
  );
}
