"use client";

import React, { useState, useEffect } from "react";
import HeroSection from "@/components/feature/homepage/HeroSection";
import CategoriesSection from "@/components/feature/homepage/CategoriesSection";
import HowItWorksSection from "@/components/feature/homepage/HowItWorksSection";
import FeaturesSection from "@/components/feature/homepage/FeaturesSection";

import ScrollToTopButton from "@/components/feature/homepage/ScrollToTopButton";
import { categories, stats, features, steps } from "@/components/feature/homepage/constants";
import Footer from "@/components/layout/Footer/Footer";

export default function HomePage() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      <HeroSection stats={stats} />
      <CategoriesSection categories={categories} />
      <HowItWorksSection steps={steps} />
      <FeaturesSection features={features} />
      <Footer />
      <ScrollToTopButton show={showScrollTop} onClick={scrollToTop} />
    </div>
  );
}
