"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PRODUCT_MESSAGES } from "@/constants";
import { useMyProducts, useDeleteProduct, useProductsFilter } from "./hooks";
import {
  ProductListHeader,
  EmptyProductState,
  ProductLoadingState,
  ProductCard,
} from "./components";
import { PageContainer, Container } from "@/components/layout/Container";

export default function MyProducts() {
  const { products, isLoading, error, refetch } = useMyProducts();
  const { deletingId, handleDelete } = useDeleteProduct(refetch);
  const { activeFilter, setActiveFilter, stats, filteredProducts } = useProductsFilter(products);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  return (
    <div className="min-h-screen bg-gray-50/50">
      <ProductListHeader
        stats={stats}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      
      <Container maxWidth="7xl" paddingX="md" paddingY="lg">
        {error && (
          <div
            className={cn(
              "rounded-xl px-4 py-3 text-sm mb-6",
              "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300",
              "border border-red-200 dark:border-red-800"
            )}
          >
            {PRODUCT_MESSAGES.LOAD_ERROR}
          </div>
        )}

        {isLoading ? (
          <ProductLoadingState />
        ) : products.length === 0 ? (
          <EmptyProductState />
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-2xl bg-card border border-border p-16 text-center">
            <p className="text-muted-foreground">
              Không có sản phẩm nào trong danh mục này
            </p>
          </div>
        ) : (
          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            )}
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onDelete={handleDelete}
                isDeleting={deletingId === product._id}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
