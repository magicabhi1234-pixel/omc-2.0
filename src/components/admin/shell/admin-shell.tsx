"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import type { CurrentProfile } from "@/lib/auth/session";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";
import AdminSidebar, { BrandMark, SidebarNav } from "@/components/admin/sidebar";
import Topbar from "./topbar";
import CommandPalette from "./command-palette";

export const SIDEBAR_COOKIE = "omc-admin-sidebar";
export const THEME_STORAGE_KEY = "omc-admin-theme";

/** Theme provider for the dashboard and its login page (separate storage key from anything public). */
export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" storageKey={THEME_STORAGE_KEY} defaultTheme="light" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}

function ShellInner({
  profile,
  initialCollapsed,
  children,
}: {
  profile: CurrentProfile;
  initialCollapsed: boolean;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleCollapsed = () =>
    setCollapsed((value) => {
      const next = !value;
      document.cookie = `${SIDEBAR_COOKIE}=${next ? "collapsed" : "expanded"}; path=/admin; max-age=31536000; samesite=lax`;
      return next;
    });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target?.closest("input, textarea, select, [contenteditable=true]");
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((open) => !open);
      } else if (e.key === "[" && !typing && !e.metaKey && !e.ctrlKey) {
        toggleCollapsed();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex h-dvh overflow-hidden bg-canvas text-foreground">
      <AdminSidebar profile={profile} collapsed={collapsed} onToggle={toggleCollapsed} />

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="left" className="w-[290px] gap-0 border-0 p-0 text-sidebar-foreground" style={{ backgroundImage: "var(--sidebar-gradient)" }}>
          <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
          <div className="flex h-16 items-center border-b border-sidebar-border px-4">
            <BrandMark />
          </div>
          <SidebarNav profile={profile} onNavigate={() => setDrawerOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar profile={profile} onOpenMenu={() => setDrawerOpen(true)} onOpenSearch={() => setSearchOpen(true)} />
        <main id="admin-main" className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
        </main>
      </div>

      <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} permissions={profile.permissions} />
      <Toaster position="bottom-right" richColors closeButton />
    </div>
  );
}

export default function AdminShell(props: {
  profile: CurrentProfile;
  initialCollapsed: boolean;
  children: React.ReactNode;
}) {
  return (
    <AdminThemeProvider>
      <ShellInner {...props} />
    </AdminThemeProvider>
  );
}
