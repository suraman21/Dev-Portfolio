"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCinema } from "@/components/cinema/CinemaProvider";
import { foley } from "@/lib/sound";

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "teal" | "porcelain" | "obsidian";
  className?: string;
  cursorText?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
}

export function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
  cursorText,
  type = "button",
  disabled = false,
  ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const { setCursorLabel, soundEnabled, tvMode } = useCinema();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (tvMode || disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.18;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.18;
    setOffset({ x: Math.max(-10, Math.min(10, dx)), y: Math.max(-8, Math.min(8, dy)) });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
    if (cursorText) setCursorLabel(null);
  };

  const handleMouseEnter = () => {
    if (cursorText) setCursorLabel(cursorText);
    foley.playHoverShimmer(soundEnabled);
  };

  const variantClasses: Record<string, string> = {
    // High-contrast accessible Neon Orange CTA (Von Restorff focal point)
    primary:
      "bg-[var(--neon-orange)] text-[#0E171A] font-semibold border border-[#FF7E4D] shadow-[0_14px_34px_-12px_rgba(255,90,31,0.55)] hover:bg-[#FF6830] hover:shadow-[0_18px_40px_-10px_rgba(255,90,31,0.7)]",
    teal:
      "bg-[var(--surface-porcelain)] text-[var(--teal-deep)] font-semibold border border-[var(--teal-deep)]/35 hover:border-[var(--neon-teal)] hover:bg-[var(--teal-mist)]/65 shadow-[0_10px_28px_-14px_rgba(0,229,204,0.35)]",
    porcelain:
      "porcelain-glass text-[var(--ink-obsidian)] font-medium hover:border-[var(--neon-teal)]/70",
    obsidian:
      "obsidian-island text-[#F7F5F0] font-medium hover:border-[var(--neon-teal)]/80",
  };

  const sharedClasses = `group relative inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-sm md:text-[15px] tracking-[-0.01em] transition-colors duration-200 cursor-pointer select-none min-h-[48px] ${variantClasses[variant]} ${disabled ? "opacity-50 pointer-events-none" : ""} ${className}`;

  const innerContent = (
    <motion.span
      className="relative z-10 inline-flex items-center gap-2.5"
      animate={{ x: offset.x * 0.35, y: offset.y * 0.35 }}
      transition={{ type: "spring", stiffness: 360, damping: 24 }}
    >
      {children}
    </motion.span>
  );

  return (
    <motion.div
      ref={ref}
      className="inline-block"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      animate={{ x: offset.x, y: offset.y }}
      whileTap={{ scale: 0.965 }}
      transition={{ type: "spring", stiffness: 320, damping: 22, mass: 0.6 }}
    >
      {href ? (
        <Link
          href={href}
          data-tv-focus="true"
          aria-label={ariaLabel}
          onClick={() => foley.playDetent(soundEnabled)}
          className={sharedClasses}
        >
          {innerContent}
        </Link>
      ) : (
        <button
          type={type}
          disabled={disabled}
          data-tv-focus="true"
          aria-label={ariaLabel}
          onClick={() => {
            foley.playDetent(soundEnabled);
            onClick?.();
          }}
          className={sharedClasses}
        >
          {innerContent}
        </button>
      )}
    </motion.div>
  );
}
