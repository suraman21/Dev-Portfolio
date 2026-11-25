"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects, type ProjectCategory } from "@/data/projects";
import { ProjectPreview } from "@/components/ui/ProjectPreview";
import { MagneticButton } from "@/components/ui/MagneticButton";

const categories: ("All" | ProjectCategory)[] = [
  "All",
  "SaaS Products",
  "Web Platforms",
  "Design Systems",
];

export default function WorkPage() {
  const [selected, setSelected] = useState<"All" | ProjectCategory>("All");

  const filtered =
    selected === "All" ? projects : projects.filter((p) => p.category === selected);

  return (
    <div className="sunlit-aura pt-28 pb-24 md:pt-36">
      <div className="shell">
        <header className="max-w-3xl pb-10 border-b border-[var(--border-mineral)]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--orange-lacquer)]">
            Selected Work
          </span>
          <h1 className="mt-3 text-hero font-bold text-[var(--ink-obsidian)]">
            Products &amp; websites built for{" "}
            <span className="font-editorial italic font-normal text-[var(--teal-deep)]">
              real impact.
            </span>
          </h1>
          <p className="mt-4 text-body-lg text-[var(--ink-slate)] max-w-[56ch]">
            A curated collection of SaaS platforms, luxury storefronts, and design systems — each
            written clearly around the problem, key decisions, and measurable results.
          </p>

          <div className="mt-7 flex flex-wrap gap-2.5">
            {categories.map((cat) => {
              const active = selected === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelected(cat)}
                  className={`rounded-full px-5 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-[var(--ink-obsidian)] text-[#F7F5F0]"
                      : "border border-[var(--border-mineral)] bg-white text-[var(--ink-slate)] hover:border-[var(--neon-teal)] hover:text-[var(--ink-obsidian)]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </header>

        <motion.div layout className="mt-10 grid grid-cols-1 gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => {
              const isOrange = project.accent === "orange";
              return (
                <motion.article
                  layout
                  key={project.slug}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 280, damping: 28 }}
                  className="cq-shell porcelain-card dichroic-ring rounded-[32px] p-6 md:p-9"
                >
                  <div className="cq-split">
                    <div className="space-y-5">
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <span
                          className={`rounded-full px-3 py-1 font-semibold ${
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

                      <h2 className="text-h2 font-bold text-[var(--ink-obsidian)]">
                        {project.title}
                      </h2>

                      <p className="text-body text-[var(--ink-slate)] max-w-[52ch]">
                        {project.overview}
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                        {project.metrics.map((m) => (
                          <div
                            key={m.label}
                            className="rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] p-3"
                          >
                            <div
                              className={`text-lg font-bold ${
                                isOrange ? "text-[var(--orange-lacquer)]" : "text-[var(--teal-deep)]"
                              }`}
                            >
                              {m.value}
                            </div>
                            <div className="mt-0.5 text-[11px] text-[var(--ink-muted)]">
                              {m.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {project.stack.map((tech) => (
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
                          Read Case Study <ArrowUpRight className="h-4 w-4" />
                        </MagneticButton>
                      </div>
                    </div>

                    <div className="mt-6 md:mt-0">
                      <ProjectPreview type={project.previewType} title={project.title} />
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
