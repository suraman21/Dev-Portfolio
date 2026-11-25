"use client";

import React from "react";
import { CinemaProvider, useCinema } from "@/components/cinema/CinemaProvider";
import { LenisBridge } from "@/components/cinema/LenisBridge";
import { Header } from "@/components/cinema/Header";
import { Footer } from "@/components/cinema/Footer";
import { CommandPalette } from "@/components/cinema/CommandPalette";
import { AdaptiveCursor } from "@/components/cinema/AdaptiveCursor";
import { XRayTelemetryOverlay } from "@/components/cinema/XRayTelemetryOverlay";

function CinemaFrame({ children }: { children: React.ReactNode }) {
  const { tvMode } = useCinema();

  return (
    <div className={tvMode ? "pl-[260px]" : ""}>
      <LenisBridge />
      <Header />
      <main id="main-content" className="relative min-h-screen">
        {children}
      </main>
      <Footer />
      <CommandPalette />
      <AdaptiveCursor />
      <XRayTelemetryOverlay />
      <div aria-hidden="true" className="film-grain" />
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <CinemaProvider>
      <CinemaFrame>{children}</CinemaFrame>
    </CinemaProvider>
  );
}
