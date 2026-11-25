"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Cpu, Layers, Sparkles } from "lucide-react";
import type { Project } from "@/data/projects";
import { SceneCanvas } from "@/components/3d/SceneCanvas";
import { ProjectArtifact3D } from "@/components/3d/ProjectArtifact3D";
import { MagneticButton } from "@/components/ui/MagneticButton";

interface CaseStudyViewProps {
  project: Project;
  nextProject: Project;
}

export function CaseStudyView({ project, nextProject }: CaseStudyViewProps) {
  const isOrange = project.accent === "orange";

  return (
    <article className="bg-[var(--bg-alabaster)] pt-28 pb-24 md:pt-36">
      {/* Chapter 00 — Feature Film Title Sequence */}
      <header className="shell pb-14 border-b border-[var(--border-mineral)]">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--ink-slate)] hover:text-[var(--orange-lacquer)] mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Filmography Archive
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full px-3.5 py-1 font-mono text-[10.5px] font-bold uppercase tracking-widest ${
                  isOrange
                    ? "bg-[var(--orange-halo)] text-[var(--orange-lacquer)] border border-[var(--neon-orange)]/40"
                    : "bg-[var(--teal-mist)] text-[var(--teal-deep)] border border-[var(--neon-teal)]/50"
                }`}
              >
                FEATURE FILM {project.filmNumber} · {project.category}
              </span>
              <span className="font-mono text-xs text-[var(--ink-muted)]">
                {project.client} · {project.year}
              </span>
            </div>

            <h1 className="text-hero font-bold text-[var(--ink-obsidian)]">{project.title}</h1>
            <p className="text-body-lg text-[var(--ink-slate)] max-w-[56ch]">{project.summary}</p>

            {/* Production Credits Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="porcelain-card rounded-2xl p-3.5">
                <div className="font-mono text-[10px] text-[var(--ink-muted)]">ROLE</div>
                <div className="mt-1 text-xs font-semibold text-[var(--ink-obsidian)]">
                  {project.role}
                </div>
              </div>
              <div className="porcelain-card rounded-2xl p-3.5">
                <div className="font-mono text-[10px] text-[var(--ink-muted)]">TIMELINE</div>
                <div className="mt-1 text-xs font-semibold text-[var(--ink-obsidian)]">
                  {project.duration}
                </div>
              </div>
              <div className="porcelain-card rounded-2xl p-3.5">
                <div className="font-mono text-[10px] text-[var(--ink-muted)]">TEAM</div>
                <div className="mt-1 text-xs font-semibold text-[var(--ink-obsidian)]">
                  {project.team}
                </div>
              </div>
              <div className="porcelain-card rounded-2xl p-3.5">
                <div className="font-mono text-[10px] text-[var(--ink-muted)]">HEADLINE</div>
                <div
                  className={`mt-1 text-xs font-bold ${
                    isOrange ? "text-[var(--orange-lacquer)]" : "text-[var(--teal-deep)]"
                  }`}
                >
                  {project.headlineMetric}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive 3D Hero Artifact Stage */}
          <div className="lg:col-span-5">
            <div className="porcelain-glass dichroic-ring relative h-[360px] md:h-[440px] w-full overflow-hidden rounded-[34px] sunlit-aura">
              <SceneCanvas cameraPosition={[0, 0.25, 4.35]} fallbackLabel={project.title}>
                <ProjectArtifact3D variant={project.artifact} />
              </SceneCanvas>
              <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl bg-white/88 px-4 py-2.5 backdrop-blur-md border border-[var(--border-mineral)]">
                <span className="font-mono text-[10.5px] text-[var(--ink-obsidian)]">
                  INTERACTIVE 3D ARTIFACT · DRAG TO INSPECT
                </span>
                <span className="font-mono text-[10.5px] text-[var(--teal-deep)]">PBR STUDIO</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quantified Outcome Metrics Bar */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {project.metrics.map((metric) => (
            <div key={metric.label} className="porcelain-card rounded-3xl p-6">
              <div className="font-mono text-[10.5px] uppercase tracking-widest text-[var(--ink-muted)]">
                {metric.label}
              </div>
              <div
                className={`mt-2 text-3xl md:text-4xl font-bold tracking-tight ${
                  isOrange ? "text-[var(--orange-lacquer)]" : "text-[var(--teal-deep)]"
                }`}
              >
                {metric.value}
              </div>
              <div className="mt-1 text-xs font-medium text-[var(--ink-slate)]">{metric.delta}</div>
            </div>
          ))}
        </div>
      </header>

      {/* Chapter 01 — The Stakes */}
      <section className="shell py-16 md:py-20 border-b border-[var(--border-mineral)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <span className="font-mono-tech text-[11px] text-[var(--orange-lacquer)]">
              CHAPTER 01 · THE STAKES
            </span>
            <h2 className="mt-3 text-h3 font-bold text-[var(--ink-obsidian)]">
              {project.chapters.stakes.heading}
            </h2>
          </div>
          <div className="lg:col-span-8 space-y-6">
            <p className="text-body-lg text-[var(--ink-slate)] max-w-[65ch]">
              {project.chapters.stakes.context}
            </p>
            <div className="porcelain-card rounded-3xl p-6">
              <div className="font-mono text-[10.5px] uppercase tracking-widest text-[var(--teal-deep)] mb-4">
                HARD PRODUCTION CONSTRAINTS
              </div>
              <ul className="space-y-3">
                {project.chapters.stakes.constraints.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-sm text-[var(--ink-obsidian)]">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--neon-orange)]" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 02 — Architectural Decisions & Trade-Offs */}
      <section className="shell py-16 md:py-20 border-b border-[var(--border-mineral)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <span className="inline-flex items-center gap-1.5 font-mono-tech text-[11px] text-[var(--teal-deep)]">
              <Cpu className="h-3.5 w-3.5" /> CHAPTER 02 · ARCHITECTURE
            </span>
            <h2 className="mt-3 text-h3 font-bold text-[var(--ink-obsidian)]">
              {project.chapters.architecture.heading}
            </h2>
            <p className="mt-4 text-sm text-[var(--ink-slate)] leading-relaxed">
              {project.chapters.architecture.overview}
            </p>
          </div>

          <div className="lg:col-span-8 space-y-6">
            {/* System Pipeline Schematic */}
            <div className="obsidian-island rounded-3xl p-6 md:p-7">
              <div className="font-mono text-[10.5px] text-[var(--neon-teal)] mb-5">
                END-TO-END LATENCY &amp; RENDERING PIPELINE
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
                {project.chapters.architecture.pipelineNodes.map((node, idx) => (
                  <div
                    key={node.name}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] text-white/50">
                      <span>0{idx + 1}</span>
                      <span className="text-[var(--neon-orange)]">{node.latency}</span>
                    </div>
                    <div className="mt-2 text-sm font-bold text-[#F7F5F0]">{node.name}</div>
                    <div className="mt-1 text-xs text-white/65">{node.spec}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trade-Off Decision Matrix (What Senior Hiring Managers Love Most) */}
            <div className="space-y-3.5">
              <div className="font-mono text-[10.5px] uppercase tracking-widest text-[var(--ink-muted)]">
                KEY ARCHITECTURAL TRADE-OFFS
              </div>
              {project.chapters.architecture.decisions.map((d) => (
                <div key={d.topic} className="porcelain-card rounded-3xl p-5 md:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--border-mineral)]">
                    <span className="font-bold text-sm text-[var(--ink-obsidian)]">{d.topic}</span>
                    <div className="flex flex-wrap gap-2 text-xs font-mono">
                      <span className="rounded-full bg-[var(--teal-mist)] px-3 py-1 text-[var(--teal-deep)] font-semibold">
                        ✓ {d.chosen}
                      </span>
                      <span className="rounded-full bg-[var(--surface-stone)] px-3 py-1 text-[var(--ink-muted)] line-through">
                        {d.rejected}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-[var(--ink-slate)]">{d.rationale}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 03 — Craft in Motion */}
      <section className="shell py-16 md:py-20 border-b border-[var(--border-mineral)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <span className="inline-flex items-center gap-1.5 font-mono-tech text-[11px] text-[var(--orange-lacquer)]">
              <Sparkles className="h-3.5 w-3.5" /> CHAPTER 03 · CRAFT IN MOTION
            </span>
            <h2 className="mt-3 text-h3 font-bold text-[var(--ink-obsidian)]">
              {project.chapters.craft.heading}
            </h2>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <p className="text-body-lg text-[var(--ink-slate)] max-w-[65ch]">
              {project.chapters.craft.story}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {project.chapters.craft.highlights.map((h) => (
                <div key={h.title} className="porcelain-card rounded-3xl p-6">
                  <Layers className="h-5 w-5 text-[var(--teal-deep)] mb-3" />
                  <h3 className="font-bold text-sm text-[var(--ink-obsidian)]">{h.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--ink-slate)]">{h.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 04 — Quantified Impact & Engineering Postmortem */}
      <section className="shell py-16 md:py-20 border-b border-[var(--border-mineral)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <span className="font-mono-tech text-[11px] text-[var(--teal-deep)]">
              CHAPTER 04 · IMPACT &amp; POSTMORTEM
            </span>
            <h2 className="mt-3 text-h3 font-bold text-[var(--ink-obsidian)]">
              {project.chapters.impact.heading}
            </h2>
          </div>
          <div className="lg:col-span-8 space-y-6">
            <p className="text-body-lg text-[var(--ink-slate)] max-w-[65ch]">
              {project.chapters.impact.narrative}
            </p>
            <div className="porcelain-card rounded-3xl p-6 space-y-3">
              <div className="font-mono text-[10.5px] uppercase tracking-widest text-[var(--orange-lacquer)]">
                HONEST ENGINEERING LESSONS
              </div>
              {project.chapters.impact.postmortem.map((lesson) => (
                <div key={lesson} className="flex items-start gap-3 text-sm text-[var(--ink-obsidian)]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--teal-deep)]" />
                  <span>{lesson}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Up Next Feature Film Handoff (Curiosity Gap #44) */}
      <section className="shell pt-16">
        <div className="obsidian-island rounded-[34px] p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--neon-teal)]">
              UP NEXT · FILM {nextProject.filmNumber}
            </span>
            <h3 className="mt-2 text-h2 font-bold text-[#F7F5F0]">{nextProject.title}</h3>
            <p className="mt-2 text-sm text-white/70 max-w-xl">{nextProject.oneLiner}</p>
          </div>
          <MagneticButton href={`/work/${nextProject.slug}`} variant="primary">
            Watch Next Case Study <ArrowRight className="h-4 w-4" />
          </MagneticButton>
        </div>
      </section>
    </article>
  );
}
