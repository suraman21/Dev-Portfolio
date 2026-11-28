"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { CmsProvider, useCms } from "@/components/cms/CmsProvider";
import { SiteHeadSync } from "@/components/cms/SiteHeadSync";
import { LenisBridge } from "./LenisBridge";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingContactWidget } from "./FloatingContactWidget";

/**
 * Clean, neutral warm-alabaster porcelain boot veil shown ONLY during the brief
 * millisecond window before live CMS data hydrates. Contains ZERO demo names,
 * ZERO demo photos, and ZERO demo projects — completely eliminating any flash
 * of default data on first visit, reload, or hard refresh.
 */
function PorcelainBootCurtain() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading portfolio"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg-alabaster)]"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-2xl border border-[var(--border-mineral)] bg-white shadow-sm flex items-center justify-center">
          <span className="h-3 w-3 rounded-full bg-gradient-to-tr from-[var(--neon-teal)] to-[var(--neon-orange)] animate-pulse" />
        </div>
        <div className="h-1 w-28 overflow-hidden rounded-full bg-[var(--border-mineral)]">
          <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-[var(--neon-teal)] to-[var(--neon-orange)] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function ShellFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { ready } = useCms();
  const isAdmin = pathname?.startsWith("/app") || pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <main id="main-content" className="relative min-h-screen bg-[var(--bg-alabaster)]">
        {children}
      </main>
    );
  }

  // Never render public pages with build-time default demo data!
  // On cPanel `/public/index.php`, `window.__PORTFOLIO_CMS__` resolves synchronously
  // in `useLayoutEffect` before paint; on non-PHP servers, `/api/cms` resolves first.
  if (!ready) {
    return <PorcelainBootCurtain />;
  }

  return (
    <>
      <LenisBridge />
      <Header />
      <main id="main-content" className="relative min-h-screen">
        {children}
      </main>
      <Footer />
      <FloatingContactWidget />
      <div aria-hidden="true" className="paper-grain" />
    </>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <CmsProvider>
      <SiteHeadSync />
      <ShellFrame>{children}</ShellFrame>
    </CmsProvider>
  );
}
