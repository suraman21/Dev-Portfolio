"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle2, Compass, Cpu, Sparkles } from "lucide-react";
import { buildSteps, type BuildStep } from "@/data/story";

/** Clean, immediately understandable visual card for each step (Zero 3D overload) */
function StepVisual({ step }: { step: BuildStep }) {
  const isOrange = step.accent === "orange";

  return (
    <div className="porcelain-glass dichroic-ring relative overflow-hidden rounded-[30px] p-7 sm:p-9 shadow-[0_24px_60px_-24px_rgba(15,23,26,0.12)]">
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full blur-3xl ${
          isOrange ? "bg-[var(--neon-orange)]/18" : "bg-[var(--neon-teal)]/20"
        }`}
      />

      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${
              isOrange
                ? "bg-[var(--orange-halo)] text-[var(--orange-lacquer)]"
                : "bg-[var(--teal-mist)] text-[var(--teal-deep)]"
            }`}
          >
            {step.visualType === "strategy" && <Compass className="h-6 w-6" />}
            {step.visualType === "engineering" && <Cpu className="h-6 w-6" />}
            {step.visualType === "craft" && <Sparkles className="h-6 w-6" />}
          </span>
          <span className="font-mono text-xs font-bold text-[var(--ink-muted)]">
            {step.number} / 03
          </span>
        </div>

        {/* Big Clear Metric Anchor */}
        <div className="rounded-2xl border border-[var(--border-mineral)] bg-white p-6">
          <div
            className={`text-4xl sm:text-5xl font-bold tracking-tight ${
              isOrange ? "text-[var(--orange-lacquer)]" : "text-[var(--teal-deep)]"
            }`}
          >
            {step.statValue}
          </div>
          <div className="mt-1.5 text-sm font-medium text-[var(--ink-slate)]">
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
                className="rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] p-3.5"
              >
                <div className="text-xs font-bold text-[var(--ink-obsidian)]">{item.label}</div>
                <div className="mt-0.5 text-[11px] text-[var(--teal-deep)]">{item.spec}</div>
              </div>
            ))}
          </div>
        )}

        {step.visualType === "engineering" && (
          <div className="space-y-2.5 rounded-2xl bg-[var(--ink-obsidian)] p-5 text-[#F7F5F0]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/65">Edge API Response</span>
              <span className="font-mono font-bold text-[var(--neon-teal)]">34 ms</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[92%] rounded-full bg-[var(--neon-teal)]" />
            </div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-white/65">Core Web Vitals</span>
              <span className="font-mono font-bold text-[var(--neon-orange)]">99 / 100</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[98%] rounded-full bg-[var(--neon-orange)]" />
            </div>
          </div>
        )}

        {step.visualType === "craft" && (
          <div className="flex items-center justify-between rounded-2xl border border-[var(--border-mineral)] bg-white p-5">
            <div>
              <div className="text-sm font-bold text-[var(--ink-obsidian)]">
                Living Motion System
              </div>
              <div className="text-xs text-[var(--ink-slate)]">
                Smooth springs, calm pacing, zero clutter
              </div>
            </div>
            <span className="rounded-full bg-[var(--neon-orange)] px-3.5 py-1.5 text-xs font-bold text-[#0F171A]">
              60 FPS
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * STICKY MULTI-SLIDE FULL-SCREEN STORY ("How I Build")
 * - Desktop/Laptop (>=1024px): Screen pins smoothly while scrolling transitions
 *   through 3 spacious full-screen slides with soft depth recession & clickable dots.
 * - Mobile (<1024px): Clean native CSS `position: sticky` cards (zero iOS bugs).
 */
export function HowIBuildDeck() {
  const stageRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const slides = slideRefs.current.filter(Boolean) as HTMLDivElement[];
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
          trigger: stageRef.current,
          pin: true,
          scrub: 0.7,
          start: "top top",
          end: () => `+=${(slides.length - 1) * window.innerHeight * 0.85}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
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
          tl.to({}, { duration: 0.25 });
          return;
        }
        const prev = slides[i - 1];
        tl.to(slide, {
          yPercent: 0,
          duration: 1,
          ease: "power2.inOut",
        })
          .to(
            prev,
            {
              scale: 0.95,
              opacity: 0.35,
              duration: 1,
              ease: "power2.inOut",
            },
            "<"
          )
          .to({}, { duration: 0.3 });
      });
    });

    return () => {
      triggerRef.current = null;
      mm.revert();
    };
  }, []);

  const jumpToSlide = (idx: number) => {
    setActiveIndex(idx);
    if (triggerRef.current) {
      const st = triggerRef.current;
      const y = st.start + (idx / (buildSteps.length - 1)) * (st.end - st.start);
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section id="how-i-build" aria-label="How I Build Software and Websites">
      {/* DESKTOP / LAPTOP: Smooth Sticky Pinned Full-Screen Slides */}
      <div
        ref={stageRef}
        className="relative hidden lg:block h-screen w-full overflow-hidden border-y border-[var(--border-mineral)] bg-[var(--bg-alabaster)]"
      >
        {/* Minimal Clean Progress Dots */}
        <div className="pointer-events-none absolute left-0 right-0 top-22 z-40 shell">
          <div className="flex items-center justify-between">
            <span className="porcelain-glass rounded-full px-4 py-1.5 text-xs font-semibold text-[var(--ink-slate)]">
              How I Build ·{" "}
              <strong className="text-[var(--ink-obsidian)]">
                0{activeIndex + 1} / 0{buildSteps.length}
              </strong>
            </span>

            <div className="pointer-events-auto porcelain-glass flex items-center gap-2 rounded-full px-3.5 py-2">
              {buildSteps.map((s, idx) => (
                <button
                  key={s.number}
                  type="button"
                  onClick={() => jumpToSlide(idx)}
                  aria-label={`Jump to ${s.label}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeIndex
                      ? "w-7 bg-[var(--neon-orange)]"
                      : "w-2 bg-[var(--teal-deep)]/35 hover:bg-[var(--teal-deep)]"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Full-Screen Sliding Layers */}
        <div className="relative h-full w-full">
          {buildSteps.map((step, idx) => {
            const isOrange = step.accent === "orange";
            return (
              <div
                key={step.number}
                ref={(el) => {
                  slideRefs.current[idx] = el;
                }}
                className="absolute inset-0 flex items-center pt-16"
                style={{
                  background:
                    idx % 2 === 0
                      ? "linear-gradient(155deg, #F7F5F0 0%, #FFFFFF 100%)"
                      : "linear-gradient(155deg, #FFFFFF 0%, #F4F2EC 100%)",
                }}
              >
                <div className="shell grid grid-cols-12 gap-12 items-center">
                  <div className="col-span-7 space-y-6">
                    <span
                      className={`inline-flex rounded-full px-3.5 py-1 text-xs font-semibold ${
                        isOrange
                          ? "bg-[var(--orange-halo)] text-[var(--orange-lacquer)] border border-[var(--neon-orange)]/30"
                          : "bg-[var(--teal-mist)] text-[var(--teal-deep)] border border-[var(--neon-teal)]/40"
                      }`}
                    >
                      {step.label}
                    </span>

                    <h2 className="text-h2 font-bold text-[var(--ink-obsidian)]">
                      {step.title}{" "}
                      <span
                        className={`font-editorial italic font-normal ${
                          isOrange ? "text-[var(--orange-lacquer)]" : "text-[var(--teal-deep)]"
                        }`}
                      >
                        {step.highlight}
                      </span>
                    </h2>

                    <p className="text-body-lg max-w-[54ch] text-[var(--ink-slate)]">
                      {step.description}
                    </p>

                    <ul className="space-y-3 pt-2">
                      {step.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-3 text-[15px] font-medium text-[var(--ink-obsidian)]"
                        >
                          <CheckCircle2
                            className={`mt-0.5 h-5 w-5 shrink-0 ${
                              isOrange ? "text-[var(--orange-lacquer)]" : "text-[var(--teal-deep)]"
                            }`}
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="col-span-5">
                    <StepVisual step={step} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MOBILE / TABLET: Clean Native CSS Sticky Stack (100% smooth on iOS Safari) */}
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
            const isOrange = step.accent === "orange";
            return (
              <article
                key={step.number}
                style={{ top: `${78 + idx * 14}px` }}
                className="sticky porcelain-card rounded-3xl p-6 shadow-[0_18px_40px_-18px_rgba(15,23,26,0.12)]"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      isOrange
                        ? "bg-[var(--orange-halo)] text-[var(--orange-lacquer)]"
                        : "bg-[var(--teal-mist)] text-[var(--teal-deep)]"
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="font-mono text-xs font-bold text-[var(--ink-muted)]">
                    {step.number}/03
                  </span>
                </div>

                <h3 className="mt-4 text-h3 font-bold text-[var(--ink-obsidian)]">
                  {step.title}{" "}
                  <span className="font-editorial italic font-normal">{step.highlight}</span>
                </h3>
                <p className="mt-2.5 text-sm text-[var(--ink-slate)]">{step.description}</p>

                <ul className="mt-4 space-y-2 border-t border-[var(--border-mineral)] pt-4">
                  {step.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2.5 text-sm text-[var(--ink-obsidian)]"
                    >
                      <CheckCircle2
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          isOrange ? "text-[var(--orange-lacquer)]" : "text-[var(--teal-deep)]"
                        }`}
                      />
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
