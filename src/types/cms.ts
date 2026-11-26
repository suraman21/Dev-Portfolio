/**
 * CMS & Full Admin-Panel Schema (Next.js Frontend + PHP/MySQL Backend)
 *
 * Every interface here maps 1:1 to tables in `php-backend/database/schema.sql`
 * and JSON responses from `php-backend/public/index.php` and `/api/cms`.
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
  coverImage: string;
  alt: string;
  fit: ProjectMediaFit;
  focalPoint: ProjectMediaFocalPoint;
  frameStyle: ProjectMediaFrameStyle;
  surfaceTone: ProjectMediaTone;
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
  preset: ProjectThemePreset;
  accentColor: string;
  surfaceColor: string;
  cardTone: ProjectCardTone;
  secondaryAccent?: string;
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
  id?: string;
  slug: string;
  number: string;
  title: string;
  client: string;
  year: string;
  role: string;
  timeline: string;
  category: ProjectCategory;
  media: ProjectMedia;
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
  featured?: boolean;
  published?: boolean;
  liveUrl?: string;
}

export interface HeroStat {
  value: string;
  label: string;
}

export type ProfileImagePosition = "top" | "center" | "bottom";

export interface SiteSettings {
  // Brand & Developer Identity
  name: string;
  monogram: string;
  role: string;
  location: string;
  availability: string;
  email: string;
  github: string;
  linkedin: string;

  // Developer Profile Portrait & Home Profile Spotlight
  profileImage: string;
  profileImageAlt: string;
  profileImagePosition: ProfileImagePosition;
  profileEyebrow: string;
  profileHeadline: string;
  profileHighlight: string;
  profileBio: string;
  profileHighlights: string[];
  profilePrimaryCta: string;
  profileSecondaryCta: string;
  showHomeProfile: boolean;

  // Home Hero
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroScrollCue: string;
  heroStats: HeroStat[];

  // Home Selected Work Section Copy
  workReelEyebrow: string;
  workReelHeadline: string;
  workReelHighlight: string;
  workReelEndEyebrow: string;
  workReelEndHeadline: string;
  workReelEndHighlight: string;
  workReelEndDescription: string;
  workReelEndCta: string;

  // Home Testimonials & Closing CTA
  testimonialsEyebrow: string;
  testimonialsHeadline: string;
  testimonialsHighlight: string;
  ctaHeadline: string;
  ctaHighlight: string;
  ctaDescription: string;
  ctaButtonLabel: string;

  // Work Page Header
  workPageEyebrow: string;
  workPageHeadline: string;
  workPageHighlight: string;
  workPageDescription: string;

  // Footer
  footerHeadline: string;
  footerHighlight: string;
  footerBio: string;
  footerCtaLabel: string;
  footerCopyrightNote: string;

  // Contact Page
  contactHeadline: string;
  contactHighlight: string;
  contactDescription: string;
  contactReplyNote: string;
  contactSubmitLabel: string;
  contactBudgetOptions: string[];
}

export interface AboutContent {
  // Hero & Bio
  eyebrow: string;
  headline: string;
  highlight: string;
  bio: string;
  secondaryBio: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;

  // Developer Portrait Card & Quick Overview
  showProfileImage: boolean;
  profileCardLabel: string;
  profileCaption: string;
  quickOverviewTitle: string;

  // Services Section on About Page
  showServices: boolean;
  servicesEyebrow: string;
  servicesHeadline: string;
  servicesHighlight: string;
  servicesLinkLabel: string;

  // Experience Section on About Page
  showExperience: boolean;
  experienceEyebrow: string;
  experienceHeadline: string;
  experienceHighlight: string;

  // Core Skills Section on About Page
  showSkills: boolean;
  skillsEyebrow: string;
  skillsHeadline: string;
  skillsHighlight: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  shortDescription: string;
  timeline: string;
  startingPrice: string;
  accent: "teal" | "orange";
  active: boolean;
}

export interface BuildStep {
  id?: string;
  number: string;
  label: string;
  title: string;
  highlight: string;
  description: string;
  accent: "teal" | "orange" | "cobalt";
  points: string[];
  statValue: string;
  statLabel: string;
  visualType: "strategy" | "engineering" | "craft";
}

export interface Testimonial {
  id?: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  result: string;
}

export interface ExperienceItem {
  id?: string;
  period: string;
  role: string;
  company: string;
  location: string;
  summary: string;
  highlights: string[];
}

export interface SkillGroup {
  id?: string;
  title: string;
  accent: "teal" | "orange";
  skills: string[];
}

export type ContactMessageStatus = "new" | "read" | "replied" | "archived";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  serviceId?: string;
  serviceName: string;
  budget?: string;
  message: string;
  status: ContactMessageStatus;
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  filename: string;
  url: string;
  alt: string;
  mimeType: string;
  sizeBytes?: number;
  createdAt: string;
}

/** Complete Website Content Payload managed by Admin Panel & PHP/MySQL API */
export interface CmsData {
  site: SiteSettings;
  about: AboutContent;
  services: ServiceItem[];
  projects: Project[];
  buildSteps: BuildStep[];
  testimonials: Testimonial[];
  experiences: ExperienceItem[];
  skillGroups: SkillGroup[];
  mediaLibrary: MediaAsset[];
}
