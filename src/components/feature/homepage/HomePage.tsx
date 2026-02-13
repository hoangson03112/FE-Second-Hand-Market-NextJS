"use client";

import HeroSection from "./components/HeroSection";
import CategoriesSection from "./components/CategoriesSection";
import HowItWorksSection from "./components/HowItWorksSection";
import FeaturesSection from "./components/FeaturesSection";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { categories, stats, steps, features } from "@/constants";
import { useScrollToTop } from "./hooks";

export default function HomePage() {
  const { showScrollTop, scrollToTop } = useScrollToTop();
  return (
    <div className="min-h-screen bg-white">
      <HeroSection stats={stats} />
      <CategoriesSection categories={categories} />
      <HowItWorksSection steps={steps} />
      <FeaturesSection features={features} />
      <ScrollToTopButton show={showScrollTop} onClick={scrollToTop} />
    </div>
  );
}
