"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useScrollReveal } from "../hooks";
import useCategories from "@/hooks/useCategories";

interface Category {
  name: string;
  slug: string;
  icon: string;
  color: string;
}

interface CategoriesSectionProps {
  categories: Category[];
}

export default function CategoriesSection({
  categories: fallbackCategories,
}: CategoriesSectionProps) {
  const { data: apiCategories } = useCategories();
  const categories = apiCategories?.length
    ? apiCategories
    : fallbackCategories.map((c, i) => ({ _id: String(i), name: c.name, slug: c.slug, subCategories: [] }));
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const [showAll, setShowAll] = useState(false);
  const LIMIT = 10;
  const visibleCategories = showAll ? categories : categories.slice(0, LIMIT);

  return (
    <section
      ref={ref}
      className="relative py-12 md:py-16"
      style={{ background: "#FAF7F2" }}
    >
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <span
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-3"
              style={{ color: "#C47B5A" }}
            >
              <span className="w-5 h-px" style={{ background: "#C47B5A", display: "inline-block" }} />
              Danh mục
            </span>
            <h2
              className="text-xl md:text-2xl font-semibold tracking-tight"
              style={{ color: "#1A1714" }}
            >
              Tìm đúng thứ bạn cần
            </h2>
          </div>
          <Link
            href="/categories"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-70"
            style={{ color: "#C47B5A" }}
          >
            Tất cả <span>→</span>
          </Link>
        </div>

        {/* Category list */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {visibleCategories.map((category, index) => {
            const slug = category.slug ?? "";
            return (
              <Link
                key={"_id" in category ? category._id : index}
                href={`/categories/${slug}`}
                className="group flex items-center justify-between gap-2 px-4 py-3 transition-all duration-150"
                style={{
                  background: "#fff",
                  border: "1px solid #EDE0D4",
                  borderRadius: "10px",
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(8px)",
                  transition: `opacity 250ms ease-out ${index * 30 + 40}ms, transform 250ms ease-out ${index * 30 + 40}ms, border-color 150ms`,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#C47B5A"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#EDE0D4"; }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="text-[11px] font-semibold tabular-nums flex-shrink-0"
                    style={{ color: "#C47B5A" }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="text-[13px] font-medium truncate"
                    style={{ color: "#1A1714" }}
                  >
                    {category.name}
                  </span>
                </div>
                <span
                  className="text-[11px] flex-shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
                  style={{ color: "#C47B5A" }}
                >
                  →
                </span>
              </Link>
            );
          })}
        </div>

        {/* Show more button */}
        {categories.length > LIMIT && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setShowAll((v) => !v)}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200"
              style={{
                color: "#1A1714",
                border: "1px solid #D5C4B5",
                borderRadius: "8px",
                background: "transparent",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "#1A1714"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "#D5C4B5"}
            >
              {showAll ? "Thu gọn ↑" : `Xem tất cả ${categories.length} danh mục →`}
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

