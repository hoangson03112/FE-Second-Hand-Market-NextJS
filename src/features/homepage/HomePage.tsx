"use client";

import HeroSection from "./components/HeroSection";
import CuratedCollectionsSection from "./components/CuratedCollectionsSection";
import FeaturedListingsSection from "./components/FeaturedListingsSection";
import PhilosophySection from "./components/PhilosophySection";
import { beVietnamPro } from "@/lib/fonts";

export default function HomePage() {
  return (
    <div className={`min-h-screen bg-taupe-900 ${beVietnamPro.className}`}>
      <HeroSection />
      <CuratedCollectionsSection />
      <FeaturedListingsSection />
      <PhilosophySection />
    </div>
  );
}
