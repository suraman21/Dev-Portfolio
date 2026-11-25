import { HeroSection } from "@/components/sections/HeroSection";
import { StickySlideDeck } from "@/components/cinema/StickySlideDeck";
import { HorizontalReelStage } from "@/components/cinema/HorizontalReelStage";
import { LivingAtelierSection } from "@/components/sections/LivingAtelierSection";
import { ConciergeSection } from "@/components/sections/ConciergeSection";

export default function HomePage() {
  return (
    <>
      {/* Act I — The Thesis (Opening Establishing Shot + Interactive 3D Prism) */}
      <HeroSection />

      {/* Act II — The Dual Craft (Sticky Pinned Full-Screen Multi-Slide Stage) */}
      <StickySlideDeck />

      {/* Act III — Feature Films (Vertical-to-Horizontal Pinned Scroll Reel) */}
      <HorizontalReelStage />

      {/* Act IV — The Living Atelier (Interactive 3D Systems & Latency Workbench) */}
      <LivingAtelierSection />

      {/* Act V — Leadership Endorsements & Quiet Horizon Concierge Finale */}
      <ConciergeSection />
    </>
  );
}
