"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCms } from "@/components/cms/CmsProvider";
import { resolveProjectTheme } from "@/lib/project-theme";
import { ProjectMediaFrame } from "@/components/ui/ProjectMediaFrame";
import { MagneticButton } from "@/components/ui/MagneticButton";

/**
 * ADAPTIVE HORIZONTAL SHOWCASE ("Selected Work")
 *
 * - Desktop / Laptop (>=1024px + fine pointer): Crisp GSAP vertical-to-horizontal pinned
 *   showcase with `refreshPriority: 5` (strictly ordered after `HowIBuildDeck`'s `10` so
 *   adding 4, 5, 10+ slides above NEVER causes section overlap!).
 * - Mobile / Tablet / Touch (<1024px or coarse pointer): Pure GPU-accelerated native
 *   horizontal scroll-snap rail (`overflow-x: auto; scroll-snap-type: x mandatory; touch-action: pan-x pan-y`)
 *   so scrolling vertically up & down past the section is 100% effortless and instant while
 *   swiping horizontally glides smoothly 1 card at a time with live progress, dots, and arrows.
 */
export function SelectedWorkReel() {
  const { data } = useCms();
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const mobileRailRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const lastIndexRef = useRef(0);
  const scrollRafRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktopPinned, setIsDesktopPinned] = useState(false);

  const visibleProjects = useMemo(
    () => data.projects.filter((p) => p.published !== false && p.featured !== false),
    [data.projects]
  );

  const resolvedThemes = useMemo(
    () => visibleProjects.map((p) => resolveProjectTheme(p.theme)),
    [visibleProjects]
  );

  const totalSlides = visibleProjects.length + 1;
  const buildStepsCount = data.buildSteps.length;

  const activeSectionBg =
    activeIndex < resolvedThemes.length
      ? resolvedThemes[activeIndex].sectionBg
      : "#EFECE4";

  // Detect desktop fine-pointer vs mobile/touch cleanly on mount & resize
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const update = () => setIsDesktopPinned(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // DESKTOP: Vertical-to-Horizontal GSAP ScrollTrigger (only on >=1024px fine pointer)
  useEffect(() => {
    if (!isDesktopPinned) {
      triggerRef.current = null;
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const stage = stageRef.current;
      const track = trackRef.current;
      if (!stage || !track) return;

      const getDistance = () => Math.max(0, track.scrollWidth - stage.clientWidth);

      const horizontalTween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          id: "selected-work-reel",
          trigger: stage,
          pin: true,
          pinSpacing: true,
          refreshPriority: 5,
          scrub: 0.14,
          start: "top top",
          end: () => `+=${Math.max(320, getDistance() * 0.68)}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${Math.max(12, self.progress * 100)}%`;
            }
            const nextIdx = Math.min(
              totalSlides - 1,
              Math.round(self.progress * (totalSlides - 1))
            );
            if (nextIdx !== lastIndexRef.current) {
              lastIndexRef.current = nextIdx;
              setActiveIndex(nextIdx);
            }
          },
        },
      });

      triggerRef.current = horizontalTween.scrollTrigger || null;
    });

    // Re-sort and refresh after mount or slide-count changes in HowIBuildDeck above
    const rafId = window.requestAnimationFrame(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      triggerRef.current = null;
      mm.revert();
    };
  }, [isDesktopPinned, totalSlides, buildStepsCount]);

  // MOBILE / TOUCH: Native horizontal scroll progress tracking (zero scroll-hijack!)
  const handleMobileScroll = useCallback(() => {
    if (scrollRafRef.current !== null) return;
    scrollRafRef.current = window.requestAnimationFrame(() => {
      scrollRafRef.current = null;
      const rail = mobileRailRef.current;
      if (!rail) return;

      const maxScroll = Math.max(1, rail.scrollWidth - rail.clientWidth);
      const progress = Math.max(0, Math.min(1, rail.scrollLeft / maxScroll));

      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${Math.max(12, progress * 100)}%`;
      }

      // Determine nearest snapped card center cleanly
      const children = Array.from(rail.children) as HTMLElement[];
      const railCenter = rail.scrollLeft + rail.clientWidth / 2;
      let nearestIdx = 0;
      let nearestDist = Infinity;

      children.forEach((child, idx) => {
        const childCenter = child.offsetLeft + child.offsetWidth / 2;
        const dist = Math.abs(childCenter - railCenter);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestIdx = idx;
        }
      });

      if (nearestIdx !== lastIndexRef.current) {
        lastIndexRef.current = nearestIdx;
        setActiveIndex(nearestIdx);
      }
    });
  }, []);

  useEffect(() => {
    return () => {
      if (scrollRafRef.current !== null) {
        window.cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, []);

  const jumpToSlide = (idx: number) => {
    const bounded = Math.max(0, Math.min(totalSlides - 1, idx));
    lastIndexRef.current = bounded;
    setActiveIndex(bounded);

    if (isDesktopPinned && triggerRef.current && totalSlides > 1) {
      const st = triggerRef.current;
      const y = st.start + (bounded / (totalSlides - 1)) * (st.end - st.start);
      window.scrollTo({ top: y, behavior: "smooth" });
      return;
    }

    const rail = mobileRailRef.current;
    if (rail) {
      const targetChild = rail.children[bounded] as HTMLElement | undefined;
      if (targetChild) {
        const left = targetChild.offsetLeft - (rail.clientWidth - targetChild.offsetWidth) / 2;
        rail.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
      }
    }
  };

  const renderCards = (mobileSnap: boolean) => (
    <>
      {visibleProjects.map((project, idx) => {
        const theme = resolvedThemes[idx];
        return (
          <article
            key={project.id || project.slug}
            style={{
              background: theme.cardBg,
              borderColor: theme.cardBorder,
              boxShadow: theme.cardShadow,
            }}
            className={`relative flex shrink-0 overflow-hidden rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] border-2 p-4 sm:p-6 lg:p-9 xl:p-10 ${
              mobileSnap
                ? "snap-center snap-always w-[86vw] max-w-[420px] sm:w-[78vw] sm:max-w-[580px]"
                : "w-[76vw] max-w-[1080px]"
            }`}
          >
            {/* Dynamic Per-Project Top Color Bar */}
            <div
              aria-hidden="true"
              className="absolute left-0 right-0 top-0 h-1.5 sm:h-2"
              style={{ background: theme.topBarGradient }}
            />

            <div className="flex w-full flex-col gap-3.5 sm:gap-5 pt-1 lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center">
              {/* Product Image Showcase */}
              <div className="w-full lg:order-2 lg:col-span-6">
                <ProjectMediaFrame
                  media={project.media}
                  theme={project.theme}
                  title={project.title}
                  compact
                  priority={idx === 0}
                />
              </div>

              {/* Plain-English Project Summary */}
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
      <div
        className={`flex shrink-0 flex-col justify-between gap-6 rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] border-2 border-[#00E5CC]/40 bg-[var(--ink-obsidian)] p-6 sm:p-8 lg:p-10 text-[#F7F5F0] shadow-[0_24px_60px_-20px_rgba(15,23,26,0.45)] ${
          mobileSnap
            ? "snap-center snap-always w-[84vw] max-w-[380px] sm:w-[70vw] sm:max-w-[480px]"
            : "w-[42vw] max-w-[520px]"
        }`}
      >
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
            {mobileSnap ? "Scroll down anytime to continue ↓" : "Keep scrolling down to continue ↓"}
          </div>
        </div>
      </div>
    </>
  );

  const currentStr = String(Math.min(activeIndex + 1, totalSlides)).padStart(2, "0");
  const totalStr = String(totalSlides).padStart(2, "0");

  return (
    <section
      id="selected-work"
      aria-label="Selected Work Showcase"
      className="relative z-20 isolate transition-colors duration-300"
      style={{ backgroundColor: activeSectionBg }}
    >
      {/* DESKTOP (>=1024px fine pointer): Pinned Vertical-to-Horizontal Showcase */}
      {isDesktopPinned ? (
        <div
          ref={stageRef}
          className="relative flex h-[100svh] min-h-[600px] w-full flex-col justify-between overflow-hidden pt-24 pb-8"
        >
          <div className="shell z-20 flex items-center justify-between gap-6">
            <div className="min-w-0">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink-obsidian)]/70">
                {data.site.workReelEyebrow || "Selected Work"}
              </span>
              <h2 className="mt-0.5 text-h3 font-bold text-[var(--ink-obsidian)] leading-tight truncate">
                {data.site.workReelHeadline || "Featured"}{" "}
                <span className="font-editorial italic font-normal text-[var(--orange-lacquer)]">
                  {data.site.workReelHighlight || "Products"}
                </span>
              </h2>
            </div>

            <div className="flex shrink-0 items-center gap-3.5">
              <div className="flex items-center gap-3 rounded-full bg-white/88 backdrop-blur-md px-4 py-2 border border-black/10">
                <span className="font-mono text-xs font-bold text-[var(--ink-obsidian)]">
                  {currentStr} / {totalStr}
                </span>
                <div className="h-1.5 w-28 overflow-hidden rounded-full bg-black/10">
                  <div
                    ref={progressBarRef}
                    className="h-full rounded-full bg-gradient-to-r from-[var(--neon-teal)] to-[var(--neon-orange)]"
                    style={{ width: "12%" }}
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

          <div
            ref={trackRef}
            className="my-auto flex flex-nowrap items-center gap-8 pl-[var(--safe-x)] pr-[12vw] will-change-transform"
          >
            {renderCards(false)}
          </div>

          <div className="shell flex items-center justify-between text-xs font-medium text-[var(--ink-obsidian)]/70">
            <span>Scroll down to slide across projects</span>
            <Link href="/work" className="font-bold text-[var(--ink-obsidian)] hover:underline">
              View all →
            </Link>
          </div>
        </div>
      ) : (
        /* MOBILE & TOUCH: Pure Native Horizontal Scroll-Snap Rail (Zero Vertical Scroll Struggle!) */
        <div className="py-14 sm:py-16 space-y-6">
          <div className="shell flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[var(--ink-obsidian)]/70">
                {data.site.workReelEyebrow || "Selected Work"}
              </span>
              <h2 className="mt-0.5 text-xl sm:text-2xl font-bold text-[var(--ink-obsidian)] leading-tight truncate">
                {data.site.workReelHeadline || "Featured"}{" "}
                <span className="font-editorial italic font-normal text-[var(--orange-lacquer)]">
                  {data.site.workReelHighlight || "Products"}
                </span>
              </h2>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <div className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 border border-black/10">
                <span className="font-mono text-[11px] font-bold text-[var(--ink-obsidian)]">
                  {currentStr} / {totalStr}
                </span>
                <div className="h-1.5 w-12 sm:w-20 overflow-hidden rounded-full bg-black/10">
                  <div
                    ref={progressBarRef}
                    className="h-full rounded-full bg-gradient-to-r from-[var(--neon-teal)] to-[var(--neon-orange)] transition-[width] duration-150"
                    style={{ width: `${Math.max(12, ((activeIndex + 1) / totalSlides) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => jumpToSlide(activeIndex - 1)}
                  disabled={activeIndex === 0}
                  aria-label="Previous project"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-black/15 bg-white text-[var(--ink-obsidian)] disabled:opacity-35 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => jumpToSlide(activeIndex + 1)}
                  disabled={activeIndex >= totalSlides - 1}
                  aria-label="Next project"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-black/15 bg-white text-[var(--ink-obsidian)] disabled:opacity-35 cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Native Touch-Friendly Horizontal Scroll-Snap Track */}
          <div
            ref={mobileRailRef}
            onScroll={handleMobileScroll}
            className="touch-reel items-stretch gap-4 sm:gap-5 px-[var(--safe-x)] pb-2"
          >
            {renderCards(true)}
          </div>

          {/* Interactive Snap Dots + View All Link */}
          <div className="shell flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => jumpToSlide(idx)}
                  aria-label={`View slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-200 cursor-pointer ${
                    idx === activeIndex
                      ? "w-7 bg-[var(--ink-obsidian)]"
                      : "w-2 bg-[var(--ink-obsidian)]/25"
                  }`}
                />
              ))}
            </div>

            <Link
              href="/work"
              className="text-xs font-bold text-[var(--ink-obsidian)] hover:underline"
            >
              Swipe cards · View all →
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
