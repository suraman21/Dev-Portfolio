import { HeroSection } from "@/components/sections/HeroSection";
import { HowIBuildDeck } from "@/components/cinema/HowIBuildDeck";
import { SelectedWorkReel } from "@/components/cinema/SelectedWorkReel";
import { TestimonialsAndContactSection } from "@/components/sections/TestimonialsAndContactSection";

export default function HomePage() {
  return (
    <>
      {/* 1. Opening Hero + Signature Interactive 3D Product Stack */}
      <HeroSection />

      {/* 2. Sticky Full-Screen Multi-Slide Story ("How I Build") */}
      <HowIBuildDeck />

      {/* 3. Vertical-to-Horizontal Scroll Showcase ("Selected Work") */}
      <SelectedWorkReel />

      {/* 4. Client Testimonials & Direct Contact CTA */}
      <TestimonialsAndContactSection />
    </>
  );
}
