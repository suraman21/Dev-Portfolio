import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import type { Project } from "@/data/projects";
import { resolveProjectTheme } from "@/lib/project-theme";
import { ProjectMediaFrame } from "@/components/ui/ProjectMediaFrame";
import { MagneticButton } from "@/components/ui/MagneticButton";

interface CaseStudyViewProps {
  project: Project;
  nextProject: Project;
}

export function CaseStudyView({ project, nextProject }: CaseStudyViewProps) {
  const theme = resolveProjectTheme(project.theme);

  return (
    <article className="bg-[var(--bg-alabaster)] pt-24 pb-28 md:pt-36 md:pb-24">
      {/* Dynamic Per-Project Tinted Hero Header & Real Product Image */}
      <div
        className="border-b border-black/10 transition-colors"
        style={{ backgroundColor: theme.sectionBg }}
      >
        <header className="shell py-10 sm:py-14">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--ink-obsidian)]/75 hover:text-[var(--ink-obsidian)] mb-6 sm:mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Selected Work
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="flex flex-wrap items-center gap-2.5 text-xs">
                <span
                  className="rounded-full px-3.5 py-1 font-bold"
                  style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}
                >
                  {project.category}
                </span>
                <span className="font-semibold text-[var(--ink-obsidian)]/65">
                  {project.client} · {project.year}
                </span>
              </div>

              <h1 className="text-hero font-bold text-[var(--ink-obsidian)]">{project.title}</h1>
              <p className="text-body-lg text-[#28363B] max-w-[54ch]">{project.overview}</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="rounded-2xl border border-black/10 bg-white/90 p-3.5">
                  <div className="text-[11px] font-medium text-[var(--ink-muted)]">Role</div>
                  <div className="mt-1 text-xs font-semibold text-[var(--ink-obsidian)]">
                    {project.role}
                  </div>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white/90 p-3.5">
                  <div className="text-[11px] font-medium text-[var(--ink-muted)]">Timeline</div>
                  <div className="mt-1 text-xs font-semibold text-[var(--ink-obsidian)]">
                    {project.timeline}
                  </div>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white/90 p-3.5">
                  <div className="text-[11px] font-medium text-[var(--ink-muted)]">Key Result</div>
                  <div className="mt-1 text-xs font-bold" style={{ color: theme.accentInk }}>
                    {project.keyResult}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-2.5">
              <ProjectMediaFrame
                media={project.media}
                theme={project.theme}
                title={project.title}
                priority
              />
              {project.media.caption && (
                <p className="text-center text-xs text-[var(--ink-obsidian)]/60">
                  {project.media.caption}
                </p>
              )}
            </div>
          </div>

          {/* Verified Results Row */}
          <div className="mt-10 sm:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {project.metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl sm:rounded-3xl border border-black/10 bg-white/95 p-4 sm:p-6 shadow-sm"
              >
                <div className="text-[11px] sm:text-xs font-medium text-[var(--ink-muted)]">
                  {metric.label}
                </div>
                <div
                  className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight"
                  style={{ color: theme.accentInk }}
                >
                  {metric.value}
                </div>
                <div className="mt-1 text-[11px] sm:text-xs text-[var(--ink-slate)]">
                  {metric.note}
                </div>
              </div>
            ))}
          </div>
        </header>
      </div>

      {/* 1. The Challenge */}
      <section className="shell py-12 md:py-20 border-b border-[var(--border-mineral)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-4">
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: theme.accentInk }}
            >
              01 · The Challenge
            </span>
            <h2 className="mt-2 text-h3 font-bold text-[var(--ink-obsidian)]">
              {project.challenge.heading}
            </h2>
          </div>
          <div className="lg:col-span-8 space-y-6">
            <p className="text-body-lg text-[var(--ink-slate)] max-w-[64ch]">
              {project.challenge.description}
            </p>
            <div className="porcelain-card rounded-3xl p-5 sm:p-6 space-y-3">
              {project.challenge.points.map((pt) => (
                <div key={pt} className="flex items-start gap-3 text-sm text-[var(--ink-obsidian)]">
                  <span
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: project.theme.accentColor }}
                  />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. The Solution & Key Decisions */}
      <section className="shell py-12 md:py-20 border-b border-[var(--border-mineral)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-4">
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: theme.accentInk }}
            >
              02 · The Solution
            </span>
            <h2 className="mt-2 text-h3 font-bold text-[var(--ink-obsidian)]">
              {project.solution.heading}
            </h2>
          </div>
          <div className="lg:col-span-8 space-y-6">
            <p className="text-body-lg text-[var(--ink-slate)] max-w-[64ch]">
              {project.solution.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {project.solution.decisions.map((decision) => (
                <div key={decision.title} className="porcelain-card rounded-3xl p-5 sm:p-6">
                  <h3 className="text-sm font-bold text-[var(--ink-obsidian)]">{decision.title}</h3>
                  <p className="mt-2 text-sm text-[var(--ink-slate)] leading-relaxed">
                    {decision.detail}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-[var(--border-mineral)] bg-white px-3.5 py-1.5 text-xs font-medium text-[var(--ink-obsidian)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Final Outcome */}
      <section className="shell py-12 md:py-20 border-b border-[var(--border-mineral)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-4">
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: theme.accentInk }}
            >
              03 · Outcome
            </span>
            <h2 className="mt-2 text-h3 font-bold text-[var(--ink-obsidian)]">
              {project.outcome.heading}
            </h2>
          </div>
          <div className="lg:col-span-8 space-y-5">
            <p className="text-body-lg text-[var(--ink-slate)] max-w-[64ch]">
              {project.outcome.description}
            </p>
            <div className="porcelain-card rounded-3xl p-5 sm:p-6 space-y-3">
              {project.outcome.takeaways.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 text-sm text-[var(--ink-obsidian)]"
                >
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0"
                    style={{ color: theme.accentInk }}
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Optional Gallery Section — Automatically activates when Admin Panel adds gallery images */}
      {project.media.gallery && project.media.gallery.length > 0 && (
        <section className="shell py-12 md:py-16 border-b border-[var(--border-mineral)]">
          <h2 className="text-h3 font-bold text-[var(--ink-obsidian)] mb-6">Product Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.media.gallery.map((item) => (
              <figure
                key={item.url}
                className="overflow-hidden rounded-3xl border border-[var(--border-mineral)] bg-white p-3"
              >
                <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl">
                  <img
                    src={item.url}
                    alt={item.alt}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                {item.caption && (
                  <figcaption className="mt-2.5 px-2 text-xs text-[var(--ink-slate)]">
                    {item.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Next Project Link */}
      <section className="shell pt-12 sm:pt-14">
        <div className="rounded-[28px] sm:rounded-[32px] bg-[var(--ink-obsidian)] p-6 sm:p-8 md:p-12 text-[#F7F5F0] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--neon-teal)]">
              Next Case Study
            </span>
            <h3 className="mt-2 text-2xl sm:text-h2 font-bold">{nextProject.title}</h3>
            <p className="mt-2 text-sm text-white/70 max-w-xl">{nextProject.tagline}</p>
          </div>
          <MagneticButton href={`/work/${nextProject.slug}`} variant="primary" className="w-full sm:w-auto">
            Read Next Case Study <ArrowRight className="h-4 w-4" />
          </MagneticButton>
        </div>
      </section>
    </article>
  );
}
