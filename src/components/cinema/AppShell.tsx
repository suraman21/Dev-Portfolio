"use client";

import React from "react";
import { LenisBridge } from "./LenisBridge";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LenisBridge />
      <Header />
      <main id="main-content" className="relative min-h-screen">
        {children}
      </main>
      <Footer />
      <div aria-hidden="true" className="paper-grain" />
    </>
  );
}
