"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/data/site";
import { useCms } from "@/components/cms/CmsProvider";
import { BrandAvatar } from "@/components/ui/BrandAvatar";

export function Header() {
  const pathname = usePathname();
  const { data } = useCms();
  const site = data.site;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Serene, Uncluttered Luxury Header (Desktop, Laptop, 4K) */}
      <header className="fixed left-0 right-0 top-0 z-[100] px-3 pt-3 md:px-6 md:pt-4 pointer-events-none">
        <div className="shell pointer-events-auto !px-0">
          <div className="porcelain-glass mx-auto flex items-center justify-between gap-2 rounded-full px-3 py-2 md:px-4">
            {/* Brand Identity (Profile Image Logo + Synced Name + Synced Availability) */}
            <Link
              href="/"
              className="group flex min-w-0 items-center gap-2.5 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-[var(--surface-stone)]/60"
            >
              <BrandAvatar
                src={site.profileImage}
                alt={site.profileImageAlt || site.name}
                monogram={site.monogram}
                position={site.profileImagePosition}
                sizeClass="h-9 w-9"
                className="transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-bold leading-none tracking-[-0.02em] text-[var(--ink-obsidian)]">
                  {site.name}
                </span>
                <span className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium text-[var(--teal-deep)]">
                  <span className="pulse-teal h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--neon-teal)]" />
                  <span className="max-w-[145px] sm:max-w-[220px] truncate">
                    {site.availability}
                  </span>
                </span>
              </div>
            </Link>

            {/* Clean 4-Item Navigation */}
            <nav
              aria-label="Main Navigation"
              className="hidden md:flex items-center gap-1 rounded-full bg-[var(--surface-stone)]/75 p-1 border border-[var(--border-mineral)]/70"
            >
              {siteConfig.navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                      active
                        ? "text-[#F7F5F0]"
                        : "text-[var(--ink-slate)] hover:text-[var(--ink-obsidian)]"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="header-active-pill"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-0 rounded-full bg-[var(--ink-obsidian)]"
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Single Clear Primary CTA */}
            <Link
              href="/contact"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-[var(--neon-orange)] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#0F171A] shadow-[0_8px_22px_-8px_rgba(255,90,31,0.55)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{site.headerCtaLabel || "Let's Talk"}</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Clean Mobile Bottom Thumb-Zone Navigation */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-3 left-3 right-3 z-[100] md:hidden"
      >
        <div className="mx-auto flex max-w-sm items-center justify-around rounded-full bg-[var(--ink-obsidian)]/92 backdrop-blur-xl px-2 py-1.5 shadow-[0_18px_40px_-10px_rgba(15,23,26,0.45)] border border-white/10">
          {siteConfig.navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-h-[42px] flex-1 items-center justify-center rounded-full px-3 text-xs font-semibold transition-colors ${
                  active
                    ? "bg-[var(--neon-orange)] text-[#0F171A]"
                    : "text-white/75 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
