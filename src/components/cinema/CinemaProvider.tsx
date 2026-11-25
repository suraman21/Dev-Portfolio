"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { foley } from "@/lib/sound";

export interface CinemaScrollState {
  progress: number;
  velocity: number;
  horizontalProgress: number;
  stickySlideProgress: number;
}

interface CinemaContextValue {
  tvMode: boolean;
  toggleTvMode: () => void;
  xrayMode: boolean;
  toggleXrayMode: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  commandOpen: boolean;
  setCommandOpen: (v: boolean) => void;
  cursorLabel: string | null;
  setCursorLabel: (label: string | null) => void;
  activeHomeAct: string;
  setActiveHomeAct: (id: string) => void;
  scrollRef: React.MutableRefObject<CinemaScrollState>;
}

const CinemaContext = createContext<CinemaContextValue | null>(null);

export function CinemaProvider({ children }: { children: React.ReactNode }) {
  const [tvMode, setTvMode] = useState(false);
  const [xrayMode, setXrayMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [cursorLabel, setCursorLabel] = useState<string | null>(null);
  const [activeHomeAct, setActiveHomeAct] = useState("act-1");

  const scrollRef = useRef<CinemaScrollState>({
    progress: 0,
    velocity: 0,
    horizontalProgress: 0,
    stickySlideProgress: 0,
  });

  const toggleTvMode = useCallback(() => {
    setTvMode((prev) => {
      const next = !prev;
      foley.playDetent(soundEnabled);
      return next;
    });
  }, [soundEnabled]);

  const toggleXrayMode = useCallback(() => {
    setXrayMode((prev) => {
      const next = !prev;
      foley.playDetent(soundEnabled);
      return next;
    });
  }, [soundEnabled]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      if (next) foley.playDetent(true);
      return next;
    });
  }, []);

  // Sync HTML attribute for 4K / 10-foot TV Presentation Mode
  useEffect(() => {
    if (tvMode) {
      document.documentElement.setAttribute("data-cinema-tv", "true");
    } else {
      document.documentElement.removeAttribute("data-cinema-tv");
    }
  }, [tvMode]);

  // Global keyboard shortcuts (⌘K Command Palette, T TV Mode, X X-Ray Telemetry)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen((open) => !open);
        return;
      }

      if (e.key === "Escape" && commandOpen) {
        setCommandOpen(false);
        return;
      }

      if (isInput || e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key.toLowerCase() === "t") {
        setTvMode((prev) => !prev);
      } else if (e.key.toLowerCase() === "x") {
        setXrayMode((prev) => !prev);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [commandOpen]);

  return (
    <CinemaContext.Provider
      value={{
        tvMode,
        toggleTvMode,
        xrayMode,
        toggleXrayMode,
        soundEnabled,
        toggleSound,
        commandOpen,
        setCommandOpen,
        cursorLabel,
        setCursorLabel,
        activeHomeAct,
        setActiveHomeAct,
        scrollRef,
      }}
    >
      {children}
    </CinemaContext.Provider>
  );
}

export function useCinema() {
  const ctx = useContext(CinemaContext);
  if (!ctx) throw new Error("useCinema must be used inside CinemaProvider");
  return ctx;
}
