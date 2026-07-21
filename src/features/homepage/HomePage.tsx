"use client";

import HeroSection from "./components/HeroSection";
import CuratedCollectionsSection from "./components/CuratedCollectionsSection";
import FeaturedListingsSection from "./components/FeaturedListingsSection";
import PhilosophySection from "./components/PhilosophySection";
import { plusJakarta, notoSerif } from "@/lib/fonts";

export default function HomePage() {
  return (
    <div
      className={`bg-background h-full ${plusJakarta.variable} ${notoSerif.variable}`}
    >
      <HeroSection />
      <CuratedCollectionsSection />
      <FeaturedListingsSection />
      <PhilosophySection />
    </div>
  );
}
