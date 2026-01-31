import HeroSection from './HeroSection';
import CategoriesSection from './CategoriesSection';
import HowItWorksSection from './HowItWorksSection';
import FeaturesSection from './FeaturesSection';
import ScrollToTopButton from './ScrollToTopButton';
import { categories, stats, steps, features } from './constants';
import { useScrollToTop } from '@/hooks/useScrollToTop';

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
  )
}
