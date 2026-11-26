"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle2, Compass, Cpu, Sparkles } from "lucide-react";
import type { BuildStep } from "@/types/cms";
import { useCms } from "@/components/cms/CmsProvider";
import { resolveSlideTheme } from "@/lib/slide-themes";

/** Distinct, high-contrast visual card per slide */
function StepVisual({
  step,
  slideIndex,
  totalSlides,
}: {
  step: BuildStep;
  slideIndex: number;
  totalSlides: number;
}) {
  const theme = resolveSlideTheme(step.accent, slideIndex);
  const isDarkCard = theme.isDarkCard;
  const totalFormatted = String(totalSlides).padStart(2, "0");

  return (
    <div className={`relative overflow-hidden rounded-[30px] p-7 sm:p-9 ${theme.cardClass}`}>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full blur-3xl ${theme.orbClass}`}
      />

      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${theme.iconBoxClass}`}
          >
            {step.visualType === "strategy" && <Compass className="h-6 w-6" />}
            {step.visualType === "engineering" && <Cpu className="h-6 w-6" />}
            {step.visualType === "craft" && <Sparkles className="h-6 w-6" />}
          </span>
          <span
            className={`font-mono text-xs font-bold ${
              isDarkCard ? "text-white/60" : "text-[var(--ink-muted)]"
            }`}
          >
            {step.number} / {totalFormatted}
          </span>
        </div>

        {/* Big Clear Metric Anchor */}
        <div
          className={`rounded-2xl p-6 ${
            isDarkCard
              ? "border border-white/12 bg-white/5"
              : "border border-[var(--border-mineral)] bg-white"
          }`}
        >
          <div className={`text-4xl sm:text-5xl font-bold tracking-tight ${theme.statTextClass}`}>
            {step.statValue}
          </div>
          <div
            className={`mt-1.5 text-sm font-medium ${
              isDarkCard ? "text-white/75" : "text-[var(--ink-slate)]"
            }`}
          >
            {step.statLabel}
          </div>
        </div>

        {/* Clean Visual Diagram Specific to Each Step */}
        {step.visualType === "strategy" && (
          <div className="grid grid-cols-3 gap-2.5 text-center">
            {[
              { label: "Mobile", spec: "Touch First" },
              { label: "Laptop", spec: "Fluid Grid" },
              { label: "4K / TV", spec: "Wide Safe" },
            ].map((item) => (
              <div
                key={item.label}
                className={`rounded-2xl border p-3.5 ${
                  isDarkCard
                    ? "border-white/15 bg-white/8"
                    : "border-[#00D2BC]/45 bg-[#EEFCF9]"
                }`}
              >
                <div
                  className={`text-xs font-bold ${
                    isDarkCard ? "text-white" : "text-[#0F171A]"
                  }`}
                >
                  {item.label}
                </div>
                <div
                  className={`mt-0.5 text-[11px] font-semibold ${
                    isDarkCard ? "text-[#00E5CC]" : "text-[#006B60]"
                  }`}
                >
                  {item.spec}
                </div>
              </div>
            ))}
          </div>
        )}

        {step.visualType === "engineering" && (
          <div className="space-y-2.5 rounded-2xl bg-[#19120E] p-5 text-[#FFF7F2]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/70">Edge API Response</span>
              <span className="font-mono font-bold text-[#00E5CC]">34 ms</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/12">
              <div className="h-full w-[92%] rounded-full bg-[#00E5CC]" />
            </div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-white/70">Core Web Vitals</span>
              <span className="font-mono font-bold text-[#FF6B35]">99 / 100</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/12">
              <div className="h-full w-[98%] rounded-full bg-[#FF5A1F]" />
            </div>
          </div>
        )}

        {step.visualType === "craft" && (
          <div
            className={`flex items-center justify-between rounded-2xl border p-5 ${
              isDarkCard
                ? "border-white/15 bg-white/8"
                : "border-[var(--border-mineral)] bg-[#0F171A]"
            }`}
          >
            <div>
              <div className="text-sm font-bold text-white">Real-Speed Motion System</div>
              <div className="text-xs text-white/65">
                Crisp 24fps filmic pacing, zero floaty lag
              </div>
            </div>
            <span className="rounded-full bg-[#FF5A1F] px-3.5 py-1.5 font-mono text-xs font-bold text-[#0F171A]">
              24 FPS
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * STICKY MULTI-SLIDE FULL-SCREEN STORY ("How I Build")
 * - Supports ANY number of slides (2, 3, 5, 12+) with zero overlap against downstream sections.
 * - Uses `refreshPriority: 10` and triggers `ScrollTrigger.refresh()` on slide count updates
 *   so `SelectedWorkReel` below always recalculates its exact Y start after pin spacers mount.
 * - Supports Default (Auto) + 12 curated studio themes via `resolveSlideTheme`.
 */
export function HowIBuildDeck() {
  const { data } = useCms();
  const buildSteps = data.buildSteps;
  const stageRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const lastIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  // Always keep ref array length synchronized with active slide count (no stale DOM nodes!)
  slideRefs.current.length = buildSteps.length;

  const slidesSignature = buildSteps.map((s, i) => `${s.id || i}:${s.accent}`).join("|");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    lastIndexRef.current = 0;
    setActiveIndex(0);

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const slides = slideRefs.current.slice(0, buildSteps.length).filter(Boolean) as HTMLDivElement[];
      if (!stageRef.current || slides.length < 2) return;

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
          id: "how-i-build-deck",
          trigger: stageRef.current,
          pin: true,
          pinSpacing: true,
          refreshPriority: 10,
          scrub: 0.14,
          start: "top top",
          end: () => `+=${(slides.length - 1) * window.innerHeight * 0.55}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const idx = Math.min(
              slides.length - 1,
              Math.round(self.progress * (slides.length - 1))
            );
            if (idx !== lastIndexRef.current) {
              lastIndexRef.current = idx;
              setActiveIndex(idx);
            }
          },
        },
      });

      triggerRef.current = tl.scrollTrigger || null;

      slides.forEach((slide, i) => {
        if (i === 0) {
          tl.to({}, { duration: 0.18 });
          return;
        }
        const prev = slides[i - 1];
        tl.to(slide, {
          yPercent: 0,
          duration: 0.85,
          ease: "power2.out",
        })
          .to(
            prev,
            {
              scale: 0.94,
              opacity: 0.15,
              duration: 0.85,
              ease: "power2.out",
            },
            "<"
          )
          .to({}, { duration: 0.2 });
      });
    });

    // Force GSAP to sort & recalculate downstream pinned triggers (e.g. SelectedWorkReel)
    const rafId = window.requestAnimationFrame(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      triggerRef.current = null;
      mm.revert();
      window.requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    };
  }, [buildSteps.length, slidesSignature]);

  const jumpToSlide = (idx: number) => {
    const safeIdx = Math.max(0, Math.min(buildSteps.length - 1, idx));
    setActiveIndex(safeIdx);
    if (triggerRef.current && buildSteps.length > 1) {
      const st = triggerRef.current;
      const y = st.start + (safeIdx / (buildSteps.length - 1)) * (st.end - st.start);
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const totalFormatted = String(buildSteps.length).padStart(2, "0");
  const currentFormatted = String(Math.min(activeIndex + 1, buildSteps.length)).padStart(2, "0");
  const firstTheme = resolveSlideTheme(buildSteps[0]?.accent, 0);

  return (
    <section
      id="how-i-build"
      aria-label="How I Build Software and Websites"
      className="relative z-10 isolate"
    >
      {/* DESKTOP / LAPTOP: Crisp Sticky Pinned Full-Screen Color-Coded Slides */}
      <div
        ref={stageRef}
        className="relative hidden lg:block h-screen w-full overflow-hidden border-y border-[var(--border-mineral)]"
        style={{ background: firstTheme.bgStyle }}
      >
        {/* Minimal Clean Progress Dots Reflecting Active Slide Color */}
        <div className="pointer-events-none absolute left-0 right-0 top-22 z-40 shell">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-white/90 backdrop-blur-md border border-[var(--border-mineral)] px-4 py-1.5 text-xs font-semibold text-[var(--ink-slate)] shadow-sm">
              How I Build ·{" "}
              <strong className="text-[var(--ink-obsidian)]">
                {currentFormatted} / {totalFormatted}
              </strong>
            </span>

            <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-md border border-[var(--border-mineral)] px-3.5 py-2 shadow-sm">
              {buildSteps.map((s, idx) => {
                const dotTheme = resolveSlideTheme(s.accent, idx);
                return (
                  <button
                    key={s.id || `${s.number}-${idx}`}
                    type="button"
                    onClick={() => jumpToSlide(idx)}
                    aria-label={`Jump to ${s.label}`}
                    className={`h-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                      idx === activeIndex
                        ? dotTheme.dotActiveClass
                        : "w-2.5 bg-[#0F171A]/20 hover:bg-[#0F171A]/45"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Full-Screen Sliding Color Chapters */}
        <div className="relative h-full w-full">
          {buildSteps.map((step, idx) => {
            const theme = resolveSlideTheme(step.accent, idx);
            return (
              <div
                key={step.id || `${step.number}-${idx}`}
                ref={(el) => {
                  slideRefs.current[idx] = el;
                }}
                className="absolute inset-0 flex items-center pt-16"
                style={{ background: theme.bgStyle }}
              >
                <div className="shell grid grid-cols-12 gap-12 items-center">
                  <div className="col-span-7 space-y-6">
                    <span
                      className={`inline-flex rounded-full px-4 py-1.5 text-xs font-bold shadow-sm ${theme.badgeClass}`}
                    >
                      {step.label}
                    </span>

                    <h2 className="text-h2 font-bold text-[var(--ink-obsidian)]">
                      {step.title}{" "}
                      <span className={`font-editorial italic font-normal ${theme.highlightClass}`}>
                        {step.highlight}
                      </span>
                    </h2>

                    <p className="text-body-lg max-w-[54ch] text-[#28363B]">{step.description}</p>

                    <ul className="space-y-3 pt-2">
                      {step.points.map((point, pIdx) => (
                        <li
                          key={`${point}-${pIdx}`}
                          className="flex items-start gap-3 text-[15px] font-semibold text-[var(--ink-obsidian)]"
                        >
                          <CheckCircle2 className={`mt-0.5 h-5 w-5 shrink-0 ${theme.checkClass}`} />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="col-span-5">
                    <StepVisual step={step} slideIndex={idx} totalSlides={buildSteps.length} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MOBILE / TABLET: Clean Native CSS Sticky Stack (Capped top offset so 4-12+ slides never overflow) */}
      <div className="lg:hidden border-y border-[var(--border-mineral)] bg-[var(--bg-alabaster)] py-16">
        <div className="shell mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--teal-deep)]">
            How I Build
          </span>
          <h2 className="mt-2 text-h2 font-bold text-[var(--ink-obsidian)]">
            From idea to{" "}
            <span className="font-editorial italic font-normal text-[var(--orange-lacquer)]">
              polished product.
            </span>
          </h2>
        </div>

        <div className="shell space-y-6">
          {buildSteps.map((step, idx) => {
            const theme = resolveSlideTheme(step.accent, idx);
            return (
              <article
                key={step.id || `${step.number}-${idx}`}
                style={{
                  top: `${76 + Math.min(idx, 4) * 10}px`,
                  background: theme.mobileCardStyle,
                }}
                className={`sticky rounded-3xl p-6 shadow-[0_18px_40px_-18px_rgba(15,23,26,0.16)] ${theme.mobileBorderClass}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${theme.badgeClass}`}>
                    {step.label}
                  </span>
                  <span className="font-mono text-xs font-bold text-[var(--ink-obsidian)]">
                    {step.number}/{totalFormatted}
                  </span>
                </div>

                <h3 className="mt-4 text-xl sm:text-h3 font-bold text-[var(--ink-obsidian)]">
                  {step.title}{" "}
                  <span className={`font-editorial italic font-normal ${theme.highlightClass}`}>
                    {step.highlight}
                  </span>
                </h3>
                <p className="mt-2 text-sm text-[#28363B]">{step.description}</p>

                <div className="mt-3.5 flex items-baseline gap-2.5 rounded-2xl border border-black/10 bg-white/85 px-4 py-2.5">
                  <span className={`text-xl font-bold ${theme.highlightClass}`}>
                    {step.statValue}
                  </span>
                  <span className="text-xs font-medium text-[var(--ink-slate)]">
                    {step.statLabel}
                  </span>
                </div>

                <ul className="mt-4 space-y-2 border-t border-black/10 pt-4">
                  {step.points.map((point, pIdx) => (
                    <li
                      key={`${point}-${pIdx}`}
                      className="flex items-start gap-2.5 text-sm font-medium text-[var(--ink-obsidian)]"
                    >
                      <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${theme.checkClass}`} />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
