"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Layers, Minimize2 } from "lucide-react";
import { siteConfig } from "@/data/site";
import { SceneCanvas } from "@/components/3d/SceneCanvas";
import { HeroWorkspace3D } from "@/components/3d/HeroWorkspace3D";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function HeroSection() {
  const [layeredView, setLayeredView] = useState(false);

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
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2.5 rounded-full border border-[var(--border-mineral)] bg-white/90 px-4 py-1.5 shadow-[0_4px_18px_-10px_rgba(15,23,26,0.12)]"
            >
              <span className="pulse-teal h-2 w-2 rounded-full bg-[var(--neon-teal)]" />
              <span className="text-xs font-semibold text-[var(--teal-deep)]">
                {siteConfig.role}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="text-hero font-bold text-[var(--ink-obsidian)]"
            >
              I build fast SaaS products &amp;{" "}
              <span className="font-editorial italic font-normal text-[var(--orange-lacquer)]">
                luxury websites.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.62, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
              className="text-body-lg max-w-[52ch] text-[var(--ink-slate)]"
            >
              Hi, I&apos;m <strong className="text-[var(--ink-obsidian)]">{siteConfig.name}</strong>
              . I help startups and growing companies turn complex ideas into fast, reliable
              software and memorable web experiences that feel effortless on every screen.
            </motion.p>

            {/* Primary & Secondary Actions */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.62, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
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
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
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

          {/* Right: ONE Signature Interactive 3D Centerpiece That Tells a Clear Story */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <div className="porcelain-glass dichroic-ring relative h-[360px] sm:h-[440px] lg:h-[520px] w-full overflow-hidden rounded-[32px]">
              {/* Clean Layer Switch Button */}
              <div className="pointer-events-none absolute left-4 right-4 top-4 z-10 flex items-center justify-between">
                <span className="rounded-full bg-white/90 border border-[var(--border-mineral)] px-3.5 py-1.5 text-xs font-medium text-[var(--ink-slate)]">
                  {layeredView ? "Full-Stack Layers Separated" : "Interactive 3D Product Model"}
                </span>
                <button
                  type="button"
                  onClick={() => setLayeredView((v) => !v)}
                  className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-[var(--ink-obsidian)] px-3.5 py-1.5 text-xs font-semibold text-[#F7F5F0] shadow-sm transition-transform hover:scale-[1.03] cursor-pointer"
                >
                  {layeredView ? (
                    <>
                      <Minimize2 className="h-3.5 w-3.5 text-[var(--neon-teal)]" /> Unified View
                    </>
                  ) : (
                    <>
                      <Layers className="h-3.5 w-3.5 text-[var(--neon-orange)]" /> See Layers
                    </>
                  )}
                </button>
              </div>

              <SceneCanvas
                cameraPosition={[0, 0.18, 5.1]}
                fov={36}
                fallbackLabel="INTERACTIVE PRODUCT STACK"
              >
                <HeroWorkspace3D
                  layeredView={layeredView}
                  onToggleLayers={() => setLayeredView((v) => !v)}
                />
              </SceneCanvas>

              {/* Simple Plain-English Caption */}
              <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between rounded-2xl bg-white/90 px-4 py-2.5 backdrop-blur-md border border-[var(--border-mineral)]/80">
                <span className="text-xs font-medium text-[var(--ink-obsidian)]">
                  {layeredView
                    ? "Backend APIs + Web Interface + Floating UX — built as one system"
                    : "Drag gently to rotate · Click to inspect the full-stack layers"}
                </span>
                <span className="hidden sm:inline text-[11px] font-semibold text-[var(--teal-deep)]">
                  Interactive
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
