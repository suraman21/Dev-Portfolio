"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ChevronLeft, ChevronRight, Code2, Layers } from "lucide-react";
import { architectureStrata } from "@/data/story";
import { SceneCanvas } from "@/components/3d/SceneCanvas";
import { ArchitectureStack3D } from "@/components/3d/ArchitectureStack3D";
import { useCinema } from "./CinemaProvider";
import { foley } from "@/lib/sound";

/**
 * ACT II — STICKY PINNED MULTI-SLIDE FULL-SCREEN STAGE
 * - Desktop/Laptop (>=1024px): Pins full viewport via GSAP ScrollTrigger while
 *   scrolling cleanly wipes through 4 architectural full-screen slides with
 *   outgoing depth recession, readability plateaus, and synced 3D Stack updates.
 * - Mobile (<1024px): Native CSS `position: sticky` 100svh stacking deck (zero
 *   iOS Safari dynamic URL-bar pin-spacer bugs!).
 * - 4K / TV Mode: Clean Apple-Keynote ArrowUp/Down/Left/Right slide stepping!
 */
export function StickySlideDeck() {
  const stageRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showCode, setShowCode] = useState(false);
  const { tvMode, soundEnabled, scrollRef } = useCinema();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (tvMode) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const slides = slideRefs.current.filter(Boolean) as HTMLDivElement[];
      if (!stageRef.current || slides.length < 2) return;

      // Initial stacked positions: Slide 0 visible, Slides 1..N tucked below viewport
      slides.forEach((slide, i) => {
        gsap.set(slide, {
          yPercent: i === 0 ? 0 : 102,
          scale: 1,
          opacity: 1,
          zIndex: i + 1,
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stageRef.current,
          pin: true,
          scrub: 0.72,
          start: "top top",
          end: () => `+=${(slides.length - 1) * window.innerHeight * 0.92}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            scrollRef.current.stickySlideProgress = self.progress;
            const idx = Math.min(
              slides.length - 1,
              Math.round(self.progress * (slides.length - 1))
            );
            setActiveIndex(idx);
          },
        },
      });

      triggerRef.current = tl.scrollTrigger || null;

      slides.forEach((slide, i) => {
        if (i === 0) {
          tl.to({}, { duration: 0.22 }); // Opening readability plateau
          return;
        }
        const prev = slides[i - 1];
        tl.addLabel(`stratum-${i}`)
          .to(slide, {
            yPercent: 0,
            duration: 1,
            ease: "power2.inOut",
          })
          .to(
            prev,
            {
              scale: 0.94,
              opacity: 0.35,
              duration: 1,
              ease: "power2.inOut",
            },
            "<"
          )
          .to({}, { duration: 0.32 }); // Readability dwell plateau
      });
    });

    return () => {
      triggerRef.current = null;
      mm.revert();
    };
  }, [tvMode, scrollRef]);

  // Jump cleanly to any slide (works in desktop pinned mode AND TV Keynote mode)
  const jumpToSlide = (idx: number) => {
    foley.playDetent(soundEnabled);
    const bounded = Math.max(0, Math.min(architectureStrata.length - 1, idx));
    setActiveIndex(bounded);

    if (!tvMode && triggerRef.current) {
      const st = triggerRef.current;
      const targetY =
        st.start + (bounded / (architectureStrata.length - 1)) * (st.end - st.start);
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  };

  const skipSection = () => {
    foley.playDetent(soundEnabled);
    const next = document.getElementById("act-3");
    if (next) next.scrollIntoView({ behavior: "smooth" });
  };

  // TV Mode: Keynote-style deterministic slide switcher with Arrow keys
  if (tvMode) {
    const stratum = architectureStrata[activeIndex];
    return (
      <section
        id="act-2"
        aria-label="Act II Architecture Strata Keynote"
        className="relative min-h-[100svh] border-y border-[var(--border-mineral)] bg-[var(--bg-alabaster)] py-16 flex items-center"
      >
        <div className="shell">
          <div className="flex items-center justify-between mb-8">
            <span className="font-mono-tech text-[var(--teal-deep)]">
              ACT 02 · ARCHITECTURE STRATA ({stratum.index} / 04)
            </span>
            <div className="flex items-center gap-3">
              <button
                data-tv-focus="true"
                onClick={() => jumpToSlide(activeIndex - 1)}
                disabled={activeIndex === 0}
                className="rounded-full border border-[var(--border-mineral)] bg-white px-5 py-3 text-sm font-semibold disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="inline h-5 w-5" /> Prev Slide
              </button>
              <button
                data-tv-focus="true"
                onClick={() => jumpToSlide(activeIndex + 1)}
                disabled={activeIndex === architectureStrata.length - 1}
                className="rounded-full bg-[var(--neon-orange)] px-5 py-3 text-sm font-bold text-[#0E171A] disabled:opacity-40 cursor-pointer"
              >
                Next Slide <ChevronRight className="inline h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-10 items-center">
            <div className="col-span-7 space-y-6">
              <h2 className="text-h2 font-bold text-[var(--ink-obsidian)]">
                {stratum.title}{" "}
                <span className="font-editorial italic font-normal text-[var(--teal-deep)]">
                  {stratum.italicWord}
                </span>
              </h2>
              <p className="text-body-lg text-[var(--ink-slate)] max-w-2xl">{stratum.summary}</p>
              <div className="grid grid-cols-3 gap-4 pt-2">
                {stratum.metrics.map((m) => (
                  <div key={m.label} className="porcelain-card rounded-2xl p-5">
                    <div className="text-2xl font-bold text-[var(--ink-obsidian)]">{m.value}</div>
                    <div className="mt-1 font-mono text-xs text-[var(--ink-muted)]">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-5 h-[520px] porcelain-glass rounded-[32px] overflow-hidden">
              <SceneCanvas cameraPosition={[0, 0.2, 5.1]} fallbackLabel="ARCHITECTURE STACK">
                <ArchitectureStack3D activeLayer={activeIndex} />
              </SceneCanvas>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="act-2" aria-label="Act II — The Dual Craft Sticky Multi-Slide Stage">
      {/* ============================================================
          DESKTOP / LAPTOP (>=1024px): TRUE GSAP STICKY MULTI-SLIDE STAGE
         ============================================================ */}
      <div
        ref={stageRef}
        className="relative hidden lg:block h-screen w-full overflow-hidden border-y border-[var(--border-mineral)] bg-[var(--bg-alabaster)]"
      >
        {/* Top Floating Progress & Escape HUD (Goal-Gradient Effect #48) */}
        <div className="pointer-events-none absolute left-0 right-0 top-[78px] z-[40] shell">
          <div className="flex items-center justify-between">
            <div className="pointer-events-auto porcelain-glass flex items-center gap-3 rounded-full px-4 py-2">
              <Layers className="h-3.5 w-3.5 text-[var(--teal-deep)]" />
              <span className="font-mono-tech text-[10.5px] text-[var(--ink-obsidian)]">
                ACT 02 · STICKY STRATA
              </span>
              <span className="h-3 w-px bg-[var(--border-mineral)]" />
              <span className="font-mono text-xs font-bold text-[var(--orange-lacquer)]">
                0{activeIndex + 1} / 0{architectureStrata.length}
              </span>
            </div>

            {/* Clickable Slide Jump Dots + Skip Escape Hatch */}
            <div className="pointer-events-auto flex items-center gap-3">
              <div className="porcelain-glass flex items-center gap-1.5 rounded-full px-3 py-2">
                {architectureStrata.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => jumpToSlide(idx)}
                    aria-label={`Jump to slide ${idx + 1}: ${s.title}`}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === activeIndex
                        ? "w-7 bg-[var(--neon-orange)]"
                        : "w-2 bg-[var(--teal-deep)]/35 hover:bg-[var(--teal-deep)]"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={skipSection}
                className="porcelain-glass inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 font-mono text-[10.5px] uppercase tracking-wider text-[var(--ink-slate)] hover:border-[var(--neon-orange)] hover:text-[var(--ink-obsidian)] cursor-pointer"
              >
                Skip <ArrowDown className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Full-Viewport Stacking Slides */}
        <div className="relative h-full w-full">
          {architectureStrata.map((stratum, idx) => {
            const isOrange = stratum.accent === "orange";
            return (
              <div
                key={stratum.id}
                ref={(el) => {
                  slideRefs.current[idx] = el;
                }}
                className="absolute inset-0 flex items-center pt-20 pb-8"
                style={{
                  background:
                    idx % 2 === 0
                      ? "linear-gradient(155deg, #F7F5F0 0%, #FFFFFF 100%)"
                      : "linear-gradient(155deg, #FFFFFF 0%, #F3F1EB 100%)",
                }}
              >
                <div className="shell grid grid-cols-12 gap-8 xl:gap-12 items-center">
                  {/* Left Editorial Story & Progressive Code Spec */}
                  <div className="col-span-7 space-y-6">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 font-mono text-[10.5px] font-semibold tracking-widest uppercase ${
                          isOrange
                            ? "bg-[var(--orange-halo)] text-[var(--orange-lacquer)] border border-[var(--neon-orange)]/35"
                            : "bg-[var(--teal-mist)] text-[var(--teal-deep)] border border-[var(--neon-teal)]/45"
                        }`}
                      >
                        {stratum.eyebrow}
                      </span>
                    </div>

                    <h2 className="text-h2 font-bold text-[var(--ink-obsidian)]">
                      {stratum.title}{" "}
                      <span
                        className={`font-editorial italic font-normal ${
                          isOrange ? "text-[var(--orange-lacquer)]" : "text-[var(--teal-deep)]"
                        }`}
                      >
                        {stratum.italicWord}
                      </span>
                    </h2>

                    <p className="text-body-lg max-w-[58ch] text-[var(--ink-slate)]">
                      {stratum.summary}
                    </p>

                    {/* Quantified Proof Strip */}
                    <div className="grid grid-cols-3 gap-3.5 max-w-xl">
                      {stratum.metrics.map((metric) => (
                        <div
                          key={metric.label}
                          className="porcelain-card rounded-2xl px-4 py-3.5"
                        >
                          <div className="text-xl xl:text-2xl font-bold tracking-tight text-[var(--ink-obsidian)]">
                            {metric.value}
                          </div>
                          <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--ink-muted)]">
                            {metric.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Progressive Disclosure: Capabilities vs Live Code Spec */}
                    <div className="pt-1">
                      <div className="flex items-center justify-between max-w-xl mb-3">
                        <span className="font-mono-tech text-[10px] text-[var(--ink-muted)]">
                          {showCode ? "PRODUCTION PATTERN" : "ENGINEERING CAPABILITIES"}
                        </span>
                        <button
                          onClick={() => {
                            foley.playDetent(soundEnabled);
                            setShowCode((s) => !s);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-mineral)] bg-white px-3 py-1 font-mono text-[10.5px] text-[var(--teal-deep)] hover:border-[var(--neon-teal)] cursor-pointer"
                        >
                          <Code2 className="h-3.5 w-3.5" />
                          {showCode ? "View Capabilities" : "Inspect Code Spec"}
                        </button>
                      </div>

                      {showCode ? (
                        <pre className="obsidian-island max-w-xl overflow-x-auto rounded-2xl p-4 font-mono text-xs leading-relaxed text-[var(--neon-teal)]">
                          <code>{stratum.codeProof}</code>
                        </pre>
                      ) : (
                        <div className="grid grid-cols-2 gap-2.5 max-w-xl">
                          {stratum.capabilities.map((cap) => (
                            <div
                              key={cap}
                              className="flex items-center gap-2.5 rounded-xl border border-[var(--border-mineral)]/80 bg-white/80 px-3.5 py-2.5 text-[13px] font-medium text-[var(--ink-obsidian)]"
                            >
                              <span
                                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                                  isOrange ? "bg-[var(--neon-orange)]" : "bg-[var(--neon-teal)]"
                                }`}
                              />
                              <span>{cap}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side Spacer (Visual Stage sits persistently synchronized on right) */}
                  <div className="col-span-5 h-[500px] xl:h-[540px]" />
                </div>
              </div>
            );
          })}

          {/* Single Persistent 3D Exploded Architecture Stack overlaid cleanly on Right Column */}
          <div className="pointer-events-none absolute inset-0 z-[30] flex items-center pt-20 pb-8">
            <div className="shell grid grid-cols-12 gap-8 xl:gap-12 items-center">
              <div className="col-span-7" />
              <div className="pointer-events-auto col-span-5">
                <div className="porcelain-glass dichroic-ring relative h-[480px] xl:h-[530px] w-full overflow-hidden rounded-[32px]">
                  <SceneCanvas
                    cameraPosition={[0, 0.25, 5.25]}
                    fov={38}
                    fallbackLabel="EXPLODED ARCHITECTURE"
                  >
                    <ArchitectureStack3D activeLayer={activeIndex} />
                  </SceneCanvas>

                  <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl bg-white/85 px-4 py-2.5 backdrop-blur-md border border-[var(--border-mineral)]">
                    <span className="font-mono text-[10.5px] uppercase tracking-wider text-[var(--ink-obsidian)]">
                      ACTIVE LAYER · {architectureStrata[activeIndex].index}
                    </span>
                    <span className="font-mono text-[10.5px] text-[var(--teal-deep)]">
                      SCROLL TO EXPLODE ↓
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          MOBILE / TABLET (<1024px): NATIVE CSS STICKY 100svh STACKING DECK
          (Zero iOS Safari URL-bar pin glitches!)
         ============================================================ */}
      <div className="lg:hidden relative border-y border-[var(--border-mineral)] bg-[var(--bg-alabaster)] py-14">
        <div className="shell mb-8">
          <span className="font-mono-tech text-[11px] text-[var(--teal-deep)]">
            ACT 02 · ARCHITECTURE STRATA
          </span>
          <h2 className="mt-2 text-h2 font-bold text-[var(--ink-obsidian)]">
            Full-Stack Depth,{" "}
            <span className="font-editorial italic font-normal text-[var(--orange-lacquer)]">
              Layer by Layer
            </span>
          </h2>

          {/* Compact Interactive 3D Preview for Mobile */}
          <div className="mt-6 porcelain-glass dichroic-ring h-[280px] w-full overflow-hidden rounded-3xl">
            <SceneCanvas cameraPosition={[0, 0.2, 5.4]} fallbackLabel="ARCHITECTURE STACK">
              <ArchitectureStack3D activeLayer={activeIndex} />
            </SceneCanvas>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {architectureStrata.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setActiveIndex(idx)}
                className={`shrink-0 rounded-full px-3.5 py-2 font-mono text-[11px] transition-colors ${
                  activeIndex === idx
                    ? "bg-[var(--ink-obsidian)] text-[var(--neon-teal)]"
                    : "border border-[var(--border-mineral)] bg-white text-[var(--ink-slate)]"
                }`}
              >
                {s.index} · {s.italicWord}
              </button>
            ))}
          </div>
        </div>

        {/* Sticky Stacking Cards (Native CSS position: sticky with safe offset) */}
        <div className="shell space-y-6">
          {architectureStrata.map((stratum, idx) => {
            const isOrange = stratum.accent === "orange";
            return (
              <article
                key={stratum.id}
                style={{ top: `${76 + idx * 14}px` }}
                className="sticky porcelain-card rounded-3xl p-6 shadow-[0_18px_40px_-18px_rgba(14,23,26,0.14)]"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 font-mono text-[10px] font-semibold uppercase ${
                      isOrange
                        ? "bg-[var(--orange-halo)] text-[var(--orange-lacquer)]"
                        : "bg-[var(--teal-mist)] text-[var(--teal-deep)]"
                    }`}
                  >
                    {stratum.eyebrow}
                  </span>
                  <span className="font-mono text-xs font-bold text-[var(--ink-muted)]">
                    {stratum.index}/04
                  </span>
                </div>
                <h3 className="mt-4 text-h3 font-bold text-[var(--ink-obsidian)]">
                  {stratum.title}{" "}
                  <span className="font-editorial italic font-normal">{stratum.italicWord}</span>
                </h3>
                <p className="mt-2.5 text-sm text-[var(--ink-slate)] leading-relaxed">
                  {stratum.summary}
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {stratum.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="rounded-2xl bg-[var(--bg-alabaster)] p-3 border border-[var(--border-mineral)]/70"
                    >
                      <div className="text-sm font-bold text-[var(--ink-obsidian)]">{m.value}</div>
                      <div className="text-[10px] font-mono text-[var(--ink-muted)]">{m.label}</div>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
