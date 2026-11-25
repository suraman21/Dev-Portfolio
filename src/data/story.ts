export interface BuildStep {
  number: string;
  label: string;
  title: string;
  highlight: string;
  description: string;
  accent: "teal" | "orange";
  points: string[];
  statValue: string;
  statLabel: string;
  visualType: "strategy" | "engineering" | "craft";
}

export const buildSteps: BuildStep[] = [
  {
    number: "01",
    label: "Step 01 · Product Clarity",
    title: "Every great product starts with",
    highlight: "clarity.",
    description:
      "Before writing a single line of code, I simplify complex business goals into clear user journeys. Visitors should understand what your product does and trust it within the first three seconds.",
    accent: "teal",
    points: [
      "Clear information hierarchy rooted in real UX psychology",
      "Simple, scannable flows that convert visitors into customers",
      "Designed thoughtfully for phones, laptops, desktops, and large displays",
    ],
    statValue: "3 sec",
    statLabel: "First-impression clarity target",
    visualType: "strategy",
  },
  {
    number: "02",
    label: "Step 02 · Full-Stack Engineering",
    title: "Built for real speed and",
    highlight: "reliability.",
    description:
      "Luxury disappears the moment a site lags or breaks. I engineer clean full-stack architectures — resilient APIs, fast databases, strict TypeScript, and edge caching — so your product stays rock-solid as you scale.",
    accent: "teal",
    points: [
      "Sub-second page loads and instant button feedback",
      "Scalable backend APIs, databases, and clean TypeScript codebases",
      "Accessible WCAG 2.2 contrast and keyboard support built in from day one",
    ],
    statValue: "99.99%",
    statLabel: "Production reliability standard",
    visualType: "engineering",
  },
  {
    number: "03",
    label: "Step 03 · Motion & Luxury Polish",
    title: "Crafted with movement that feels",
    highlight: "alive.",
    description:
      "The difference between good software and unforgettable software lives in the details — smooth scroll pacing, subtle tactile animations, warm lighting, and purposeful interactive 3D that elevates your brand without getting in the way.",
    accent: "orange",
    points: [
      "Butter-smooth 60fps transitions and spring micro-interactions",
      "Restrained, high-taste visual design that makes your brand look unmistakable",
      "Purposeful interactive 3D moments that tell a story without slowing the page",
    ],
    statValue: "60fps",
    statLabel: "Fluid motion across devices",
    visualType: "craft",
  },
];

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  result: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "Sura is the rarest kind of engineer: he solves tough backend performance bottlenecks and still cares deeply about every pixel, transition, and customer interaction. Our trial conversions jumped 38% right after launch.",
    author: "Elena Rostova",
    role: "VP of Engineering",
    company: "Aether Systems",
    result: "64% faster · +38% conversions",
  },
  {
    quote:
      "When clients move millions of dollars, software has to feel calm and trustworthy. Sura transformed a stressful workflow into the cleanest, fastest financial platform our customers have ever used.",
    author: "Marcus Lindholm",
    role: "Co-Founder & CTO",
    company: "Solstice Financial",
    result: "$2.4B processed · 84 NPS",
  },
  {
    quote:
      "Previous web agencies gave us heavy sites that crawled on iPhones. Sura delivered a luxury digital flagship that loads in a second, feels effortless to browse, and grew our online sales by 41%.",
    author: "Camille Laurent",
    role: "Chief Digital Officer",
    company: "Maison Velour",
    result: "+41% sales · 1.1s load time",
  },
];

export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  location: string;
  summary: string;
  highlights: string[];
}

export const experiences: ExperienceItem[] = [
  {
    period: "2024 — Present",
    role: "Principal Software Engineer & Web Consultant",
    company: "Independent · Sura Aman",
    location: "Addis Ababa · Global Remote",
    summary:
      "Partnering with ambitious SaaS teams and luxury brands to architect flagship web applications, redesign complex dashboards, and ship fast full-stack products.",
    highlights: [
      "Led Aether Cloud's frontend and live-streaming overhaul (-64% latency, +38% conversions).",
      "Architected Solstice Treasury's multi-signature banking experience ($2.4B processed).",
      "Built Maison Velour's luxury e-commerce flagship (+41% online sales lift).",
    ],
  },
  {
    period: "2022 — 2024",
    role: "Staff Frontend & Design System Engineer",
    company: "Kinetix Labs",
    location: "San Francisco (Remote)",
    summary:
      "Owned the multiplayer browser workspace, component design system, and frontend architecture powering 180,000+ monthly active creators.",
    highlights: [
      "Engineered real-time multiplayer sync with 24ms median latency.",
      "Simplified onboarding and workspace controls, lifting first-run completion by 47%.",
      "Mentored a team of 10 engineers on React performance, TypeScript, and UX polish.",
    ],
  },
  {
    period: "2020 — 2022",
    role: "Senior Full-Stack Software Engineer",
    company: "Meridian Commerce",
    location: "London (Remote)",
    summary:
      "Engineered scalable checkout APIs and shared storefront design systems serving millions of monthly shoppers across 12 international markets.",
    highlights: [
      "Cut API checkout response times from 420ms down to 78ms.",
      "Created an accessible 60+ component UI library adopted across all product squads.",
    ],
  },
  {
    period: "2018 — 2020",
    role: "Software Engineer",
    company: "Nordic Digital Craft",
    location: "Remote",
    summary:
      "Built custom websites, interactive product showcases, and full-stack web applications for growing European startups.",
    highlights: [
      "Shipped 18+ production web platforms with crisp typography, responsive layouts, and clean APIs.",
    ],
  },
];

export const skillGroups = [
  {
    title: "Frontend & User Experience",
    accent: "teal" as const,
    skills: [
      "Next.js & React",
      "TypeScript",
      "Tailwind CSS",
      "Design Systems",
      "Responsive Mobile to 4K",
      "Accessibility (WCAG 2.2)",
    ],
  },
  {
    title: "Backend & Cloud Systems",
    accent: "teal" as const,
    skills: [
      "Node.js & Go",
      "PostgreSQL & Redis",
      "REST & GraphQL APIs",
      "Real-Time WebSockets",
      "Performance & Edge Caching",
      "Security & Passkeys",
    ],
  },
  {
    title: "Motion & Interactive 3D",
    accent: "orange" as const,
    skills: [
      "GSAP Scroll Choreography",
      "Framer Motion Springs",
      "Lenis Smooth Scroll",
      "Three.js & React Three Fiber",
      "Micro-Interactions",
      "60fps GPU Optimization",
    ],
  },
];
