"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface Category {
  name: string;
  icon: string;
  color: string;
}

interface CategoriesSectionProps {
  categories: Category[];
}

export default function CategoriesSection({ categories }: CategoriesSectionProps) {
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className={cn("text-2xl md:text-3xl font-bold text-center mb-12", "animate-fade-in-up", "text-neutral-900")}>
          Danh mục phổ biến
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category, index) => (
            <div
              key={index}
              className={cn(
                "px-6 py-3 rounded-full border-2 border-default hover-border-primary",
                "bg-white hover:bg-primary-tint transition-all duration-300",
                "hover-lift cursor-pointer",
                "animate-scale-in"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="text-lg mr-2">{category.icon}</span>
              <span className="text-sm font-semibold text-neutral-800 hover-text-primary">{category.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
