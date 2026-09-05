import { requireProfile } from "@/lib/auth/session";
import AdminSidebar from "@/components/admin/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireProfile();

  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar profile={profile} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-8 py-8">{children}</div>
      </main>
      <Toaster />
    </div>
  );
}
