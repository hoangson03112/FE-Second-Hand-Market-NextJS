"use client";
import React from "react";
import { useRouter } from "next/navigation";
import useHeader from "./useHeader";
import HeaderView from "./Header.view";

export default function HeaderContainer() {
  const router = useRouter();
  const {
    account,
    categories,
    isLoading,
    visibleCategories,
    activeCategory,
    showAllCategories,
    cartItemCount,
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
      account={account}
      visibleCategories={visibleCategories || []}
      categories={categories || []}
      isLoading={isLoading}
      activeCategory={activeCategory}
      showAllCategories={showAllCategories}
      cartItemCount={cartItemCount ?? 0}
      onMouseEnterCategory={handleMouseEnterCategory}
      onMouseLeaveCategory={handleMouseLeaveCategory}
      onShowAll={handleShowAllCategories}
      onHideAll={handleHideAllCategories}
      onSearch={onSearch}
    />
  );
}
