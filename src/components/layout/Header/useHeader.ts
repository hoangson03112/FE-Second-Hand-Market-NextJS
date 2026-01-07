import { useCallback, useEffect, useMemo, useState } from "react";
import useCategories from "@/hooks/useCategories";
import { useTokenStore } from "@/store/useTokenStore";

export function useHeader() {
  // Fetch categories using TanStack Query (server state)
  const { data: categories, isLoading } = useCategories();

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Tính toán visibleCategories từ data
  const visibleCategories = useMemo(
    () => categories?.slice(0, 8),
    [categories]
  );

  const handleMouseEnterCategory = useCallback((id: string) => {
    setActiveCategory(id);
  }, []);

  const handleMouseLeaveCategory = useCallback(() => {
    setActiveCategory(null);
  }, []);

  const handleShowAllCategories = useCallback(() => {
    setShowAllCategories(true);
  }, []);

  const handleHideAllCategories = useCallback(() => {
    setShowAllCategories(false);
  }, []);

  // Lấy accessToken từ store
  const accessToken = useTokenStore((state) => state.accessToken);

  useEffect(() => {
    // Check authentication status từ store
    setIsAuthenticated(!!accessToken);
  }, [accessToken]);

  useEffect(() => {
    const onDocClick = () => {
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return {
    categories,
    isLoading,
    visibleCategories,
    activeCategory,
    showAllCategories,
    isAuthenticated,
    handleMouseEnterCategory,
    handleMouseLeaveCategory,
    handleShowAllCategories,
    handleHideAllCategories,
  };
}

export default useHeader;
