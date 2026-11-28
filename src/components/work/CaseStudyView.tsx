"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Images,
  Maximize2,
  X,
} from "lucide-react";
import type { Project, ProjectMedia } from "@/types/cms";
import { resolveProjectTheme } from "@/lib/project-theme";
import {
  normalizeGalleryItems,
  resolveGalleryAspectClass,
  resolveGallerySizeMeta,
} from "@/lib/project-gallery";
import { ProjectMediaFrame } from "@/components/ui/ProjectMediaFrame";
import { MagneticButton } from "@/components/ui/MagneticButton";

interface CaseStudyViewProps {
  project: Project;
  nextProject: Project;
}

interface LightboxSlide {
  url: string;
  alt: string;
  caption?: string;
  sizeLabel: string;
  media: ProjectMedia;
  aspectClass: string;
}

export function CaseStudyView({ project, nextProject }: CaseStudyViewProps) {
  const theme = resolveProjectTheme(project.theme);
  const galleryItems = useMemo(
    () => normalizeGalleryItems(project.media.gallery),
    [project.media.gallery]
  );

  // Unified list: index 0 = primary cover, index 1..N = multi-size gallery visuals
  const allSlides = useMemo<LightboxSlide[]>(() => {
    const coverSlide: LightboxSlide = {
      url: project.media.coverImage,
      alt: project.media.alt || project.title,
      caption: project.media.caption,
      sizeLabel: "Cover Visual",
      media: project.media,
      aspectClass: "aspect-[16/10]",
    };

    const extraSlides: LightboxSlide[] = galleryItems.map((item) => {
      const sizeMeta = resolveGallerySizeMeta(item.size);
      const aspectClass = resolveGalleryAspectClass(item.aspect, item.size);
      return {
        url: item.url,
        alt: item.alt || project.title,
        caption: item.caption,
        sizeLabel: sizeMeta.shortLabel,
        aspectClass,
        media: {
          ...project.media,
          coverImage: item.url,
          alt: item.alt || project.title,
          fit: item.fit || project.media.fit || "cover",
          focalPoint: item.focalPoint || project.media.focalPoint || "center",
          frameStyle: item.frameStyle || project.media.frameStyle || "default",
        },
      };
    });

    return [coverSlide, ...extraSlides];
  }, [galleryItems, project.media, project.title]);

  const [activeHeroIdx, setActiveHeroIdx] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // Reset active hero preview when navigating between projects
  useEffect(() => {
    setActiveHeroIdx(0);
    setLightboxIdx(null);
  }, [project.slug]);

  const safeHeroIdx = Math.min(activeHeroIdx, Math.max(0, allSlides.length - 1));
  const activeHeroSlide = allSlides[safeHeroIdx];

  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const stepLightbox = useCallback(
    (delta: number) => {
      setLightboxIdx((prev) => {
        if (prev === null || allSlides.length === 0) return null;
        return (prev + delta + allSlides.length) % allSlides.length;
      });
    },
    [allSlides.length]
  );

  // Keyboard navigation for fullscreen lightbox
  useEffect(() => {
    if (lightboxIdx === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") stepLightbox(1);
      else if (e.key === "ArrowLeft") stepLightbox(-1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxIdx, closeLightbox, stepLightbox]);

  return (
    <article className="bg-[var(--bg-alabaster)] pt-24 pb-28 md:pt-36 md:pb-24">
      {/* Dynamic Per-Project Tinted Hero Header & Interactive Visual Showcase */}
      <div
        className="border-b border-black/10 transition-colors"
        style={{ backgroundColor: theme.sectionBg }}
      >
        <header className="shell py-10 sm:py-14">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--ink-obsidian)]/75 hover:text-[var(--ink-obsidian)]"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Selected Work
            </Link>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-black/15 bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-[var(--ink-obsidian)] hover:border-[var(--ink-obsidian)] transition-colors"
              >
                Visit Live Product <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>

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
                {galleryItems.length > 0 && (
                  <a
                    href="#visual-showcase"
                    className="inline-flex items-center gap-1 rounded-full bg-white/85 border border-black/10 px-2.5 py-1 text-[11px] font-semibold text-[var(--ink-obsidian)] hover:bg-white transition-colors"
                  >
                    <Images className="h-3 w-3" style={{ color: theme.accentInk }} />
                    {allSlides.length} Visuals
                  </a>
                )}
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

            {/* Primary Hero Frame + Interactive Thumbnail Strip when multiple visuals exist */}
            <div className="lg:col-span-6 space-y-3">
              <div className="relative group/heroframe">
                <ProjectMediaFrame
                  media={activeHeroSlide.media}
                  theme={project.theme}
                  title={project.title}
                  priority
                />
                <button
                  type="button"
                  onClick={() => setLightboxIdx(safeHeroIdx)}
                  aria-label="Open fullscreen visual preview"
                  className="absolute right-3.5 bottom-3.5 inline-flex items-center gap-1.5 rounded-full bg-[var(--ink-obsidian)]/82 px-3 py-1.5 text-[11px] font-semibold text-[#F7F5F0] backdrop-blur-md shadow-lg transition-all hover:bg-[var(--ink-obsidian)] hover:scale-[1.03] cursor-pointer"
                >
                  <Maximize2 className="h-3 w-3 text-[var(--neon-teal)]" />
                  <span>Expand</span>
                </button>
              </div>

              {activeHeroSlide.caption && (
                <p className="text-center text-xs text-[var(--ink-obsidian)]/65">
                  {activeHeroSlide.caption}
                </p>
              )}

              {/* Quick Visual Switcher Strip right in the Hero when project has multiple images */}
              {allSlides.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5">
                  {allSlides.map((slide, idx) => {
                    const isActive = idx === safeHeroIdx;
                    return (
                      <button
                        key={`${slide.url}-${idx}`}
                        type="button"
                        onClick={() => setActiveHeroIdx(idx)}
                        aria-label={`Preview visual ${idx + 1}: ${slide.alt}`}
                        className={`relative h-14 w-20 sm:h-16 sm:w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
                          isActive
                            ? "border-[var(--ink-obsidian)] shadow-md scale-[1.02]"
                            : "border-white/75 opacity-70 hover:opacity-100 hover:border-black/30"
                        }`}
                      >
                        <img
                          src={slide.url}
                          alt={slide.alt}
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute bottom-1 right-1 rounded bg-black/65 px-1.5 py-0.5 font-mono text-[9px] font-bold text-white">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                      </button>
                    );
                  })}
                </div>
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

      {/* Multi-Size Editorial Visual Showcase — Displays all additional images in their chosen sizes */}
      {galleryItems.length > 0 && (
        <section
          id="visual-showcase"
          aria-label="Project Visual Showcase"
          className="shell py-12 md:py-20 border-b border-[var(--border-mineral)]"
        >
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: theme.accentInk }}
              >
                Visual Showcase · {allSlides.length} Screens
              </span>
              <h2 className="mt-2 text-h3 font-bold text-[var(--ink-obsidian)]">
                Inside the{" "}
                <span className="font-editorial italic font-normal" style={{ color: theme.accentInk }}>
                  experience.
                </span>
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setLightboxIdx(0)}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border-mineral)] bg-white px-4 py-2 text-xs font-semibold text-[var(--ink-obsidian)] hover:border-[var(--ink-obsidian)] transition-colors cursor-pointer"
            >
              <Maximize2 className="h-3.5 w-3.5" style={{ color: theme.accentInk }} />
              View All in Fullscreen
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-7 items-start">
            {galleryItems.map((item, idx) => {
              const sizeMeta = resolveGallerySizeMeta(item.size);
              const aspectClass = resolveGalleryAspectClass(item.aspect, item.size);
              const slideIndex = idx + 1;
              const itemMedia: ProjectMedia = {
                ...project.media,
                coverImage: item.url,
                alt: item.alt || `${project.title} visual ${slideIndex + 1}`,
                fit: item.fit || project.media.fit || "cover",
                focalPoint: item.focalPoint || project.media.focalPoint || "center",
                frameStyle: item.frameStyle || project.media.frameStyle || "default",
              };

              return (
                <figure
                  key={item.id || `${item.url}-${idx}`}
                  className={`group/gal col-span-1 ${sizeMeta.colSpanClass} space-y-2.5`}
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setLightboxIdx(slideIndex)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setLightboxIdx(slideIndex);
                      }
                    }}
                    aria-label={`Open full-size view of ${item.caption || item.alt || `visual ${slideIndex + 1}`}`}
                    className="relative cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neon-teal)] rounded-[24px]"
                  >
                    <ProjectMediaFrame
                      media={itemMedia}
                      theme={project.theme}
                      title={item.caption || project.title}
                      aspectClass={aspectClass}
                    />
                    <span className="pointer-events-none absolute right-3.5 top-3.5 inline-flex items-center gap-1 rounded-full bg-[var(--ink-obsidian)]/80 px-2.5 py-1 text-[10px] font-semibold text-white opacity-0 backdrop-blur-md transition-opacity duration-200 group-hover/gal:opacity-100">
                      <Maximize2 className="h-3 w-3 text-[var(--neon-teal)]" />
                      Full size
                    </span>
                  </div>

                  {item.caption && (
                    <figcaption className="flex items-start justify-between gap-3 px-1 text-xs text-[var(--ink-slate)] leading-relaxed">
                      <span>{item.caption}</span>
                      <span className="shrink-0 font-mono text-[10px] text-[var(--ink-muted)]">
                        {String(slideIndex + 1).padStart(2, "0")}
                      </span>
                    </figcaption>
                  )}
                </figure>
              );
            })}
          </div>
        </section>
      )}

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

      {/* Luxury Fullscreen Lightbox Modal */}
      {lightboxIdx !== null && allSlides[lightboxIdx] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen project image gallery"
          onClick={closeLightbox}
          className="fixed inset-0 z-[120] flex flex-col justify-between bg-[#0B1215]/92 p-4 sm:p-6 backdrop-blur-xl"
        >
          {/* Top Bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 text-white"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-xs font-bold text-[var(--neon-teal)]">
                {String(lightboxIdx + 1).padStart(2, "0")} /{" "}
                {String(allSlides.length).padStart(2, "0")}
              </span>
              <span className="truncate text-sm font-semibold text-white/90">
                {project.title}
              </span>
              <span className="hidden sm:inline-block rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[11px] text-white/70">
                {allSlides[lightboxIdx].sizeLabel}
              </span>
            </div>

            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Close fullscreen preview"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white hover:bg-white/20 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Center Full-Resolution Image */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative mx-auto my-auto flex w-full max-w-6xl items-center justify-center py-4"
          >
            {allSlides.length > 1 && (
              <button
                type="button"
                onClick={() => stepLightbox(-1)}
                aria-label="Previous visual"
                className="absolute left-0 sm:left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur-md hover:bg-white hover:text-[var(--ink-obsidian)] transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}

            <div className="flex flex-col items-center gap-3 px-12 sm:px-16">
              <img
                src={allSlides[lightboxIdx].url}
                alt={allSlides[lightboxIdx].alt}
                className="max-h-[72vh] max-w-full rounded-2xl border border-white/15 object-contain shadow-[0_32px_90px_-20px_rgba(0,0,0,0.85)]"
              />
              {allSlides[lightboxIdx].caption && (
                <p className="max-w-2xl text-center text-xs sm:text-sm text-white/80">
                  {allSlides[lightboxIdx].caption}
                </p>
              )}
            </div>

            {allSlides.length > 1 && (
              <button
                type="button"
                onClick={() => stepLightbox(1)}
                aria-label="Next visual"
                className="absolute right-0 sm:right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur-md hover:bg-white hover:text-[var(--ink-obsidian)] transition-colors cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnail Strip */}
          {allSlides.length > 1 && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="mx-auto flex max-w-4xl items-center gap-2 overflow-x-auto pb-1"
            >
              {allSlides.map((slide, idx) => (
                <button
                  key={`lb-${slide.url}-${idx}`}
                  type="button"
                  onClick={() => setLightboxIdx(idx)}
                  className={`h-12 w-16 sm:h-14 sm:w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
                    idx === lightboxIdx
                      ? "border-[var(--neon-teal)] scale-105 opacity-100"
                      : "border-white/15 opacity-55 hover:opacity-95"
                  }`}
                >
                  <img src={slide.url} alt={slide.alt} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
