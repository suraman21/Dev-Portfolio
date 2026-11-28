"use client";

import { useState } from "react";
import type { ProjectMedia, ProjectMediaTone, ProjectTheme } from "@/types/cms";
import { resolveProjectTheme } from "@/lib/project-theme";

interface ProjectMediaFrameProps {
  media: ProjectMedia;
  theme: ProjectTheme;
  title: string;
  /** Compact padding & chrome for mobile cards so zero space is wasted */
  compact?: boolean;
  /** Load immediately for above-the-fold hero case study views */
  priority?: boolean;
  /** Optional aspect ratio class (e.g. "aspect-video", "aspect-[3/4]", or "auto" for natural dimensions) */
  aspectClass?: string;
  className?: string;
}

const FOCAL_CLASSES: Record<ProjectMedia["focalPoint"], string> = {
  center: "object-center",
  top: "object-top",
  bottom: "object-bottom",
  left: "object-left",
  right: "object-right",
};

interface ToneStyleConfig {
  canvasBg: string;
  chromeBg: string;
  chromeBorder: string;
  chromeText: string;
  isDarkChrome: boolean;
  imgFilter?: string;
}

const TONE_CONFIGS: Record<ProjectMediaTone, ToneStyleConfig> = {
  default: {
    canvasBg: "#F7F8FA",
    chromeBg: "#F6F5F1",
    chromeBorder: "rgba(15,23,26,0.10)",
    chromeText: "rgba(15,23,26,0.58)",
    isDarkChrome: false,
  },
  light: {
    canvasBg: "#FFFFFF",
    chromeBg: "#F8F9FA",
    chromeBorder: "rgba(15,23,26,0.09)",
    chromeText: "rgba(15,23,26,0.55)",
    isDarkChrome: false,
  },
  dark: {
    canvasBg: "#0B1418",
    chromeBg: "#0F1B20",
    chromeBorder: "rgba(255,255,255,0.12)",
    chromeText: "rgba(255,255,255,0.65)",
    isDarkChrome: true,
  },
  warm: {
    canvasBg: "#F5EFE6",
    chromeBg: "#F2EADF",
    chromeBorder: "rgba(120,71,0,0.14)",
    chromeText: "rgba(92,58,24,0.68)",
    isDarkChrome: false,
  },
  vibrant: {
    canvasBg: "#F3F6FA",
    chromeBg: "#FFFFFF",
    chromeBorder: "rgba(15,23,26,0.12)",
    chromeText: "rgba(15,23,26,0.62)",
    isDarkChrome: false,
    imgFilter: "saturate(1.08) contrast(1.03)",
  },
  cool: {
    canvasBg: "#EEF4FB",
    chromeBg: "#E8F0FA",
    chromeBorder: "rgba(37,99,235,0.16)",
    chromeText: "rgba(30,58,138,0.65)",
    isDarkChrome: false,
  },
  muted: {
    canvasBg: "#EFECE6",
    chromeBg: "#E9E6DF",
    chromeBorder: "rgba(15,23,26,0.10)",
    chromeText: "rgba(71,85,105,0.7)",
    isDarkChrome: false,
    imgFilter: "saturate(0.88)",
  },
  monochrome: {
    canvasBg: "#F2F2F2",
    chromeBg: "#18181B",
    chromeBorder: "rgba(255,255,255,0.14)",
    chromeText: "rgba(255,255,255,0.7)",
    isDarkChrome: true,
    imgFilter: "grayscale(0.95) contrast(1.06)",
  },
  pastel: {
    canvasBg: "#FAF6F2",
    chromeBg: "#FDF9F5",
    chromeBorder: "rgba(15,23,26,0.08)",
    chromeText: "rgba(71,85,105,0.65)",
    isDarkChrome: false,
    imgFilter: "brightness(1.02) saturate(0.94)",
  },
  midnight: {
    canvasBg: "#0B1024",
    chromeBg: "#101733",
    chromeBorder: "rgba(99,102,241,0.28)",
    chromeText: "rgba(199,210,254,0.75)",
    isDarkChrome: true,
  },
  sepia: {
    canvasBg: "#F4ECE0",
    chromeBg: "#EDE1CF",
    chromeBorder: "rgba(146,64,14,0.18)",
    chromeText: "rgba(120,53,15,0.72)",
    isDarkChrome: false,
    imgFilter: "sepia(0.18) contrast(1.02)",
  },
  neon: {
    canvasBg: "#071014",
    chromeBg: "#0B181E",
    chromeBorder: "rgba(0,229,204,0.34)",
    chromeText: "#00E5CC",
    isDarkChrome: true,
    imgFilter: "contrast(1.06) saturate(1.1)",
  },
  "high-contrast": {
    canvasBg: "#090B0C",
    chromeBg: "#0F171A",
    chromeBorder: "rgba(255,255,255,0.22)",
    chromeText: "rgba(255,255,255,0.85)",
    isDarkChrome: true,
    imgFilter: "contrast(1.12)",
  },
};

/**
 * Universal Admin-Panel-Ready Product Image Frame (Default + 12 Frame Styles, Default + 12 Image Tones)
 *
 * Adapts automatically to ANY uploaded real product image while enforcing a locked
 * 16:10 aspect ratio so images never stretch or distort across mobile, laptop, desktop, or 4K.
 */
export function ProjectMediaFrame({
  media,
  theme,
  title,
  compact = false,
  priority = false,
  aspectClass = "aspect-[16/10]",
  className = "",
}: ProjectMediaFrameProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const imgFailed = failedSrc === media.coverImage;
  const resolved = resolveProjectTheme(theme);

  const tone = TONE_CONFIGS[media.surfaceTone] || TONE_CONFIGS.default;
  const frameStyle = media.frameStyle || "default";
  const isAutoAspect = aspectClass === "auto";
  const fitClass = media.fit === "contain" ? "object-contain" : "object-cover";
  const focalClass = FOCAL_CLASSES[media.focalPoint] || "object-center";
  const slugLabel = `${title.toLowerCase().replace(/\s+/g, "-")}.app`;
  const viewportAspect = isAutoAspect ? "" : aspectClass;

  const imageElement = imgFailed ? (
    <div
      className={`flex w-full flex-col items-center justify-center gap-2 p-6 text-center ${
        isAutoAspect ? "min-h-[220px]" : "h-full"
      }`}
      style={{ background: resolved.cardBg }}
    >
      <span
        className="rounded-full px-3 py-1 text-[11px] font-bold"
        style={{ backgroundColor: resolved.badgeBg, color: resolved.badgeText }}
      >
        Product Preview
      </span>
      <span className="text-sm font-bold" style={{ color: resolved.titleColor }}>
        {title}
      </span>
    </div>
  ) : (
    <img
      src={media.coverImage}
      alt={media.alt}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      onError={() => setFailedSrc(media.coverImage)}
      style={tone.imgFilter ? { filter: tone.imgFilter } : undefined}
      className={
        isAutoAspect
          ? "block w-full h-auto select-none transition-transform duration-500 ease-out group-hover/media:scale-[1.015]"
          : `h-full w-full ${fitClass} ${focalClass} select-none transition-transform duration-500 ease-out group-hover/media:scale-[1.02]`
      }
    />
  );

  // 1. BROWSER FRAME
  if (frameStyle === "browser") {
    return (
      <div
        className={`group/media w-full overflow-hidden rounded-[20px] sm:rounded-[24px] border shadow-[0_18px_45px_-22px_rgba(15,23,26,0.34)] ${className}`}
        style={{ borderColor: tone.chromeBorder, backgroundColor: tone.canvasBg }}
      >
        <div
          className={`flex items-center justify-between border-b px-3 sm:px-4 ${
            compact ? "py-1.5" : "py-2.5"
          }`}
          style={{ backgroundColor: tone.chromeBg, borderColor: tone.chromeBorder }}
        >
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#FF5A1F]" />
            <span className="h-2 w-2 rounded-full bg-[#00E5CC]" />
            <span
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor: tone.isDarkChrome
                  ? "rgba(255,255,255,0.22)"
                  : "rgba(15,23,26,0.18)",
              }}
            />
          </div>
          <span
            className="truncate max-w-[65%] font-mono text-[10px] font-medium"
            style={{ color: tone.chromeText }}
          >
            {slugLabel}
          </span>
          <span className="w-6" aria-hidden="true" />
        </div>

        <div className={`relative ${viewportAspect} w-full overflow-hidden`} style={{ backgroundColor: tone.canvasBg }}>
          {imageElement}
        </div>
      </div>
    );
  }

  // 2. TERMINAL FRAME — Software engineering CLI header
  if (frameStyle === "terminal") {
    return (
      <div
        className={`group/media w-full overflow-hidden rounded-[20px] sm:rounded-[24px] border border-[#00E5CC]/35 bg-[#0B1317] shadow-[0_22px_50px_-22px_rgba(11,19,23,0.55)] ${className}`}
      >
        <div
          className={`flex items-center justify-between border-b border-white/10 bg-[#0F1B20] px-3.5 ${
            compact ? "py-1.5" : "py-2.5"
          }`}
        >
          <span className="font-mono text-[10px] font-bold text-[#00E5CC]">
            &gt;_ {slugLabel}
          </span>
          <span className="rounded bg-[#FF5A1F]/20 px-2 py-0.5 font-mono text-[9px] font-bold text-[#FF7A45]">
            LIVE
          </span>
        </div>
        <div className={`relative ${viewportAspect} w-full overflow-hidden`} style={{ backgroundColor: tone.canvasBg }}>
          {imageElement}
        </div>
      </div>
    );
  }

  // 3. MACBOOK / LAPTOP DISPLAY BEZEL
  if (frameStyle === "macbook") {
    return (
      <div className={`group/media w-full ${className}`}>
        <div className="overflow-hidden rounded-t-[18px] sm:rounded-t-[22px] rounded-b-[6px] border-[5px] sm:border-[7px] border-[#141D21] bg-[#141D21] shadow-[0_22px_48px_-20px_rgba(15,23,26,0.42)]">
          <div className="mx-auto mb-1 h-1 w-8 rounded-full bg-white/15" />
          <div
            className={`relative ${viewportAspect} w-full overflow-hidden rounded-[8px]`}
            style={{ backgroundColor: tone.canvasBg }}
          >
            {imageElement}
          </div>
        </div>
        <div className="mx-auto h-2 w-[92%] rounded-b-xl bg-gradient-to-b from-[#CBD5E1] to-[#94A3B8] shadow-sm" />
      </div>
    );
  }

  // 4. STUDIO MAT FRAME (also used as "default" adaptive presentation)
  if (frameStyle === "studio" || frameStyle === "default") {
    return (
      <div
        className={`group/media w-full overflow-hidden rounded-[20px] sm:rounded-[24px] border ${
          compact ? "p-2" : "p-3 sm:p-4"
        } ${className}`}
        style={{
          backgroundColor: resolved.mediaMatBg,
          borderColor: resolved.resultBorder,
        }}
      >
        <div
          className={`relative ${viewportAspect} w-full overflow-hidden rounded-[14px] sm:rounded-[16px] border border-black/8 shadow-[0_14px_34px_-16px_rgba(15,23,26,0.22)]`}
          style={{ backgroundColor: tone.canvasBg }}
        >
          {imageElement}
        </div>
      </div>
    );
  }

  // 5. FLOATING FRAME
  if (frameStyle === "floating") {
    return (
      <div
        className={`group/media w-full overflow-hidden rounded-[20px] sm:rounded-[24px] border bg-white ${className}`}
        style={{
          borderColor: resolved.cardBorder,
          boxShadow: resolved.cardShadow,
        }}
      >
        <div className={`relative ${viewportAspect} w-full overflow-hidden`} style={{ backgroundColor: tone.canvasBg }}>
          {imageElement}
        </div>
      </div>
    );
  }

  // 6. EDITORIAL DOUBLE BORDER FRAME
  if (frameStyle === "editorial") {
    return (
      <div
        className={`group/media w-full rounded-[22px] border border-[var(--ink-obsidian)]/20 bg-[#FBF9F4] ${
          compact ? "p-2" : "p-3.5"
        } shadow-[0_16px_40px_-20px_rgba(15,23,26,0.2)] ${className}`}
      >
        <div
          className={`relative ${viewportAspect} w-full overflow-hidden rounded-[14px] border border-[var(--ink-obsidian)]/15`}
          style={{ backgroundColor: tone.canvasBg }}
        >
          {imageElement}
        </div>
      </div>
    );
  }

  // 7. FROSTED PORCELAIN GLASS FRAME
  if (frameStyle === "glass") {
    return (
      <div
        className={`group/media w-full rounded-[22px] border border-white/75 bg-white/55 backdrop-blur-md ${
          compact ? "p-2" : "p-3"
        } shadow-[0_20px_50px_-22px_rgba(15,23,26,0.24)] ${className}`}
      >
        <div
          className={`relative ${viewportAspect} w-full overflow-hidden rounded-[15px] ring-1 ring-black/8`}
          style={{ backgroundColor: tone.canvasBg }}
        >
          {imageElement}
        </div>
      </div>
    );
  }

  // 8. POLAROID / GALLERY CAPTION CARD
  if (frameStyle === "polaroid") {
    return (
      <div
        className={`group/media w-full rounded-[18px] border border-black/10 bg-white ${
          compact ? "p-2 pb-2.5" : "p-3 pb-4"
        } shadow-[0_20px_48px_-20px_rgba(15,23,26,0.28)] ${className}`}
      >
        <div
          className={`relative ${viewportAspect} w-full overflow-hidden rounded-[10px]`}
          style={{ backgroundColor: tone.canvasBg }}
        >
          {imageElement}
        </div>
        <div className="mt-2 flex items-center justify-between px-1">
          <span className="truncate text-[11px] font-semibold text-[var(--ink-obsidian)]">
            {title}
          </span>
          <span className="font-mono text-[10px] text-[var(--ink-muted)]">Showcase</span>
        </div>
      </div>
    );
  }

  // 9. BLUEPRINT CAD GRID FRAME
  if (frameStyle === "blueprint") {
    return (
      <div
        className={`group/media relative w-full rounded-[18px] border-2 border-dashed border-[#0284C7]/45 bg-[#EFF8FF] ${
          compact ? "p-2" : "p-3.5"
        } ${className}`}
      >
        <div
          className={`relative ${viewportAspect} w-full overflow-hidden rounded-[12px] border border-[#0284C7]/35`}
          style={{ backgroundColor: tone.canvasBg }}
        >
          {imageElement}
        </div>
      </div>
    );
  }

  // 10. DICHROIC NEON RING FRAME
  if (frameStyle === "duotone-ring") {
    return (
      <div
        className={`group/media w-full rounded-[22px] p-[2.5px] shadow-[0_22px_52px_-20px_rgba(0,180,160,0.34)] ${className}`}
        style={{ background: resolved.topBarGradient }}
      >
        <div
          className={`relative ${viewportAspect} w-full overflow-hidden rounded-[20px]`}
          style={{ backgroundColor: tone.canvasBg }}
        >
          {imageElement}
        </div>
      </div>
    );
  }

  // 11. DEEP EXHIBITION SHADOWBOX
  if (frameStyle === "shadow-box") {
    return (
      <div
        className={`group/media w-full rounded-[22px] bg-[#0F171A] ${
          compact ? "p-2.5" : "p-4"
        } shadow-[0_28px_60px_-18px_rgba(15,23,26,0.55)] ${className}`}
      >
        <div
          className={`relative ${viewportAspect} w-full overflow-hidden rounded-[13px] ring-1 ring-white/15`}
          style={{ backgroundColor: tone.canvasBg }}
        >
          {imageElement}
        </div>
      </div>
    );
  }

  // 12. FRAMELESS EDITORIAL — Pure edge-to-edge luxury product / brand photography
  return (
    <div
      className={`group/media relative w-full overflow-hidden rounded-[20px] sm:rounded-[24px] shadow-[0_20px_50px_-22px_rgba(15,23,26,0.28)] ring-1 ring-inset ring-black/10 ${className}`}
      style={{ backgroundColor: tone.canvasBg }}
    >
      <div className={`relative ${viewportAspect} w-full overflow-hidden`}>{imageElement}</div>
    </div>
  );
}
