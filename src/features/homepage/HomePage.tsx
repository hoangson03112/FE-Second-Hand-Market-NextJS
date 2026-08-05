"use client";

import CuratedCollectionsSection from "./components/CuratedCollectionsSection";
import FeaturedListingsSection from "./components/FeaturedListingsSection";
import HeroSection from "./components/HeroSection";
import PhilosophySection from "./components/PhilosophySection";
import MarqueeStrip from "./components/MarqueeStrip";
import LuxuryCtaSection from "./components/LuxuryCtaSection";
import { plusJakarta } from "@/lib/fonts";

export default function HomePage() {
  return (
    <div
      className={`min-h-full bg-luxury-ivory ${plusJakarta.variable}`}
      style={{ fontFamily: "var(--font-jakarta), sans-serif" }}
    >
      <HeroSection />
      <MarqueeStrip />
      <CuratedCollectionsSection />
      <FeaturedListingsSection />
      <PhilosophySection />
      <LuxuryCtaSection />
    </div>
  );
}
