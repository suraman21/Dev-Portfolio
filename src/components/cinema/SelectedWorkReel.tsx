"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCms } from "@/components/cms/CmsProvider";
import { resolveProjectTheme } from "@/lib/project-theme";
import { ProjectMediaFrame } from "@/components/ui/ProjectMediaFrame";
import { MagneticButton } from "@/components/ui/MagneticButton";

/**
 * UNIFIED RESPONSIVE VERTICAL-TO-HORIZONTAL PINNED SHOWCASE ("Selected Work")
 *
 * Works identically on Mobile, Tablet, Laptop, Desktop, and 4K:
 * - Scrolling vertically pins the stage cleanly at `100svh` (with `ignoreMobileResize: true`
 *   so mobile browser address bars never cause pin jumps) and glides projects horizontally.
 * - When the last card finishes, normal vertical scrolling resumes seamlessly.
 * - Every slide's colors, contrast, and product image frame are driven dynamically by
 *   each project's self-contained CMS `theme` + `media` config (zero hardcoded index colors).
 */
export function SelectedWorkReel() {
  const { data } = useCms();
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const visibleProjects = useMemo(
    () => data.projects.filter((p) => p.published !== false && p.featured !== false),
    [data.projects]
  );

  const resolvedThemes = useMemo(
    () => visibleProjects.map((p) => resolveProjectTheme(p.theme)),
    [visibleProjects]
  );

  const totalSlides = visibleProjects.length + 1;

  const activeSectionBg =
    activeIndex < resolvedThemes.length
      ? resolvedThemes[activeIndex].sectionBg
      : "#EFECE4";

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const stage = stageRef.current;
      const track = trackRef.current;
      if (!stage || !track) return;

      const getDistance = () => Math.max(0, track.scrollWidth - stage.clientWidth);

      const horizontalTween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: stage,
          pin: true,
          scrub: 0.35,
          start: "top top",
          end: () => {
            const dist = getDistance();
            const isMobile = window.innerWidth < 768;
            // Slightly tighter scroll travel on phones so thumb scrolling feels natural & swift
            return `+=${Math.max(320, dist * (isMobile ? 0.72 : 0.88))}`;
          },
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
      {/* UNIFIED PINNED VERTICAL-TO-HORIZONTAL STAGE (Mobile + Tablet + Desktop + 4K) */}
      <div
        ref={stageRef}
        className="relative flex h-[100svh] min-h-[580px] w-full flex-col justify-between overflow-hidden pt-[74px] pb-[78px] md:pt-[92px] md:pb-8 lg:pt-24"
      >
        {/* Responsive Top Header + Progress + Prev/Next Controls */}
        <div className="shell z-20 flex items-center justify-between gap-3 sm:gap-6">
          <div className="min-w-0">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[var(--ink-obsidian)]/70">
              {data.site.workReelEyebrow || "Selected Work"}
            </span>
            <h2 className="mt-0.5 text-lg sm:text-2xl lg:text-h3 font-bold text-[var(--ink-obsidian)] leading-tight truncate">
              {data.site.workReelHeadline || "Featured"}{" "}
              <span className="font-editorial italic font-normal text-[var(--orange-lacquer)]">
                {data.site.workReelHighlight || "Products"}
              </span>
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3.5">
            <div className="flex items-center gap-2 sm:gap-3 rounded-full bg-white/88 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 border border-black/10">
              <span className="font-mono text-[11px] sm:text-xs font-bold text-[var(--ink-obsidian)]">
                0{Math.min(activeIndex + 1, totalSlides)} / 0{totalSlides}
              </span>
              <div className="h-1.5 w-14 sm:w-28 overflow-hidden rounded-full bg-black/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--neon-teal)] to-[var(--neon-orange)] transition-[width] duration-75"
                  style={{ width: `${Math.max(12, progress * 100)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                type="button"
                onClick={() => jumpToSlide(activeIndex - 1)}
                disabled={activeIndex === 0}
                aria-label="Previous project"
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-black/15 bg-white text-[var(--ink-obsidian)] hover:border-[var(--neon-teal)] disabled:opacity-35 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => jumpToSlide(activeIndex + 1)}
                disabled={activeIndex >= totalSlides - 1}
                aria-label="Next project"
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-black/15 bg-white text-[var(--ink-obsidian)] hover:border-[var(--neon-orange)] disabled:opacity-35 cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Track — Zero-Distortion Cards Across Every Screen Size */}
        <div
          ref={trackRef}
          className="my-auto flex flex-nowrap items-center gap-4 sm:gap-6 lg:gap-8 pl-[var(--safe-x)] pr-[8vw] lg:pr-[12vw] will-change-transform"
        >
          {visibleProjects.map((project, idx) => {
            const theme = resolvedThemes[idx];
            return (
              <article
                key={project.slug}
                style={{
                  background: theme.cardBg,
                  borderColor: theme.cardBorder,
                  boxShadow: theme.cardShadow,
                }}
                className="relative flex w-[88vw] max-w-[400px] sm:w-[82vw] sm:max-w-[600px] lg:w-[76vw] lg:max-w-[1080px] shrink-0 overflow-hidden rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] border-2 p-4 sm:p-6 lg:p-9 xl:p-10"
              >
                {/* Dynamic Per-Project Top Color Bar */}
                <div
                  aria-hidden="true"
                  className="absolute left-0 right-0 top-0 h-1.5 sm:h-2"
                  style={{ background: theme.topBarGradient }}
                />

                {/* Responsive Layout: Clean Vertical Stack on Mobile/Tablet -> 12-Col Split on Desktop */}
                <div className="flex w-full flex-col gap-3.5 sm:gap-5 pt-1 lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center">
                  {/* Product Image Showcase (Top on Mobile, Right on Desktop — Locked 16:10, Zero Distortion) */}
                  <div className="w-full lg:order-2 lg:col-span-6">
                    <ProjectMediaFrame
                      media={project.media}
                      theme={project.theme}
                      title={project.title}
                      compact
                      priority={idx === 0}
                    />
                  </div>

                  {/* Plain-English Project Summary (Bottom on Mobile, Left on Desktop) */}
                  <div className="flex flex-col justify-between gap-2.5 sm:gap-4 lg:order-1 lg:col-span-6">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span
                        className="rounded-full px-2.5 py-0.5 sm:px-3.5 sm:py-1 text-[11px] sm:text-xs font-bold"
                        style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}
                      >
                        {project.category}
                      </span>
                      <span
                        className="text-[11px] sm:text-xs font-semibold truncate"
                        style={{ color: theme.mutedColor }}
                      >
                        {project.client} · {project.year}
                      </span>
                    </div>

                    <h3
                      className="text-xl sm:text-2xl lg:text-h2 font-bold leading-tight"
                      style={{ color: theme.titleColor }}
                    >
                      {project.title}
                    </h3>

                    <p
                      className="text-xs sm:text-sm lg:text-body leading-relaxed line-clamp-2 lg:line-clamp-none max-w-[44ch]"
                      style={{ color: theme.bodyColor }}
                    >
                      {project.tagline}
                    </p>

                    <div
                      className="rounded-xl sm:rounded-2xl border px-3 py-2 sm:px-4 sm:py-3"
                      style={{
                        backgroundColor: theme.resultBg,
                        borderColor: theme.resultBorder,
                      }}
                    >
                      <div
                        className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider"
                        style={{ color: theme.resultLabelColor }}
                      >
                        Key Result
                      </div>
                      <div
                        className="mt-0.5 text-xs sm:text-base lg:text-lg font-bold leading-snug"
                        style={{ color: theme.accentInk }}
                      >
                        {project.keyResult}
                      </div>
                    </div>

                    {/* Tech Chips: visible on tablet/desktop so mobile stays ultra-clean and uncluttered */}
                    <div className="hidden sm:flex flex-wrap gap-1.5 lg:gap-2">
                      {project.stack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border px-3 py-1 text-xs font-semibold"
                          style={{
                            backgroundColor: theme.chipBg,
                            borderColor: theme.chipBorder,
                            color: theme.chipText,
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="pt-0.5">
                      <Link
                        href={`/work/${project.slug}`}
                        style={{ backgroundColor: theme.ctaBg, color: theme.ctaText }}
                        className="inline-flex w-full sm:w-auto min-h-[42px] sm:min-h-[46px] items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <span>View Case Study</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          {/* Responsive End-Cap Card Leading to Full Portfolio Index */}
          <div className="flex w-[84vw] max-w-[380px] sm:w-[70vw] sm:max-w-[480px] lg:w-[42vw] lg:max-w-[520px] shrink-0 flex-col justify-between gap-6 rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] border-2 border-[#00E5CC]/40 bg-[var(--ink-obsidian)] p-6 sm:p-8 lg:p-10 text-[#F7F5F0] shadow-[0_24px_60px_-20px_rgba(15,23,26,0.45)]">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--neon-teal)]">
                {data.site.workReelEndEyebrow || "All Projects"}
              </span>
              <h3 className="mt-3 text-2xl sm:text-3xl lg:text-h2 font-bold leading-tight">
                {data.site.workReelEndHeadline || "Want to see the full"}{" "}
                <span className="font-editorial italic font-normal text-[var(--neon-orange)]">
                  {data.site.workReelEndHighlight || "portfolio?"}
                </span>
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-white/75 leading-relaxed">
                {data.site.workReelEndDescription ||
                  "Browse every shipped SaaS dashboard, luxury website, and design system with real product imagery and engineering breakdowns."}
              </p>
            </div>

            <div className="space-y-3">
              <MagneticButton href="/work" variant="primary" className="w-full sm:w-auto">
                {data.site.workReelEndCta || "Browse All Work"} <ArrowRight className="h-4 w-4" />
              </MagneticButton>
              <div className="text-[11px] sm:text-xs text-white/55">
                Keep scrolling down to continue ↓
              </div>
            </div>
          </div>
        </div>

        {/* Clean Bottom Status Bar */}
        <div className="shell flex items-center justify-between text-[11px] sm:text-xs font-medium text-[var(--ink-obsidian)]/70">
          <span>Scroll down to slide across projects</span>
          <Link href="/work" className="font-bold text-[var(--ink-obsidian)] hover:underline">
            View all →
          </Link>
        </div>
      </div>
    </section>
  );
}
