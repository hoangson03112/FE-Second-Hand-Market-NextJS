import { useCallback, useEffect, useMemo, useState } from "react";
import useCategories from "@/hooks/useCategories";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useUserStore } from "@/store/useUserStore";

export function useHeader() {
  // Fetch categories (chỉ fetch một lần, sau đó dùng từ store)
  useCategories();

  // Lấy data từ Zustand store thay vì từ hook trực tiếp
  const { categories, isLoading, visibleCategories: storeVisibleCategories } =
    useCategoryStore();

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Sử dụng visibleCategories từ store hoặc tính toán từ categories
  const visibleCategories = useMemo(
    () => storeVisibleCategories || categories?.slice(0, 8),
    [storeVisibleCategories, categories]
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
  const accessToken = useUserStore((state) => state.accessToken);

  useEffect(() => {
    // Check authentication status từ store
    setIsAuthenticated(!!accessToken);
  }, [accessToken]);

  useEffect(() => {
    const onDocClick = () => {
      // placeholder for outside click behaviour; view may pass refs if needed
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
