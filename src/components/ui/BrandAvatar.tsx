"use client";

import { useEffect, useState } from "react";
import type { ProfileImagePosition } from "@/types/cms";

interface BrandAvatarProps {
  src?: string;
  alt: string;
  monogram: string;
  position?: ProfileImagePosition;
  sizeClass?: string;
  roundedClass?: string;
  className?: string;
}

const POS_CLASS: Record<ProfileImagePosition, string> = {
  top: "object-top",
  center: "object-center",
  bottom: "object-bottom",
};

/**
 * Unified Brand Logo Avatar
 * Displays the developer's live profile image across Header, Footer, About Card,
 * and Admin Panel, gracefully falling back to the monogram only if no image is set
 * or if the image fails to load.
 */
export function BrandAvatar({
  src,
  alt,
  monogram,
  position = "top",
  sizeClass = "h-9 w-9",
  roundedClass = "rounded-full",
  className = "",
}: BrandAvatarProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const showImg = Boolean(src && src.trim() !== "" && !failed);
  const posClass = POS_CLASS[position || "top"];

  if (showImg) {
    return (
      <span
        className={`relative inline-flex shrink-0 overflow-hidden border-2 border-white bg-[var(--surface-stone)] shadow-sm ring-1 ring-[var(--border-mineral)] ${sizeClass} ${roundedClass} ${className}`}
      >
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover ${posClass}`}
        />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center bg-[var(--ink-obsidian)] font-mono text-xs font-bold text-[var(--neon-teal)] shadow-sm ${sizeClass} ${roundedClass} ${className}`}
    >
      {monogram}
    </span>
  );
}
