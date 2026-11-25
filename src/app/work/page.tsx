"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Film } from "lucide-react";
import { projects, type ProjectCategory } from "@/data/projects";
import { SceneCanvas } from "@/components/3d/SceneCanvas";
import { ProjectArtifact3D } from "@/components/3d/ProjectArtifact3D";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useCinema } from "@/components/cinema/CinemaProvider";
import { foley } from "@/lib/sound";

const categories: ("All" | ProjectCategory)[] = [
  "All",
  "SaaS Systems",
  "3D & WebGL",
  "Full-Stack Architecture",
];

export default function WorkArchivePage() {
  const [selected, setSelected] = useState<"All" | ProjectCategory>("All");
  const { soundEnabled, setCursorLabel } = useCinema();

  const filtered =
    selected === "All" ? projects : projects.filter((p) => p.category === selected);

  return (
    <div className="sunlit-aura pt-28 pb-24 md:pt-36">
      <div className="shell">
        {/* Cinematic Page Opening */}
        <header className="max-w-3xl pb-12 border-b border-[var(--border-mineral)]">
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--orange-halo)] border border-[var(--neon-orange)]/35 px-3.5 py-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-widest text-[var(--orange-lacquer)]">
            <Film className="h-3.5 w-3.5" />
            FILMOGRAPHY ARCHIVE · 04 SELECTED CASE STUDIES
          </span>
          <h1 className="mt-5 text-hero font-bold text-[var(--ink-obsidian)]">
            Shipped Systems &amp;{" "}
            <span className="font-editorial italic font-normal text-[var(--teal-deep)]">
              Digital Flagships.
            </span>
          </h1>
          <p className="mt-4 text-body-lg text-[var(--ink-slate)] max-w-[58ch]">
            Each case study is authored as an honest engineering postmortem — real constraints,
            architectural trade-offs, interactive 3D craft, and verified production outcomes.
          </p>

          {/* Filter Pills (Hick's Law — 4 crisp options) */}
          <div className="mt-8 flex flex-wrap gap-2.5">
            {categories.map((cat) => {
              const active = selected === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  data-tv-focus="true"
                  onClick={() => {
                    foley.playDetent(soundEnabled);
                    setSelected(cat);
                  }}
                  className={`relative rounded-full px-5 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-[var(--ink-obsidian)] text-[#F7F5F0] shadow-md"
                      : "border border-[var(--border-mineral)] bg-white/85 text-[var(--ink-slate)] hover:border-[var(--neon-teal)] hover:text-[var(--ink-obsidian)]"
                  }`}
                >
                  {active && (
                    <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--neon-orange)] align-middle" />
                  )}
                  {cat}
                </button>
              );
            })}
          </div>
        </header>

        {/* Animated Layout Grid using CSS @container queries */}
        <motion.div layout className="mt-12 grid grid-cols-1 gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => {
              const isOrange = project.accent === "orange";
              return (
                <motion.article
                  layout
                  key={project.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 260, damping: 26 }}
                  onMouseEnter={() => setCursorLabel("VIEW CASE")}
                  onMouseLeave={() => setCursorLabel(null)}
                  className="cq-shell porcelain-card dichroic-ring rounded-[34px] p-6 md:p-9"
                >
                  <div className="cq-split-card">
                    <div className="space-y-5">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono text-xs font-bold text-[var(--ink-muted)]">
                          FILM {project.filmNumber}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 font-mono text-[10.5px] font-semibold uppercase ${
                            isOrange
                              ? "bg-[var(--orange-halo)] text-[var(--orange-lacquer)]"
                              : "bg-[var(--teal-mist)] text-[var(--teal-deep)]"
                          }`}
                        >
                          {project.category}
                        </span>
                        <span className="font-mono text-xs text-[var(--ink-muted)]">
                          {project.client} · {project.year}
                        </span>
                      </div>

                      <h2 className="text-h2 font-bold text-[var(--ink-obsidian)]">
                        {project.title}
                      </h2>

                      <p className="text-body text-[var(--ink-slate)] max-w-[54ch]">
                        {project.summary}
                      </p>

                      {/* 4-Metric Dossier Strip */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                        {project.metrics.map((m) => (
                          <div
                            key={m.label}
                            className="rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] p-3"
                          >
                            <div
                              className={`text-lg font-bold font-mono ${
                                isOrange ? "text-[var(--orange-lacquer)]" : "text-[var(--teal-deep)]"
                              }`}
                            >
                              {m.value}
                            </div>
                            <div className="mt-0.5 text-[10.5px] leading-tight text-[var(--ink-muted)]">
                              {m.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1">
                        {project.stack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-[var(--border-mineral)] bg-white px-3 py-1 font-mono text-[10.5px] text-[var(--ink-slate)]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2">
                        <MagneticButton
                          href={`/work/${project.slug}`}
                          variant={isOrange ? "primary" : "teal"}
                          cursorText="OPEN FILM"
                        >
                          Read 4-Chapter Case Study <ArrowUpRight className="h-4 w-4" />
                        </MagneticButton>
                      </div>
                    </div>

                    {/* Interactive 3D Artifact Pedestal */}
                    <div className="mt-6 md:mt-0 h-[300px] md:h-[380px] w-full overflow-hidden rounded-[26px] border border-[var(--border-mineral)] sunlit-aura">
                      <SceneCanvas
                        cameraPosition={[0, 0.25, 4.4]}
                        fallbackLabel={project.title}
                      >
                        <ProjectArtifact3D variant={project.artifact} />
                      </SceneCanvas>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
