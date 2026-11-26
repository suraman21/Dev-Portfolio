import type { CmsData, ContactMessage } from "@/types/cms";
import { siteConfig } from "./site";
import { projects } from "./projects";
import { buildSteps, experiences, skillGroups, testimonials } from "./story";

export const defaultCmsData: CmsData = {
  site: {
    name: siteConfig.name,
    monogram: siteConfig.monogram,
    role: siteConfig.role,
    location: siteConfig.location,
    availability: siteConfig.availability,
    email: siteConfig.email,
    github: siteConfig.github,
    linkedin: siteConfig.linkedin,
    heroTitle: "I build fast SaaS products &",
    heroHighlight: "luxury websites.",
    heroDescription:
      "I help startups and growing companies turn complex ideas into fast, reliable software and memorable web experiences that feel effortless on every screen.",
    heroStats: [...siteConfig.heroStats],
    ctaHeadline: "Have a product or role in mind?",
    ctaHighlight: "Let's build it right.",
    ctaDescription:
      "Whether you're hiring a senior engineer or launching a new flagship SaaS or website, I'd love to hear what you're working on.",
    footerHeadline: "Building products with",
    footerHighlight: "clarity & speed.",
    footerBio:
      "Designing and engineering fast, reliable SaaS platforms and modern luxury websites for ambitious teams worldwide.",
    contactHeadline: "Let's work",
    contactHighlight: "together.",
    contactDescription:
      "Share a quick overview of your product, service needs, or timeline. I reply personally to every message within 24 hours.",
    contactReplyNote: "Usually replies within 24 hours",
  },
  about: {
    eyebrow: "About Me",
    headline: "Senior engineering rigor with an eye for",
    highlight: "luxury craft.",
    bio: "I'm Sura Aman, a Senior Software Engineer and Web Developer with over 8 years of experience building scalable SaaS products and high-converting websites. I enjoy bridging the gap between backend reliability and smooth, intuitive design so products feel great for real people.",
  },
  services: [
    {
      id: "svc-saas",
      name: "SaaS Product & Dashboard Engineering",
      shortDescription:
        "End-to-end full-stack web apps, fast dashboards, APIs, and real-time analytics built for scale.",
      timeline: "6–12 Weeks",
      startingPrice: "Custom Scope",
      accent: "teal",
      active: true,
    },
    {
      id: "svc-website",
      name: "Luxury Website & Brand Flagship",
      shortDescription:
        "High-converting marketing websites, editorial storytelling, smooth scroll motion, and CMS setup.",
      timeline: "4–8 Weeks",
      startingPrice: "Custom Scope",
      accent: "orange",
      active: true,
    },
    {
      id: "svc-design-system",
      name: "Design System & UI Architecture",
      shortDescription:
        "Accessible React + Tailwind component libraries, responsive tokens, and multi-device parity.",
      timeline: "3–6 Weeks",
      startingPrice: "Custom Scope",
      accent: "teal",
      active: true,
    },
    {
      id: "svc-role",
      name: "Full-Time Senior / Staff Engineering Role",
      shortDescription:
        "Joining your core engineering team remotely to lead frontend architecture and product craft.",
      timeline: "Ongoing",
      startingPrice: "Full-Time",
      accent: "orange",
      active: true,
    },
    {
      id: "svc-advisory",
      name: "Technical Advisory & Performance Audit",
      shortDescription:
        "Deep performance profiling, UX clarity audit, and actionable engineering roadmap for existing apps.",
      timeline: "1–2 Weeks",
      startingPrice: "Fixed Sprint",
      accent: "teal",
      active: true,
    },
  ],
  projects: projects.map((p, idx) => ({
    ...p,
    id: p.id || `proj-${idx + 1}`,
  })),
  buildSteps: buildSteps.map((s, idx) => ({
    ...s,
    id: `step-${idx + 1}`,
  })),
  testimonials: testimonials.map((t, idx) => ({
    ...t,
    id: `test-${idx + 1}`,
  })),
  experiences: experiences.map((e, idx) => ({
    ...e,
    id: `exp-${idx + 1}`,
  })),
  skillGroups: skillGroups.map((g, idx) => ({
    ...g,
    id: `skill-${idx + 1}`,
  })),
  mediaLibrary: [
    {
      id: "media-1",
      filename: "aether-cloud.png",
      url: "/images/projects/aether-cloud.png",
      alt: "Aether Cloud dark-mode analytics dashboard",
      mimeType: "image/png",
      createdAt: "2026-11-20T10:00:00.000Z",
    },
    {
      id: "media-2",
      filename: "solstice-treasury.png",
      url: "/images/projects/solstice-treasury.png",
      alt: "Solstice Treasury light-mode fintech banking interface",
      mimeType: "image/png",
      createdAt: "2026-11-20T10:05:00.000Z",
    },
    {
      id: "media-3",
      filename: "velour-maison.png",
      url: "/images/projects/velour-maison.png",
      alt: "Maison Velour Parisian ceramic and brass editorial lookbook",
      mimeType: "image/png",
      createdAt: "2026-11-20T10:10:00.000Z",
    },
    {
      id: "media-4",
      filename: "kinetix-workspace.png",
      url: "/images/projects/kinetix-workspace.png",
      alt: "Kinetix Studio multiplayer design system canvas",
      mimeType: "image/png",
      createdAt: "2026-11-20T10:15:00.000Z",
    },
  ],
};

export const defaultContactMessages: ContactMessage[] = [
  {
    id: "msg-welcome-1",
    name: "Elena Rostova",
    email: "elena@aethersystems.io",
    serviceId: "svc-saas",
    serviceName: "SaaS Product & Dashboard Engineering",
    budget: "$25k – $50k",
    message:
      "Hi Sura — we're expanding Aether Cloud's observability suite for Q1 and would love to discuss partnering on the new real-time telemetry workspace.",
    status: "new",
    createdAt: "2026-11-24T14:30:00.000Z",
  },
];
