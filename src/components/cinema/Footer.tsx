import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-mineral)] bg-[var(--surface-porcelain)] pb-24 pt-14 md:pb-12">
      <div className="shell">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-[var(--border-mineral)]">
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ink-obsidian)] font-mono text-xs font-bold text-[var(--neon-teal)]">
                {siteConfig.monogram}
              </span>
              <div>
                <div className="font-bold text-[var(--ink-obsidian)]">{siteConfig.name}</div>
                <div className="text-xs font-medium text-[var(--teal-deep)]">{siteConfig.role}</div>
              </div>
            </div>
            <p className="mt-3 text-sm text-[var(--ink-slate)]">
              Designing and engineering fast, reliable SaaS platforms and modern luxury websites for
              ambitious teams worldwide.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
            {siteConfig.navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[var(--ink-obsidian)] hover:text-[var(--orange-lacquer)] transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center gap-1 text-[var(--teal-deep)] hover:underline"
            >
              {siteConfig.email} <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[var(--ink-muted)]">
          <span>© 2026 {siteConfig.name}. All rights reserved.</span>
          <span>{siteConfig.location}</span>
        </div>
      </div>
    </footer>
  );
}
