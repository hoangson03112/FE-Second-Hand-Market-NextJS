import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import HeroSection from './HeroSection';
import { categories, stats, steps } from './constants';
import CategoriesSection from './CategoriesSection';
import HowItWorksSection from './HowItWorksSection';
import FeaturesSection from './FeaturesSection';
import { features } from './constants';
import ScrollToTopButton from './ScrollToTopButton';

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
    <ScrollToTopButton show={showScrollTop} onClick={scrollToTop} />
  </div>
  )
}
