"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Image as ImageIcon,
  Images,
  LayoutGrid,
  Link2,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import type {
  MediaAsset,
  ProjectGalleryAspect,
  ProjectGalleryItem,
  ProjectGallerySize,
  ProjectMediaFit,
  ProjectMediaFocalPoint,
  ProjectMediaFrameStyle,
} from "@/types/cms";
import { PROJECT_FRAME_OPTIONS } from "@/lib/project-theme";
import {
  PROJECT_GALLERY_ASPECT_OPTIONS,
  PROJECT_GALLERY_SIZE_OPTIONS,
  resolveGallerySizeMeta,
} from "@/lib/project-gallery";

interface AdminProjectGalleryEditorProps {
  projectTitle: string;
  gallery: ProjectGalleryItem[];
  mediaLibrary: MediaAsset[];
  onChange: (nextGallery: ProjectGalleryItem[]) => void;
  onPromoteToCover: (index: number) => void;
  onUploadImage: (file: File, alt: string) => Promise<MediaAsset | null>;
}

const PREVIEW_SPAN_CLASSES: Record<number, string> = {
  12: "col-span-12",
  8: "col-span-8",
  6: "col-span-6",
  4: "col-span-4",
};

export function AdminProjectGalleryEditor({
  projectTitle,
  gallery,
  mediaLibrary,
  onChange,
  onPromoteToCover,
  onUploadImage,
}: AdminProjectGalleryEditorProps) {
  const [showLibrary, setShowLibrary] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  const updateItem = (idx: number, patch: Partial<ProjectGalleryItem>) => {
    onChange(gallery.map((item, i) => (i === idx ? { ...item, ...patch } : item)));
  };

  const moveItem = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= gallery.length) return;
    const next = [...gallery];
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  };

  const removeItem = (idx: number) => {
    onChange(gallery.filter((_, i) => i !== idx));
  };

  const addBlankUrlItem = () => {
    const num = gallery.length + 2;
    const nextItem: ProjectGalleryItem = {
      id: `gal-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      url: "",
      alt: `${projectTitle} visual ${num}`,
      caption: "",
      size: "half",
      aspect: "16/10",
      fit: "cover",
      focalPoint: "center",
    };
    onChange([...gallery, nextItem]);
  };

  const addFromLibrary = (asset: MediaAsset) => {
    const nextItem: ProjectGalleryItem = {
      id: `gal-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      url: asset.url,
      alt: asset.alt || `${projectTitle} visual ${gallery.length + 2}`,
      caption: "",
      size: "half",
      aspect: "16/10",
      fit: "cover",
      focalPoint: "center",
    };
    onChange([...gallery, nextItem]);
  };

  const handleMultiUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const added: ProjectGalleryItem[] = [];
    try {
      for (let i = 0; i < files.length; i++) {
        setUploadProgress(`Uploading ${i + 1} / ${files.length}...`);
        const file = files[i];
        const asset = await onUploadImage(file, `${projectTitle} visual ${gallery.length + i + 2}`);
        if (asset) {
          added.push({
            id: `gal-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
            url: asset.url,
            alt: asset.alt || `${projectTitle} visual ${gallery.length + i + 2}`,
            caption: "",
            size: files.length === 1 ? "full" : "half",
            aspect: "auto",
            fit: "cover",
            focalPoint: "center",
          });
        }
      }
      if (added.length > 0) {
        onChange([...gallery, ...added]);
      }
    } finally {
      setUploadProgress(null);
      e.target.value = "";
    }
  };

  return (
    <div className="rounded-3xl border border-[var(--border-mineral)] bg-white p-6 space-y-5">
      {/* Header & Action Bar */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Images className="h-4 w-4 text-[var(--teal-deep)]" />
            <h3 className="text-base font-bold text-[var(--ink-obsidian)]">
              Multi-Image Case Study Showcase ({gallery.length} extra{" "}
              {gallery.length === 1 ? "image" : "images"})
            </h3>
          </div>
          <p className="mt-1 text-xs text-[var(--ink-slate)]">
            Add as many additional screenshots or photos as you want with custom widths &amp; sizes
            (Full Width, Wide, Half, Compact, Square, Tall Mobile) — displayed on the detailed
            project page alongside the primary cover image.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ink-obsidian)] px-4 py-2 text-xs font-semibold text-[#F7F5F0] cursor-pointer hover:opacity-90">
            <Upload className="h-3.5 w-3.5 text-[var(--neon-teal)]" />
            {uploadProgress || "Upload Multiple Images"}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleMultiUpload}
              disabled={Boolean(uploadProgress)}
            />
          </label>
          <button
            type="button"
            onClick={() => setShowLibrary((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2 text-xs font-semibold text-[var(--ink-obsidian)] cursor-pointer hover:border-[var(--teal-deep)]"
          >
            <ImageIcon className="h-3.5 w-3.5" />
            {showLibrary ? "Close Library" : "Pick from Library"}
          </button>
          <button
            type="button"
            onClick={addBlankUrlItem}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-mineral)] bg-white px-3.5 py-2 text-xs font-semibold text-[var(--ink-obsidian)] cursor-pointer hover:border-[var(--neon-orange)]"
          >
            <Link2 className="h-3.5 w-3.5" /> Add URL
          </button>
        </div>
      </div>

      {/* Inline Media Library Multi-Picker */}
      {showLibrary && (
        <div className="rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] p-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--ink-slate)]">
            <span>Click any image below to add it to this project&apos;s showcase gallery</span>
            <span>{mediaLibrary.length} assets</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {mediaLibrary.map((asset) => {
              const addedCount = gallery.filter((g) => g.url === asset.url).length;
              return (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => addFromLibrary(asset)}
                  className="group relative overflow-hidden rounded-xl border border-[var(--border-mineral)] bg-white text-left cursor-pointer hover:border-[var(--neon-orange)] transition-colors"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden">
                    <img
                      src={asset.url}
                      alt={asset.alt}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {addedCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 inline-flex items-center gap-0.5 rounded-full bg-[var(--ink-obsidian)] px-2 py-0.5 text-[10px] font-bold text-[var(--neon-teal)]">
                      <Check className="h-2.5 w-2.5" /> {addedCount}
                    </span>
                  )}
                  <div className="truncate px-2 py-1 text-[10px] font-medium text-[var(--ink-slate)]">
                    {asset.filename}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Live 12-Column Editorial Size Blueprint Preview */}
      {gallery.length > 0 && (
        <div className="rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--ink-obsidian)]">
              <LayoutGrid className="h-3.5 w-3.5 text-[var(--teal-deep)]" />
              Case Study Layout Preview (12-Column Grid)
            </span>
            <span className="font-mono text-[10px] text-[var(--ink-muted)]">
              {gallery.length + 1} total visuals incl. cover
            </span>
          </div>
          <div className="grid grid-cols-12 gap-2">
            {gallery.map((item, idx) => {
              const sizeMeta = resolveGallerySizeMeta(item.size);
              const spanClass = PREVIEW_SPAN_CLASSES[sizeMeta.previewCols] || "col-span-6";
              const isTall = item.size === "tall" || item.aspect === "3/4" || item.aspect === "9/16";
              return (
                <div
                  key={item.id || `prev-${idx}`}
                  className={`${spanClass} relative overflow-hidden rounded-xl border border-black/10 bg-white ${
                    isTall ? "h-24" : "h-16"
                  }`}
                >
                  {item.url ? (
                    <img
                      src={item.url}
                      alt={item.alt || `Visual ${idx + 2}`}
                      className="h-full w-full object-cover opacity-90"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-[var(--ink-muted)]">
                      No image URL
                    </div>
                  )}
                  <div className="absolute inset-x-1.5 bottom-1.5 flex items-center justify-between gap-1">
                    <span className="rounded bg-[var(--ink-obsidian)]/85 px-1.5 py-0.5 font-mono text-[9px] font-bold text-white">
                      #{idx + 2}
                    </span>
                    <span className="truncate rounded bg-white/90 px-1.5 py-0.5 text-[9px] font-bold text-[var(--ink-obsidian)]">
                      {sizeMeta.shortLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {gallery.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border-mineral)] bg-[var(--bg-alabaster)]/70 p-6 text-center space-y-2">
          <p className="text-sm font-semibold text-[var(--ink-obsidian)]">
            Only the primary cover image is shown on this project right now.
          </p>
          <p className="text-xs text-[var(--ink-slate)] max-w-md mx-auto">
            Upload multiple screenshots (desktop dashboards, mobile screens, full-width banners, or
            detail shots) and assign different sizes so visitors can explore your work in depth.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {gallery.map((item, idx) => {
            const currentSize = item.size || "half";
            const currentAspect = item.aspect || resolveGallerySizeMeta(currentSize).defaultAspect;

            return (
              <div
                key={item.id || `${item.url}-${idx}`}
                className="rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)]/60 p-4 space-y-4"
              >
                {/* Row 1: Preview + Header Actions */}
                <div className="flex flex-wrap items-start gap-4">
                  <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border border-black/10 bg-white">
                    {item.url ? (
                      <img
                        src={item.url}
                        alt={item.alt || `Gallery image ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-[var(--ink-muted)]">
                        Preview
                      </div>
                    )}
                    <span className="absolute left-1.5 top-1.5 rounded bg-[var(--ink-obsidian)]/85 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                      #{idx + 2}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[var(--ink-obsidian)]">
                        Showcase Image #{idx + 2}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onPromoteToCover(idx)}
                          disabled={!item.url}
                          title="Swap this image with the primary Cover Image"
                          className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-mineral)] bg-white px-2 py-1 text-[10px] font-semibold text-[var(--ink-obsidian)] hover:border-[var(--neon-orange)] disabled:opacity-40 cursor-pointer"
                        >
                          <Star className="h-3 w-3 text-[var(--orange-lacquer)]" /> Make Cover
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItem(idx, -1)}
                          disabled={idx === 0}
                          title="Move earlier"
                          className="rounded-lg border border-[var(--border-mineral)] bg-white p-1.5 text-[var(--ink-slate)] hover:text-[var(--ink-obsidian)] disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItem(idx, 1)}
                          disabled={idx === gallery.length - 1}
                          title="Move later"
                          className="rounded-lg border border-[var(--border-mineral)] bg-white p-1.5 text-[var(--ink-slate)] hover:text-[var(--ink-obsidian)] disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          title="Remove image"
                          className="rounded-lg border border-red-200 bg-white p-1.5 text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Quick Multi-Size Width Pills */}
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--ink-muted)] mb-1.5">
                        Display Size on Case Study Page
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {PROJECT_GALLERY_SIZE_OPTIONS.map((opt) => {
                          const isSelected = currentSize === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              title={opt.description}
                              onClick={() =>
                                updateItem(idx, {
                                  size: opt.value as ProjectGallerySize,
                                  aspect: opt.defaultAspect,
                                })
                              }
                              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-[var(--ink-obsidian)] text-[#F7F5F0] shadow-sm"
                                  : "border border-[var(--border-mineral)] bg-white text-[var(--ink-slate)] hover:border-[var(--ink-obsidian)]/40"
                              }`}
                            >
                              {opt.shortLabel}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 2: Aspect Ratio, Fit, Focal Point, Frame Style */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-semibold text-[var(--ink-slate)] mb-1">
                      Aspect / Height
                    </label>
                    <select
                      value={currentAspect}
                      onChange={(e) =>
                        updateItem(idx, { aspect: e.target.value as ProjectGalleryAspect })
                      }
                      className="w-full rounded-xl border border-[var(--border-mineral)] bg-white px-2.5 py-2 text-xs font-semibold"
                    >
                      {PROJECT_GALLERY_ASPECT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-[var(--ink-slate)] mb-1">
                      Scaling Fit
                    </label>
                    <select
                      value={item.fit || "cover"}
                      onChange={(e) =>
                        updateItem(idx, { fit: e.target.value as ProjectMediaFit })
                      }
                      className="w-full rounded-xl border border-[var(--border-mineral)] bg-white px-2.5 py-2 text-xs font-semibold"
                    >
                      <option value="cover">Cover (Fill)</option>
                      <option value="contain">Contain (No Crop)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-[var(--ink-slate)] mb-1">
                      Focal Point
                    </label>
                    <select
                      value={item.focalPoint || "center"}
                      onChange={(e) =>
                        updateItem(idx, { focalPoint: e.target.value as ProjectMediaFocalPoint })
                      }
                      className="w-full rounded-xl border border-[var(--border-mineral)] bg-white px-2.5 py-2 text-xs font-semibold"
                    >
                      <option value="center">Center</option>
                      <option value="top">Top</option>
                      <option value="bottom">Bottom</option>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-[var(--ink-slate)] mb-1">
                      Frame Style
                    </label>
                    <select
                      value={item.frameStyle || ""}
                      onChange={(e) =>
                        updateItem(idx, {
                          frameStyle: (e.target.value || undefined) as
                            | ProjectMediaFrameStyle
                            | undefined,
                        })
                      }
                      className="w-full rounded-xl border border-[var(--border-mineral)] bg-white px-2.5 py-2 text-xs font-semibold"
                    >
                      <option value="">Inherit Project Frame</option>
                      {PROJECT_FRAME_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 3: URL, Caption, Alt Text */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-semibold text-[var(--ink-slate)] mb-1">
                      Image URL / Path
                    </label>
                    <input
                      value={item.url}
                      onChange={(e) => updateItem(idx, { url: e.target.value })}
                      placeholder="/uploads/... or https://..."
                      className="w-full rounded-xl border border-[var(--border-mineral)] bg-white px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[var(--ink-slate)] mb-1">
                      Caption (Shown below image)
                    </label>
                    <input
                      value={item.caption || ""}
                      onChange={(e) => updateItem(idx, { caption: e.target.value })}
                      placeholder="e.g. Mobile checkout screen & live order tracker"
                      className="w-full rounded-xl border border-[var(--border-mineral)] bg-white px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[var(--ink-slate)] mb-1">
                      Alt Text (Accessibility)
                    </label>
                    <input
                      value={item.alt}
                      onChange={(e) => updateItem(idx, { alt: e.target.value })}
                      placeholder="Describe this screenshot"
                      className="w-full rounded-xl border border-[var(--border-mineral)] bg-white px-3 py-2 text-xs"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
