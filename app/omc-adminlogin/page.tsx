import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getCurrentProfile } from "@/lib/auth/session";
import { safeAdminRedirect } from "@/lib/security/request";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const destination = safeAdminRedirect(next);

  // Checked here rather than in the proxy: only an *active profile* counts as
  // signed in. A session without one (deactivated user) must still see the
  // form, otherwise login <-> dashboard redirect each other forever.
  if (await getCurrentProfile()) redirect(destination);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-[#0B3B68]">OMC Admin</CardTitle>
          <CardDescription>Sign in to manage site content.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm next={destination} />
        </CardContent>
      </Card>
    </div>
  );
}
