import { useState, useEffect, useCallback } from "react";

interface UseScrollToTopOptions {
  threshold?: number;
}

export function useScrollToTop({ threshold = 300 }: UseScrollToTopOptions = {}) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return { showScrollTop, scrollToTop };
}
