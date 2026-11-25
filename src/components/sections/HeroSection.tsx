"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  Expand,
  Minimize2,
  Sparkles,
} from "lucide-react";
import { siteConfig } from "@/data/site";
import { SceneCanvas } from "@/components/3d/SceneCanvas";
import { HeroPrismEngine } from "@/components/3d/HeroPrismEngine";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useCinema } from "@/components/cinema/CinemaProvider";
import { foley } from "@/lib/sound";

export function HeroSection() {
  const [exploded, setExploded] = useState(false);
  const { setCursorLabel, soundEnabled } = useCinema();

  const toggleExplode = () => {
    foley.playDetent(soundEnabled);
    setExploded((e) => !e);
  };

  return (
    <section
      id="act-1"
      aria-label="Act I — The Thesis Hero"
      className="relative min-h-[100svh] sunlit-aura pt-28 pb-14 md:pt-32 md:pb-20 flex flex-col justify-between overflow-hidden"
    >
      {/* Subtle Swiss Architectural Hairline Framing */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-24 h-px bg-gradient-to-r from-transparent via-[var(--border-mineral)] to-transparent"
      />

      <div className="shell my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
          {/* Left Editorial Thesis (6-Second Recruiter Clarity + Anchoring Effect #01) */}
          <div className="lg:col-span-7 space-y-6 md:space-y-7">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex flex-wrap items-center gap-2.5 rounded-full border border-[var(--border-mineral)] bg-white/85 px-4 py-1.5 backdrop-blur-md shadow-[0_6px_20px_-12px_rgba(14,23,26,0.12)]"
            >
              <span className="pulse-teal h-2 w-2 rounded-full bg-[var(--neon-teal)]" />
              <span className="font-mono-tech text-[10.5px] font-semibold text-[var(--teal-deep)]">
                ACT 01 · SENIOR SOFTWARE ENGINEER &amp; WEB ARCHITECT
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="text-hero font-bold text-[var(--ink-obsidian)]"
            >
              Engineering Software{" "}
              <span className="block">
                That Feels Like{" "}
                <span className="font-editorial italic font-normal text-[var(--orange-lacquer)]">
                  Cinema.
                </span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.68, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="text-body-lg max-w-[56ch] text-[var(--ink-slate)]"
            >
              I architect resilient full-stack SaaS platforms and luxury interactive web
              experiences — uniting distributed backend discipline, behavioral UX psychology, and
              sunlit 60–120fps 3D storytelling across mobile, desktop, and 4K displays.
            </motion.p>

            {/* Primary & Secondary CTAs (Von Restorff Isolation on Electric Orange) */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.68, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-3.5 pt-1"
            >
              <MagneticButton href="/work" variant="primary" cursorText="EXPLORE">
                Explore Selected Works <ArrowUpRight className="h-4 w-4" />
              </MagneticButton>
              <MagneticButton href="/contact" variant="teal" cursorText="BOOK">
                Book a Technical Call
              </MagneticButton>
              <MagneticButton href="/lab" variant="porcelain" cursorText="PLAY LAB">
                <Sparkles className="h-4 w-4 text-[var(--orange-lacquer)]" />
                Enter 3D Lab
              </MagneticButton>
            </motion.div>

            {/* 3 Headline Proof Anchors (Anchoring Effect — UX Law #01) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-3 max-w-2xl"
            >
              {siteConfig.heroAnchors.map((anchor, idx) => (
                <div
                  key={anchor.label}
                  className="porcelain-card rounded-2xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--ink-muted)]">
                      {anchor.label}
                    </span>
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        idx === 2 ? "bg-[var(--neon-orange)]" : "bg-[var(--neon-teal)]"
                      }`}
                    />
                  </div>
                  <div className="mt-1.5 text-2xl font-bold tracking-tight text-[var(--ink-obsidian)]">
                    {anchor.value}
                  </div>
                  <div className="mt-0.5 text-xs text-[var(--ink-slate)]">{anchor.detail}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Interactive 3D Hero Stage ("The Prism Chronometer") */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div
              onMouseEnter={() => setCursorLabel(exploded ? "ASSEMBLE 3D" : "DRAG / CLICK 3D")}
              onMouseLeave={() => setCursorLabel(null)}
              className="porcelain-glass dichroic-ring relative h-[390px] sm:h-[460px] lg:h-[550px] xl:h-[600px] w-full overflow-hidden rounded-[36px]"
            >
              {/* Top Minimal Telemetry Strip inside 3D Frame */}
              <div className="pointer-events-none absolute left-4 right-4 top-4 z-10 flex items-center justify-between">
                <div className="obsidian-island rounded-full px-3.5 py-1.5 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--neon-teal)]" />
                  <span className="font-mono text-[10px] tracking-wider text-[#F7F5F0]">
                    PRISM CHRONOMETER · LIVE PBR
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleExplode}
                  data-tv-focus="true"
                  className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-[var(--border-mineral)] bg-white/90 px-3.5 py-1.5 font-mono text-[10.5px] font-semibold text-[var(--ink-obsidian)] shadow-sm transition-all hover:border-[var(--neon-orange)] hover:text-[var(--orange-lacquer)] cursor-pointer"
                >
                  {exploded ? (
                    <>
                      <Minimize2 className="h-3.5 w-3.5" /> Assemble
                    </>
                  ) : (
                    <>
                      <Expand className="h-3.5 w-3.5" /> Explode Core
                    </>
                  )}
                </button>
              </div>

              <SceneCanvas
                cameraPosition={[0, 0.3, 5.2]}
                fov={38}
                fallbackLabel="PRISM CHRONOMETER"
              >
                <HeroPrismEngine exploded={exploded} onToggleExplode={toggleExplode} />
              </SceneCanvas>

              {/* Bottom Interactive Caption Telling the 3D Story */}
              <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between gap-3 rounded-2xl bg-white/88 px-4 py-3 backdrop-blur-md border border-[var(--border-mineral)]/85">
                <div className="min-w-0">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--teal-deep)]">
                    {exploded ? "X-RAY BLUEPRINT · EXPLODED" : "INTERACTIVE SCULPTURE · DRAG OR CLICK"}
                  </div>
                  <div className="truncate text-xs font-medium text-[var(--ink-obsidian)]">
                    Teal conduits = distributed flow · Orange nucleus = decisive UX craft
                  </div>
                </div>
                <span className="shrink-0 font-mono text-[10px] font-bold text-[var(--orange-lacquer)]">
                  60 FPS
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Continuity Cue into Act II Sticky Multi-Slide */}
      <div className="shell mt-10 flex items-center justify-between">
        <a
          href="#act-2"
          className="group inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-widest text-[var(--ink-slate)] hover:text-[var(--ink-obsidian)]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-mineral)] bg-white transition-transform group-hover:translate-y-1">
            <ArrowDown className="h-3.5 w-3.5 text-[var(--orange-lacquer)]" />
          </span>
          <span>Scroll into Act 02 · Sticky Architecture Strata</span>
        </a>
        <span className="hidden md:inline font-mono text-[11px] text-[var(--ink-muted)]">
          PRESS [⌘K] COMMAND · [T] 4K TV MODE · [X] X-RAY GRID
        </span>
      </div>
    </section>
  );
}
