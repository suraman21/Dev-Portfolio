"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { projects } from "@/data/projects";
import { ProjectPreview } from "@/components/ui/ProjectPreview";
import { MagneticButton } from "@/components/ui/MagneticButton";

/** Distinct, bold color identity for every horizontal project slide */
const PROJECT_SLIDE_THEMES = [
  {
    // 01: Aether Cloud — Electric Teal Studio
    sectionBg: "#DCF9F3",
    cardBg: "linear-gradient(145deg, #ECFCF8 0%, #FFFFFF 100%)",
    borderClass: "border-2 border-[#00D2BC] shadow-[0_28px_65px_-24px_rgba(0,122,110,0.24)]",
    topBarClass: "from-[#00E5CC] to-[#009E8E]",
    badgeClass: "bg-[#006B60] text-[#EAFFFB]",
    resultBgClass: "bg-[#D9FAF3] border-[#00D2BC]/60",
    resultTextClass: "text-[#005C53]",
    buttonVariant: "teal" as const,
  },
  {
    // 02: Solstice Treasury — Vivid Neon Orange Studio
    sectionBg: "#FFE6D6",
    cardBg: "linear-gradient(145deg, #FFF3EB 0%, #FFFFFF 100%)",
    borderClass: "border-2 border-[#FF6B35] shadow-[0_28px_65px_-24px_rgba(201,57,4,0.24)]",
    topBarClass: "from-[#FF5A1F] to-[#FF8A3D]",
    badgeClass: "bg-[#C93904] text-[#FFF7F2]",
    resultBgClass: "bg-[#FFE7D9] border-[#FF6B35]/60",
    resultTextClass: "text-[#B83200]",
    buttonVariant: "primary" as const,
  },
  {
    // 03: Velour Maison — Warm Champagne Gold & Amber Studio
    sectionBg: "#FAECD1",
    cardBg: "linear-gradient(145deg, #FFF9EB 0%, #FFFFFF 100%)",
    borderClass: "border-2 border-[#E29A1B] shadow-[0_28px_65px_-24px_rgba(148,88,0,0.22)]",
    topBarClass: "from-[#F0A824] to-[#FF5A1F]",
    badgeClass: "bg-[#8C5200] text-[#FFFBF0]",
    resultBgClass: "bg-[#FCF0D4] border-[#E29A1B]/60",
    resultTextClass: "text-[#7A4700]",
    buttonVariant: "primary" as const,
  },
  {
    // 04: Kinetix Workspace — Electric Sky-Cobalt Studio
    sectionBg: "#DFEAFF",
    cardBg: "linear-gradient(145deg, #EEF4FF 0%, #FFFFFF 100%)",
    borderClass: "border-2 border-[#346EFF] shadow-[0_28px_65px_-24px_rgba(22,70,168,0.24)]",
    topBarClass: "from-[#2B6BFF] to-[#00E5CC]",
    badgeClass: "bg-[#173E99] text-[#F0F5FF]",
    resultBgClass: "bg-[#E2ECFF] border-[#346EFF]/55",
    resultTextClass: "text-[#14378A]",
    buttonVariant: "teal" as const,
  },
];

/**
 * VERTICAL-TO-HORIZONTAL PINNED SHOWCASE ("Selected Work")
 * - Desktop/Laptop (>=1024px): Scrolling down glides swiftly horizontally across
 *   4 distinctly color-themed projects (shifting the entire studio backdrop per slide)
 *   and resumes vertical scroll cleanly when finished.
 * - Mobile (<1024px): Native touch horizontal swipe carousel with the same bold colors.
 */
export function SelectedWorkReel() {
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const totalSlides = projects.length + 1;
  const activeSectionBg =
    activeIndex < PROJECT_SLIDE_THEMES.length
      ? PROJECT_SLIDE_THEMES[activeIndex].sectionBg
      : "#EFECE4";

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const stage = stageRef.current;
      const track = trackRef.current;
      if (!stage || !track) return;

      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      const horizontalTween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: stage,
          pin: true,
          scrub: 0.35,
          start: "top top",
          end: () => `+=${getDistance() * 0.88}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            setProgress(self.progress);
            setActiveIndex(
              Math.min(totalSlides - 1, Math.round(self.progress * (totalSlides - 1)))
            );
          },
        },
      });

      triggerRef.current = horizontalTween.scrollTrigger || null;
    });

    return () => {
      triggerRef.current = null;
      mm.revert();
    };
  }, [totalSlides]);

  const jumpToSlide = (idx: number) => {
    const bounded = Math.max(0, Math.min(totalSlides - 1, idx));
    setActiveIndex(bounded);
    if (triggerRef.current) {
      const st = triggerRef.current;
      const y = st.start + (bounded / (totalSlides - 1)) * (st.end - st.start);
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section
      id="selected-work"
      aria-label="Selected Work Showcase"
      className="relative transition-colors duration-300"
      style={{ backgroundColor: activeSectionBg }}
    >
      {/* DESKTOP / LAPTOP: Vertical-to-Horizontal Color-Shifting Showcase */}
      <div
        ref={stageRef}
        className="relative hidden lg:flex h-screen w-full flex-col justify-between overflow-hidden pt-24 pb-8"
      >
        {/* Clean Top Header + Progress Indicator */}
        <div className="shell flex items-end justify-between gap-6 z-20">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink-obsidian)]/70">
              Selected Work
            </span>
            <h2 className="mt-1 text-h3 font-bold text-[var(--ink-obsidian)]">
              Featured Products &amp;{" "}
              <span className="font-editorial italic font-normal text-[var(--orange-lacquer)]">
                Websites
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 rounded-full bg-white/85 backdrop-blur-md px-4 py-2 border border-black/10">
              <span className="font-mono text-xs font-bold text-[var(--ink-obsidian)]">
                0{Math.min(activeIndex + 1, totalSlides)} / 0{totalSlides}
              </span>
              <div className="h-1.5 w-32 overflow-hidden rounded-full bg-black/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--neon-teal)] to-[var(--neon-orange)] transition-[width] duration-75"
                  style={{ width: `${Math.max(12, progress * 100)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => jumpToSlide(activeIndex - 1)}
                disabled={activeIndex === 0}
                aria-label="Previous project"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/15 bg-white text-[var(--ink-obsidian)] hover:border-[var(--neon-teal)] disabled:opacity-35 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => jumpToSlide(activeIndex + 1)}
                disabled={activeIndex >= totalSlides - 1}
                aria-label="Next project"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/15 bg-white text-[var(--ink-obsidian)] hover:border-[var(--neon-orange)] disabled:opacity-35 cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Track (Each card has its own unmistakable color palette) */}
        <div
          ref={trackRef}
          className="flex flex-nowrap items-center gap-8 pl-[var(--safe-x)] pr-[12vw] my-auto will-change-transform"
        >
          {projects.map((project, idx) => {
            const theme = PROJECT_SLIDE_THEMES[idx % PROJECT_SLIDE_THEMES.length];
            return (
              <article
                key={project.slug}
                style={{ background: theme.cardBg }}
                className={`relative overflow-hidden flex h-[66vh] min-h-[450px] max-h-[600px] w-[76vw] max-w-[1080px] shrink-0 items-center rounded-[32px] p-8 xl:p-10 ${theme.borderClass}`}
              >
                {/* Bold Color Accent Top Strip */}
                <div
                  aria-hidden="true"
                  className={`absolute left-0 right-0 top-0 h-2 bg-gradient-to-r ${theme.topBarClass}`}
                />

                <div className="grid w-full grid-cols-12 gap-8 items-center">
                  {/* Left Plain-English Project Summary */}
                  <div className="col-span-6 space-y-5">
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3.5 py-1 text-xs font-bold ${theme.badgeClass}`}
                      >
                        {project.category}
                      </span>
                      <span className="text-xs font-semibold text-[var(--ink-slate)]">
                        {project.client} · {project.year}
                      </span>
                    </div>

                    <h3 className="text-h2 font-bold text-[var(--ink-obsidian)]">
                      {project.title}
                    </h3>

                    <p className="text-body text-[#2C3A40] max-w-[44ch]">{project.tagline}</p>

                    <div className={`rounded-2xl border px-4 py-3.5 ${theme.resultBgClass}`}>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--ink-obsidian)]/65">
                        Key Result
                      </div>
                      <div className={`mt-0.5 text-lg font-bold ${theme.resultTextClass}`}>
                        {project.keyResult}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {project.stack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-black/12 bg-white px-3 py-1 text-xs font-semibold text-[var(--ink-obsidian)]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="pt-1">
                      <MagneticButton href={`/work/${project.slug}`} variant={theme.buttonVariant}>
                        View Case Study <ArrowUpRight className="h-4 w-4" />
                      </MagneticButton>
                    </div>
                  </div>

                  {/* Right Realistic SaaS / Web Product UI Preview */}
                  <div className="col-span-6">
                    <ProjectPreview type={project.previewType} title={project.title} />
                  </div>
                </div>
              </article>
            );
          })}

          {/* Clean End-Cap Leading to Full Work Page */}
          <div className="flex h-[66vh] min-h-[450px] max-h-[600px] w-[42vw] max-w-[520px] shrink-0 flex-col justify-between rounded-[32px] border-2 border-[#00E5CC]/40 bg-[var(--ink-obsidian)] p-10 text-[#F7F5F0] shadow-[0_24px_60px_-20px_rgba(15,23,26,0.45)]">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--neon-teal)]">
                All Projects
              </span>
              <h3 className="mt-4 text-h2 font-bold">
                Want to see the full{" "}
                <span className="font-editorial italic font-normal text-[var(--neon-orange)]">
                  portfolio?
                </span>
              </h3>
              <p className="mt-4 text-sm text-white/70 leading-relaxed">
                Browse every shipped SaaS dashboard, luxury website, and design system with full
                outcomes and architecture notes.
              </p>
            </div>

            <div className="space-y-4">
              <MagneticButton href="/work" variant="primary">
                Browse All Work <ArrowRight className="h-4 w-4" />
              </MagneticButton>
              <div className="text-xs text-white/50">
                Keep scrolling to continue down the page ↓
              </div>
            </div>
          </div>
        </div>

        <div className="shell flex items-center justify-between text-xs font-medium text-[var(--ink-obsidian)]/70">
          <span>Scroll down to glide through color-coded project slides</span>
          <Link href="/work" className="font-bold text-[var(--ink-obsidian)] hover:underline">
            View all work →
          </Link>
        </div>
      </div>

      {/* MOBILE / TABLET: Smooth Native Touch Horizontal Swipe Carousel with Distinct Card Colors */}
      <div className="lg:hidden py-16 border-b border-[var(--border-mineral)] bg-[var(--surface-porcelain)]">
        <div className="shell mb-6 flex items-end justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--orange-lacquer)]">
              Selected Work
            </span>
            <h2 className="mt-1 text-h2 font-bold text-[var(--ink-obsidian)]">
              Featured{" "}
              <span className="font-editorial italic font-normal text-[var(--teal-deep)]">
                Projects
              </span>
            </h2>
          </div>
          <Link href="/work" className="text-xs font-semibold text-[var(--teal-deep)] underline">
            See All →
          </Link>
        </div>

        <div className="touch-reel gap-4 px-5 pb-4">
          {projects.map((project, idx) => {
            const theme = PROJECT_SLIDE_THEMES[idx % PROJECT_SLIDE_THEMES.length];
            return (
              <article
                key={project.slug}
                style={{ background: theme.cardBg }}
                className={`relative overflow-hidden w-[86vw] max-w-[420px] shrink-0 snap-center rounded-3xl p-5 flex flex-col justify-between gap-4 ${theme.borderClass}`}
              >
                <div
                  aria-hidden="true"
                  className={`absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r ${theme.topBarClass}`}
                />
                <div className="space-y-4 pt-1">
                  <ProjectPreview type={project.previewType} title={project.title} compact />
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className={`rounded-full px-2.5 py-0.5 font-bold ${theme.badgeClass}`}>
                        {project.category}
                      </span>
                      <span className="font-medium text-[var(--ink-slate)]">{project.year}</span>
                    </div>
                    <h3 className="mt-2 text-xl font-bold text-[var(--ink-obsidian)]">
                      {project.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-[#2C3A40]">{project.tagline}</p>
                  </div>
                </div>

                <div className="border-t border-black/10 pt-3.5">
                  <div className={`text-xs font-bold mb-3 ${theme.resultTextClass}`}>
                    {project.keyResult}
                  </div>
                  <Link
                    href={`/work/${project.slug}`}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[var(--ink-obsidian)] px-4 py-3 text-xs font-semibold text-[#F7F5F0]"
                  >
                    View Case Study <ArrowUpRight className="h-4 w-4 text-[var(--neon-teal)]" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="shell mt-1 text-xs text-[var(--ink-muted)]">← Swipe to browse projects →</div>
      </div>
    </section>
  );
}
