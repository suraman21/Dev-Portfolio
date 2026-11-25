"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Film,
} from "lucide-react";
import { projects } from "@/data/projects";
import { SceneCanvas } from "@/components/3d/SceneCanvas";
import { ProjectArtifact3D } from "@/components/3d/ProjectArtifact3D";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useCinema } from "./CinemaProvider";
import { foley } from "@/lib/sound";

/**
 * ACT III — VERTICAL-TO-HORIZONTAL PINNED FILM REEL
 * - Desktop/Laptop (>=1024px): ScrollTrigger pins outer wrapper and translates
 *   inner track horizontally with `ease: "none"` (exact 1:1 scroll sync), nested
 *   `containerAnimation` card reveals, peeking next-slide continuity cue, live
 *   progress scrubber, and seamless return to vertical scroll when finished!
 * - Mobile (<1024px): Native touch swipe carousel (`scroll-snap-type: x mandatory`)
 *   with `84vw` peeking cards + thumb prev/next controls!
 * - 4K / TV Mode: ArrowLeft / ArrowRight focus-driven horizontal film showcase!
 */
export function HorizontalReelStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const mobileRailRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const { tvMode, soundEnabled, setCursorLabel, scrollRef } = useCinema();

  const totalPanels = projects.length + 1; // 4 feature films + 1 Archive End-Cap

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (tvMode) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const stage = stageRef.current;
      const track = trackRef.current;
      if (!stage || !track) return;

      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      const horizontalTween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none", // Mandatory 1:1 sync for vertical-to-horizontal scroll
        scrollTrigger: {
          trigger: stage,
          pin: true,
          scrub: 0.82,
          start: "top top",
          end: () => `+=${getDistance()}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            scrollRef.current.horizontalProgress = self.progress;
            setProgress(self.progress);
            const idx = Math.min(
              totalPanels - 1,
              Math.round(self.progress * (totalPanels - 1))
            );
            setActiveSlide(idx);
          },
        },
      });

      triggerRef.current = horizontalTween.scrollTrigger || null;

      // Nested per-panel motion driven by horizontal movement (containerAnimation)
      const panels = gsap.utils.toArray<HTMLElement>(".reel-panel", track);
      panels.forEach((panel, i) => {
        if (i === 0) return;
        const inner = panel.querySelector(".reel-panel-reveal");
        if (!inner) return;
        gsap.fromTo(
          inner,
          { y: 28, opacity: 0.35 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: "power3.out",
            scrollTrigger: {
              containerAnimation: horizontalTween,
              trigger: panel,
              start: "left 85%",
              end: "left 45%",
              scrub: true,
            },
          }
        );
      });
    });

    return () => {
      triggerRef.current = null;
      mm.revert();
    };
  }, [tvMode, totalPanels, scrollRef]);

  const jumpToPanel = (index: number) => {
    foley.playDetent(soundEnabled);
    const bounded = Math.max(0, Math.min(totalPanels - 1, index));
    setActiveSlide(bounded);

    if (tvMode) return;

    if (triggerRef.current) {
      const st = triggerRef.current;
      const targetY = st.start + (bounded / (totalPanels - 1)) * (st.end - st.start);
      window.scrollTo({ top: targetY, behavior: "smooth" });
    } else if (mobileRailRef.current) {
      const cardWidth = mobileRailRef.current.clientWidth * 0.86;
      mobileRailRef.current.scrollTo({ left: bounded * cardWidth, behavior: "smooth" });
    }
  };

  const skipReel = () => {
    foley.playDetent(soundEnabled);
    const next = document.getElementById("act-4");
    if (next) next.scrollIntoView({ behavior: "smooth" });
  };

  // TV Mode: Focus-Driven Horizontal Carousel
  if (tvMode) {
    const project = projects[Math.min(activeSlide, projects.length - 1)];
    return (
      <section
        id="act-3"
        aria-label="Act III Feature Films TV Carousel"
        className="relative min-h-[100svh] bg-[var(--surface-porcelain)] py-16 flex items-center"
      >
        <div className="shell">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="font-mono-tech text-[var(--orange-lacquer)]">
                ACT 03 · FEATURE CASE STUDIES ({project.filmNumber} / 04)
              </span>
              <h2 className="mt-2 text-h2 font-bold text-[var(--ink-obsidian)]">
                {project.title}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                data-tv-focus="true"
                onClick={() => jumpToPanel(activeSlide - 1)}
                disabled={activeSlide === 0}
                className="rounded-full border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-5 py-3 text-sm font-semibold disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="inline h-5 w-5" /> Prev Film
              </button>
              <button
                data-tv-focus="true"
                onClick={() => jumpToPanel(Math.min(projects.length - 1, activeSlide + 1))}
                disabled={activeSlide >= projects.length - 1}
                className="rounded-full bg-[var(--neon-orange)] px-5 py-3 text-sm font-bold text-[#0E171A] disabled:opacity-40 cursor-pointer"
              >
                Next Film <ChevronRight className="inline h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="porcelain-card grid grid-cols-12 gap-10 rounded-[36px] p-10 items-center">
            <div className="col-span-6 space-y-5">
              <div className="inline-flex rounded-full bg-[var(--teal-mist)] px-4 py-1.5 font-mono text-xs font-bold text-[var(--teal-deep)]">
                {project.headlineMetric}
              </div>
              <p className="text-body-lg text-[var(--ink-slate)]">{project.summary}</p>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-1.5 font-mono text-xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="pt-2">
                <MagneticButton href={`/work/${project.slug}`} variant="primary">
                  Open Full Case Study <ArrowUpRight className="h-5 w-5" />
                </MagneticButton>
              </div>
            </div>
            <div className="col-span-6 h-[460px] rounded-3xl bg-[var(--bg-alabaster)] overflow-hidden border border-[var(--border-mineral)]">
              <SceneCanvas cameraPosition={[0, 0.2, 4.4]} fallbackLabel={project.title}>
                <ProjectArtifact3D variant={project.artifact} />
              </SceneCanvas>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="act-3"
      aria-label="Act III — Selected Case Studies Horizontal Film Reel"
      className="relative bg-[var(--surface-porcelain)]"
    >
      {/* ============================================================
          DESKTOP / LAPTOP (>=1024px): VERTICAL-TO-HORIZONTAL PINNED REEL
         ============================================================ */}
      <div
        ref={stageRef}
        className="relative hidden lg:flex h-screen w-full flex-col justify-between overflow-hidden pt-[84px] pb-7"
      >
        {/* Top Reel Header & Live Progress Scrubber */}
        <div className="shell flex items-center justify-between gap-6 z-20">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--orange-halo)] border border-[var(--neon-orange)]/35 px-3.5 py-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-widest text-[var(--orange-lacquer)]">
              <Film className="h-3.5 w-3.5" />
              ACT 03 · FEATURE FILMS
            </span>
            <span className="font-mono text-xs text-[var(--ink-muted)]">
              SCROLL DOWN TO GLIDE HORIZONTALLY →
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Horizontal Progress Track (Goal-Gradient Effect #48) */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-[var(--ink-obsidian)]">
                0{Math.min(activeSlide + 1, totalPanels)} / 0{totalPanels}
              </span>
              <div className="relative h-1.5 w-36 overflow-hidden rounded-full bg-[var(--surface-stone-deep)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--neon-teal)] to-[var(--neon-orange)] transition-[width] duration-75"
                  style={{ width: `${Math.max(8, progress * 100)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => jumpToPanel(activeSlide - 1)}
                disabled={activeSlide === 0}
                aria-label="Previous case study"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-mineral)] bg-white text-[var(--ink-obsidian)] hover:border-[var(--neon-teal)] disabled:opacity-35 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => jumpToPanel(activeSlide + 1)}
                disabled={activeSlide >= totalPanels - 1}
                aria-label="Next case study"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-mineral)] bg-white text-[var(--ink-obsidian)] hover:border-[var(--neon-orange)] disabled:opacity-35 cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={skipReel}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-1.5 font-mono text-[10.5px] uppercase tracking-wider text-[var(--ink-slate)] hover:border-[var(--neon-orange)] hover:text-[var(--ink-obsidian)] cursor-pointer"
            >
              Skip Reel <ArrowDown className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Horizontal Sliding Track (Panels intentionally 78vw so next film peeks — Law of Continuity #30) */}
        <div
          ref={trackRef}
          className="flex flex-nowrap items-center gap-8 pl-[var(--safe-x)] pr-[12vw] will-change-transform my-auto"
        >
          {projects.map((project) => {
            const isOrange = project.accent === "orange";
            return (
              <article
                key={project.slug}
                onMouseEnter={() => setCursorLabel("VIEW FILM")}
                onMouseLeave={() => setCursorLabel(null)}
                className="reel-panel porcelain-card dichroic-ring relative flex h-[70vh] min-h-[470px] max-h-[640px] w-[78vw] max-w-[1140px] shrink-0 overflow-hidden rounded-[34px] p-8 xl:p-10"
              >
                <div className="reel-panel-reveal grid h-full w-full grid-cols-12 gap-8 items-center">
                  {/* Left Film Dossier */}
                  <div className="col-span-7 flex h-full flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono text-xs font-bold tracking-widest text-[var(--ink-muted)]">
                          FILM {project.filmNumber}
                        </span>
                        <span className="h-3 w-px bg-[var(--border-mineral)]" />
                        <span
                          className={`rounded-full px-3 py-1 font-mono text-[10.5px] font-semibold uppercase ${
                            isOrange
                              ? "bg-[var(--orange-halo)] text-[var(--orange-lacquer)]"
                              : "bg-[var(--teal-mist)] text-[var(--teal-deep)]"
                          }`}
                        >
                          {project.category}
                        </span>
                        <span className="font-mono text-[11px] text-[var(--ink-muted)]">
                          {project.year}
                        </span>
                      </div>

                      <h3 className="mt-4 text-h2 font-bold text-[var(--ink-obsidian)]">
                        {project.title}
                      </h3>

                      <p className="mt-3 max-w-[50ch] text-body text-[var(--ink-slate)]">
                        {project.oneLiner}
                      </p>
                    </div>

                    {/* Headline Quantified Metric Banner */}
                    <div className="my-4 rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)]/85 p-4">
                      <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--ink-muted)]">
                        VERIFIED PRODUCTION IMPACT
                      </div>
                      <div
                        className={`mt-1 text-xl xl:text-2xl font-bold tracking-tight ${
                          isOrange ? "text-[var(--orange-lacquer)]" : "text-[var(--teal-deep)]"
                        }`}
                      >
                        {project.headlineMetric}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {project.stack.slice(0, 5).map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-[var(--border-mineral)] bg-white px-3 py-1 font-mono text-[10.5px] text-[var(--ink-slate)]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <MagneticButton
                          href={`/work/${project.slug}`}
                          variant={isOrange ? "primary" : "teal"}
                          cursorText="OPEN CASE"
                        >
                          Enter Case Study <ArrowUpRight className="h-4 w-4" />
                        </MagneticButton>
                        <span className="font-mono text-[11px] text-[var(--ink-muted)]">
                          {project.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Bespoke 3D Museum Artifact */}
                  <div className="col-span-5 h-full">
                    <div
                      onMouseEnter={(e) => {
                        e.stopPropagation();
                        setCursorLabel("DRAG 3D");
                      }}
                      onMouseLeave={() => setCursorLabel("VIEW FILM")}
                      className="relative h-full w-full overflow-hidden rounded-[26px] border border-[var(--border-mineral)] sunlit-aura"
                    >
                      <SceneCanvas
                        cameraPosition={[0, 0.25, 4.4]}
                        fov={38}
                        fallbackLabel={project.title}
                      >
                        <ProjectArtifact3D variant={project.artifact} />
                      </SceneCanvas>
                      <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-white/85 px-3 py-2 backdrop-blur-md border border-[var(--border-mineral)]/80">
                        <span className="font-mono text-[10px] text-[var(--ink-obsidian)]">
                          ARTIFACT · {project.artifact.toUpperCase()}
                        </span>
                        <span className="font-mono text-[10px] text-[var(--teal-deep)]">
                          INTERACTIVE 3D
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          {/* Final Horizontal Reel End-Cap -> Full Archive */}
          <div className="reel-panel obsidian-island flex h-[70vh] min-h-[470px] max-h-[640px] w-[48vw] max-w-[620px] shrink-0 flex-col justify-between rounded-[34px] p-10">
            <div>
              <span className="font-mono-tech text-[10.5px] text-[var(--neon-teal)]">
                END OF REEL · CONTINUING VERTICAL ↓
              </span>
              <h3 className="mt-4 text-h2 font-bold text-[#F7F5F0]">
                Explore the Full{" "}
                <span className="font-editorial italic font-normal text-[var(--neon-orange)]">
                  Filmography
                </span>
              </h3>
              <p className="mt-4 text-sm text-white/70 leading-relaxed max-w-md">
                Filter all shipped SaaS architectures, 3D WebGL flagships, and systems deep dives
                with full trade-off matrices and postmortem outcomes.
              </p>
            </div>

            <div className="space-y-4">
              <MagneticButton href="/work" variant="primary" cursorText="ARCHIVE">
                Open Work Archive <ArrowRight className="h-4 w-4" />
              </MagneticButton>
              <div className="font-mono text-[11px] text-white/45">
                KEEP SCROLLING TO ENTER ACT 04 · LIVING ATELIER ↓
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Subtle Chapter Dots */}
        <div className="shell flex items-center justify-between text-[11px] font-mono text-[var(--ink-muted)]">
          <span>SWIPE OR SCROLL · 1:1 PINNED CONTINUITY</span>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPanels }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => jumpToPanel(idx)}
                aria-label={`Jump to horizontal panel ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === activeSlide
                    ? "w-8 bg-[var(--neon-orange)]"
                    : "w-2 bg-[var(--border-mineral)] hover:bg-[var(--teal-deep)]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================
          MOBILE / TABLET (<1024px): NATIVE TOUCH HORIZONTAL SWIPE RAIL
          (Zero vertical scroll hijacking; Law of Continuity peeking cards)
         ============================================================ */}
      <div className="lg:hidden py-16 border-b border-[var(--border-mineral)]">
        <div className="shell mb-6 flex items-end justify-between gap-4">
          <div>
            <span className="font-mono-tech text-[10.5px] text-[var(--orange-lacquer)]">
              ACT 03 · FEATURE FILMS
            </span>
            <h2 className="mt-2 text-h2 font-bold text-[var(--ink-obsidian)]">
              Selected{" "}
              <span className="font-editorial italic font-normal text-[var(--teal-deep)]">
                Case Studies
              </span>
            </h2>
          </div>
          <Link
            href="/work"
            className="shrink-0 font-mono text-xs text-[var(--teal-deep)] underline underline-offset-4"
          >
            All Work →
          </Link>
        </div>

        <div
          ref={mobileRailRef}
          className="touch-reel gap-4 px-5 pb-4"
        >
          {projects.map((project) => {
            const isOrange = project.accent === "orange";
            return (
              <article
                key={project.slug}
                className="porcelain-card w-[85vw] max-w-[420px] shrink-0 snap-center rounded-3xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="h-[200px] w-full overflow-hidden rounded-2xl border border-[var(--border-mineral)] sunlit-aura">
                    <SceneCanvas
                      cameraPosition={[0, 0.2, 4.6]}
                      fallbackLabel={project.title}
                    >
                      <ProjectArtifact3D variant={project.artifact} interactive={false} />
                    </SceneCanvas>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase ${
                        isOrange
                          ? "bg-[var(--orange-halo)] text-[var(--orange-lacquer)]"
                          : "bg-[var(--teal-mist)] text-[var(--teal-deep)]"
                      }`}
                    >
                      {project.filmNumber} · {project.category}
                    </span>
                    <span className="font-mono text-[10.5px] text-[var(--ink-muted)]">
                      {project.year}
                    </span>
                  </div>

                  <h3 className="mt-3 text-xl font-bold text-[var(--ink-obsidian)]">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--ink-slate)] leading-relaxed">
                    {project.oneLiner}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-[var(--border-mineral)]">
                  <div
                    className={`font-mono text-xs font-bold mb-3 ${
                      isOrange ? "text-[var(--orange-lacquer)]" : "text-[var(--teal-deep)]"
                    }`}
                  >
                    {project.headlineMetric}
                  </div>
                  <Link
                    href={`/work/${project.slug}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--ink-obsidian)] px-4 py-3 text-xs font-semibold text-[#F7F5F0]"
                  >
                    Enter Case Study <ArrowUpRight className="h-4 w-4 text-[var(--neon-teal)]" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="shell mt-2 flex items-center justify-between font-mono text-[10.5px] text-[var(--ink-muted)]">
          <span>← SWIPE HORIZONTALLY →</span>
          <span>4 FEATURED WORKS</span>
        </div>
      </div>
    </section>
  );
}
