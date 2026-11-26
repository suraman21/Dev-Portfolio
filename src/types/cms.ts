/**
 * CMS & Future Admin-Panel-Ready Portfolio Project Schema
 *
 * Every field here is plain, JSON-serializable data designed to map 1:1
 * to a database table (Postgres / Supabase / Prisma) or headless CMS
 * (Sanity / Payload / Strapi) when an Admin Panel is connected later.
 */

export type ProjectCategory = "SaaS Products" | "Web Platforms" | "Design Systems";

/** How an uploaded product image scales inside its locked responsive frame */
export type ProjectMediaFit = "cover" | "contain";

/** Where cropping focuses when `fit === "cover"` so key UI/subjects never clip */
export type ProjectMediaFocalPoint = "center" | "top" | "bottom" | "left" | "right";

/**
 * Visual presentation frame selected per project in the Admin Panel:
 * - "browser"   : Minimal adaptive window bar for raw web app screenshots
 * - "studio"    : Tinted gallery mat around high-contrast light/dark UI shots
 * - "floating"  : Clean elevated card shadow (ideal when image already has browser chrome)
 * - "frameless" : Edge-to-edge editorial photography with subtle hairline ring
 */
export type ProjectMediaFrameStyle = "browser" | "studio" | "floating" | "frameless";

/** Dominant visual tone of the uploaded image itself so inner borders & chrome adapt cleanly */
export type ProjectMediaTone = "light" | "dark" | "warm" | "vibrant";

export interface ProjectGalleryItem {
  url: string;
  alt: string;
  caption?: string;
}

export interface ProjectMedia {
  /** Relative path (`/images/projects/...`) or absolute remote CDN/Storage URL */
  coverImage: string;
  alt: string;
  fit: ProjectMediaFit;
  focalPoint: ProjectMediaFocalPoint;
  frameStyle: ProjectMediaFrameStyle;
  surfaceTone: ProjectMediaTone;
  /** Optional subtle label shown on case study view */
  caption?: string;
  gallery?: ProjectGalleryItem[];
}

export type ProjectThemePreset =
  | "teal"
  | "orange"
  | "gold"
  | "cobalt"
  | "rose"
  | "sage"
  | "obsidian"
  | "custom";

export type ProjectCardTone = "light" | "tinted" | "dark";

export interface ProjectTheme {
  /** 1-click preset for quick Admin Panel setup, or "custom" with arbitrary hex values */
  preset: ProjectThemePreset;
  /** Primary brand/highlight hex color for this project (e.g. "#00C4B0") */
  accentColor: string;
  /** Soft studio section backdrop hex color (e.g. "#DCF9F3") */
  surfaceColor: string;
  /** Controls whether the project card uses a bright, tinted, or moody dark surface */
  cardTone: ProjectCardTone;
  /** Optional secondary gradient accent hex (defaults smoothly from accentColor) */
  secondaryAccent?: string;
  /** Optional manual WCAG-safe ink override for accent text */
  accentInk?: string;
}

export interface ProjectMetric {
  label: string;
  value: string;
  note: string;
}

export interface ProjectDecision {
  title: string;
  detail: string;
}

export interface Project {
  slug: string;
  number: string;
  title: string;
  client: string;
  year: string;
  role: string;
  timeline: string;
  category: ProjectCategory;
  /** Self-contained media configuration (real uploaded image + adaptive frame rules) */
  media: ProjectMedia;
  /** Self-contained color/tone configuration (powers sliders, cards, and case studies) */
  theme: ProjectTheme;
  tagline: string;
  keyResult: string;
  overview: string;
  stack: string[];
  metrics: ProjectMetric[];
  challenge: {
    heading: string;
    description: string;
    points: string[];
  };
  solution: {
    heading: string;
    description: string;
    decisions: ProjectDecision[];
  };
  outcome: {
    heading: string;
    description: string;
    takeaways: string[];
  };
  /** Optional publishing metadata for future Admin Panel sorting & drafts */
  featured?: boolean;
  published?: boolean;
  liveUrl?: string;
}
