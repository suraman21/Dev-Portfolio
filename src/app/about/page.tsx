"use client";

import { ArrowUpRight, Compass, Layers, Sparkles } from "lucide-react";
import { careerEras, engineeringPrinciples } from "@/data/story";
import { siteConfig } from "@/data/site";
import { SceneCanvas } from "@/components/3d/SceneCanvas";
import { HeroPrismEngine } from "@/components/3d/HeroPrismEngine";
import { MagneticButton } from "@/components/ui/MagneticButton";

const stackMatrix = [
  {
    layer: "01 · Systems & Cloud",
    accent: "teal",
    items: ["TypeScript (Strict)", "Go", "Node.js", "Rust / WASM", "PostgreSQL", "ClickHouse", "Redis", "Docker & Edge Workers"],
  },
  {
    layer: "02 · Frontend Architecture",
    accent: "teal",
    items: ["Next.js 15 App Router", "React 19 RSC", "Tailwind CSS v4", "CRDT (Yjs)", "GraphQL & gRPC-Web", "WCAG 2.2 AA/AAA"],
  },
  {
    layer: "03 · Cinema, 3D & Motion",
    accent: "orange",
    items: ["Three.js & R3F", "Custom GLSL Shaders", "GSAP ScrollTrigger", "Lenis Momentum", "Framer Motion Springs", "Web Audio API"],
  },
];

export default function AboutPage() {
  return (
    <div className="sunlit-aura pt-28 pb-24 md:pt-36">
      <div className="shell">
        {/* Director's Biography Opening */}
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-16 border-b border-[var(--border-mineral)] items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--teal-mist)] border border-[var(--neon-teal)]/45 px-3.5 py-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-widest text-[var(--teal-deep)]">
              <Compass className="h-3.5 w-3.5" />
              DIRECTOR&apos;S BIOGRAPHY · ABOUT {siteConfig.name.toUpperCase()}
            </span>
            <h1 className="text-hero font-bold text-[var(--ink-obsidian)]">
              Built at the Intersection of{" "}
              <span className="font-editorial italic font-normal text-[var(--orange-lacquer)]">
                Systems &amp; Cinema.
              </span>
            </h1>
            <p className="text-body-lg text-[var(--ink-slate)] max-w-[58ch]">
              Over the past 8+ years, I&apos;ve bridged two disciplines that rarely sit in the same
              chair: Staff-level full-stack distributed engineering and luxury, film-grade web
              craftsmanship. I believe high-stakes software should feel as calm, tactile, and
              unmistakable as an architectural timepiece.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <MagneticButton href="/work" variant="primary">
                Inspect Shipped Work <ArrowUpRight className="h-4 w-4" />
              </MagneticButton>
              <MagneticButton href="/contact" variant="teal">
                Schedule Executive Intro
              </MagneticButton>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="porcelain-glass dichroic-ring h-[360px] md:h-[420px] rounded-[34px] overflow-hidden">
              <SceneCanvas cameraPosition={[0, 0.3, 5.2]} fallbackLabel="ATELIER CORE">
                <HeroPrismEngine exploded={true} />
              </SceneCanvas>
            </div>
          </div>
        </header>

        {/* Engineering Philosophy (Rooted in Laws of UX) */}
        <section className="py-16 md:py-20 border-b border-[var(--border-mineral)]">
          <div className="mb-10">
            <span className="font-mono-tech text-[10.5px] text-[var(--orange-lacquer)]">
              OPERATING SYSTEM · BEHAVIORAL ENGINEERING PRINCIPLES
            </span>
            <h2 className="mt-2 text-h2 font-bold text-[var(--ink-obsidian)]">
              How I Make Architectural{" "}
              <span className="font-editorial italic font-normal text-[var(--teal-deep)]">
                Decisions.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {engineeringPrinciples.map((p) => (
              <div key={p.code} className="porcelain-card rounded-3xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between font-mono text-[10.5px]">
                    <span className="font-bold text-[var(--orange-lacquer)]">{p.code}</span>
                    <span className="rounded-full bg-[var(--teal-mist)] px-2.5 py-0.5 text-[var(--teal-deep)]">
                      {p.law}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-[var(--ink-obsidian)]">{p.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[var(--ink-slate)]">{p.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Career Strata Timeline (Horizontal Swipe on Mobile, Clean Multi-Col Architectural Track on Desktop) */}
        <section className="py-16 md:py-20 border-b border-[var(--border-mineral)]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="inline-flex items-center gap-1.5 font-mono-tech text-[10.5px] text-[var(--teal-deep)]">
                <Layers className="h-3.5 w-3.5" /> CAREER TIMELINE · 2018 — 2026
              </span>
              <h2 className="mt-2 text-h2 font-bold text-[var(--ink-obsidian)]">
                Architectural{" "}
                <span className="font-editorial italic font-normal text-[var(--orange-lacquer)]">
                  Evolution.
                </span>
              </h2>
            </div>
            <span className="font-mono text-xs text-[var(--ink-muted)]">
              4 ERAS OF PRODUCTION LEADERSHIP
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {careerEras.map((era) => {
              const isOrange = era.accent === "orange";
              return (
                <article key={era.period} className="porcelain-card rounded-[30px] p-7">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`rounded-full px-3 py-1 font-mono text-[10.5px] font-bold ${
                        isOrange
                          ? "bg-[var(--orange-halo)] text-[var(--orange-lacquer)]"
                          : "bg-[var(--teal-mist)] text-[var(--teal-deep)]"
                      }`}
                    >
                      {era.period}
                    </span>
                    <span className="font-mono text-[11px] text-[var(--ink-muted)]">
                      {era.location}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-bold text-[var(--ink-obsidian)]">{era.role}</h3>
                  <div className="mt-1 font-mono text-xs text-[var(--teal-deep)]">
                    {era.organization}
                  </div>
                  <p className="mt-3 text-sm text-[var(--ink-slate)]">{era.headline}</p>

                  <ul className="mt-5 space-y-2.5 border-t border-[var(--border-mineral)] pt-4">
                    {era.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5 text-sm text-[var(--ink-obsidian)]">
                        <span
                          className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                            isOrange ? "bg-[var(--neon-orange)]" : "bg-[var(--neon-teal)]"
                          }`}
                        />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        {/* Technical Stack Matrix */}
        <section className="pt-16">
          <div className="mb-8 flex items-center gap-2 font-mono-tech text-[10.5px] text-[var(--teal-deep)]">
            <Sparkles className="h-3.5 w-3.5" /> TECHNICAL STACK BY STRATUM
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stackMatrix.map((group) => (
              <div key={group.layer} className="porcelain-card rounded-3xl p-6">
                <div
                  className={`font-mono text-xs font-bold mb-4 ${
                    group.accent === "orange"
                      ? "text-[var(--orange-lacquer)]"
                      : "text-[var(--teal-deep)]"
                  }`}
                >
                  {group.layer}
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-1.5 font-mono text-xs text-[var(--ink-obsidian)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
