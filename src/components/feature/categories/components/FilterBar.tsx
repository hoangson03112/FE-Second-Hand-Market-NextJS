"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { IProductFilters } from "@/types/product";

interface FilterBarProps {
  filters: IProductFilters;
  onFilterChange: (filters: IProductFilters) => void;
  totalProducts?: number;
}

export default function FilterBar({ filters, onFilterChange, totalProducts }: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const handleSortChange = (sortBy: IProductFilters["sortBy"]) => {
    onFilterChange({ ...filters, sortBy });
  };

  const handlePriceRangeChange = (min?: number, max?: number) => {
    onFilterChange({ ...filters, minPrice: min, maxPrice: max });
  };

  const handleConditionChange = (condition: string) => {
    onFilterChange({
      ...filters,
      condition: condition === filters.condition ? undefined : condition,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      ...filters,
      minPrice: undefined,
      maxPrice: undefined,
      condition: undefined,
      sortBy: "newest",
      page: 1,
    });
  };

  const hasActiveFilters = filters.minPrice || filters.maxPrice || filters.condition || filters.sortBy;

  return (
    <div className="bg-cream-50 border-b-2 border-taupe-200 sticky top-28 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "h-10 px-4 border-2 border-taupe-300 text-taupe-700",
                "hover:border-primary hover:text-primary transition-colors",
                "flex items-center gap-2 text-sm font-medium",
                showFilters && "border-primary text-primary bg-taupe-50"
              )}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Bộ lọc
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="h-10 px-4 border border-taupe-200 bg-taupe-100 hover:bg-taupe-200 text-sm font-medium text-taupe-700 transition-colors"
              >
                Xóa bộ lọc
              </button>
            )}
            {totalProducts !== undefined && <span className="text-sm text-taupe-400">{totalProducts} sản phẩm</span>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-taupe-400">Sắp xếp:</span>
            <select
              value={filters.sortBy || "newest"}
              onChange={(e) => handleSortChange(e.target.value as IProductFilters["sortBy"])}
              className="h-10 px-4 border-2 border-taupe-300 focus:border-primary focus:outline-none text-sm text-taupe-700 bg-cream-50"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="price_low">Giá: Thấp → Cao</option>
              <option value="price_high">Giá: Cao → Thấp</option>
              <option value="popular">Phổ biến</option>
            </select>
          </div>
        </div>
        {showFilters && (
          <div className="border-t border-taupe-200 pt-4 space-y-4 animate-fade-in-down">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-[0.14em] text-taupe-500 mb-2">Khoảng giá</label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  placeholder="Từ"
                  value={filters.minPrice || ""}
                  onChange={(e) => handlePriceRangeChange(e.target.value ? Number(e.target.value) : undefined, filters.maxPrice)}
                  className="flex-1 h-10 px-4 border-2 border-taupe-200 focus:border-primary focus:outline-none text-sm text-taupe-700 bg-cream-50"
                />
                <span className="text-taupe-400">—</span>
                <input
                  type="number"
                  placeholder="Đến"
                  value={filters.maxPrice || ""}
                  onChange={(e) => handlePriceRangeChange(filters.minPrice, e.target.value ? Number(e.target.value) : undefined)}
                  className="flex-1 h-10 px-4 border-2 border-taupe-200 focus:border-primary focus:outline-none text-sm text-taupe-700 bg-cream-50"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-black uppercase tracking-[0.14em] text-taupe-500 mb-2">Tình trạng</label>
              <div className="flex flex-wrap gap-2">
                {["new", "like_new", "good", "fair", "poor"].map((condition) => (
                  <button
                    key={condition}
                    onClick={() => handleConditionChange(condition)}
                    className={cn(
                      "h-9 px-4 text-sm font-medium border-2 transition-colors",
                      filters.condition === condition
                        ? "border-primary bg-primary text-cream-50"
                        : "border-taupe-200 text-taupe-700 hover:border-taupe-400"
                    )}
                  >
                    {condition === "new" && "Mới"}
                    {condition === "like_new" && "Như mới"}
                    {condition === "good" && "Tốt"}
                    {condition === "fair" && "Khá"}
                    {condition === "poor" && "Cũ"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
