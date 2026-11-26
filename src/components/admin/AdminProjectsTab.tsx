"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  CopyPlus,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Plus,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import type {
  MediaAsset,
  Project,
  ProjectCardTone,
  ProjectCategory,
  ProjectMediaFit,
  ProjectMediaFocalPoint,
  ProjectMediaFrameStyle,
  ProjectMediaTone,
  ProjectThemePreset,
} from "@/types/cms";
import {
  PROJECT_FRAME_OPTIONS,
  PROJECT_THEME_PRESET_LIST,
  PROJECT_THEME_PRESETS,
  PROJECT_TONE_OPTIONS,
  resolveProjectTheme,
} from "@/lib/project-theme";
import { ProjectMediaFrame } from "@/components/ui/ProjectMediaFrame";

interface AdminProjectsTabProps {
  projects: Project[];
  mediaLibrary: MediaAsset[];
  onChange: (next: Project[]) => void;
  onUploadImage: (file: File, alt: string) => Promise<MediaAsset | null>;
}

const CATEGORIES: ProjectCategory[] = ["SaaS Products", "Web Platforms", "Design Systems"];

function createEmptyProject(index: number): Project {
  const num = String(index + 1).padStart(2, "0");
  return {
    id: `proj-${Date.now()}`,
    slug: `new-project-${index + 1}`,
    number: num,
    title: "New Product Case Study",
    client: "Client Name",
    year: String(new Date().getFullYear()),
    role: "Lead Product Engineer",
    timeline: "4 Months",
    category: "SaaS Products",
    featured: true,
    published: true,
    media: {
      coverImage: "/images/projects/aether-cloud.png",
      alt: "New product showcase screenshot",
      fit: "cover",
      focalPoint: "center",
      frameStyle: "default",
      surfaceTone: "default",
      caption: "",
      gallery: [],
    },
    theme: {
      preset: "default",
      ...PROJECT_THEME_PRESETS.default,
    },
    tagline: "A crisp one-sentence summary explaining what this product solves.",
    keyResult: "+40% faster workflows · 99.9% reliability",
    overview: "Describe the business problem, your engineering ownership, and the measurable result.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "MySQL"],
    metrics: [
      { label: "Speed Gain", value: "2.4×", note: "Measured post-launch" },
      { label: "Conversion Lift", value: "+32%", note: "Quarter over quarter" },
    ],
    challenge: {
      heading: "What needed to change",
      description: "Explain the primary user or engineering bottleneck.",
      points: ["First key pain point", "Second key pain point"],
    },
    solution: {
      heading: "How we engineered the solution",
      description: "Explain the architectural and design direction.",
      decisions: [
        { title: "Clear Architecture", detail: "Key technical decision and why it worked." },
        { title: "Responsive Polish", detail: "How it delivered a great mobile & desktop experience." },
      ],
    },
    outcome: {
      heading: "Verified business results",
      description: "Summarize the final impact after launch.",
      takeaways: ["Key lesson learned from shipping this project."],
    },
  };
}

export function AdminProjectsTab({
  projects,
  mediaLibrary,
  onChange,
  onUploadImage,
}: AdminProjectsTabProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const safeIndex = Math.min(selectedIndex, Math.max(0, projects.length - 1));
  const active = projects[safeIndex];

  const updateProject = (patch: Partial<Project>) => {
    const next = projects.map((p, i) => (i === safeIndex ? { ...p, ...patch } : p));
    onChange(next);
  };

  const addProject = () => {
    const created = createEmptyProject(projects.length);
    const next = [...projects, created];
    onChange(next);
    setSelectedIndex(next.length - 1);
  };

  const duplicateProject = (idx: number) => {
    const src = projects[idx];
    const copy: Project = {
      ...structuredClone(src),
      id: `proj-${Date.now()}`,
      slug: `${src.slug}-copy-${projects.length + 1}`,
      number: String(projects.length + 1).padStart(2, "0"),
      title: `${src.title} (Copy)`,
    };
    const next = [...projects, copy];
    onChange(next);
    setSelectedIndex(next.length - 1);
  };

  const removeProject = (idx: number) => {
    const next = projects
      .filter((_, i) => i !== idx)
      .map((p, i) => ({ ...p, number: String(i + 1).padStart(2, "0") }));
    onChange(next);
    setSelectedIndex(Math.max(0, idx - 1));
  };

  const moveProject = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= projects.length) return;
    const next = [...projects];
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next.map((p, i) => ({ ...p, number: String(i + 1).padStart(2, "0") })));
    setSelectedIndex(target);
  };

  const applyPreset = (preset: ProjectThemePreset) => {
    if (!active) return;
    if (preset === "custom") {
      updateProject({ theme: { ...active.theme, preset: "custom" } });
      return;
    }
    const p = PROJECT_THEME_PRESETS[preset];
    updateProject({
      theme: {
        preset,
        accentColor: p.accentColor,
        secondaryAccent: p.secondaryAccent,
        surfaceColor: p.surfaceColor,
        cardTone: p.cardTone,
        accentInk: p.accentInk,
      },
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !active) return;
    setUploading(true);
    try {
      const asset = await onUploadImage(file, active.title);
      if (asset) {
        updateProject({
          media: { ...active.media, coverImage: asset.url, alt: asset.alt || active.title },
        });
      }
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const resolvedPreview = active ? resolveProjectTheme(active.theme) : null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      {/* Left Project List */}
      <div className="xl:col-span-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[var(--ink-obsidian)]">
              Portfolio Projects ({projects.length})
            </h2>
            <p className="text-xs text-[var(--ink-slate)]">
              Each project owns its real product image &amp; custom theme.
            </p>
          </div>
          <button
            type="button"
            onClick={addProject}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--neon-orange)] px-3.5 py-2 text-xs font-bold text-[#0F171A] shadow-sm hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Add Project
          </button>
        </div>

        <div className="space-y-2.5">
          {projects.map((p, idx) => {
            const isSelected = idx === safeIndex;
            const t = resolveProjectTheme(p.theme);
            return (
              <div
                key={p.id || p.slug}
                onClick={() => setSelectedIndex(idx)}
                className={`rounded-2xl border p-3.5 transition-all cursor-pointer ${
                  isSelected
                    ? "border-[var(--ink-obsidian)] bg-white shadow-md"
                    : "border-[var(--border-mineral)] bg-white/75 hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-12 w-16 shrink-0 overflow-hidden rounded-xl border"
                    style={{ borderColor: t.cardBorder, backgroundColor: t.sectionBg }}
                  >
                    <img
                      src={p.media.coverImage}
                      alt={p.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: p.theme.accentColor }}
                      />
                      <span className="truncate text-sm font-bold text-[var(--ink-obsidian)]">
                        {p.title}
                      </span>
                    </div>
                    <div className="mt-0.5 text-[11px] text-[var(--ink-muted)] truncate">
                      {p.category} · /{p.slug}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-[var(--border-mineral)]/70 pt-2.5">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange(
                          projects.map((item, i) =>
                            i === idx ? { ...item, published: !(item.published !== false) } : item
                          )
                        );
                      }}
                      title="Toggle Published"
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold cursor-pointer ${
                        p.published !== false
                          ? "bg-[var(--teal-mist)] text-[var(--teal-deep)]"
                          : "bg-black/8 text-[var(--ink-muted)]"
                      }`}
                    >
                      {p.published !== false ? (
                        <>
                          <Eye className="h-3 w-3" /> Live
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" /> Draft
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange(
                          projects.map((item, i) =>
                            i === idx ? { ...item, featured: !(item.featured !== false) } : item
                          )
                        );
                      }}
                      title="Toggle Featured on Home Slider"
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold cursor-pointer ${
                        p.featured !== false
                          ? "bg-[var(--orange-halo)] text-[var(--orange-lacquer)]"
                          : "bg-black/8 text-[var(--ink-muted)]"
                      }`}
                    >
                      <Star className="h-3 w-3" /> Home
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveProject(idx, -1);
                      }}
                      disabled={idx === 0}
                      className="rounded-lg p-1 text-[var(--ink-slate)] hover:bg-black/5 disabled:opacity-30 cursor-pointer"
                      title="Move up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveProject(idx, 1);
                      }}
                      disabled={idx === projects.length - 1}
                      className="rounded-lg p-1 text-[var(--ink-slate)] hover:bg-black/5 disabled:opacity-30 cursor-pointer"
                      title="Move down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateProject(idx);
                      }}
                      className="rounded-lg p-1 text-[var(--ink-slate)] hover:bg-black/5 cursor-pointer"
                      title="Duplicate"
                    >
                      <CopyPlus className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeProject(idx);
                      }}
                      className="rounded-lg p-1 text-red-600 hover:bg-red-50 cursor-pointer"
                      title="Delete project"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Full Project Editor + Live Theme & Image Preview */}
      {active && resolvedPreview && (
        <div className="xl:col-span-8 space-y-6">
          {/* LIVE CARD & IMAGE PREVIEW */}
          <div
            className="rounded-3xl border border-black/10 p-5 sm:p-6 transition-colors"
            style={{ backgroundColor: resolvedPreview.sectionBg }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-[var(--ink-obsidian)]">
                Live Card &amp; Theme Preview
              </span>
              <span className="font-mono text-[11px] text-[var(--ink-obsidian)]/65">
                {active.media.frameStyle} · {active.media.surfaceTone} · {active.theme.cardTone}
              </span>
            </div>

            <div
              className="relative overflow-hidden rounded-2xl border-2 p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center"
              style={{
                background: resolvedPreview.cardBg,
                borderColor: resolvedPreview.cardBorder,
                boxShadow: resolvedPreview.cardShadow,
              }}
            >
              <div
                className="absolute left-0 right-0 top-0 h-1.5"
                style={{ background: resolvedPreview.topBarGradient }}
              />
              <div className="md:col-span-6 space-y-2.5 pt-1">
                <span
                  className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                  style={{
                    backgroundColor: resolvedPreview.badgeBg,
                    color: resolvedPreview.badgeText,
                  }}
                >
                  {active.category}
                </span>
                <div className="text-xl font-bold" style={{ color: resolvedPreview.titleColor }}>
                  {active.title}
                </div>
                <p className="text-xs line-clamp-2" style={{ color: resolvedPreview.bodyColor }}>
                  {active.tagline}
                </p>
                <div
                  className="rounded-xl border px-3 py-2 text-xs font-bold"
                  style={{
                    backgroundColor: resolvedPreview.resultBg,
                    borderColor: resolvedPreview.resultBorder,
                    color: resolvedPreview.accentInk,
                  }}
                >
                  {active.keyResult}
                </div>
              </div>
              <div className="md:col-span-6">
                <ProjectMediaFrame
                  media={active.media}
                  theme={active.theme}
                  title={active.title}
                  compact
                />
              </div>
            </div>
          </div>

          {/* 1. REAL PRODUCT IMAGE & FRAME SETTINGS */}
          <div className="rounded-3xl border border-[var(--border-mineral)] bg-white p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-[var(--ink-obsidian)]">
                  Product Image &amp; Adaptive Framing
                </h3>
                <p className="text-xs text-[var(--ink-slate)]">
                  Upload any real screenshot or photo — choose how it frames &amp; crops cleanly.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ink-obsidian)] px-4 py-2 text-xs font-semibold text-[#F7F5F0] cursor-pointer hover:opacity-90">
                  <Upload className="h-3.5 w-3.5 text-[var(--neon-teal)]" />
                  {uploading ? "Uploading..." : "Upload Image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setShowPicker((v) => !v)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2 text-xs font-semibold text-[var(--ink-obsidian)] cursor-pointer hover:border-[var(--teal-deep)]"
                >
                  <ImageIcon className="h-3.5 w-3.5" /> Pick from Library
                </button>
              </div>
            </div>

            {showPicker && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] p-3">
                {mediaLibrary.map((asset) => (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => {
                      updateProject({
                        media: { ...active.media, coverImage: asset.url, alt: asset.alt },
                      });
                      setShowPicker(false);
                    }}
                    className="group overflow-hidden rounded-xl border border-[var(--border-mineral)] bg-white text-left cursor-pointer hover:border-[var(--neon-orange)]"
                  >
                    <div className="aspect-[16/10] w-full overflow-hidden">
                      <img
                        src={asset.url}
                        alt={asset.alt}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="truncate px-2 py-1 text-[10px] font-medium text-[var(--ink-slate)]">
                      {asset.filename}
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
                  Cover Image URL / Path
                </label>
                <input
                  value={active.media.coverImage}
                  onChange={(e) =>
                    updateProject({ media: { ...active.media, coverImage: e.target.value } })
                  }
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
                  Image Alt Text (Accessibility &amp; SEO)
                </label>
                <input
                  value={active.media.alt}
                  onChange={(e) =>
                    updateProject({ media: { ...active.media, alt: e.target.value } })
                  }
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                  Frame Style
                </label>
                <select
                  value={active.media.frameStyle || "default"}
                  onChange={(e) =>
                    updateProject({
                      media: {
                        ...active.media,
                        frameStyle: e.target.value as ProjectMediaFrameStyle,
                      },
                    })
                  }
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2 text-xs font-semibold"
                >
                  {PROJECT_FRAME_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                  Image Tone
                </label>
                <select
                  value={active.media.surfaceTone || "default"}
                  onChange={(e) =>
                    updateProject({
                      media: {
                        ...active.media,
                        surfaceTone: e.target.value as ProjectMediaTone,
                      },
                    })
                  }
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2 text-xs font-semibold"
                >
                  {PROJECT_TONE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                  Scaling Fit
                </label>
                <select
                  value={active.media.fit}
                  onChange={(e) =>
                    updateProject({
                      media: { ...active.media, fit: e.target.value as ProjectMediaFit },
                    })
                  }
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2 text-xs font-semibold"
                >
                  <option value="cover">Cover (Fill)</option>
                  <option value="contain">Contain (No Crop)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                  Focal Point
                </label>
                <select
                  value={active.media.focalPoint}
                  onChange={(e) =>
                    updateProject({
                      media: {
                        ...active.media,
                        focalPoint: e.target.value as ProjectMediaFocalPoint,
                      },
                    })
                  }
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2 text-xs font-semibold"
                >
                  <option value="center">Center</option>
                  <option value="top">Top</option>
                  <option value="bottom">Bottom</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. DYNAMIC THEME & COLOR STUDIO */}
          <div className="rounded-3xl border border-[var(--border-mineral)] bg-white p-6 space-y-4">
            <h3 className="text-base font-bold text-[var(--ink-obsidian)]">
              Slide &amp; Card Color Theme (Auto WCAG Contrast)
            </h3>

            <div className="flex flex-wrap gap-2">
              {PROJECT_THEME_PRESET_LIST.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    active.theme.preset === preset.id
                      ? "bg-[var(--ink-obsidian)] text-[#F7F5F0]"
                      : "border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] text-[var(--ink-slate)] hover:border-[var(--ink-obsidian)]/35"
                  }`}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full border border-black/15"
                    style={{ backgroundColor: preset.swatch }}
                  />
                  {preset.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => applyPreset("custom")}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  active.theme.preset === "custom"
                    ? "bg-[var(--ink-obsidian)] text-[#F7F5F0]"
                    : "border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] text-[var(--ink-slate)]"
                }`}
              >
                Custom Hex
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={active.theme.accentColor}
                    onChange={(e) =>
                      updateProject({
                        theme: {
                          ...active.theme,
                          preset: "custom",
                          accentColor: e.target.value,
                          accentInk: undefined,
                        },
                      })
                    }
                    className="h-10 w-12 rounded-xl border border-[var(--border-mineral)] cursor-pointer"
                  />
                  <input
                    value={active.theme.accentColor}
                    onChange={(e) =>
                      updateProject({
                        theme: {
                          ...active.theme,
                          preset: "custom",
                          accentColor: e.target.value,
                          accentInk: undefined,
                        },
                      })
                    }
                    className="flex-1 rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
                  Backdrop Surface Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={active.theme.surfaceColor}
                    onChange={(e) =>
                      updateProject({
                        theme: {
                          ...active.theme,
                          preset: "custom",
                          surfaceColor: e.target.value,
                        },
                      })
                    }
                    className="h-10 w-12 rounded-xl border border-[var(--border-mineral)] cursor-pointer"
                  />
                  <input
                    value={active.theme.surfaceColor}
                    onChange={(e) =>
                      updateProject({
                        theme: {
                          ...active.theme,
                          preset: "custom",
                          surfaceColor: e.target.value,
                        },
                      })
                    }
                    className="flex-1 rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
                  Card Tone
                </label>
                <select
                  value={active.theme.cardTone}
                  onChange={(e) =>
                    updateProject({
                      theme: {
                        ...active.theme,
                        cardTone: e.target.value as ProjectCardTone,
                        accentInk: undefined,
                      },
                    })
                  }
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2.5 text-xs font-semibold"
                >
                  <option value="tinted">Tinted Light Surface</option>
                  <option value="light">Pure Porcelain White</option>
                  <option value="dark">Luxury Dark Obsidian</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. CORE DETAILS & CASE STUDY CONTENT */}
          <div className="rounded-3xl border border-[var(--border-mineral)] bg-white p-6 space-y-4">
            <h3 className="text-base font-bold text-[var(--ink-obsidian)]">
              Project Details &amp; Case Study Story
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
                  Project Title
                </label>
                <input
                  value={active.title}
                  onChange={(e) => updateProject({ title: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
                  URL Slug (/work/...)
                </label>
                <input
                  value={active.slug}
                  onChange={(e) =>
                    updateProject({
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                    })
                  }
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
                  Category
                </label>
                <select
                  value={active.category}
                  onChange={(e) =>
                    updateProject({ category: e.target.value as ProjectCategory })
                  }
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
                  Client · Year
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    value={active.client}
                    onChange={(e) => updateProject({ client: e.target.value })}
                    placeholder="Client"
                    className="col-span-2 rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2.5 text-sm"
                  />
                  <input
                    value={active.year}
                    onChange={(e) => updateProject({ year: e.target.value })}
                    placeholder="2026"
                    className="rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2.5 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
                  Role
                </label>
                <input
                  value={active.role}
                  onChange={(e) => updateProject({ role: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
                  Key Result Highlight
                </label>
                <input
                  value={active.keyResult}
                  onChange={(e) => updateProject({ keyResult: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
                Short Tagline (Shown on Home Slider)
              </label>
              <textarea
                rows={2}
                value={active.tagline}
                onChange={(e) => updateProject({ tagline: e.target.value })}
                className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
                Full Case Study Overview
              </label>
              <textarea
                rows={3}
                value={active.overview}
                onChange={(e) => updateProject({ overview: e.target.value })}
                className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
                Tech Stack (comma separated)
              </label>
              <input
                value={active.stack.join(", ")}
                onChange={(e) =>
                  updateProject({
                    stack: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
              />
            </div>

            {/* Challenge / Solution / Outcome Quick Editors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-[var(--border-mineral)]">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[var(--orange-lacquer)]">
                  01 · Challenge
                </label>
                <input
                  value={active.challenge.heading}
                  onChange={(e) =>
                    updateProject({
                      challenge: { ...active.challenge, heading: e.target.value },
                    })
                  }
                  placeholder="Challenge heading"
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2 text-xs font-semibold"
                />
                <textarea
                  rows={3}
                  value={active.challenge.description}
                  onChange={(e) =>
                    updateProject({
                      challenge: { ...active.challenge, description: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2 text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[var(--teal-deep)]">
                  02 · Solution
                </label>
                <input
                  value={active.solution.heading}
                  onChange={(e) =>
                    updateProject({
                      solution: { ...active.solution, heading: e.target.value },
                    })
                  }
                  placeholder="Solution heading"
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2 text-xs font-semibold"
                />
                <textarea
                  rows={3}
                  value={active.solution.description}
                  onChange={(e) =>
                    updateProject({
                      solution: { ...active.solution, description: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2 text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[var(--teal-deep)]">
                  03 · Outcome
                </label>
                <input
                  value={active.outcome.heading}
                  onChange={(e) =>
                    updateProject({
                      outcome: { ...active.outcome, heading: e.target.value },
                    })
                  }
                  placeholder="Outcome heading"
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2 text-xs font-semibold"
                />
                <textarea
                  rows={3}
                  value={active.outcome.description}
                  onChange={(e) =>
                    updateProject({
                      outcome: { ...active.outcome, description: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2 text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
