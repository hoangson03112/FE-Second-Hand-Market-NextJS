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
    <div className="bg-white border-b border-default sticky top-28 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "px-4 py-2 rounded-full border-2 border-default",
                "hover-border-primary transition-colors",
                "flex items-center gap-2 text-sm font-medium",
                showFilters && "border-primary bg-primary-tint"
              )}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Bộ lọc
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-sm font-medium transition-colors"
              >
                Xóa bộ lọc
              </button>
            )}
            {totalProducts !== undefined && <span className="text-sm text-tertiary">{totalProducts} sản phẩm</span>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-tertiary">Sắp xếp:</span>
            <select
              value={filters.sortBy || "newest"}
              onChange={(e) => handleSortChange(e.target.value as IProductFilters["sortBy"])}
              className="px-4 py-2 rounded-full border border-default focus:border-primary focus:outline-none focus-ring-primary text-sm"
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
          <div className="border-t border-default pt-4 space-y-4 animate-fade-in-down">
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">Khoảng giá</label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  placeholder="Từ"
                  value={filters.minPrice || ""}
                  onChange={(e) => handlePriceRangeChange(e.target.value ? Number(e.target.value) : undefined, filters.maxPrice)}
                  className="flex-1 px-4 py-2 rounded-lg border border-default focus:border-primary focus:outline-none focus-ring-primary"
                />
                <span className="text-tertiary">-</span>
                <input
                  type="number"
                  placeholder="Đến"
                  value={filters.maxPrice || ""}
                  onChange={(e) => handlePriceRangeChange(filters.minPrice, e.target.value ? Number(e.target.value) : undefined)}
                  className="flex-1 px-4 py-2 rounded-lg border border-default focus:border-primary focus:outline-none focus-ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">Tình trạng</label>
              <div className="flex flex-wrap gap-2">
                {["new", "like_new", "good", "fair", "poor"].map((condition) => (
                  <button
                    key={condition}
                    onClick={() => handleConditionChange(condition)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                      filters.condition === condition ? "bg-primary text-white" : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
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
