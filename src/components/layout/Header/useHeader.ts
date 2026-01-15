import { useCallback, useEffect, useMemo, useState } from "react";
import useCategories from "@/hooks/useCategories";
import { useUser } from "@/hooks/useUser";

export function useHeader() {
  const { data: categories, isLoading } = useCategories();
  const { data: account } = useUser();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const visibleCategories = useMemo(
    () => categories?.slice(0, 7),
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

  return {
    account,
    categories,
    isLoading,
    visibleCategories,
    activeCategory,
    showAllCategories,
    handleMouseEnterCategory,
    handleMouseLeaveCategory,
    handleShowAllCategories,
    handleHideAllCategories,
  };
}

export default useHeader;
