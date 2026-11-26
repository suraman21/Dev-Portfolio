"use client";

import { useState } from "react";
import type { ProjectMedia, ProjectTheme } from "@/types/cms";
import { resolveProjectTheme } from "@/lib/project-theme";

interface ProjectMediaFrameProps {
  media: ProjectMedia;
  theme: ProjectTheme;
  title: string;
  /** Compact padding & chrome for mobile cards so zero space is wasted */
  compact?: boolean;
  /** Load immediately for above-the-fold hero case study views */
  priority?: boolean;
  className?: string;
}

const FOCAL_CLASSES: Record<ProjectMedia["focalPoint"], string> = {
  center: "object-center",
  top: "object-top",
  bottom: "object-bottom",
  left: "object-left",
  right: "object-right",
};

/**
 * Universal Admin-Panel-Ready Product Image Frame
 *
 * Adapts automatically to ANY uploaded real product image — dark UI, light UI,
 * editorial photography, or SaaS screenshots — while enforcing a locked aspect
 * ratio so images never stretch or distort on phones, laptops, desktops, or 4K.
 */
export function ProjectMediaFrame({
  media,
  theme,
  title,
  compact = false,
  priority = false,
  className = "",
}: ProjectMediaFrameProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const resolved = resolveProjectTheme(theme);

  const isDarkImage = media.surfaceTone === "dark";
  const fitClass = media.fit === "contain" ? "object-contain" : "object-cover";
  const focalClass = FOCAL_CLASSES[media.focalPoint] || "object-center";

  // Adaptive image canvas background so `contain` or loading transitions never flash stark white
  const canvasBg =
    media.surfaceTone === "dark"
      ? "#0B1418"
      : media.surfaceTone === "warm"
        ? "#F5EFE6"
        : "#F7F8FA";

  const imageElement = imgFailed ? (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center"
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
    // Native <img> works identically with local public assets AND arbitrary future
    // remote Admin Panel URLs (S3, Supabase Storage, Cloudinary, R2) without domain lockouts.
    <img
      src={media.coverImage}
      alt={media.alt}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      onError={() => setImgFailed(true)}
      className={`h-full w-full ${fitClass} ${focalClass} select-none transition-transform duration-500 ease-out group-hover/media:scale-[1.02]`}
    />
  );

  // 1. BROWSER FRAME — Ideal for raw SaaS / web application UI screenshots
  if (media.frameStyle === "browser") {
    return (
      <div
        className={`group/media w-full overflow-hidden rounded-[20px] sm:rounded-[24px] border shadow-[0_18px_45px_-22px_rgba(15,23,26,0.34)] ${className}`}
        style={{
          borderColor: isDarkImage ? "rgba(255,255,255,0.14)" : "rgba(15,23,26,0.12)",
          backgroundColor: canvasBg,
        }}
      >
        <div
          className={`flex items-center justify-between border-b px-3 sm:px-4 ${
            compact ? "py-1.5" : "py-2.5"
          }`}
          style={{
            backgroundColor: isDarkImage ? "#0F1B20" : "#F6F5F1",
            borderColor: isDarkImage ? "rgba(255,255,255,0.08)" : "rgba(15,23,26,0.08)",
          }}
        >
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#FF5A1F]" />
            <span className="h-2 w-2 rounded-full bg-[#00E5CC]" />
            <span
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor: isDarkImage ? "rgba(255,255,255,0.22)" : "rgba(15,23,26,0.18)",
              }}
            />
          </div>
          <span
            className="truncate max-w-[65%] font-mono text-[10px] font-medium"
            style={{
              color: isDarkImage ? "rgba(255,255,255,0.62)" : "rgba(15,23,26,0.55)",
            }}
          >
            {title.toLowerCase().replace(/\s+/g, "-")}.app
          </span>
          <span className="w-6" aria-hidden="true" />
        </div>

        <div className="relative aspect-[16/10] w-full overflow-hidden" style={{ backgroundColor: canvasBg }}>
          {imageElement}
        </div>
      </div>
    );
  }

  // 2. STUDIO MAT FRAME — Museum-grade tinted mat for light/crisp UI mockups
  if (media.frameStyle === "studio") {
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
          className="relative aspect-[16/10] w-full overflow-hidden rounded-[14px] sm:rounded-[16px] border border-black/8 shadow-[0_14px_34px_-16px_rgba(15,23,26,0.22)]"
          style={{ backgroundColor: canvasBg }}
        >
          {imageElement}
        </div>
      </div>
    );
  }

  // 3. FLOATING FRAME — Clean elevated frame for screenshots that already include browser chrome
  if (media.frameStyle === "floating") {
    return (
      <div
        className={`group/media w-full overflow-hidden rounded-[20px] sm:rounded-[24px] border bg-white ${className}`}
        style={{
          borderColor: resolved.cardBorder,
          boxShadow: resolved.cardShadow,
        }}
      >
        <div
          className="relative aspect-[16/10] w-full overflow-hidden"
          style={{ backgroundColor: canvasBg }}
        >
          {imageElement}
        </div>
      </div>
    );
  }

  // 4. FRAMELESS EDITORIAL — Pure edge-to-edge luxury product / brand photography
  return (
    <div
      className={`group/media relative w-full overflow-hidden rounded-[20px] sm:rounded-[24px] shadow-[0_20px_50px_-22px_rgba(15,23,26,0.28)] ring-1 ring-inset ring-black/10 ${className}`}
      style={{ backgroundColor: canvasBg }}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">{imageElement}</div>
    </div>
  );
}
