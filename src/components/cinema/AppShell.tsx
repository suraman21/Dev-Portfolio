"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { CmsProvider } from "@/components/cms/CmsProvider";
import { SiteHeadSync } from "@/components/cms/SiteHeadSync";
import { LenisBridge } from "./LenisBridge";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingContactWidget } from "./FloatingContactWidget";

function ShellFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/app") || pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <main id="main-content" className="relative min-h-screen bg-[var(--bg-alabaster)]">
        {children}
      </main>
    );
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
