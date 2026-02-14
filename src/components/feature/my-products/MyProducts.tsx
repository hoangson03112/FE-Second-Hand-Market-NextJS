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
import { Container } from "@/components/layout/Container";
import { Package } from "lucide-react";

export default function MyProducts() {
  const { products, isLoading, error, refetch } = useMyProducts();
  const { deletingId, handleDelete } = useDeleteProduct(refetch);
  const { activeFilter, setActiveFilter, stats, filteredProducts } = useProductsFilter(products);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  return (
    <div className="min-h-screen bg-background">
      <ProductListHeader
        stats={stats}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      
      <Container maxWidth="7xl" paddingX="md" paddingY="lg">
        {error && (
          <div className="rounded-lg px-4 py-3 text-sm mb-6 bg-red-50 text-red-600 border border-red-200">
            {PRODUCT_MESSAGES.LOAD_ERROR}
          </div>
        )}

        {isLoading ? (
          <ProductLoadingState />
        ) : products.length === 0 ? (
          <EmptyProductState />
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-xl bg-card border border-border p-16 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">
              Không có sản phẩm nào trong danh mục này
            </p>
          </div>
        ) : (
          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "space-y-3"
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
