"use client";

import { IconPackage } from "@tabler/icons-react";
import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { PRODUCT_MESSAGES } from "@/constants";
import { useMyProducts, useDeleteProduct, useDeleteDiscount, useProductsFilter } from "./hooks";
import {
  ProductListHeader,
  EmptyProductState,
  ProductLoadingState,
  ProductCard,
} from "./components";
import { Container } from "@/components/layout/Container";
import { useRequestReview } from "@/features/sell/hooks";
import { usePagination } from "@/hooks/usePagination";
import { Pagination } from "@/components/shared";
import type { MyListingsResponse } from "@/types/myProducts";

const PAGE_SIZE = 12;

export default function MyProducts() {
  const queryClient = useQueryClient();
  const { products, isLoading, error, refetch } = useMyProducts();
  const { deletingId, handleDelete } = useDeleteProduct(refetch);
  const { deletingId: deletingDiscountId, handleDelete: handleDeleteDiscount } = useDeleteDiscount(refetch);
  const { activeFilter, setActiveFilter, stats, filteredProducts } = useProductsFilter(products);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [requestingReviewId, setRequestingReviewId] = useState<string | null>(null);
  const { handleRequestReview: _requestReview } = useRequestReview();

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const { page, setPage, resetPage } = usePagination(totalPages);

  const handleFilterChange = useCallback(
    (filter: string) => { setActiveFilter(filter as Parameters<typeof setActiveFilter>[0]); resetPage(); },
    [setActiveFilter, resetPage],
  );

  const paginatedProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleRequestReview = async (productId: string) => {
    setRequestingReviewId(productId);
    await _requestReview(productId);
    setRequestingReviewId(null);
    // Optimistic update: đổi status ngay lập tức, rồi refetch nền
    queryClient.setQueryData<MyListingsResponse>(["my", "products"], (old) => {
      if (!old) return old;
      return {
        ...old,
        data: old.data.map((p) =>
          p._id === productId
            ? {
                ...p,
                status: "review_requested" as const,
                aiModerationResult: {
                  ...p.aiModerationResult,
                  humanReviewRequested: true,
                },
              }
            : p,
        ),
      };
    });
    refetch();
  };

  return (
    <div className="min-h-screen bg-background">
      <ProductListHeader
        stats={stats}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <Container maxWidth="7xl" paddingX="md" paddingY="lg">
        {error && (
          <div className="rounded-lg px-4 py-3 text-sm mb-6 bg-destructive/8 text-destructive border border-destructive/20">
            {PRODUCT_MESSAGES.LOAD_ERROR}
          </div>
        )}

        {isLoading ? (
          <ProductLoadingState />
        ) : products.length === 0 ? (
          <EmptyProductState />
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-xl bg-card border border-border p-16 text-center">
            <IconPackage className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">
              Không có sản phẩm nào trong danh mục này
            </p>
          </div>
        ) : (
          <>
            <div
              className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  : "space-y-3"
              )}
            >
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onDelete={handleDelete}
                  isDeleting={deletingId === product._id}
                  onDeleteDiscount={handleDeleteDiscount}
                  isDeletingDiscount={deletingDiscountId}
                  onRequestReview={handleRequestReview}
                  isRequestingReview={requestingReviewId === product._id}
                  viewMode={viewMode}
                />
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              className="mt-6"
            />
          </>
        )}
      </Container>
    </div>
  );
}

