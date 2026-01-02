"use client";
import React from "react";
import { useRouter } from "next/navigation";
import useHeader from "./useHeader";
import HeaderView from "./Header.view";

export default function HeaderContainer() {
  const router = useRouter();
  const {
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
  } = useHeader();

  const onSearch = (q?: string) => {
    if (q && q.length) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <HeaderView
      visibleCategories={visibleCategories || []}
      categories={categories || []}
      isLoading={isLoading}
      activeCategory={activeCategory}
      showAllCategories={showAllCategories}
      isAuthenticated={isAuthenticated}
      onMouseEnterCategory={handleMouseEnterCategory}
      onMouseLeaveCategory={handleMouseLeaveCategory}
      onShowAll={handleShowAllCategories}
      onHideAll={handleHideAllCategories}
      onSearch={onSearch}
    />
  );
}
