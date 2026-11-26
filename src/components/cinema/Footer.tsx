"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Copy, Lock, MapPin } from "lucide-react";
import { siteConfig } from "@/data/site";
import { useCms } from "@/components/cms/CmsProvider";
import { MagneticButton } from "@/components/ui/MagneticButton";

/**
 * Architectural Luxury Footer — Seamlessly Matches the Warm Alabaster,
 * Porcelain Glass, Dichroic Neon Teal & Neon Orange Vibe of the Entire Site.
 */
export function Footer() {
  const { data } = useCms();
  const { site, services } = data;
  const [copied, setCopied] = useState(false);

  const activeServices = services.filter((s) => s.active).slice(0, 4);

  const copyEmail = () => {
    navigator.clipboard?.writeText(site.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="relative bg-[var(--bg-alabaster)] pt-6 pb-24 md:pb-12">
      <div className="shell">
        <div className="porcelain-glass dichroic-ring relative overflow-hidden rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 md:p-12">
          {/* Soft Ambient Neon Teal & Orange Gallery Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--neon-teal)]/18 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-[var(--neon-orange)]/14 blur-3xl"
          />

          <div className="relative z-10">
            {/* Top Editorial Band */}
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 pb-9 border-b border-[var(--border-mineral)]">
              <div className="space-y-4 max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-mineral)] bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-[var(--teal-deep)]">
                  <span className="pulse-teal h-2 w-2 rounded-full bg-[var(--neon-teal)]" />
                  <span>{site.availability}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[var(--ink-obsidian)] leading-[1.1]">
                  {site.footerHeadline}{" "}
                  <span className="font-editorial italic font-normal text-[var(--orange-lacquer)]">
                    {site.footerHighlight}
                  </span>
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <MagneticButton href="/contact" variant="primary">
                  Start a Project <ArrowUpRight className="h-4 w-4" />
                </MagneticButton>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-full border border-[var(--border-mineral)] bg-white/95 px-5 py-2.5 text-xs sm:text-sm font-semibold text-[var(--ink-obsidian)] transition-colors hover:border-[var(--neon-teal)] cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-[var(--teal-deep)]" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 text-[var(--teal-deep)]" /> {site.email}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Middle Structured 12-Col Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 py-9 border-b border-[var(--border-mineral)]">
              {/* Brand Column */}
              <div className="sm:col-span-2 lg:col-span-5 space-y-4">
                <Link href="/" className="inline-flex items-center gap-3 group">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--ink-obsidian)] font-mono text-xs font-bold text-[var(--neon-teal)] shadow-sm transition-transform group-hover:scale-105">
                    {site.monogram}
                  </span>
                  <div>
                    <div className="text-base font-bold text-[var(--ink-obsidian)]">{site.name}</div>
                    <div className="text-xs font-medium text-[var(--teal-deep)]">{site.role}</div>
                  </div>
                </Link>

                <p className="text-sm text-[var(--ink-slate)] max-w-[40ch] leading-relaxed">
                  {site.footerBio}
                </p>

                <div className="inline-flex items-center gap-2 text-xs font-medium text-[var(--ink-muted)]">
                  <MapPin className="h-3.5 w-3.5 text-[var(--orange-lacquer)]" />
                  <span>{site.location}</span>
                </div>
              </div>

              {/* Navigation Column */}
              <div className="lg:col-span-2 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                  Explore
                </div>
                <ul className="space-y-2.5 text-sm font-medium">
                  {siteConfig.navItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-[var(--ink-obsidian)] hover:text-[var(--orange-lacquer)] transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Services Column (Live from Admin Panel!) */}
              <div className="lg:col-span-3 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                  Services
                </div>
                <ul className="space-y-2.5 text-sm">
                  {activeServices.map((svc) => (
                    <li key={svc.id}>
                      <Link
                        href={`/contact?service=${encodeURIComponent(svc.id)}`}
                        className="text-[var(--ink-slate)] hover:text-[var(--teal-deep)] transition-colors"
                      >
                        {svc.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Connect Column */}
              <div className="lg:col-span-2 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                  Connect
                </div>
                <ul className="space-y-2.5 text-sm font-medium">
                  <li>
                    <a
                      href={site.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[var(--ink-obsidian)] hover:text-[var(--teal-deep)] transition-colors"
                    >
                      GitHub <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </li>
                  <li>
                    <a
                      href={site.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[var(--ink-obsidian)] hover:text-[var(--teal-deep)] transition-colors"
                    >
                      LinkedIn <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${site.email}`}
                      className="inline-flex items-center gap-1 text-[var(--ink-obsidian)] hover:text-[var(--orange-lacquer)] transition-colors"
                    >
                      Email <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Legal & Admin Access Bar */}
            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[var(--ink-muted)]">
              <span>© {new Date().getFullYear()} {site.name}. Crafted with care.</span>
              <div className="flex items-center gap-4">
                <span className="hidden sm:inline font-mono text-[11px] text-[var(--teal-deep)]">
                  24 FPS · Responsive Mobile to 4K
                </span>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-mineral)] bg-white/80 px-3 py-1 text-[11px] font-semibold text-[var(--ink-slate)] hover:border-[var(--ink-obsidian)] hover:text-[var(--ink-obsidian)] transition-colors"
                >
                  <Lock className="h-3 w-3 text-[var(--orange-lacquer)]" /> Admin Panel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
