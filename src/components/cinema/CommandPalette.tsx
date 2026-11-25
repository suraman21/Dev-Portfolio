"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  Copy,
  Film,
  Grid,
  Monitor,
  Search,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useCinema } from "./CinemaProvider";
import { siteConfig } from "@/data/site";
import { projects } from "@/data/projects";
import { foley } from "@/lib/sound";

export function CommandPalette() {
  const {
    commandOpen,
    setCommandOpen,
    tvMode,
    toggleTvMode,
    xrayMode,
    toggleXrayMode,
    soundEnabled,
    toggleSound,
  } = useCinema();
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!commandOpen) setQuery("");
  }, [commandOpen]);

  const actions = useMemo(() => {
    const nav = siteConfig.navItems.map((item) => ({
      id: `nav-${item.href}`,
      group: "Navigation",
      label: item.label,
      meta: item.href,
      icon: ArrowUpRight,
      run: () => router.push(item.href),
    }));

    const films = projects.map((p) => ({
      id: `film-${p.slug}`,
      group: "Feature Case Studies",
      label: `${p.filmNumber} · ${p.title}`,
      meta: p.headlineMetric,
      icon: Film,
      run: () => router.push(`/work/${p.slug}`),
    }));

    const utilities = [
      {
        id: "util-tv",
        group: "Cinema Controls",
        label: tvMode ? "Exit 4K / TV 10-Foot Mode" : "Enter 4K / TV 10-Foot Presentation Mode",
        meta: "Shortcut: T",
        icon: Monitor,
        run: () => toggleTvMode(),
      },
      {
        id: "util-xray",
        group: "Cinema Controls",
        label: xrayMode ? "Disable X-Ray Grid & FPS Telemetry" : "Inspect X-Ray Grid & Live Telemetry",
        meta: "Shortcut: X",
        icon: Grid,
        run: () => toggleXrayMode(),
      },
      {
        id: "util-sound",
        group: "Cinema Controls",
        label: soundEnabled ? "Mute Tactile Foley Audio" : "Enable Tactile Foley Audio",
        meta: "Web Audio API",
        icon: soundEnabled ? VolumeX : Volume2,
        run: () => toggleSound(),
      },
      {
        id: "util-copy",
        group: "Direct Contact",
        label: copied ? "Copied hello@sura.dev" : `Copy Direct Email (${siteConfig.email})`,
        meta: "Instant Clipboard",
        icon: copied ? Check : Copy,
        run: () => {
          navigator.clipboard?.writeText(siteConfig.email);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        },
      },
    ];

    const all = [...nav, ...films, ...utilities];
    if (!query.trim()) return all;
    const q = query.toLowerCase();
    return all.filter(
      (a) =>
        a.label.toLowerCase().includes(q) ||
        a.group.toLowerCase().includes(q) ||
        a.meta.toLowerCase().includes(q)
    );
  }, [copied, query, router, soundEnabled, toggleSound, toggleTvMode, toggleXrayMode, tvMode, xrayMode]);

  return (
    <AnimatePresence>
      {commandOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[150] flex items-start justify-center bg-[#0E171A]/45 backdrop-blur-md p-4 pt-[12vh]"
          onClick={() => setCommandOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="obsidian-island w-full max-w-xl overflow-hidden rounded-3xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Command Palette"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <Search className="h-4 w-4 text-[var(--neon-teal)] shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to chapter, case study, TV mode, or telemetry..."
                className="w-full bg-transparent text-sm text-[#F7F5F0] placeholder:text-white/40 focus:outline-none"
              />
              <button
                onClick={() => setCommandOpen(false)}
                aria-label="Close command palette"
                className="rounded-lg p-1.5 text-white/55 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[55vh] overflow-y-auto p-3">
              {actions.length === 0 ? (
                <div className="py-10 text-center text-sm text-white/50">
                  No matching chapters or commands.
                </div>
              ) : (
                <div className="space-y-1">
                  {actions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.id}
                        onClick={() => {
                          foley.playDetent(soundEnabled);
                          action.run();
                          if (action.id !== "util-copy") setCommandOpen(false);
                        }}
                        className="group flex w-full items-center justify-between rounded-2xl px-3.5 py-3 text-left transition-colors hover:bg-white/[0.08] cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-[var(--neon-teal)] group-hover:bg-[var(--neon-orange)]/20 group-hover:text-[var(--neon-orange)] transition-colors">
                            <Icon className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium text-[#F7F5F0]">
                              {action.label}
                            </div>
                            <div className="font-mono-tech text-[10px] text-white/45">
                              {action.group}
                            </div>
                          </div>
                        </div>
                        <span className="ml-3 shrink-0 font-mono text-[11px] text-white/50 group-hover:text-[var(--neon-teal)]">
                          {action.meta}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-white/10 px-5 py-2.5 text-[11px] text-white/45 font-mono">
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-[var(--neon-orange)]" /> SURA ATELIER COMMAND
              </span>
              <span>ESC TO CLOSE</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
