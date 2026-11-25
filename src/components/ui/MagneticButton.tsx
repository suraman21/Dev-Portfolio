"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "teal" | "porcelain" | "dark";
  className?: string;
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
  type = "button",
  disabled = false,
  ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.14;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.14;
    setOffset({ x: Math.max(-8, Math.min(8, dx)), y: Math.max(-6, Math.min(6, dy)) });
  };

  const variantClasses: Record<string, string> = {
    primary:
      "bg-[var(--neon-orange)] text-[#0F171A] font-semibold border border-[#FF7E4D] shadow-[0_12px_28px_-10px_rgba(255,90,31,0.52)] hover:bg-[#FF6830]",
    teal:
      "bg-white text-[var(--teal-deep)] font-semibold border border-[var(--teal-deep)]/30 hover:border-[var(--neon-teal)] hover:bg-[var(--teal-mist)]/55",
    porcelain:
      "porcelain-glass text-[var(--ink-obsidian)] font-medium hover:border-[var(--neon-teal)]/65",
    dark:
      "bg-[var(--ink-obsidian)] text-[#F7F5F0] font-semibold hover:bg-[#182529]",
  };

  const sharedClasses = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm md:text-[15px] transition-colors duration-200 cursor-pointer select-none min-h-[48px] ${variantClasses[variant]} ${disabled ? "opacity-50 pointer-events-none" : ""} ${className}`;

  return (
    <motion.div
      ref={ref}
      className="inline-block"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      animate={{ x: offset.x, y: offset.y }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 340, damping: 24, mass: 0.6 }}
    >
      {href ? (
        <Link href={href} aria-label={ariaLabel} className={sharedClasses}>
          {children}
        </Link>
      ) : (
        <button
          type={type}
          disabled={disabled}
          aria-label={ariaLabel}
          onClick={onClick}
          className={sharedClasses}
        >
          {children}
        </button>
      )}
    </motion.div>
  );
}
