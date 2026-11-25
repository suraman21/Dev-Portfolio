export type ProjectPreviewType = "analytics" | "finance" | "commerce" | "workspace";
export type ProjectCategory = "SaaS Products" | "Web Platforms" | "Design Systems";

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
  accent: "teal" | "orange";
  previewType: ProjectPreviewType;
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
}

export const projects: Project[] = [
  {
    slug: "aether-cloud",
    number: "01",
    title: "Aether Cloud",
    client: "Aether Systems",
    year: "2026",
    role: "Lead Frontend & Systems Engineer",
    timeline: "9 Months",
    category: "SaaS Products",
    accent: "teal",
    previewType: "analytics",
    tagline:
      "A real-time cloud monitoring SaaS rebuilt for speed, clarity, and effortless incident resolution.",
    keyResult: "64% faster load times · +38% paid conversions",
    overview:
      "Aether's original dashboard slowed down under heavy live traffic and overwhelmed teams during outages. I led the full frontend and streaming architecture redesign — making millions of live metrics feel instant, calm, and effortless to navigate.",
    stack: ["Next.js", "TypeScript", "React", "Tailwind CSS", "ClickHouse", "WebSockets"],
    metrics: [
      { label: "Query Response Time", value: "36ms", note: "64% faster than before" },
      { label: "Trial to Paid Lift", value: "+38%", note: "Measured in Q3 after launch" },
      { label: "Issue Resolution", value: "2.1 min", note: "Down from 11.4 minutes" },
      { label: "Smooth Rendering", value: "60fps", note: "Even with live data streams" },
    ],
    challenge: {
      heading: "Fast backend, frustrating user experience",
      description:
        "Aether had world-class cloud infrastructure, but their web app froze browsers whenever engineering teams opened high-traffic views. Prospective customers loved the technology yet dropped off during trials because the UI felt cluttered and slow.",
      points: [
        "Pages lagged whenever live alerts streamed in during high-traffic events.",
        "Critical health indicators were buried inside dense, low-contrast tables.",
        "The interface broke on smaller laptop screens and conference-room displays.",
      ],
    },
    solution: {
      heading: "Calm visual hierarchy backed by a fast streaming architecture",
      description:
        "I redesigned the workspace in a bright, high-contrast light mode and moved heavy live data parsing off the main UI thread so scrolling, filtering, and clicking always respond instantaneously.",
      decisions: [
        {
          title: "Background data streaming",
          detail:
            "Moved live data updates into a background worker so charts update smoothly without ever freezing buttons or scrolling.",
        },
        {
          title: "Progressive detail levels",
          detail:
            "Show clear executive health metrics first, then let engineers expand deep server logs only when they click in.",
        },
        {
          title: "Clear color meaning",
          detail:
            "Used calm teal for healthy systems and reserved bright orange exclusively for warnings and priority actions.",
        },
      ],
    },
    outcome: {
      heading: "Turned the dashboard into Aether's strongest sales asset",
      description:
        "Within 90 days of launching the new web platform, self-serve trial conversions jumped 38% and engineering teams cut average outage diagnosis time by over 80%.",
      takeaways: [
        "Speed and clarity directly drive SaaS revenue — users trust products that respond instantly.",
        "Hiding complex logs until needed made both executives and senior engineers happier.",
      ],
    },
  },
  {
    slug: "solstice-treasury",
    number: "02",
    title: "Solstice Treasury",
    client: "Solstice Financial · Zurich",
    year: "2026",
    role: "Principal Full-Stack Engineer",
    timeline: "7 Months",
    category: "SaaS Products",
    accent: "orange",
    previewType: "finance",
    tagline:
      "A calm, Swiss-grade business banking and treasury platform built for high-value multi-signature transfers.",
    keyResult: "$2.4B processed safely · 71% faster approvals",
    overview:
      "Finance leaders approving multi-million-dollar wires need absolute confidence, zero visual clutter, and ironclad security. I designed and engineered Solstice's web platform from API to interface so every approval feels effortless and unmistakable.",
    stack: ["Next.js", "TypeScript", "Go", "PostgreSQL", "Passkeys", "Framer Motion"],
    metrics: [
      { label: "Volume Processed", value: "$2.4B", note: "Zero erroneous approvals" },
      { label: "Approval Time", value: "19 sec", note: "71% faster workflow" },
      { label: "Platform Uptime", value: "99.99%", note: "Multi-region reliability" },
      { label: "Customer NPS", value: "84", note: "Up from 51 pre-redesign" },
    ],
    challenge: {
      heading: "High-stakes financial actions shouldn't feel like a messy spreadsheet",
      description:
        "CFOs and treasury directors were verifying large international transfers in cramped tables where tiny buttons and inconsistent numbers created stress and costly delays.",
      points: [
        "Approvals required jumping across 5 disconnected screens and email confirmations.",
        "Mobile approvals while traveling were nearly unusable.",
        "Users lacked clear confirmation receipts after authorizing major transactions.",
      ],
    },
    solution: {
      heading: "Intentional simplicity paired with bank-grade reliability",
      description:
        "We rebuilt the entire approval journey into a spacious, crystal-clear flow with hardware passkey sign-off, aligned financial typography, and instant exportable confirmations.",
      decisions: [
        {
          title: "One clear approval flow",
          detail:
            "Consolidated counterparty verification, FX rates, and multi-sig quorum status into a single scannable card.",
        },
        {
          title: "Unmistakable action hierarchy",
          detail:
            "Rationed electric orange exclusively for final authorization buttons so important actions stand out cleanly.",
        },
        {
          title: "Seamless desktop & mobile parity",
          detail:
            "Designed the exact same calm experience for quick iPhone checks and widescreen office monitors.",
        },
      ],
    },
    outcome: {
      heading: "Trusted by 14 new European treasury teams",
      description:
        "Customer satisfaction jumped 33 points in one quarter, approval turnaround dropped by 71%, and Solstice closed 14 new enterprise accounts citing product clarity during security reviews.",
      takeaways: [
        "Ending high-stakes workflows with a polished confirmation receipt dramatically increases user trust.",
        "Clean spacing and aligned numbers reduce human errors far better than extra warning pop-ups.",
      ],
    },
  },
  {
    slug: "velour-maison",
    number: "03",
    title: "Maison Velour",
    client: "Maison Velour · Paris",
    year: "2025",
    role: "Lead Web Developer & Creative Engineer",
    timeline: "5 Months",
    category: "Web Platforms",
    accent: "teal",
    previewType: "commerce",
    tagline:
      "A sunlit luxury flagship website blending editorial storytelling, smooth horizontal lookbooks, and instant mobile checkout.",
    keyResult: "+41% online sales · 1.1s mobile page load",
    overview:
      "Maison Velour wanted an online flagship that felt as refined as stepping into their Paris boutique — without the slow, laggy loading times common on luxury brand sites. I engineered a fast, tactile storefront with fluid motion and effortless shopping.",
    stack: ["Next.js", "TypeScript", "GSAP", "Tailwind CSS", "Shopify Storefront API"],
    metrics: [
      { label: "Conversion Lift", value: "+41%", note: "Across mobile & desktop" },
      { label: "First Page Load", value: "1.1s", note: "Fast on 4G mobile networks" },
      { label: "Time on Site", value: "4m 40s", note: "2.6× industry average" },
      { label: "Mobile Bounce Rate", value: "-48%", note: "Cut nearly in half" },
    ],
    challenge: {
      heading: "Luxury websites often look pretty on desktop and break on phones",
      description:
        "Their previous agency site loaded massive unoptimized media that took 8 seconds to open on iPhones and trapped users in janky scroll animations.",
      points: [
        "Over 68% of visitors shopped on mobile, yet the experience was only tested on large monitors.",
        "Slow transitions made adding items to the bag feel broken.",
        "Editorial stories and product buying pages felt completely disconnected.",
      ],
    },
    solution: {
      heading: "Editorial polish engineered with strict performance budgets",
      description:
        "I paired server-rendered Next.js pages for instant opening speed with smooth GSAP horizontal lookbooks on desktop and native touch swipe galleries on mobile.",
      decisions: [
        {
          title: "Device-native scrolling",
          detail:
            "Used smooth pinned horizontal galleries on laptops/desktops and natural thumb-swipe rails on phones.",
        },
        {
          title: "Instant tactile cart drawer",
          detail:
            "Built optimistic add-to-bag feedback responding in under 80ms so shopping feels immediate and luxurious.",
        },
        {
          title: "Warm gallery color palette",
          detail:
            "Framed photography on warm porcelain stone with crisp typography and subtle teal/orange accents.",
        },
      ],
    },
    outcome: {
      heading: "Luxury feel that measurably grew revenue",
      description:
        "Maison Velour saw a 41% conversion increase within 60 days while cutting mobile bounce rates in half — proving luxury storytelling and blazing speed belong together.",
      takeaways: [
        "Respecting native touch ergonomics on phones matters more than forcing desktop effects onto small screens.",
        "Subtle motion and generous white space feel far more luxurious than heavy special effects.",
      ],
    },
  },
  {
    slug: "kinetix-workspace",
    number: "04",
    title: "Kinetix Studio",
    client: "Kinetix Labs · San Francisco",
    year: "2025",
    role: "Staff Frontend & Design System Lead",
    timeline: "8 Months",
    category: "Design Systems",
    accent: "orange",
    previewType: "workspace",
    tagline:
      "A real-time collaborative design & component platform empowering 180,000+ makers to ship consistent products faster.",
    keyResult: "180k+ active users · 58% smaller code exports",
    overview:
      "Product teams struggled to keep Figma designs and production React code in sync. I architected Kinetix's multiplayer web workspace, unified component design system, and clean code export engine.",
    stack: ["React", "TypeScript", "Next.js", "Yjs Multiplayer", "Framer Motion", "CSS Grid"],
    metrics: [
      { label: "Active Creators", value: "180k+", note: "3.4× year-over-year growth" },
      { label: "Sync Latency", value: "24ms", note: "Real-time multiplayer edits" },
      { label: "Export Size Cut", value: "-58%", note: "Cleaner production code" },
      { label: "Onboarding Success", value: "+47%", note: "Simplified first-run flow" },
    ],
    challenge: {
      heading: "Powerful software shouldn't feel intimidating on day one",
      description:
        "Early versions of Kinetix exposed dozens of complex developer controls all at once, causing nearly half of new signups to quit before finishing their first project.",
      points: [
        "Crowded toolbars overwhelmed first-time users.",
        "Collaborators editing simultaneously experienced lag and merge conflicts.",
        "Exported components needed heavy cleanup before engineers could ship them.",
      ],
    },
    solution: {
      heading: "Smart defaults upfront, full power one click away",
      description:
        "We rebuilt the interface around progressive disclosure — giving everyone a clean, calm canvas with smart presets while letting senior teams expand advanced token and motion controls whenever needed.",
      decisions: [
        {
          title: "Conflict-free live collaboration",
          detail:
            "Implemented CRDT real-time sync so teams edit together smoothly with instant local updates.",
        },
        {
          title: "Modular responsive panels",
          detail:
            "Used modern CSS container queries so workspace inspectors adapt cleanly on any screen size.",
        },
        {
          title: "Production-ready exports",
          detail:
            "Engineered clean React + Tailwind code generation with accessible focus states built in.",
        },
      ],
    },
    outcome: {
      heading: "Adopted by product teams at scale",
      description:
        "Kinetix grew past 180,000 monthly active creators, improved new-user onboarding completion by 47%, and reduced design-to-engineering handoff time by days.",
      takeaways: [
        "Great software absorbs complexity behind the scenes instead of dumping sliders onto users.",
        "Fast, predictable interactions put creators into flow within minutes.",
      ],
    },
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
