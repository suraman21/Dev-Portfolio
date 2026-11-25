"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/data/site";
import { useCinema } from "./CinemaProvider";

export function Footer() {
  const { toggleTvMode, toggleXrayMode, setCommandOpen } = useCinema();

  return (
    <footer className="relative border-t border-[var(--border-mineral)] bg-[var(--surface-porcelain)] pb-24 pt-16 md:pb-14">
      <div className="shell">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 pb-12 border-b border-[var(--border-mineral)]">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ink-obsidian)] font-mono text-xs font-bold text-[var(--neon-teal)]">
                {siteConfig.monogram}
              </span>
              <div>
                <div className="font-bold tracking-tight text-[var(--ink-obsidian)]">
                  {siteConfig.name}
                </div>
                <div className="font-mono-tech text-[10px] text-[var(--teal-deep)]">
                  {siteConfig.role}
                </div>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm text-[var(--ink-slate)] leading-relaxed">
              Engineered as a sunlit kinetic atelier — uniting resilient distributed architecture,
              WCAG 2.2 optical clarity, living motion physics, and interactive light-mode 3D
              storytelling across phones, desktops, and 4K displays.
            </p>
          </div>

          <div className="md:col-span-3">
            <div className="font-mono-tech text-[10px] text-[var(--ink-muted)] mb-4">
              CHAPTERS
            </div>
            <ul className="space-y-2.5 text-sm">
              {siteConfig.navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-2 text-[var(--ink-obsidian)] hover:text-[var(--orange-lacquer)] transition-colors"
                  >
                    <span className="font-mono text-[11px] text-[var(--ink-muted)]">
                      {item.code}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="font-mono-tech text-[10px] text-[var(--ink-muted)] mb-4">
              EXECUTIVE CONTROLS &amp; DIRECT
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={toggleTvMode}
                className="rounded-full border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2 font-mono text-[11px] text-[var(--ink-obsidian)] hover:border-[var(--neon-teal)] cursor-pointer"
              >
                4K TV Mode [T]
              </button>
              <button
                onClick={toggleXrayMode}
                className="rounded-full border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2 font-mono text-[11px] text-[var(--ink-obsidian)] hover:border-[var(--neon-orange)] cursor-pointer"
              >
                X-Ray Grid [X]
              </button>
              <button
                onClick={() => setCommandOpen(true)}
                className="rounded-full border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2 font-mono text-[11px] text-[var(--ink-obsidian)] hover:border-[var(--neon-teal)] cursor-pointer"
              >
                Command ⌘K
              </button>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm font-medium">
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-flex items-center gap-1 text-[var(--orange-lacquer)] hover:underline"
              >
                {siteConfig.email} <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[var(--teal-deep)] hover:underline"
              >
                GitHub <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-[11px] text-[var(--ink-muted)]">
          <span>© 2026 {siteConfig.name.toUpperCase()} · ALL RIGHTS RESERVED</span>
          <span>{siteConfig.location} · BUILT WITH NEXT.JS 15 · R3F · GSAP · LENIS</span>
        </div>
      </div>
    </footer>
  );
}
