"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useCinema } from "./CinemaProvider";

export function AdaptiveCursor() {
  const { cursorLabel, tvMode } = useCinema();
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springX = useSpring(mouseX, { stiffness: 340, damping: 28, mass: 0.4 });
  const springY = useSpring(mouseY, { stiffness: 340, damping: 28, mass: 0.4 });

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine) and (hover: hover)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(finePointer && !reduced && !tvMode);
  }, [tvMode]);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled, mouseX, mouseY, visible]);

  if (!enabled || !visible) return null;

  const isPill = Boolean(cursorLabel);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[120] hidden lg:flex items-center justify-center"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      <motion.div
        animate={{
          width: isPill ? "auto" : 22,
          height: isPill ? 32 : 22,
          paddingLeft: isPill ? 12 : 0,
          paddingRight: isPill ? 12 : 0,
          backgroundColor: isPill ? "rgba(13, 22, 25, 0.92)" : "rgba(0, 229, 204, 0.1)",
          borderColor: isPill ? "rgba(255, 90, 31, 0.85)" : "rgba(8, 110, 104, 0.45)",
        }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        className="flex items-center justify-center rounded-full border backdrop-blur-md shadow-[0_8px_24px_rgba(14,23,26,0.16)]"
      >
        {isPill ? (
          <span className="font-mono-tech whitespace-nowrap text-[10px] font-medium text-[#F7F5F0]">
            {cursorLabel}
          </span>
        ) : (
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--neon-orange)]" />
        )}
      </motion.div>
    </motion.div>
  );
}
