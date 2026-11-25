export type ArtifactVariant = "prism" | "vault" | "monolith" | "lattice";
export type ProjectCategory = "SaaS Systems" | "3D & WebGL" | "Full-Stack Architecture";

export interface CaseStudyDecision {
  topic: string;
  chosen: string;
  rejected: string;
  rationale: string;
}

export interface ProjectMetric {
  label: string;
  value: string;
  delta: string;
}

export interface Project {
  slug: string;
  filmNumber: string;
  title: string;
  client: string;
  year: string;
  role: string;
  duration: string;
  team: string;
  category: ProjectCategory;
  accent: "teal" | "orange";
  artifact: ArtifactVariant;
  oneLiner: string;
  headlineMetric: string;
  summary: string;
  stack: string[];
  metrics: ProjectMetric[];
  chapters: {
    stakes: {
      heading: string;
      context: string;
      constraints: string[];
    };
    architecture: {
      heading: string;
      overview: string;
      pipelineNodes: { name: string; spec: string; latency: string }[];
      decisions: CaseStudyDecision[];
    };
    craft: {
      heading: string;
      story: string;
      highlights: { title: string; detail: string }[];
    };
    impact: {
      heading: string;
      narrative: string;
      postmortem: string[];
    };
  };
}

export const projects: Project[] = [
  {
    slug: "aether-edge",
    filmNumber: "01",
    title: "Aether Cloud OS",
    client: "Aether Systems · Series C",
    year: "2026",
    role: "Lead Staff Frontend & Systems Architect",
    duration: "9 Months",
    team: "8 Engineers · 2 Designers",
    category: "SaaS Systems",
    accent: "teal",
    artifact: "prism",
    oneLiner:
      "Real-time global edge observability SaaS turning 14M requests/min into tactile, sub-40ms visual clarity.",
    headlineMetric: "-64% p99 Latency · 14M+ Req/Min",
    summary:
      "Re-architected a high-throughput cloud telemetry platform from the ground up — unifying edge stream ingestion, WebWorker ring buffers, and a sunlit luxury WebGL topology viewport capable of rendering 40,000 live nodes at 120fps.",
    stack: ["Next.js 15", "TypeScript", "Rust / WebAssembly", "Three.js / R3F", "ClickHouse", "gRPC-Web"],
    metrics: [
      { label: "Global p99 Query Latency", value: "36ms", delta: "-64% vs legacy" },
      { label: "Live Telemetry Canvas FPS", value: "118 fps", delta: "40k active nodes" },
      { label: "Enterprise Trial-to-Paid", value: "+38%", delta: "Post-redesign Q3" },
      { label: "Mean Time to Diagnose", value: "2.1 min", delta: "Down from 11.4 min" },
    ],
    chapters: {
      stakes: {
        heading: "When Milliseconds Cost Millions — And Dashboards Blind Operators",
        context:
          "Aether's legacy observability console froze browsers whenever SRE teams inspected multi-region traffic anomalies above 500k events/sec. Enterprise prospects admired the backend speed yet abandoned trials because the interface felt sluggish, dense, and impossible to scan during real incidents.",
        constraints: [
          "Zero dropped frames while streaming 120+ WebSocket metric deltas per second.",
          "Must remain razor-clear in bright operations centers (light-mode first) and 4K wallboard TVs.",
          "Strict < 200KB initial JS budget for instant incident deep-link triage.",
        ],
      },
      architecture: {
        heading: "Decoupling Ingestion From Rendering With Mutable Ring Buffers",
        overview:
          "Instead of pushing high-frequency telemetry through React state (which triggered 60 full component reconciliations per second), we moved binary protobuf decoding into a dedicated WebWorker + SharedArrayBuffer ring. React renders only structural chrome while Three.js instanced meshes read live GPU buffers directly.",
        pipelineNodes: [
          { name: "Global Edge Collectors", spec: "38 PoPs · eBPF + Rust", latency: "6ms" },
          { name: "ClickHouse Rollup Tier", spec: "Sub-second Materialized Views", latency: "14ms" },
          { name: "WASM Binary Streamer", spec: "Zero-Copy Ring Buffer Worker", latency: "4ms" },
          { name: "Instanced R3F Stage", spec: "1 Draw Call · 40k Nodes", latency: "8ms" },
        ],
        decisions: [
          {
            topic: "Telemetry Transport",
            chosen: "Binary Protobuf over Multiplexed WebSockets",
            rejected: "JSON Polling / SSE",
            rationale: "Cut payload size by 78% and eliminated main-thread JSON.parse GC pauses.",
          },
          {
            topic: "Topology Renderer",
            chosen: "InstancedMesh + Custom GLSL Uniform Buffers",
            rejected: "DOM SVG / D3 Force Graph",
            rationale: "SVG collapsed at 1,500 nodes; instanced WebGL held 118fps at 40,000 nodes.",
          },
          {
            topic: "Visual Polarity",
            chosen: "Warm Porcelain Light Mode + Dual-Tier Neon Accents",
            rejected: "Low-Contrast Dark Cyberpunk Theme",
            rationale: "Passed WCAG 2.2 AAA in sunlit engineering rooms and projected clearly on 4K TVs.",
          },
        ],
      },
      craft: {
        heading: "Spatial Continuity Between Alert Lists and 3D Edge Topology",
        story:
          "Hovering any degraded region in the Swiss telemetry table magnetically glides the 3D Prism camera toward that geographic cluster, pulsing affected routes in Electric Neon Orange while healthy corridors flow smoothly in Electric Teal.",
        highlights: [
          {
            title: "4K Wallboard / 10-Foot Mode",
            detail: "Dedicated keyboard-driven presentation mode with 5% overscan safe zones for NOC TVs.",
          },
          {
            title: "Sub-100ms Command Palette",
            detail: "Engineers jump across clusters, traces, and flamegraphs with zero mouse travel.",
          },
          {
            title: "Progressive Disclosure",
            detail: "Executive KPI summary first; raw eBPF kernel traces unfold cleanly on click.",
          },
        ],
      },
      impact: {
        heading: "From Technical Bottleneck to Flagship Revenue Driver",
        narrative:
          "Within 90 days of launch, enterprise demo-to-close velocity jumped 38%, average incident diagnosis time dropped by 81%, and the product won both industry design accolades and Fortune 500 procurement clearance.",
        postmortem: [
          "Separating React UI state from continuous 60–120fps render loops was the highest-leverage architectural call.",
          "Honest progressive streaming (Labor Illusion) outperformed skeleton spinners in user trust studies.",
        ],
      },
    },
  },
  {
    slug: "solstice-vault",
    filmNumber: "02",
    title: "Solstice Private Vault",
    client: "Solstice Treasury · Zurich & London",
    year: "2026",
    role: "Principal Full-Stack & Design Engineer",
    duration: "7 Months",
    team: "6 Engineers · 1 Brand Director",
    category: "Full-Stack Architecture",
    accent: "orange",
    artifact: "vault",
    oneLiner:
      "Swiss-grade institutional treasury & multi-sig settlement experience combining horological tactile precision with zero-trust cryptography.",
    headlineMetric: "$2.4B Settled · 99.998% Uptime",
    summary:
      "Designed and engineered a flagship private-wealth treasury web platform where multi-billion-dollar wire approvals feel as calm, deliberate, and unmistakable as turning a Swiss mechanical chronograph.",
    stack: ["Next.js", "TypeScript", "Go", "PostgreSQL", "WebAuthn / Passkeys", "GSAP + R3F"],
    metrics: [
      { label: "Quarterly Volume Settled", value: "$2.4B", delta: "Zero signing errors" },
      { label: "Approval Flow Completion", value: "19 sec", delta: "-71% friction time" },
      { label: "Core Availability SLA", value: "99.998%", delta: "Multi-region active" },
      { label: "Executive NPS Score", value: "84", delta: "Up from 51" },
    ],
    chapters: {
      stakes: {
        heading: "High-Stakes Financial Decisions Deserve Calm Luxury, Not Spreadsheet Anxiety",
        context:
          "Treasury CFOs authorizing eight-figure transfers were using cluttered legacy tables where tiny misaligned buttons caused hesitation and verification fatigue. Solstice needed institutional cryptographic rigor paired with effortless luxury ergonomics.",
        constraints: [
          "Strict hardware-key WebAuthn verification with deterministic audit trails.",
          "Zero ambiguity on monetary figures, counterparty identity, and irreversible states.",
          "Must perform identically across iPhone executive travel checks and 27-inch Zurich trading desks.",
        ],
      },
      architecture: {
        heading: "Idempotent Ledger State Machines Backed by Optimistic Visual Precision",
        overview:
          "Built an event-sourced Go settlement kernel paired with a strongly typed state-machine UI. Every signing gesture requires deliberate tactile confirmation — a magnetic hold-to-authorize dial coupled with an interactive 3D horological vault ring that physically locks upon cryptographic signature.",
        pipelineNodes: [
          { name: "WebAuthn Passkey Enclave", spec: "FIDO2 Hardware Attestation", latency: "18ms" },
          { name: "Idempotent Go Ledger", spec: "Serializable Double-Entry", latency: "22ms" },
          { name: "Real-Time Risk Engine", spec: "Anomaly & Velocity Rules", latency: "11ms" },
          { name: "Tactile Porcelain UI", spec: "Tabular-Nums · Spring Physics", latency: "4ms" },
        ],
        decisions: [
          {
            topic: "Authorization Gesture",
            chosen: "Intentional Press-and-Lock + Hardware Passkey",
            rejected: "Single Click Modal Confirm",
            rationale: "Eliminated accidental triggers while making high-value sign-offs feel ceremonial.",
          },
          {
            topic: "Typography Discipline",
            chosen: "Tabular Monospace Numerals + Editorial Serif Anchors",
            rejected: "Proportional Sans for Ledgers",
            rationale: "Decimal alignment across multi-currency columns cut verification scan time by 42%.",
          },
          {
            topic: "Color Rationing",
            chosen: "Alabaster Ground + Neon Orange strictly for Irreversible Actions",
            rejected: "Multi-color Dashboard Charts",
            rationale: "Leveraged Von Restorff isolation so risk and primary sign-off states are unmistakable.",
          },
        ],
      },
      craft: {
        heading: "Horological Micro-Motion & Peak-End Signing Ritual",
        story:
          "Instead of a cold toast notification after moving $20M, completing a quorum smoothly aligns the concentric brushed-titanium vault rings and issues an archival-grade cryptographic receipt card with instant PDF export.",
        highlights: [
          {
            title: "Deterministic Focus & Audit Trail",
            detail: "Every interactive control supports full keyboard verification with zero hidden state.",
          },
          {
            title: "Zero-CLS Tabular Ledgers",
            detail: "Streaming FX rates update in place without shifting a single pixel of layout.",
          },
          {
            title: "Bespoke 3D Vault Sculpture",
            detail: "Concentric matte porcelain & titanium rings mirror real multi-sig quorum progress.",
          },
        ],
      },
      impact: {
        heading: "Trust Quantified at Institutional Scale",
        narrative:
          "Solstice onboarded 14 new European family offices within two quarters of launch, citing the platform's clarity, speed, and unmistakable luxury confidence during security diligence.",
        postmortem: [
          "Applying the Peak-End Rule to cryptographic confirmation receipts lifted executive NPS by +33 points.",
          "Strict color rationing turned Neon Orange into an instant subconscious cue for decisive authority.",
        ],
      },
    },
  },
  {
    slug: "velour-spatial",
    filmNumber: "03",
    title: "Velour Spatial Atelier",
    client: "Maison Velour · Paris & Milan",
    year: "2025",
    role: "Lead Creative WebGL & Commerce Architect",
    duration: "5 Months",
    team: "4 Engineers · 2 3D Artists",
    category: "3D & WebGL",
    accent: "teal",
    artifact: "monolith",
    oneLiner:
      "Sunlit luxury spatial commerce flagship fusing editorial magazine storytelling, horizontal film reels, and 60fps mobile PBR glass rendering.",
    headlineMetric: "+41% Conversion · 60fps Mobile",
    summary:
      "Transformed a Parisian luxury design house's online flagship into an interactive sunlit gallery where visitors glide through tactile horizontal lookbooks and inspect physically based glass-and-ceramic objects in real time.",
    stack: ["Next.js", "React Three Fiber", "GSAP ScrollTrigger", "Lenis", "Shopify Storefront", "Tailwind v4"],
    metrics: [
      { label: "Checkout Conversion Lift", value: "+41%", delta: "Across mobile & desktop" },
      { label: "Avg. Session Immersion", value: "4m 52s", delta: "2.8× industry median" },
      { label: "Mid-Range Mobile FPS", value: "60 fps", delta: "3-Tier Adaptive GPU" },
      { label: "LCP First Paint", value: "1.18s", delta: "Edge-cached RSC" },
    ],
    chapters: {
      stakes: {
        heading: "Luxury Heritage Often Dies in Heavy, Laggy WebGL Stores",
        context:
          "Previous agency prototypes loaded 35MB unoptimized 3D files that stalled iPhones for 9 seconds and broke Safari scrolling. Maison Velour wanted Cartier-grade digital theater without sacrificing sub-1.5s commerce velocity.",
        constraints: [
          "Initial above-the-fold experience must be interactive under 1.5 seconds on 4G.",
          "Must gracefully adapt from 4K showroom screens down to 375px portrait smartphones.",
          "Editorial storytelling and instant Add-to-Bag utility must coexist seamlessly.",
        ],
      },
      architecture: {
        heading: "3-Tier GPU Adaptation + Hybrid RSC / Persistent Canvas Architecture",
        overview:
          "We kept all product metadata, storytelling copy, and checkout flows inside Server Components for instant LCP & SEO, while mounting one lightweight adaptive R3F canvas that streams compressed Draco geometries and procedural studio Lightformers based on real-time GPU benchmarking.",
        pipelineNodes: [
          { name: "Edge RSC HTML Shell", spec: "Instant Editorial Paint", latency: "140ms" },
          { name: "GPU Tier Classifier", spec: "Auto-DPR & Shader Scaling", latency: "8ms" },
          { name: "GSAP Horizontal Reel", spec: "matchMedia Touch/Desktop", latency: "0ms" },
          { name: "Optimistic Cart API", spec: "Sub-100ms Doherty UI", latency: "65ms" },
        ],
        decisions: [
          {
            topic: "Mobile Horizontal Navigation",
            chosen: "Native CSS Scroll-Snap Swipe Rail (< 1024px)",
            rejected: "GSAP Pinning on iOS Safari",
            rationale: "Eliminated iOS URL-bar height jump bugs and felt native under the thumb.",
          },
          {
            topic: "Light-Mode Lighting",
            chosen: "Procedural Studio Lightformers + Short-Range Bounce Lights",
            rejected: "12MB EXR HDRI + Heavy Post-Bloom",
            rationale: "Saved 11.8MB download while making ceramic and dichroic glass look studio-lit.",
          },
          {
            topic: "Scroll Momentum",
            chosen: "Lenis Locked to GSAP Single Ticker",
            rejected: "Separate RAF Loops",
            rationale: "Eliminated 1-frame pin jitter across 120Hz ProMotion displays.",
          },
        ],
      },
      craft: {
        heading: "Tactile Lookbooks That Breathe With the Visitor",
        story:
          "Each collection opens with a warm porcelain curtain reveal, glides horizontally across sculptural silhouettes with peeking edge continuity, and allows tactile 360-degree glass inspection without trapping vertical navigation.",
        highlights: [
          {
            title: "Showroom 4K TV Mirroring",
            detail: "Boutique staff flip into 10-foot presentation mode for private client appointments.",
          },
          {
            title: "Zero-Flash Route Continuity",
            detail: "Transitioning from Lookbook to Product Detail glides the same 3D model smoothly.",
          },
          {
            title: "WCAG 2.2 AA Editorial Clarity",
            detail: "Warm alabaster paper tones with deep obsidian serif typography maintain >15:1 contrast.",
          },
        ],
      },
      impact: {
        heading: "Award-Winning Theater That Directly Multiplied Sales",
        narrative:
          "Velour Spatial Atelier lifted overall conversion by 41% while cutting mobile bounce rate in half — proving that disciplined cinematic engineering outperforms generic e-commerce templates.",
        postmortem: [
          "Respecting mobile ergonomics via gsap.matchMedia() was the single biggest conversion multiplier.",
          "Subtle archival paper grain and hairline Swiss grids elevated brand perception more than heavy FX.",
        ],
      },
    },
  },
  {
    slug: "kinetix-studio",
    filmNumber: "04",
    title: "Kinetix Design Engine",
    client: "Kinetix Labs · San Francisco",
    year: "2025",
    role: "Staff Frontend Architecture & Motion Lead",
    duration: "8 Months",
    team: "10 Engineers · 3 Product Designers",
    category: "3D & WebGL",
    accent: "orange",
    artifact: "lattice",
    oneLiner:
      "Multiplayer browser-native kinetic design & motion engineering studio powering 180k creators with CRDT sync and spring physics.",
    headlineMetric: "120fps Canvas · 180k Makers",
    summary:
      "Architected the multiplayer viewport, spring-physics timeline inspector, and custom shader compositor for a next-generation browser design tool built for design engineers.",
    stack: ["React 19", "TypeScript", "Yjs CRDT", "WebGL2 / GLSL", "Framer Motion", "Tailwind CSS"],
    metrics: [
      { label: "Active Monthly Creators", value: "180k+", delta: "3.4× YoY growth" },
      { label: "Multiplayer Sync Latency", value: "24ms", delta: "Conflict-free CRDT" },
      { label: "Viewport Frame Budget", value: "8.3ms", delta: "Locked 120Hz ProMotion" },
      { label: "Export Bundle Reduction", value: "-58%", delta: "Zero-runtime CSS/SVG" },
    ],
    chapters: {
      stakes: {
        heading: "Designers and Engineers Needed One Shared Physical Motion Language",
        context:
          "Teams wasted weeks translating keyframe curves between static design tools and React/GSAP codebases. Kinetix set out to unify real spring physics, live WebGL shaders, and clean production code export inside one multiplayer browser canvas.",
        constraints: [
          "Support 50+ simultaneous cursors editing spring timelines with zero merge conflicts.",
          "Maintain sub-8.3ms frame times on 120Hz laptops during live shader previews.",
          "Keep inspector UI calm and uncluttered despite hundreds of expert parameters.",
        ],
      },
      architecture: {
        heading: "CRDT Document Graph + Progressive Inspector Disclosure",
        overview:
          "Built a flat normalized CRDT scene graph with structural sharing and fine-grained subscriptions. Complex shader uniforms and spring physics curves remain tucked behind Progressive Disclosure drawers so newcomers feel instant flow while power users have total precision.",
        pipelineNodes: [
          { name: "Yjs CRDT Sync Mesh", spec: "Sub-25ms Presence & Ops", latency: "16ms" },
          { name: "Spring Physics Solver", spec: "RK4 Analytical Integrator", latency: "1ms" },
          { name: "GLSL Shader Compiler", spec: "Live Hot-Reload Uniforms", latency: "3ms" },
          { name: "Clean Code Emitter", spec: "React + GSAP + CSS Export", latency: "4ms" },
        ],
        decisions: [
          {
            topic: "State Synchronization",
            chosen: "Yjs CRDT + Binary Delta Awareness",
            rejected: "Centralized Operational Transform",
            rationale: "Enabled offline-first editing and instant local optimistic updates (< 10ms).",
          },
          {
            topic: "Inspector Complexity",
            chosen: "Tesler's Law Smart Presets + Expandable Math Curves",
            rejected: "Exposed 40-Slider Sidebars",
            rationale: "Absorbed complexity in the system while preserving full control for experts.",
          },
          {
            topic: "Motion Engine",
            chosen: "Analytical Spring Solver (Stiffness / Damping / Mass)",
            rejected: "Fixed Duration Bezier Only",
            rationale: "Interruptible velocity-preserving gestures made every prototype feel alive.",
          },
        ],
      },
      craft: {
        heading: "Tactile Direct Manipulation That Feels Physical",
        story:
          "Dragging a keyframe spring handle gives immediate visual recoil, velocity arcs, and live code previews — turning abstract easing math into an intuitive, joyful instrument.",
        highlights: [
          {
            title: "Live Spring-to-Code Bridge",
            detail: "Every visual curve compiles instantaneously into Framer Motion, GSAP, or CSS linear().",
          },
          {
            title: "Fluid Container-Query Panels",
            detail: "Dockable toolbars adapt cleanly using native CSS @container queries.",
          },
          {
            title: "Harmonic 3D Lattice Preview",
            detail: "Real-time wave propagation demonstrates stagger and follow-through principles.",
          },
        ],
      },
      impact: {
        heading: "Adopted by Elite Product Teams Worldwide",
        narrative:
          "Kinetix scaled past 180,000 makers and became the go-to motion specification bridge for high-craft SaaS design engineering teams.",
        postmortem: [
          "Applying Tesler's Law and Progressive Disclosure cut onboarding drop-off by 47%.",
          "Direct manipulation with <100ms feedback consistently drove users into deep Flow states.",
        ],
      },
    },
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
