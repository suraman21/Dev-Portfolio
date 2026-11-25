import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import type { Project } from "@/data/projects";
import { ProjectPreview } from "@/components/ui/ProjectPreview";
import { MagneticButton } from "@/components/ui/MagneticButton";

interface CaseStudyViewProps {
  project: Project;
  nextProject: Project;
}

export function CaseStudyView({ project, nextProject }: CaseStudyViewProps) {
  const isOrange = project.accent === "orange";

  return (
    <article className="bg-[var(--bg-alabaster)] pt-28 pb-24 md:pt-36">
      {/* Header & Realistic Product Showcase */}
      <header className="shell pb-14 border-b border-[var(--border-mineral)]">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--ink-slate)] hover:text-[var(--orange-lacquer)] mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Selected Work
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span
                className={`rounded-full px-3.5 py-1 font-semibold ${
                  isOrange
                    ? "bg-[var(--orange-halo)] text-[var(--orange-lacquer)]"
                    : "bg-[var(--teal-mist)] text-[var(--teal-deep)]"
                }`}
              >
                {project.category}
              </span>
              <span className="font-medium text-[var(--ink-muted)]">
                {project.client} · {project.year}
              </span>
            </div>

            <h1 className="text-hero font-bold text-[var(--ink-obsidian)]">{project.title}</h1>
            <p className="text-body-lg text-[var(--ink-slate)] max-w-[54ch]">{project.overview}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="porcelain-card rounded-2xl p-3.5">
                <div className="text-[11px] text-[var(--ink-muted)]">Role</div>
                <div className="mt-1 text-xs font-semibold text-[var(--ink-obsidian)]">
                  {project.role}
                </div>
              </div>
              <div className="porcelain-card rounded-2xl p-3.5">
                <div className="text-[11px] text-[var(--ink-muted)]">Timeline</div>
                <div className="mt-1 text-xs font-semibold text-[var(--ink-obsidian)]">
                  {project.timeline}
                </div>
              </div>
              <div className="porcelain-card rounded-2xl p-3.5 col-span-2 sm:col-span-1">
                <div className="text-[11px] text-[var(--ink-muted)]">Key Result</div>
                <div
                  className={`mt-1 text-xs font-bold ${
                    isOrange ? "text-[var(--orange-lacquer)]" : "text-[var(--teal-deep)]"
                  }`}
                >
                  {project.keyResult}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <ProjectPreview type={project.previewType} title={project.title} />
          </div>
        </div>

        {/* Verified Results Row */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {project.metrics.map((metric) => (
            <div key={metric.label} className="porcelain-card rounded-3xl p-6">
              <div className="text-xs font-medium text-[var(--ink-muted)]">{metric.label}</div>
              <div
                className={`mt-2 text-3xl md:text-4xl font-bold tracking-tight ${
                  isOrange ? "text-[var(--orange-lacquer)]" : "text-[var(--teal-deep)]"
                }`}
              >
                {metric.value}
              </div>
              <div className="mt-1 text-xs text-[var(--ink-slate)]">{metric.note}</div>
            </div>
          ))}
        </div>
      </header>

      {/* 1. The Challenge */}
      <section className="shell py-14 md:py-20 border-b border-[var(--border-mineral)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--orange-lacquer)]">
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
            <div className="porcelain-card rounded-3xl p-6 space-y-3">
              {project.challenge.points.map((pt) => (
                <div key={pt} className="flex items-start gap-3 text-sm text-[var(--ink-obsidian)]">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--neon-orange)]" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. The Solution & Key Decisions */}
      <section className="shell py-14 md:py-20 border-b border-[var(--border-mineral)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--teal-deep)]">
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
                <div key={decision.title} className="porcelain-card rounded-3xl p-6">
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
      <section className="shell py-14 md:py-20 border-b border-[var(--border-mineral)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--teal-deep)]">
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
            <div className="porcelain-card rounded-3xl p-6 space-y-3">
              {project.outcome.takeaways.map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm text-[var(--ink-obsidian)]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--teal-deep)]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Next Project Link */}
      <section className="shell pt-14">
        <div className="rounded-[32px] bg-[var(--ink-obsidian)] p-8 md:p-12 text-[#F7F5F0] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--neon-teal)]">
              Next Case Study
            </span>
            <h3 className="mt-2 text-h2 font-bold">{nextProject.title}</h3>
            <p className="mt-2 text-sm text-white/70 max-w-xl">{nextProject.tagline}</p>
          </div>
          <MagneticButton href={`/work/${nextProject.slug}`} variant="primary">
            Read Next Case Study <ArrowRight className="h-4 w-4" />
          </MagneticButton>
        </div>
      </section>
    </article>
  );
}
