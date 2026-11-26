"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Maximize2, Minimize2 } from "lucide-react";
import { siteConfig } from "@/data/site";
import { SceneCanvas } from "@/components/3d/SceneCanvas";
import { HeroWorkspace3D } from "@/components/3d/HeroWorkspace3D";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function HeroSection() {
  const [inspectCore, setInspectCore] = useState(false);

  return (
    <section
      aria-label="Introduction"
      className="relative min-h-[100svh] sunlit-aura pt-28 pb-14 md:pt-34 md:pb-18 flex flex-col justify-between overflow-hidden"
    >
      <div className="shell my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-center">
          {/* Left: Clear, High-Trust Senior Positioning */}
          <div className="lg:col-span-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2.5 rounded-full border border-[var(--border-mineral)] bg-white/90 px-4 py-1.5 shadow-[0_4px_18px_-10px_rgba(15,23,26,0.12)]"
            >
              <span className="pulse-teal h-2 w-2 rounded-full bg-[var(--neon-teal)]" />
              <span className="text-xs font-semibold text-[var(--teal-deep)]">
                {siteConfig.role}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.04, ease: [0.16, 1, 0.3, 1] }}
              className="text-hero font-bold text-[var(--ink-obsidian)]"
            >
              I build fast SaaS products &amp;{" "}
              <span className="font-editorial italic font-normal text-[var(--orange-lacquer)]">
                luxury websites.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="text-body-lg max-w-[52ch] text-[var(--ink-slate)]"
            >
              Hi, I&apos;m <strong className="text-[var(--ink-obsidian)]">{siteConfig.name}</strong>
              . I help startups and growing companies turn complex ideas into fast, reliable
              software and memorable web experiences that feel effortless on every screen.
            </motion.p>

            {/* Primary & Secondary Actions */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-3.5 pt-1"
            >
              <MagneticButton href="/work" variant="primary">
                View Selected Work <ArrowUpRight className="h-4 w-4" />
              </MagneticButton>
              <MagneticButton href="/contact" variant="teal">
                Start a Conversation
              </MagneticButton>
            </motion.div>

            {/* 3 Simple, Credible Proof Stats */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-3 gap-4 pt-4 border-t border-[var(--border-mineral)] max-w-xl"
            >
              {siteConfig.heroStats.map((stat, idx) => (
                <div key={stat.label}>
                  <div
                    className={`text-xl sm:text-2xl font-bold tracking-tight ${
                      idx === 2 ? "text-[var(--orange-lacquer)]" : "text-[var(--ink-obsidian)]"
                    }`}
                  >
                    {stat.value}
                  </div>
                  <div className="mt-0.5 text-xs text-[var(--ink-slate)] leading-snug">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Replacement Interactive 3D Workstation & Kinetic Core (24 FPS) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <div className="porcelain-glass dichroic-ring relative h-[300px] sm:h-[410px] lg:h-[520px] w-full overflow-hidden rounded-[24px] sm:rounded-[32px]">
              {/* Clean Interactive Toggle */}
              <div className="pointer-events-none absolute left-3 right-3 top-3 sm:left-4 sm:right-4 sm:top-4 z-10 flex items-center justify-between gap-2">
                <span className="max-w-[56%] truncate rounded-full bg-white/90 border border-[var(--border-mineral)] px-3 py-1 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-xs font-medium text-[var(--ink-slate)]">
                  {inspectCore ? "Kinetic Core Expanded" : "Studio Workstation · 24 FPS"}
                </span>
                <button
                  type="button"
                  onClick={() => setInspectCore((v) => !v)}
                  className="pointer-events-auto shrink-0 inline-flex items-center gap-1.5 rounded-full bg-[var(--ink-obsidian)] px-3 py-1.5 sm:px-3.5 text-[11px] sm:text-xs font-semibold text-[#F7F5F0] shadow-sm transition-transform hover:scale-[1.03] cursor-pointer"
                >
                  {inspectCore ? (
                    <>
                      <Minimize2 className="h-3.5 w-3.5 text-[var(--neon-teal)]" /> Dock Core
                    </>
                  ) : (
                    <>
                      <Maximize2 className="h-3.5 w-3.5 text-[var(--neon-orange)]" /> Expand Core
                    </>
                  )}
                </button>
              </div>

              <SceneCanvas
                cameraPosition={[0, 0.55, 4.9]}
                fov={35}
                fps={24}
                fallbackLabel="STUDIO WORKSTATION"
              >
                <HeroWorkspace3D
                  layeredView={inspectCore}
                  onToggleLayers={() => setInspectCore((v) => !v)}
                />
              </SceneCanvas>

              {/* Simple Plain-English Caption */}
              <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between rounded-2xl bg-white/90 px-4 py-2.5 backdrop-blur-md border border-[var(--border-mineral)]/80">
                <span className="text-xs font-medium text-[var(--ink-obsidian)]">
                  {inspectCore
                    ? "UI, APIs & Cloud orbiting as one precision-engineered system"
                    : "Drag to rotate workstation · Click to expand the kinetic core"}
                </span>
                <span className="hidden sm:inline font-mono text-[11px] font-bold text-[var(--teal-deep)]">
                  24 FPS
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Subtle Scroll Cue */}
      <div className="shell mt-10 flex items-center justify-between">
        <a
          href="#how-i-build"
          className="group inline-flex items-center gap-2.5 text-xs font-semibold text-[var(--ink-slate)] hover:text-[var(--ink-obsidian)]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-mineral)] bg-white transition-transform group-hover:translate-y-0.5">
            <ArrowDown className="h-3.5 w-3.5 text-[var(--orange-lacquer)]" />
          </span>
          <span>Scroll to see how I build</span>
        </a>
        <span className="hidden md:inline text-xs text-[var(--ink-muted)]">
          {siteConfig.location}
        </span>
      </div>
    </section>
  );
}
