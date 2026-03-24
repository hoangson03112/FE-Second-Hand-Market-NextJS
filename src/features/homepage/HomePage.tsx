"use client";

import HeroSection from "./components/HeroSection";
import CuratedCollectionsSection from "./components/CuratedCollectionsSection";
import FeaturedListingsSection from "./components/FeaturedListingsSection";
import PhilosophySection from "./components/PhilosophySection";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { useScrollToTop } from "./hooks";
import { beVietnamPro } from "@/lib/fonts";

export default function HomePage() {
  const { showScrollTop, scrollToTop } = useScrollToTop();
  return (
    <div className={`min-h-screen bg-taupe-900 ${beVietnamPro.className}`}>
      <HeroSection />
      <CuratedCollectionsSection />
      <FeaturedListingsSection />
      <PhilosophySection />
      <ScrollToTopButton show={showScrollTop} onClick={scrollToTop} />
    </div>
  );
}
