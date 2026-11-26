import type { BuildStepAccent } from "@/types/cms";

export interface SlideThemeDefinition {
  id: Exclude<BuildStepAccent, "default">;
  label: string;
  swatch: string;
  secondarySwatch: string;
  isDarkCard: boolean;
  bgStyle: string;
  orbClass: string;
  badgeClass: string;
  highlightClass: string;
  checkClass: string;
  cardClass: string;
  iconBoxClass: string;
  statTextClass: string;
  dotActiveClass: string;
  mobileCardStyle: string;
  mobileBorderClass: string;
}

/**
 * 12 Curated Luxury Studio Slide Themes + Smart "default" Auto-Progression.
 * Guarantees crisp readability and strong visual separation across 3, 5, or 12+ slides.
 */
export const SLIDE_THEMES: Record<Exclude<BuildStepAccent, "default">, SlideThemeDefinition> = {
  teal: {
    id: "teal",
    label: "Electric Mint-Teal",
    swatch: "#00D2BC",
    secondarySwatch: "#D5F9F2",
    isDarkCard: false,
    bgStyle:
      "radial-gradient(circle at 82% 24%, rgba(0, 229, 204, 0.34), transparent 52%), linear-gradient(145deg, #D5F9F2 0%, #EEFCF9 58%, #DFFBF5 100%)",
    orbClass: "bg-[#00E5CC]/35",
    badgeClass: "bg-[#006B60] text-[#E8FFF9] border border-[#00A896]",
    highlightClass: "text-[#006B60]",
    checkClass: "text-[#007A6E]",
    cardClass:
      "bg-white/95 border-2 border-[#00D2BC] shadow-[0_28px_65px_-24px_rgba(0,122,110,0.28)]",
    iconBoxClass: "bg-[#00E5CC]/25 text-[#005C53]",
    statTextClass: "text-[#006B60]",
    dotActiveClass: "w-8 bg-[#00B8A4]",
    mobileCardStyle: "linear-gradient(145deg, #DDFBF5 0%, #F4FEFC 100%)",
    mobileBorderClass: "border-2 border-[#00D2BC]",
  },
  orange: {
    id: "orange",
    label: "Solar Neon-Orange",
    swatch: "#FF5A1F",
    secondarySwatch: "#FFE2D1",
    isDarkCard: false,
    bgStyle:
      "radial-gradient(circle at 82% 24%, rgba(255, 90, 31, 0.30), transparent 52%), linear-gradient(145deg, #FFE2D1 0%, #FFF4EC 58%, #FFE8DA 100%)",
    orbClass: "bg-[#FF5A1F]/35",
    badgeClass: "bg-[#C93904] text-[#FFF7F2] border border-[#FF5A1F]",
    highlightClass: "text-[#C93904]",
    checkClass: "text-[#D94108]",
    cardClass:
      "bg-white/95 border-2 border-[#FF6B35] shadow-[0_28px_65px_-24px_rgba(201,57,4,0.28)]",
    iconBoxClass: "bg-[#FF5A1F]/20 text-[#B83200]",
    statTextClass: "text-[#C93904]",
    dotActiveClass: "w-8 bg-[#FF5A1F]",
    mobileCardStyle: "linear-gradient(145deg, #FFE6D6 0%, #FFF7F2 100%)",
    mobileBorderClass: "border-2 border-[#FF6B35]",
  },
  cobalt: {
    id: "cobalt",
    label: "Electric Cobalt + Obsidian",
    swatch: "#2563EB",
    secondarySwatch: "#DCE7FF",
    isDarkCard: true,
    bgStyle:
      "radial-gradient(circle at 18% 22%, rgba(0, 229, 204, 0.24), transparent 46%), radial-gradient(circle at 84% 78%, rgba(255, 90, 31, 0.22), transparent 48%), linear-gradient(145deg, #DCE7FF 0%, #F0F5FF 55%, #E3ECFF 100%)",
    orbClass: "bg-[#3B6EFF]/28",
    badgeClass: "bg-[#153585] text-[#EEF4FF] border border-[#3B6EFF]",
    highlightClass: "text-[#1A43A8]",
    checkClass: "text-[#1A43A8]",
    cardClass:
      "bg-[#0F171A] text-[#F7F5F0] border-2 border-[#3B6EFF] shadow-[0_32px_70px_-24px_rgba(15,23,26,0.48)]",
    iconBoxClass: "bg-[#00E5CC]/20 text-[#00E5CC]",
    statTextClass: "text-[#00E5CC]",
    dotActiveClass: "w-8 bg-[#1A43A8]",
    mobileCardStyle: "linear-gradient(145deg, #DCE7FF 0%, #F2F6FF 100%)",
    mobileBorderClass: "border-2 border-[#3B6EFF]",
  },
  emerald: {
    id: "emerald",
    label: "Botanical Emerald",
    swatch: "#10B981",
    secondarySwatch: "#D8F8E9",
    isDarkCard: false,
    bgStyle:
      "radial-gradient(circle at 80% 22%, rgba(16, 185, 129, 0.28), transparent 52%), linear-gradient(145deg, #D8F8E9 0%, #F0FDF6 58%, #E1FAEE 100%)",
    orbClass: "bg-[#10B981]/30",
    badgeClass: "bg-[#065F46] text-[#ECFDF5] border border-[#10B981]",
    highlightClass: "text-[#047857]",
    checkClass: "text-[#059669]",
    cardClass:
      "bg-white/95 border-2 border-[#10B981] shadow-[0_28px_65px_-24px_rgba(6,95,70,0.24)]",
    iconBoxClass: "bg-[#10B981]/20 text-[#065F46]",
    statTextClass: "text-[#047857]",
    dotActiveClass: "w-8 bg-[#10B981]",
    mobileCardStyle: "linear-gradient(145deg, #DCFCE7 0%, #F2FDF7 100%)",
    mobileBorderClass: "border-2 border-[#10B981]",
  },
  amber: {
    id: "amber",
    label: "Champagne Amber",
    swatch: "#D97706",
    secondarySwatch: "#FEF0D2",
    isDarkCard: false,
    bgStyle:
      "radial-gradient(circle at 82% 24%, rgba(245, 158, 11, 0.30), transparent 52%), linear-gradient(145deg, #FEF0D2 0%, #FFF9EC 58%, #FCE9C3 100%)",
    orbClass: "bg-[#F59E0B]/32",
    badgeClass: "bg-[#92400E] text-[#FFFBEB] border border-[#F59E0B]",
    highlightClass: "text-[#B45309]",
    checkClass: "text-[#B45309]",
    cardClass:
      "bg-white/95 border-2 border-[#F59E0B] shadow-[0_28px_65px_-24px_rgba(146,64,14,0.24)]",
    iconBoxClass: "bg-[#F59E0B]/20 text-[#92400E]",
    statTextClass: "text-[#B45309]",
    dotActiveClass: "w-8 bg-[#D97706]",
    mobileCardStyle: "linear-gradient(145deg, #FEF2D4 0%, #FFFBF0 100%)",
    mobileBorderClass: "border-2 border-[#F59E0B]",
  },
  rose: {
    id: "rose",
    label: "Editorial Rose-Quartz",
    swatch: "#E11D48",
    secondarySwatch: "#FFE0E9",
    isDarkCard: false,
    bgStyle:
      "radial-gradient(circle at 80% 24%, rgba(244, 63, 94, 0.25), transparent 52%), linear-gradient(145deg, #FFE0E9 0%, #FFF4F7 58%, #FFE6EE 100%)",
    orbClass: "bg-[#F43F5E]/28",
    badgeClass: "bg-[#9F1239] text-[#FFF1F2] border border-[#FB7185]",
    highlightClass: "text-[#BE123C]",
    checkClass: "text-[#E11D48]",
    cardClass:
      "bg-white/95 border-2 border-[#FB7185] shadow-[0_28px_65px_-24px_rgba(159,18,57,0.24)]",
    iconBoxClass: "bg-[#F43F5E]/18 text-[#9F1239]",
    statTextClass: "text-[#BE123C]",
    dotActiveClass: "w-8 bg-[#E11D48]",
    mobileCardStyle: "linear-gradient(145deg, #FFE4EC 0%, #FFF5F8 100%)",
    mobileBorderClass: "border-2 border-[#FB7185]",
  },
  violet: {
    id: "violet",
    label: "Luminous Iris-Violet",
    swatch: "#7C3AED",
    secondarySwatch: "#EAE0FF",
    isDarkCard: false,
    bgStyle:
      "radial-gradient(circle at 82% 24%, rgba(139, 92, 246, 0.28), transparent 52%), linear-gradient(145deg, #EAE0FF 0%, #F7F4FF 58%, #EFE7FF 100%)",
    orbClass: "bg-[#8B5CF6]/30",
    badgeClass: "bg-[#5B21B6] text-[#F5F3FF] border border-[#8B5CF6]",
    highlightClass: "text-[#6D28D9]",
    checkClass: "text-[#7C3AED]",
    cardClass:
      "bg-white/95 border-2 border-[#8B5CF6] shadow-[0_28px_65px_-24px_rgba(91,33,182,0.24)]",
    iconBoxClass: "bg-[#8B5CF6]/20 text-[#5B21B6]",
    statTextClass: "text-[#6D28D9]",
    dotActiveClass: "w-8 bg-[#7C3AED]",
    mobileCardStyle: "linear-gradient(145deg, #EDE4FF 0%, #F8F5FF 100%)",
    mobileBorderClass: "border-2 border-[#8B5CF6]",
  },
  obsidian: {
    id: "obsidian",
    label: "Obsidian Gallery + Neon",
    swatch: "#0F171A",
    secondarySwatch: "#E6E4DD",
    isDarkCard: true,
    bgStyle:
      "radial-gradient(circle at 82% 22%, rgba(0, 229, 204, 0.24), transparent 48%), radial-gradient(circle at 18% 82%, rgba(255, 90, 31, 0.18), transparent 46%), linear-gradient(145deg, #E8E5DC 0%, #F5F3EE 58%, #ECE9E1 100%)",
    orbClass: "bg-[#00E5CC]/30",
    badgeClass: "bg-[#0F171A] text-[#00F5D4] border border-[#00E5CC]/50",
    highlightClass: "text-[#0F171A]",
    checkClass: "text-[#007A6E]",
    cardClass:
      "bg-[#0F171A] text-[#F7F5F0] border-2 border-[#00E5CC] shadow-[0_32px_70px_-24px_rgba(15,23,26,0.52)]",
    iconBoxClass: "bg-[#FF5A1F]/22 text-[#FF7A45]",
    statTextClass: "text-[#00F5D4]",
    dotActiveClass: "w-8 bg-[#0F171A]",
    mobileCardStyle: "linear-gradient(145deg, #ECEAE2 0%, #F8F6F1 100%)",
    mobileBorderClass: "border-2 border-[#0F171A]",
  },
  slate: {
    id: "slate",
    label: "Architectural Slate",
    swatch: "#475569",
    secondarySwatch: "#E2E8F0",
    isDarkCard: true,
    bgStyle:
      "radial-gradient(circle at 80% 24%, rgba(71, 85, 105, 0.22), transparent 52%), linear-gradient(145deg, #E2E8F0 0%, #F4F7FA 58%, #E7EEF5 100%)",
    orbClass: "bg-[#64748B]/28",
    badgeClass: "bg-[#1E293B] text-[#F8FAFC] border border-[#64748B]",
    highlightClass: "text-[#334155]",
    checkClass: "text-[#334155]",
    cardClass:
      "bg-[#16202A] text-[#F8FAFC] border-2 border-[#64748B] shadow-[0_32px_70px_-24px_rgba(15,23,42,0.45)]",
    iconBoxClass: "bg-[#38BDF8]/20 text-[#38BDF8]",
    statTextClass: "text-[#38BDF8]",
    dotActiveClass: "w-8 bg-[#334155]",
    mobileCardStyle: "linear-gradient(145deg, #E4EAF2 0%, #F6F8FB 100%)",
    mobileBorderClass: "border-2 border-[#64748B]",
  },
  crimson: {
    id: "crimson",
    label: "Crimson Lacquer",
    swatch: "#DC2626",
    secondarySwatch: "#FEE2E2",
    isDarkCard: false,
    bgStyle:
      "radial-gradient(circle at 82% 24%, rgba(220, 38, 38, 0.24), transparent 52%), linear-gradient(145deg, #FEE2E2 0%, #FFF5F5 58%, #FDE8E8 100%)",
    orbClass: "bg-[#EF4444]/28",
    badgeClass: "bg-[#991B1B] text-[#FEF2F2] border border-[#EF4444]",
    highlightClass: "text-[#B91C1C]",
    checkClass: "text-[#DC2626]",
    cardClass:
      "bg-white/95 border-2 border-[#EF4444] shadow-[0_28px_65px_-24px_rgba(153,27,27,0.24)]",
    iconBoxClass: "bg-[#EF4444]/18 text-[#991B1B]",
    statTextClass: "text-[#B91C1C]",
    dotActiveClass: "w-8 bg-[#DC2626]",
    mobileCardStyle: "linear-gradient(145deg, #FEE6E6 0%, #FFF7F7 100%)",
    mobileBorderClass: "border-2 border-[#EF4444]",
  },
  gold: {
    id: "gold",
    label: "Burnished Studio Gold",
    swatch: "#CA8A04",
    secondarySwatch: "#F9F1D0",
    isDarkCard: false,
    bgStyle:
      "radial-gradient(circle at 80% 24%, rgba(202, 138, 4, 0.28), transparent 52%), linear-gradient(145deg, #F9F1D0 0%, #FDFBF0 58%, #F7ECBE 100%)",
    orbClass: "bg-[#EAB308]/30",
    badgeClass: "bg-[#713F12] text-[#FEFCE8] border border-[#CA8A04]",
    highlightClass: "text-[#854D0E]",
    checkClass: "text-[#A16207]",
    cardClass:
      "bg-white/95 border-2 border-[#CA8A04] shadow-[0_28px_65px_-24px_rgba(113,63,18,0.24)]",
    iconBoxClass: "bg-[#EAB308]/22 text-[#713F12]",
    statTextClass: "text-[#854D0E]",
    dotActiveClass: "w-8 bg-[#CA8A04]",
    mobileCardStyle: "linear-gradient(145deg, #FBF3D5 0%, #FEFCF3 100%)",
    mobileBorderClass: "border-2 border-[#CA8A04]",
  },
  arctic: {
    id: "arctic",
    label: "Arctic Cyan-Ice",
    swatch: "#0284C7",
    secondarySwatch: "#D8F3FE",
    isDarkCard: false,
    bgStyle:
      "radial-gradient(circle at 82% 24%, rgba(14, 165, 233, 0.28), transparent 52%), linear-gradient(145deg, #D8F3FE 0%, #F2FAFF 58%, #E0F5FF 100%)",
    orbClass: "bg-[#0EA5E9]/30",
    badgeClass: "bg-[#075985] text-[#F0F9FF] border border-[#0EA5E9]",
    highlightClass: "text-[#0369A1]",
    checkClass: "text-[#0284C7]",
    cardClass:
      "bg-white/95 border-2 border-[#0EA5E9] shadow-[0_28px_65px_-24px_rgba(7,89,133,0.24)]",
    iconBoxClass: "bg-[#0EA5E9]/20 text-[#075985]",
    statTextClass: "text-[#0369A1]",
    dotActiveClass: "w-8 bg-[#0284C7]",
    mobileCardStyle: "linear-gradient(145deg, #DCF4FF 0%, #F4FBFF 100%)",
    mobileBorderClass: "border-2 border-[#0EA5E9]",
  },
};

export const SLIDE_THEME_ORDER: Exclude<BuildStepAccent, "default">[] = [
  "teal",
  "orange",
  "cobalt",
  "emerald",
  "amber",
  "violet",
  "rose",
  "obsidian",
  "arctic",
  "gold",
  "slate",
  "crimson",
];

export const SLIDE_THEME_OPTIONS: {
  value: BuildStepAccent;
  label: string;
  swatch: string;
}[] = [
  { value: "default", label: "Default (Auto Theme)", swatch: "#00D2BC" },
  ...SLIDE_THEME_ORDER.map((key) => ({
    value: key,
    label: SLIDE_THEMES[key].label,
    swatch: SLIDE_THEMES[key].swatch,
  })),
];

/**
 * Resolves any BuildStep accent (including "default" or any legacy value) safely
 * to a complete theme definition — never returns undefined even on slide #4, #5, #12+.
 */
export function resolveSlideTheme(
  accent: string | undefined,
  slideIndex: number
): SlideThemeDefinition {
  if (accent && accent !== "default" && accent in SLIDE_THEMES) {
    return SLIDE_THEMES[accent as Exclude<BuildStepAccent, "default">];
  }
  const autoKey = SLIDE_THEME_ORDER[Math.abs(slideIndex) % SLIDE_THEME_ORDER.length];
  return SLIDE_THEMES[autoKey];
}
