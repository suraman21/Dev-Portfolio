export interface ArchitectureStratum {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  italicWord: string;
  summary: string;
  accent: "teal" | "orange";
  metrics: { label: string; value: string }[];
  capabilities: string[];
  codeProof: string;
  layerIndex: number;
}

export const architectureStrata: ArchitectureStratum[] = [
  {
    id: "foundation",
    index: "01",
    eyebrow: "STRATUM 01 · DISTRIBUTED FOUNDATION",
    title: "Resilient Cloud & Edge",
    italicWord: "Infrastructure",
    summary:
      "Every luxurious interface starts below the surface. I architect multi-region APIs, event-driven state machines, and edge-cached data pipelines engineered for four-nines uptime and sub-40ms global p99 latency.",
    accent: "teal",
    metrics: [
      { label: "Target Availability", value: "99.99%" },
      { label: "Edge p99 Budget", value: "< 38ms" },
      { label: "Throughput Scale", value: "14M/min" },
    ],
    capabilities: [
      "Distributed APIs (Go, Node.js, Rust)",
      "PostgreSQL, ClickHouse & Redis Architecture",
      "Zero-Downtime Migrations & Observability",
      "Multi-Region Edge Caching & Security",
    ],
    codeProof: `// Deterministic Idempotent Edge Pipeline
export async function executeEdgeTx(cmd: SignedCmd) {
  return await ledger.atomic(cmd.idempotencyKey, {
    isolation: "serializable",
    edgeRevalidate: ["global-pops"],
    p99BudgetMs: 38,
  });
}`,
    layerIndex: 0,
  },
  {
    id: "engine",
    index: "02",
    eyebrow: "STRATUM 02 · APPLICATION ENGINE",
    title: "Type-Safe Systems & Real-Time",
    italicWord: "State",
    summary:
      "Complex SaaS workflows demand zero-jank data orchestration. I separate high-frequency telemetry and optimistic mutations from UI rendering so interfaces respond inside the 400ms Doherty Threshold even under heavy load.",
    accent: "teal",
    metrics: [
      { label: "Interaction to Paint", value: "< 80ms" },
      { label: "Type Coverage", value: "100% Strict" },
      { label: "Layout Shift (CLS)", value: "0.002" },
    ],
    capabilities: [
      "Next.js App Router & React 19 RSC",
      "CRDT Multiplayer & WebSocket Streams",
      "WebWorkers & Binary Ring Buffers",
      "Strict End-to-End TypeScript Contracts",
    ],
    codeProof: `// Zero-Rerender Frame Bridge (GSAP -> R3F)
export const cinemaClock = {
  progress: 0,
  velocity: 0,
  activeStratum: 0,
}; // Mutated at 120Hz outside React reconciliation`,
    layerIndex: 1,
  },
  {
    id: "surface",
    index: "03",
    eyebrow: "STRATUM 03 · LUXURY DESIGN SYSTEMS",
    title: "Swiss Precision & Tactile",
    italicWord: "Interfaces",
    summary:
      "I engineer multi-viewport design systems grounded in behavioral UX psychology — fluid clamp() typography, native @container queries, WCAG 2.2 AA/AAA wide-gamut color tokens, and 1-foot mobile to 10-foot 4K TV spatial navigation.",
    accent: "orange",
    metrics: [
      { label: "Contrast Standard", value: "WCAG AAA" },
      { label: "Viewport Range", value: "320px–4K" },
      { label: "Component Reuse", value: "94% Tokenized" },
    ],
    capabilities: [
      "Tailwind v4 + Wide-Gamut oklch() Tokens",
      "Fluid Typography & CSS Container Queries",
      "10-Foot Smart TV Spatial Focus Navigation",
      "Behavioral UX (Hick, Fitts, Peak-End, Flow)",
    ],
    codeProof: `/* Continuous 1-ft Mobile to 10-ft 4K Fluidity */
--text-hero: clamp(2.5rem, 1.35rem + 4.4vw, 6.4rem);
--neon-teal: oklch(0.845 0.168 178);
--neon-orange: oklch(0.68 0.225 36);`,
    layerIndex: 2,
  },
  {
    id: "cinema",
    index: "04",
    eyebrow: "STRATUM 04 · LIVING CINEMA & 3D",
    title: "Interactive WebGL & Living",
    italicWord: "Motion",
    summary:
      "Motion is meaning, never decoration. I combine GSAP ScrollTrigger camera choreography, Lenis momentum, Disney-calibrated spring physics, and sunlit PBR Three.js models that tell a product's story at 60–120fps.",
    accent: "orange",
    metrics: [
      { label: "Desktop Frame Rate", value: "60–120fps" },
      { label: "3D Adaptive Tiers", value: "3 Auto-Tiers" },
      { label: "Motion Safety", value: "A11y Native" },
    ],
    capabilities: [
      "Three.js / React Three Fiber & Custom GLSL",
      "Sunlit PBR Porcelain, Titanium & Glass Shaders",
      "GSAP Pinned Horizontal & Sticky Multi-Slide",
      "Adaptive GPU Scaling & Procedural Web Audio",
    ],
    codeProof: `// Dual-Engine Living Actor Loop
useFrame((state, delta) => {
  const target = cinemaClock.progress * Math.PI * 2;
  prism.rotation.y = damp(prism.rotation.y, target, 4, delta);
  prism.position.y = Math.sin(state.clock.elapsedTime) * 0.08;
});`,
    layerIndex: 3,
  },
];

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  impactTag: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "Sura is the rarest profile in software: a Staff-level distributed systems engineer who also holds the visual sensibility of a luxury creative director. He cut our p99 query latency by 64% and delivered a WebGL interface that closed three Fortune 500 deals.",
    author: "Elena Rostova",
    role: "VP of Engineering",
    company: "Aether Systems",
    impactTag: "-64% p99 Latency · +38% Conversion",
  },
  {
    quote:
      "Moving billions across borders demands absolute calm and zero ambiguity. Sura transformed our multi-sig approval flow into something Swiss watchmakers would admire — our executive NPS jumped 33 points in a single quarter.",
    author: "Marcus Lindholm",
    role: "Co-Founder & CTO",
    company: "Solstice Treasury Zurich",
    impactTag: "$2.4B Settled · 84 Executive NPS",
  },
  {
    quote:
      "Other studios handed us 30MB WebGL scenes that froze iPhones. Sura engineered a sunlit 3D commerce flagship that runs at 60fps on mid-range mobile devices and lifted our conversion rate by 41%.",
    author: "Camille Laurent",
    role: "Chief Digital Officer",
    company: "Maison Velour Paris",
    impactTag: "+41% Sales Lift · 1.18s LCP",
  },
];

export interface CareerEra {
  period: string;
  role: string;
  organization: string;
  location: string;
  headline: string;
  highlights: string[];
  accent: "teal" | "orange";
}

export const careerEras: CareerEra[] = [
  {
    period: "2024 — PRESENT",
    role: "Principal Software Engineer & Creative Web Architect",
    organization: "Sura Atelier · Independent & Advisory",
    location: "Addis Ababa · Global",
    headline: "Leading flagship SaaS architecture, luxury 3D web flagships, and design-engineering transformations.",
    highlights: [
      "Architected Aether Cloud OS real-time 40k-node WebGL observability viewport.",
      "Built Solstice Private Vault multi-sig institutional settlement experience ($2.4B settled).",
      "Advised Series B–D engineering teams on React 19, performance budgets, and design systems.",
    ],
    accent: "orange",
  },
  {
    period: "2022 — 2024",
    role: "Staff Frontend & Motion Architecture Lead",
    organization: "Kinetix Labs",
    location: "San Francisco (Remote)",
    headline: "Scaled a multiplayer browser-native kinetic design engine to 180,000+ monthly creators.",
    highlights: [
      "Engineered Yjs CRDT real-time canvas sync maintaining 24ms median collaboration latency.",
      "Designed the analytical RK4 spring-physics timeline solver and clean React/GSAP code exporter.",
      "Mentored 10 engineers across rendering performance, accessibility, and strict TypeScript architecture.",
    ],
    accent: "teal",
  },
  {
    period: "2020 — 2022",
    role: "Senior Full-Stack Systems Engineer",
    organization: "Meridian Cloud Commerce",
    location: "London (Remote)",
    headline: "Built high-throughput checkout pipelines and multi-brand tokenized web storefronts.",
    highlights: [
      "Re-engineered edge API gateway cutting checkout p95 latency from 420ms to 78ms.",
      "Created a unified 65-component accessible design system shared across 12 international storefronts.",
      "Championed Core Web Vitals release gates achieving 99+ Lighthouse performance across production.",
    ],
    accent: "teal",
  },
  {
    period: "2018 — 2020",
    role: "Software Engineer — Web & Interactive Systems",
    organization: "Nordic Digital Craft",
    location: "Remote",
    headline: "Forged deep foundations across full-stack TypeScript, interactive graphics, and editorial web.",
    highlights: [
      "Shipped 18+ production web platforms blending bespoke typography, smooth motion, and clean APIs.",
      "Built custom WebGL product visualizers and automated visual regression pipelines.",
    ],
    accent: "orange",
  },
];

export const engineeringPrinciples = [
  {
    code: "P·01",
    title: "Absorb Complexity in the System",
    law: "Tesler's Law",
    detail:
      "Inherent complexity never vanishes — great engineers absorb it inside resilient backends, adaptive GPU pipelines, and smart defaults so the human interface feels effortlessly calm.",
  },
  {
    code: "P·02",
    title: "Respond Inside 100 Milliseconds",
    law: "Doherty Threshold",
    detail:
      "Speed is a luxury material. Optimistic UI, GPU-composited transforms, and edge caching keep humans in uninterrupted creative flow.",
  },
  {
    code: "P·03",
    title: "Direct Every Pixel With Restraint",
    law: "Von Restorff & Prägnanz",
    detail:
      "75% sunlit negative space makes the 3% Neon Orange focal moment unforgettable. If everything screams for attention, nothing feels luxurious.",
  },
  {
    code: "P·04",
    title: "Choreograph Peak and Finale",
    law: "Peak-End Rule",
    detail:
      "Visitors remember the most breathtaking interactive moment and the calm, decisive final ritual. Every flow — from case study to contact confirmation — ends with craft.",
  },
];
