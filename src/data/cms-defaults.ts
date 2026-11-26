import type { CmsData, ContactMessage } from "@/types/cms";
import { siteConfig } from "./site";
import { projects } from "./projects";
import { buildSteps, experiences, skillGroups, testimonials } from "./story";

export const DEFAULT_FAVICON_URL = "/images/favicons/code-brackets.svg";

export const FAVICON_PRESETS = [
  {
    id: "code-brackets",
    label: "Code Brackets </>",
    description: "Signature neon-teal chevrons & orange slash",
    url: "/images/favicons/code-brackets.svg",
  },
  {
    id: "terminal-prompt",
    label: "Terminal >_",
    description: "Engineering CLI window with neon cursor",
    url: "/images/favicons/terminal-prompt.svg",
  },
  {
    id: "circuit-node",
    label: "Systems Graph",
    description: "Distributed architecture & API core nodes",
    url: "/images/favicons/circuit-node.svg",
  },
  {
    id: "braces-core",
    label: "Braces {·}",
    description: "Minimal curly braces with orange core",
    url: "/images/favicons/braces-core.svg",
  },
] as const;

export const defaultCmsData: CmsData = {
  site: {
    name: siteConfig.name,
    monogram: siteConfig.monogram,
    role: siteConfig.role,
    location: siteConfig.location,
    availability: siteConfig.availability,
    headerCtaLabel: "Let's Talk",
    faviconUrl: DEFAULT_FAVICON_URL,
    email: siteConfig.email,
    github: siteConfig.github,
    showGithub: true,
    linkedin: siteConfig.linkedin,
    showLinkedin: true,
    whatsapp: "+251900000000",
    showWhatsapp: true,
    telegram: "@suraaman",
    showTelegram: true,
    showFloatingContact: true,

    // Developer Portrait & Home Profile Spotlight
    profileImage: "/images/developer-profile.png",
    profileImageAlt: `${siteConfig.name} — ${siteConfig.role}`,
    profileImagePosition: "top",
    profileEyebrow: "Meet the Developer",
    profileHeadline: "Engineering depth paired with",
    profileHighlight: "taste & clarity.",
    profileBio:
      "I partner directly with founders, product leaders, and engineering teams to take ambitious SaaS products and flagship websites from concept to crisp, production-hardened reality.",
    profileHighlights: [
      "8+ years shipping full-stack SaaS & web platforms",
      "Direct founder-to-engineer collaboration — zero agency layers",
      "Obsessed with speed, clean architecture, and luxury UI craft",
    ],
    profilePrimaryCta: "Full Bio & Experience",
    profileSecondaryCta: "Start a Conversation",
    showHomeProfile: true,

    // Home Hero
    heroTitle: "I build fast SaaS products &",
    heroHighlight: "luxury websites.",
    heroDescription:
      "I help startups and growing companies turn complex ideas into fast, reliable software and memorable web experiences that feel effortless on every screen.",
    heroPrimaryCta: "View Selected Work",
    heroSecondaryCta: "Start a Conversation",
    heroScrollCue: "Scroll to see how I build",
    heroStats: [...siteConfig.heroStats],

    // Home Selected Work Reel
    workReelEyebrow: "Selected Work",
    workReelHeadline: "Featured",
    workReelHighlight: "Products",
    workReelEndEyebrow: "All Projects",
    workReelEndHeadline: "Want to see the full",
    workReelEndHighlight: "portfolio?",
    workReelEndDescription:
      "Browse every shipped SaaS dashboard, luxury website, and design system with real product imagery and engineering breakdowns.",
    workReelEndCta: "Browse All Work",

    // Home Testimonials & Closing CTA
    testimonialsEyebrow: "Client Feedback",
    testimonialsHeadline: "What teams say after",
    testimonialsHighlight: "shipping together.",
    ctaHeadline: "Have a product or role in mind?",
    ctaHighlight: "Let's build it right.",
    ctaDescription:
      "Whether you're hiring a senior engineer or launching a new flagship SaaS or website, I'd love to hear what you're working on.",
    ctaButtonLabel: "Start a Conversation",

    // Work Page Header
    workPageEyebrow: "Selected Work",
    workPageHeadline: "Products & websites built for",
    workPageHighlight: "real impact.",
    workPageDescription:
      "A curated collection of SaaS platforms, luxury storefronts, and design systems — each presented with its own real product visuals, adaptive palette, and measurable results.",

    // Footer
    footerHeadline: "Building products with",
    footerHighlight: "clarity & speed.",
    footerBio:
      "Designing and engineering fast, reliable SaaS platforms and modern luxury websites for ambitious teams worldwide.",
    footerCtaLabel: "Start a Project",
    footerCopyrightNote: "Crafted with care.",

    // Contact Page
    contactHeadline: "Let's work",
    contactHighlight: "together.",
    contactDescription:
      "Share a quick overview of your product, service needs, or timeline. I reply personally to every message within 24 hours.",
    contactReplyNote: "Usually replies within 24 hours",
    contactSubmitLabel: "Send Message",
    contactBudgetOptions: [
      "Not sure yet / Let's discuss",
      "Under $5,000",
      "$5,000 – $15,000",
      "$15,000 – $35,000",
      "$35,000+",
      "Full-Time Compensation",
    ],
  },
  about: {
    eyebrow: "About Me",
    headline: "Senior engineering rigor with an eye for",
    highlight: "luxury craft.",
    bio: "I'm Sura Aman, a Senior Software Engineer and Web Developer with over 8 years of experience building scalable SaaS products and high-converting websites. I enjoy bridging the gap between backend reliability and smooth, intuitive design so products feel great for real people.",
    secondaryBio:
      "Every engagement combines pragmatic architecture, measurable Core Web Vitals performance, and clean editorial polish — whether leading a full-stack product launch or leveling up an existing platform.",
    primaryCtaLabel: "See Selected Work",
    secondaryCtaLabel: "Get in Touch",

    showProfileImage: true,
    profileCardLabel: "Developer Portrait",
    profileCaption: "Working remotely with ambitious founders and product teams worldwide.",
    quickOverviewTitle: "Quick Overview",

    showServices: true,
    servicesEyebrow: "Services",
    servicesHeadline: "How we can",
    servicesHighlight: "work together.",
    servicesLinkLabel: "Request a service →",

    showExperience: true,
    experienceEyebrow: "Experience",
    experienceHeadline: "Where I've",
    experienceHighlight: "shipped work.",

    showSkills: true,
    skillsEyebrow: "Core Capabilities",
    skillsHeadline: "Tools &",
    skillsHighlight: "Expertise",
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
      id: "media-profile",
      filename: "developer-profile.png",
      url: "/images/developer-profile.png",
      alt: `${siteConfig.name} developer studio portrait`,
      mimeType: "image/png",
      createdAt: "2026-11-25T10:00:00.000Z",
    },
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
