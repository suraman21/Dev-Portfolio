"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { ProjectCategory } from "@/types/cms";
import { useCms } from "@/components/cms/CmsProvider";
import { resolveProjectTheme } from "@/lib/project-theme";
import { ProjectMediaFrame } from "@/components/ui/ProjectMediaFrame";

const categories: ("All" | ProjectCategory)[] = [
  "All",
  "SaaS Products",
  "Web Platforms",
  "Design Systems",
];

export default function WorkPage() {
  const { data } = useCms();
  const [selected, setSelected] = useState<"All" | ProjectCategory>("All");

  const visibleProjects = data.projects.filter((p) => p.published !== false);
  const filtered =
    selected === "All"
      ? visibleProjects
      : visibleProjects.filter((p) => p.category === selected);

  return (
    <div className="sunlit-aura pt-24 pb-28 md:pt-36 md:pb-24">
      <div className="shell">
        <header className="max-w-3xl pb-8 sm:pb-10 border-b border-[var(--border-mineral)]">
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
            presented with its own real product visuals, adaptive palette, and measurable results.
          </p>

          <div className="mt-6 sm:mt-7 flex flex-wrap gap-2">
            {categories.map((cat) => {
              const active = selected === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelected(cat)}
                  className={`rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-semibold transition-all cursor-pointer ${
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

        <motion.div layout className="mt-8 sm:mt-10 grid grid-cols-1 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, idx) => {
              const theme = resolveProjectTheme(project.theme);
              return (
                <motion.article
                  layout
                  key={project.slug}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 280, damping: 28 }}
                  style={{
                    background: theme.cardBg,
                    borderColor: theme.cardBorder,
                    boxShadow: theme.cardShadow,
                  }}
                  className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] border-2 p-5 sm:p-7 md:p-9"
                >
                  <div
                    aria-hidden="true"
                    className="absolute left-0 right-0 top-0 h-1.5 sm:h-2"
                    style={{ background: theme.topBarGradient }}
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-9 items-center pt-1">
                    {/* Media First on Mobile, Right on Desktop */}
                    <div className="lg:order-2 lg:col-span-6">
                      <ProjectMediaFrame
                        media={project.media}
                        theme={project.theme}
                        title={project.title}
                        priority={idx === 0}
                      />
                    </div>

                    <div className="lg:order-1 lg:col-span-6 space-y-4 sm:space-y-5">
                      <div className="flex flex-wrap items-center gap-2.5 text-xs">
                        <span
                          className="rounded-full px-3 py-1 font-bold"
                          style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}
                        >
                          {project.category}
                        </span>
                        <span className="font-semibold" style={{ color: theme.mutedColor }}>
                          {project.client} · {project.year}
                        </span>
                      </div>

                      <h2
                        className="text-2xl sm:text-h2 font-bold"
                        style={{ color: theme.titleColor }}
                      >
                        {project.title}
                      </h2>

                      <p
                        className="text-sm sm:text-body max-w-[52ch]"
                        style={{ color: theme.bodyColor }}
                      >
                        {project.overview}
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                        {project.metrics.map((m) => (
                          <div
                            key={m.label}
                            className="rounded-2xl border p-3"
                            style={{
                              backgroundColor: theme.resultBg,
                              borderColor: theme.resultBorder,
                            }}
                          >
                            <div
                              className="text-base sm:text-lg font-bold"
                              style={{ color: theme.accentInk }}
                            >
                              {m.value}
                            </div>
                            <div
                              className="mt-0.5 text-[11px] leading-snug"
                              style={{ color: theme.mutedColor }}
                            >
                              {m.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {project.stack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border px-3 py-1 text-xs font-medium"
                            style={{
                              backgroundColor: theme.chipBg,
                              borderColor: theme.chipBorder,
                              color: theme.chipText,
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="pt-1">
                        <Link
                          href={`/work/${project.slug}`}
                          style={{ backgroundColor: theme.ctaBg, color: theme.ctaText }}
                          className="inline-flex w-full sm:w-auto min-h-[44px] items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <span>Read Case Study</span>
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </div>
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
