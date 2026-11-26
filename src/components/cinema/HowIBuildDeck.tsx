"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle2, Compass, Cpu, Sparkles } from "lucide-react";
import type { BuildStep } from "@/types/cms";
import { useCms } from "@/components/cms/CmsProvider";

/** Strong, unmistakably distinct studio color theme per slide */
const SLIDE_THEMES: Record<
  BuildStep["accent"],
  {
    bgStyle: string;
    orbClass: string;
    badgeClass: string;
    highlightClass: string;
    checkClass: string;
    cardClass: string;
    iconBoxClass: string;
    statTextClass: string;
    dotActiveClass: string;
    mobileCardStyle: string;
    mobileBorderClass: string;
  }
> = {
  teal: {
    bgStyle:
      "radial-gradient(circle at 82% 24%, rgba(0, 229, 204, 0.34), transparent 52%), linear-gradient(145deg, #D5F9F2 0%, #EEFCF9 58%, #DFFBF5 100%)",
    orbClass: "bg-[#00E5CC]/35",
    badgeClass: "bg-[#006B60] text-[#E8FFF9] border border-[#00A896]",
    highlightClass: "text-[#006B60]",
    checkClass: "text-[#007A6E]",
    cardClass:
      "bg-white/95 border-2 border-[#00D2BC] shadow-[0_28px_65px_-24px_rgba(0,122,110,0.28)]",
    iconBoxClass: "bg-[#00E5CC]/25 text-[#005C53]",
    statTextClass: "text-[#006B60]",
    dotActiveClass: "w-8 bg-[#00B8A4]",
    mobileCardStyle: "linear-gradient(145deg, #DDFBF5 0%, #F4FEFC 100%)",
    mobileBorderClass: "border-2 border-[#00D2BC]",
  },
  orange: {
    bgStyle:
      "radial-gradient(circle at 82% 24%, rgba(255, 90, 31, 0.30), transparent 52%), linear-gradient(145deg, #FFE2D1 0%, #FFF4EC 58%, #FFE8DA 100%)",
    orbClass: "bg-[#FF5A1F]/35",
    badgeClass: "bg-[#C93904] text-[#FFF7F2] border border-[#FF5A1F]",
    highlightClass: "text-[#C93904]",
    checkClass: "text-[#D94108]",
    cardClass:
      "bg-white/95 border-2 border-[#FF6B35] shadow-[0_28px_65px_-24px_rgba(201,57,4,0.28)]",
    iconBoxClass: "bg-[#FF5A1F]/20 text-[#B83200]",
    statTextClass: "text-[#C93904]",
    dotActiveClass: "w-8 bg-[#FF5A1F]",
    mobileCardStyle: "linear-gradient(145deg, #FFE6D6 0%, #FFF7F2 100%)",
    mobileBorderClass: "border-2 border-[#FF6B35]",
  },
  cobalt: {
    bgStyle:
      "radial-gradient(circle at 18% 22%, rgba(0, 229, 204, 0.24), transparent 46%), radial-gradient(circle at 84% 78%, rgba(255, 90, 31, 0.22), transparent 48%), linear-gradient(145deg, #DCE7FF 0%, #F0F5FF 55%, #E3ECFF 100%)",
    orbClass: "bg-[#3B6EFF]/28",
    badgeClass: "bg-[#153585] text-[#EEF4FF] border border-[#3B6EFF]",
    highlightClass: "text-[#1A43A8]",
    checkClass: "text-[#1A43A8]",
    cardClass:
      "bg-[#0F171A] text-[#F7F5F0] border-2 border-[#3B6EFF] shadow-[0_32px_70px_-24px_rgba(15,23,26,0.48)]",
    iconBoxClass: "bg-[#00E5CC]/20 text-[#00E5CC]",
    statTextClass: "text-[#00E5CC]",
    dotActiveClass: "w-8 bg-[#1A43A8]",
    mobileCardStyle: "linear-gradient(145deg, #DCE7FF 0%, #F2F6FF 100%)",
    mobileBorderClass: "border-2 border-[#3B6EFF]",
  },
};

/** Distinct, high-contrast visual card per slide */
function StepVisual({ step }: { step: BuildStep }) {
  const theme = SLIDE_THEMES[step.accent];
  const isDarkCard = step.accent === "cobalt";

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
            {step.number} / 03
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
                className="rounded-2xl border border-[#00D2BC]/45 bg-[#EEFCF9] p-3.5"
              >
                <div className="text-xs font-bold text-[#0F171A]">{item.label}</div>
                <div className="mt-0.5 text-[11px] font-semibold text-[#006B60]">{item.spec}</div>
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
          <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/8 p-5">
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
 * - Desktop/Laptop (>=1024px): Pins full-screen while scrolling slides sharply
 *   across 3 strongly color-coded chapters (Electric Teal -> Solar Orange -> Cobalt Ice).
 * - Mobile (<1024px): Native CSS `position: sticky` cards with the same vivid color shifts.
 */
export function HowIBuildDeck() {
  const { data } = useCms();
  const buildSteps = data.buildSteps;
  const stageRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const lastIndexRef = useRef(0);
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
          scrub: 0.14,
          start: "top top",
          end: () => `+=${(slides.length - 1) * window.innerHeight * 0.52}`,
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
              opacity: 0.2,
              duration: 0.85,
              ease: "power2.out",
            },
            "<"
          )
          .to({}, { duration: 0.2 });
      });
    });

    return () => {
      triggerRef.current = null;
      mm.revert();
    };
  }, [buildSteps.length]);

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
      {/* DESKTOP / LAPTOP: Crisp Sticky Pinned Full-Screen Color-Coded Slides */}
      <div
        ref={stageRef}
        className="relative hidden lg:block h-screen w-full overflow-hidden border-y border-[var(--border-mineral)] bg-[#D5F9F2]"
      >
        {/* Minimal Clean Progress Dots Reflecting Active Slide Color */}
        <div className="pointer-events-none absolute left-0 right-0 top-22 z-40 shell">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-white/90 backdrop-blur-md border border-[var(--border-mineral)] px-4 py-1.5 text-xs font-semibold text-[var(--ink-slate)] shadow-sm">
              How I Build ·{" "}
              <strong className="text-[var(--ink-obsidian)]">
                0{activeIndex + 1} / 0{buildSteps.length}
              </strong>
            </span>

            <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-md border border-[var(--border-mineral)] px-3.5 py-2 shadow-sm">
              {buildSteps.map((s, idx) => {
                const dotTheme = SLIDE_THEMES[s.accent];
                return (
                  <button
                    key={s.number}
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
            const theme = SLIDE_THEMES[step.accent];
            return (
              <div
                key={step.number}
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
                      {step.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-3 text-[15px] font-semibold text-[var(--ink-obsidian)]"
                        >
                          <CheckCircle2 className={`mt-0.5 h-5 w-5 shrink-0 ${theme.checkClass}`} />
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

      {/* MOBILE / TABLET: Native CSS Sticky Stack with Distinct Bold Slide Colors */}
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
            const theme = SLIDE_THEMES[step.accent];
            return (
              <article
                key={step.number}
                style={{
                  top: `${78 + idx * 14}px`,
                  background: theme.mobileCardStyle,
                }}
                className={`sticky rounded-3xl p-6 shadow-[0_18px_40px_-18px_rgba(15,23,26,0.16)] ${theme.mobileBorderClass}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${theme.badgeClass}`}>
                    {step.label}
                  </span>
                  <span className="font-mono text-xs font-bold text-[var(--ink-obsidian)]">
                    {step.number}/03
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
                  {step.points.map((point) => (
                    <li
                      key={point}
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
