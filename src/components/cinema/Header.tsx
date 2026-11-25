"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Command,
  Grid,
  Monitor,
  Volume2,
  VolumeX,
} from "lucide-react";
import { siteConfig } from "@/data/site";
import { useCinema } from "./CinemaProvider";
import { foley } from "@/lib/sound";

export function Header() {
  const pathname = usePathname();
  const {
    tvMode,
    toggleTvMode,
    xrayMode,
    toggleXrayMode,
    soundEnabled,
    toggleSound,
    setCommandOpen,
  } = useCinema();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // 4K / Smart TV 10-Foot Mode: Persistent Left Rail (Zero Hamburger Menus!)
  if (tvMode) {
    return (
      <aside
        aria-label="TV Primary Navigation Rail"
        className="fixed left-0 top-0 bottom-0 z-[105] flex w-[260px] flex-col justify-between border-r border-[var(--border-mineral)] bg-[var(--surface-porcelain)]/95 backdrop-blur-xl px-7 py-12"
      >
        <div>
          <Link
            href="/"
            data-tv-focus="true"
            className="inline-flex items-center gap-3 rounded-2xl p-2"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--ink-obsidian)] font-mono text-sm font-bold text-[var(--neon-teal)]">
              {siteConfig.monogram}
            </span>
            <div>
              <div className="text-lg font-bold tracking-tight text-[var(--ink-obsidian)]">
                {siteConfig.name}
              </div>
              <div className="font-mono-tech text-[11px] text-[var(--teal-deep)]">
                4K CINEMA MODE
              </div>
            </div>
          </Link>

          <nav className="mt-10 flex flex-col gap-3">
            {siteConfig.navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-tv-focus="true"
                  onClick={() => foley.playDetent(soundEnabled)}
                  className={`flex items-center justify-between rounded-2xl px-5 py-4 text-lg font-semibold transition-all ${
                    active
                      ? "bg-[var(--ink-obsidian)] text-[#F7F5F0] shadow-[0_14px_30px_-10px_rgba(14,23,26,0.45)]"
                      : "text-[var(--ink-obsidian)] hover:bg-[var(--surface-stone)]"
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    className={`font-mono text-xs ${
                      active ? "text-[var(--neon-orange)]" : "text-[var(--ink-muted)]"
                    }`}
                  >
                    {item.code}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3 border-t border-[var(--border-mineral)] pt-6">
          <p className="font-mono text-xs text-[var(--ink-muted)]">
            USE ARROW KEYS &amp; ENTER
          </p>
          <button
            data-tv-focus="true"
            onClick={toggleTvMode}
            className="w-full rounded-2xl bg-[var(--neon-orange)] px-4 py-3.5 text-sm font-bold text-[#0E171A] cursor-pointer"
          >
            Exit 4K TV Mode [T]
          </button>
        </div>
      </aside>
    );
  }

  return (
    <>
      {/* Desktop / Laptop / Mobile Top Hairline Porcelain Bar */}
      <header className="fixed left-0 right-0 top-0 z-[100] px-3 pt-3 md:px-6 md:pt-4 pointer-events-none">
        <div className="shell pointer-events-auto !px-0">
          <div className="porcelain-glass mx-auto flex items-center justify-between rounded-full px-3 py-2 md:px-4 md:py-2">
            {/* Brand Monogram */}
            <Link
              href="/"
              onClick={() => foley.playDetent(soundEnabled)}
              className="group flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-[var(--surface-stone)]/70"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--ink-obsidian)] font-mono text-[11px] font-bold tracking-wider text-[var(--neon-teal)] shadow-inner transition-transform duration-300 group-hover:scale-105">
                {siteConfig.monogram}
              </span>
              <div className="flex flex-col">
                <span className="text-[13px] font-bold leading-none tracking-[-0.02em] text-[var(--ink-obsidian)]">
                  {siteConfig.name}
                </span>
                <span className="mt-0.5 flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-[var(--teal-deep)]">
                  <span className="pulse-teal h-1.5 w-1.5 rounded-full bg-[var(--neon-teal)]" />
                  <span className="hidden sm:inline">Available · Global</span>
                  <span className="sm:hidden">Live</span>
                </span>
              </div>
            </Link>

            {/* Center Navigation (Desktop & Laptop — Hick's Law: 5 clean items) */}
            <nav
              aria-label="Primary Navigation"
              className="hidden md:flex items-center gap-1 rounded-full bg-[var(--surface-stone)]/75 p-1 border border-[var(--border-mineral)]/70"
            >
              {siteConfig.navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => foley.playDetent(soundEnabled)}
                    className={`relative rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
                      active
                        ? "text-[#F7F5F0]"
                        : "text-[var(--ink-slate)] hover:text-[var(--ink-obsidian)]"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active-pill"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-0 rounded-full bg-[var(--ink-obsidian)] shadow-[0_6px_18px_-6px_rgba(14,23,26,0.5)]"
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      {active && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--neon-orange)]" />
                      )}
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Precision Utility Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleTvMode}
                title="4K / 10-Foot TV Cinema Mode (Shortcut: T)"
                aria-label="Toggle 4K TV Cinema Mode"
                className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-full border border-[var(--border-mineral)] bg-white/75 px-3 text-[11px] font-mono uppercase tracking-wider text-[var(--ink-slate)] transition-all hover:border-[var(--neon-teal)] hover:text-[var(--ink-obsidian)] cursor-pointer"
              >
                <Monitor className="h-3.5 w-3.5 text-[var(--teal-deep)]" />
                <span className="hidden lg:inline">TV</span>
              </button>

              <button
                onClick={toggleXrayMode}
                title="Inspect Swiss Grid & Live FPS Telemetry (Shortcut: X)"
                aria-label="Toggle X-Ray Telemetry Overlay"
                className={`hidden sm:inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  xrayMode
                    ? "border-[var(--neon-teal)] bg-[var(--ink-obsidian)] text-[var(--neon-teal)]"
                    : "border-[var(--border-mineral)] bg-white/75 text-[var(--ink-slate)] hover:border-[var(--neon-orange)] hover:text-[var(--ink-obsidian)]"
                }`}
              >
                <Grid className="h-3.5 w-3.5" />
                <span className="hidden xl:inline">X-Ray</span>
              </button>

              <button
                onClick={toggleSound}
                title={soundEnabled ? "Mute Tactile Audio" : "Enable Tactile Audio"}
                aria-label={soundEnabled ? "Mute Tactile Audio" : "Enable Tactile Audio"}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all cursor-pointer ${
                  soundEnabled
                    ? "border-[var(--neon-teal)] bg-[var(--teal-mist)] text-[var(--teal-deep)]"
                    : "border-[var(--border-mineral)] bg-white/75 text-[var(--ink-slate)] hover:text-[var(--ink-obsidian)]"
                }`}
              >
                {soundEnabled ? (
                  <Volume2 className="h-3.5 w-3.5" />
                ) : (
                  <VolumeX className="h-3.5 w-3.5" />
                )}
              </button>

              <button
                onClick={() => {
                  foley.playDetent(soundEnabled);
                  setCommandOpen(true);
                }}
                aria-label="Open Command Palette"
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[var(--ink-obsidian)] px-3.5 text-[11px] font-mono text-[#F7F5F0] shadow-sm transition-transform hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
              >
                <Command className="h-3 w-3 text-[var(--neon-teal)]" />
                <span>K</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Floating Bottom Thumb-Zone Pill (Fitts's Law — UX Law #38) */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-3 left-3 right-3 z-[100] md:hidden"
      >
        <div className="obsidian-island mx-auto flex max-w-md items-center justify-around rounded-full px-2 py-1.5">
          {siteConfig.navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => foley.playDetent(soundEnabled)}
                className={`flex min-h-[44px] flex-1 flex-col items-center justify-center rounded-full px-2 py-1 text-[11px] font-medium transition-colors ${
                  active
                    ? "bg-[var(--neon-orange)] text-[#0E171A] font-semibold"
                    : "text-white/75 hover:text-white"
                }`}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
