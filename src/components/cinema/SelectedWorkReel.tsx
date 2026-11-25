"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { projects } from "@/data/projects";
import { ProjectPreview } from "@/components/ui/ProjectPreview";
import { MagneticButton } from "@/components/ui/MagneticButton";

/**
 * VERTICAL-TO-HORIZONTAL PINNED SHOWCASE ("Selected Work")
 * - Desktop/Laptop (>=1024px): Scrolling down glides smoothly horizontally across
 *   all 4 featured projects (with realistic UI previews) and resumes vertical
 *   scrolling automatically when finished.
 * - Mobile (<1024px): Native touch horizontal swipe carousel with peeking cards.
 */
export function SelectedWorkReel() {
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const totalSlides = projects.length + 1;

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
          scrub: 0.78,
          start: "top top",
          end: () => `+=${getDistance()}`,
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
      className="relative bg-[var(--surface-porcelain)]"
    >
      {/* DESKTOP / LAPTOP: Vertical-to-Horizontal Smooth Scroll Showcase */}
      <div
        ref={stageRef}
        className="relative hidden lg:flex h-screen w-full flex-col justify-between overflow-hidden pt-24 pb-8"
      >
        {/* Clean Top Header + Progress Indicator */}
        <div className="shell flex items-end justify-between gap-6 z-20">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--orange-lacquer)]">
              Selected Work
            </span>
            <h2 className="mt-1 text-h3 font-bold text-[var(--ink-obsidian)]">
              Featured Products &amp;{" "}
              <span className="font-editorial italic font-normal text-[var(--teal-deep)]">
                Websites
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold text-[var(--ink-obsidian)]">
                0{Math.min(activeIndex + 1, totalSlides)} / 0{totalSlides}
              </span>
              <div className="h-1.5 w-32 overflow-hidden rounded-full bg-[var(--surface-stone-deep)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--neon-teal)] to-[var(--neon-orange)] transition-[width] duration-75"
                  style={{ width: `${Math.max(10, progress * 100)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => jumpToSlide(activeIndex - 1)}
                disabled={activeIndex === 0}
                aria-label="Previous project"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-mineral)] bg-white text-[var(--ink-obsidian)] hover:border-[var(--neon-teal)] disabled:opacity-35 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => jumpToSlide(activeIndex + 1)}
                disabled={activeIndex >= totalSlides - 1}
                aria-label="Next project"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-mineral)] bg-white text-[var(--ink-obsidian)] hover:border-[var(--neon-orange)] disabled:opacity-35 cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Track (Cards sized to 76vw so next card peeks naturally) */}
        <div
          ref={trackRef}
          className="flex flex-nowrap items-center gap-8 pl-[var(--safe-x)] pr-[12vw] my-auto will-change-transform"
        >
          {projects.map((project) => {
            const isOrange = project.accent === "orange";
            return (
              <article
                key={project.slug}
                className="porcelain-card dichroic-ring flex h-[66vh] min-h-[450px] max-h-[600px] w-[76vw] max-w-[1080px] shrink-0 items-center rounded-[32px] p-8 xl:p-10"
              >
                <div className="grid w-full grid-cols-12 gap-8 items-center">
                  {/* Left Plain-English Project Summary */}
                  <div className="col-span-6 space-y-5">
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          isOrange
                            ? "bg-[var(--orange-halo)] text-[var(--orange-lacquer)]"
                            : "bg-[var(--teal-mist)] text-[var(--teal-deep)]"
                        }`}
                      >
                        {project.category}
                      </span>
                      <span className="text-xs font-medium text-[var(--ink-muted)]">
                        {project.client} · {project.year}
                      </span>
                    </div>

                    <h3 className="text-h2 font-bold text-[var(--ink-obsidian)]">
                      {project.title}
                    </h3>

                    <p className="text-body text-[var(--ink-slate)] max-w-[44ch]">
                      {project.tagline}
                    </p>

                    <div className="rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-4 py-3.5">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
                        Key Result
                      </div>
                      <div
                        className={`mt-0.5 text-lg font-bold ${
                          isOrange ? "text-[var(--orange-lacquer)]" : "text-[var(--teal-deep)]"
                        }`}
                      >
                        {project.keyResult}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {project.stack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-[var(--border-mineral)] bg-white px-3 py-1 text-xs font-medium text-[var(--ink-slate)]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="pt-1">
                      <MagneticButton
                        href={`/work/${project.slug}`}
                        variant={isOrange ? "primary" : "teal"}
                      >
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
          <div className="flex h-[66vh] min-h-[450px] max-h-[600px] w-[42vw] max-w-[520px] shrink-0 flex-col justify-between rounded-[32px] bg-[var(--ink-obsidian)] p-10 text-[#F7F5F0] shadow-[0_24px_60px_-20px_rgba(15,23,26,0.4)]">
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

        <div className="shell flex items-center justify-between text-xs text-[var(--ink-muted)]">
          <span>Scroll down to glide through projects</span>
          <Link href="/work" className="font-semibold text-[var(--teal-deep)] hover:underline">
            View all work →
          </Link>
        </div>
      </div>

      {/* MOBILE / TABLET: Smooth Native Touch Horizontal Swipe Carousel */}
      <div className="lg:hidden py-16 border-b border-[var(--border-mineral)]">
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
          {projects.map((project) => {
            const isOrange = project.accent === "orange";
            return (
              <article
                key={project.slug}
                className="porcelain-card w-[86vw] max-w-[420px] shrink-0 snap-center rounded-3xl p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-4">
                  <ProjectPreview type={project.previewType} title={project.title} compact />
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span
                        className={`font-semibold ${
                          isOrange ? "text-[var(--orange-lacquer)]" : "text-[var(--teal-deep)]"
                        }`}
                      >
                        {project.category}
                      </span>
                      <span className="text-[var(--ink-muted)]">{project.year}</span>
                    </div>
                    <h3 className="mt-1.5 text-xl font-bold text-[var(--ink-obsidian)]">
                      {project.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-[var(--ink-slate)]">{project.tagline}</p>
                  </div>
                </div>

                <div className="border-t border-[var(--border-mineral)] pt-3.5">
                  <div className="text-xs font-bold text-[var(--teal-deep)] mb-3">
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
