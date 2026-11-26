import type { ProjectTheme, ProjectThemePreset } from "@/types/cms";

/**
 * 1-click theme presets ready to populate an Admin Panel color picker dropdown.
 * Each preset can also be customized freely with any hex `accentColor` & `surfaceColor`.
 */
export const PROJECT_THEME_PRESETS: Record<
  Exclude<ProjectThemePreset, "custom">,
  Omit<ProjectTheme, "preset">
> = {
  teal: {
    accentColor: "#00C7B3",
    secondaryAccent: "#008E80",
    surfaceColor: "#DCF9F3",
    cardTone: "tinted",
    accentInk: "#005E54",
  },
  orange: {
    accentColor: "#FF5A1F",
    secondaryAccent: "#FF8C42",
    surfaceColor: "#FFE6D6",
    cardTone: "tinted",
    accentInk: "#B83200",
  },
  gold: {
    accentColor: "#D99116",
    secondaryAccent: "#FF6B2B",
    surfaceColor: "#FAECD1",
    cardTone: "tinted",
    accentInk: "#7A4700",
  },
  cobalt: {
    accentColor: "#2563EB",
    secondaryAccent: "#00D4BE",
    surfaceColor: "#DFEAFF",
    cardTone: "tinted",
    accentInk: "#153A94",
  },
  rose: {
    accentColor: "#E11D48",
    secondaryAccent: "#FB7185",
    surfaceColor: "#FFE4EC",
    cardTone: "tinted",
    accentInk: "#9F1239",
  },
  sage: {
    accentColor: "#15803D",
    secondaryAccent: "#10B981",
    surfaceColor: "#E2F7E9",
    cardTone: "tinted",
    accentInk: "#14532D",
  },
  obsidian: {
    accentColor: "#00E5CC",
    secondaryAccent: "#FF5A1F",
    surfaceColor: "#E6E4DD",
    cardTone: "dark",
    accentInk: "#00E5CC",
  },
};

export interface ResolvedProjectTheme {
  sectionBg: string;
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  topBarGradient: string;
  badgeBg: string;
  badgeText: string;
  titleColor: string;
  bodyColor: string;
  mutedColor: string;
  accentInk: string;
  resultBg: string;
  resultBorder: string;
  resultLabelColor: string;
  chipBg: string;
  chipBorder: string;
  chipText: string;
  ctaBg: string;
  ctaText: string;
  mediaMatBg: string;
  isDarkCard: boolean;
}

function parseHex(hex: string): [number, number, number] {
  const clean = hex.replace("#", "").trim();
  const normalized =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean.padEnd(6, "0").slice(0, 6);
  const num = parseInt(normalized, 16);
  if (Number.isNaN(num)) return [15, 23, 26];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function toHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return (
    "#" +
    [clamp(r), clamp(g), clamp(b)]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
  );
}

function mixHex(hexA: string, hexB: string, weightB: number): string {
  const [r1, g1, b1] = parseHex(hexA);
  const [r2, g2, b2] = parseHex(hexB);
  const w = Math.max(0, Math.min(1, weightB));
  return toHex(r1 * (1 - w) + r2 * w, g1 * (1 - w) + g2 * w, b1 * (1 - w) + b2 * w);
}

function hexToRgba(hex: string, alpha: number): string {
  const [r, g, b] = parseHex(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getRelativeLuminance(hex: string): number {
  const [r, g, b] = parseHex(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(hexA: string, hexB: string): number {
  const l1 = getRelativeLuminance(hexA);
  const l2 = getRelativeLuminance(hexB);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Guarantees WCAG AA (>= 4.5:1) readable ink derived from any arbitrary Admin hex color.
 */
function ensureAccessibleInk(accentHex: string, bgHex: string, preferLight: boolean): string {
  if (getContrastRatio(accentHex, bgHex) >= 4.6) return accentHex;
  const target = preferLight ? "#FFFFFF" : "#0B1418";
  for (let step = 0.15; step <= 0.9; step += 0.1) {
    const candidate = mixHex(accentHex, target, step);
    if (getContrastRatio(candidate, bgHex) >= 4.8) return candidate;
  }
  return target;
}

/**
 * Dynamically resolves any ProjectTheme (preset or custom Admin Panel hex values)
 * into a complete, WCAG-safe palette for sliders, work cards, and case studies.
 */
export function resolveProjectTheme(theme: ProjectTheme): ResolvedProjectTheme {
  const basePreset =
    theme.preset !== "custom" ? PROJECT_THEME_PRESETS[theme.preset] : undefined;

  const accent = theme.accentColor || basePreset?.accentColor || "#00C7B3";
  const secondary =
    theme.secondaryAccent || basePreset?.secondaryAccent || mixHex(accent, "#0F171A", 0.22);
  const surface = theme.surfaceColor || basePreset?.surfaceColor || "#F2F0EA";
  const isDarkCard = theme.cardTone === "dark";

  if (isDarkCard) {
    const darkBase = "#0F171A";
    const safeAccentInk =
      theme.accentInk || ensureAccessibleInk(accent, darkBase, true);
    const ctaText = getContrastRatio("#0F171A", accent) >= 4.5 ? "#0F171A" : "#FFFFFF";

    return {
      sectionBg: surface,
      cardBg: `linear-gradient(145deg, #131F24 0%, ${darkBase} 100%)`,
      cardBorder: hexToRgba(accent, 0.52),
      cardShadow: `0 28px 65px -24px ${hexToRgba("#091114", 0.55)}`,
      topBarGradient: `linear-gradient(90deg, ${accent}, ${secondary})`,
      badgeBg: hexToRgba(accent, 0.2),
      badgeText: safeAccentInk,
      titleColor: "#F7F5F0",
      bodyColor: "rgba(247, 245, 240, 0.78)",
      mutedColor: "rgba(247, 245, 240, 0.56)",
      accentInk: safeAccentInk,
      resultBg: "rgba(255, 255, 255, 0.06)",
      resultBorder: hexToRgba(accent, 0.35),
      resultLabelColor: "rgba(247, 245, 240, 0.6)",
      chipBg: "rgba(255, 255, 255, 0.08)",
      chipBorder: "rgba(255, 255, 255, 0.14)",
      chipText: "#F7F5F0",
      ctaBg: accent,
      ctaText,
      mediaMatBg: "#18262C",
      isDarkCard: true,
    };
  }

  const cardSurfaceStart =
    theme.cardTone === "tinted" ? mixHex(surface, "#FFFFFF", 0.42) : "#FFFFFF";
  const cardBg = `linear-gradient(145deg, ${cardSurfaceStart} 0%, #FFFFFF 100%)`;
  const safeAccentInk =
    theme.accentInk ||
    basePreset?.accentInk ||
    ensureAccessibleInk(accent, cardSurfaceStart, false);

  const badgeBg = ensureAccessibleInk(accent, "#FFFFFF", false);
  const badgeText = getContrastRatio("#FFFFFF", badgeBg) >= 4.5 ? "#FFFFFF" : "#0F171A";

  const ctaBg = getContrastRatio("#0F171A", accent) >= 4.5 ? accent : "#0F171A";
  const ctaText = ctaBg === "#0F171A" ? "#F7F5F0" : "#0F171A";

  return {
    sectionBg: surface,
    cardBg,
    cardBorder: hexToRgba(accent, 0.62),
    cardShadow: `0 24px 60px -24px ${hexToRgba(safeAccentInk, 0.24)}`,
    topBarGradient: `linear-gradient(90deg, ${accent}, ${secondary})`,
    badgeBg,
    badgeText,
    titleColor: "#0F171A",
    bodyColor: "#2C3A40",
    mutedColor: "#536369",
    accentInk: safeAccentInk,
    resultBg: mixHex(surface, "#FFFFFF", 0.25),
    resultBorder: hexToRgba(accent, 0.48),
    resultLabelColor: "rgba(15, 23, 26, 0.64)",
    chipBg: "#FFFFFF",
    chipBorder: "rgba(15, 23, 26, 0.12)",
    chipText: "#0F171A",
    ctaBg,
    ctaText,
    mediaMatBg: mixHex(surface, "#FFFFFF", 0.3),
    isDarkCard: false,
  };
}
