"use client";

import { IconAlertTriangle, IconPackage } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { PRODUCT_MESSAGES } from "@/constants";
import {
  useMyProducts,
  useDeleteProduct,
  useDeleteDiscount,
  MY_PRODUCTS_QUERY_KEY,
} from "./hooks";
import {
  ProductListHeader,
  ProductFilterTabs,
  EmptyProductState,
  ProductLoadingState,
  ProductCard,
} from "./components";
import { Container } from "@/components/layout/Container";
import { microCaps } from "@/features/order/components";
import { useRequestReview } from "@/features/seller/sell/hooks";
import { Pagination } from "@/components/ui";
import type { MyListingsResponse } from "@/types/myProducts";

export default function MyProducts() {
  const queryClient = useQueryClient();
  const {
    products,
    stats,
    activeFilter,
    setActiveFilter,
    page,
    setPage,
    totalPages,
    totalItems,
    pageStart,
    pageEnd,
    isLoading,
    isFetching,
    error,
    refresh,
  } = useMyProducts();
  const { deletingId, handleDelete } = useDeleteProduct(refresh);
  const {
    deletingId: deletingDiscountId,
    handleDelete: handleDeleteDiscount,
  } = useDeleteDiscount(refresh);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [requestingReviewId, setRequestingReviewId] = useState<string | null>(
    null,
  );
  const [isRevealed, setIsRevealed] = useState(false);
  const { handleRequestReview: _requestReview } = useRequestReview();

  const handlePageChange = useCallback(
    (nextPage: number) => {
      setPage(nextPage);
      // Điều khiển phân trang nằm dưới cùng grid, nên đưa người dùng về đầu
      // danh sách khi trang mới được tải.
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setPage],
  );

  useEffect(() => {
    if (isLoading) return;
    const frame = window.requestAnimationFrame(() => setIsRevealed(true));
    return () => window.cancelAnimationFrame(frame);
  }, [isLoading]);

  const handleRequestReview = async (productId: string) => {
    setRequestingReviewId(productId);
    await _requestReview(productId);
    setRequestingReviewId(null);
    // Optimistic update: đổi status ngay lập tức trên mọi trang đang cache,
    // rồi làm mới nền (đổi status có thể khiến tin rời khỏi tab hiện tại).
    queryClient.setQueriesData<MyListingsResponse>(
      { queryKey: MY_PRODUCTS_QUERY_KEY },
      (old) => {
        if (!old?.data) return old;
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
      },
    );
    refresh();
  };

  const revealClass = cn(
    "transition-all duration-700 ease-out",
    isRevealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
  );

  return (
    <div className="min-h-screen bg-luxury-ivory">
      <ProductListHeader
        totalCount={stats.all}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* The filter strip is the one control that must stay reachable while the
          grid scrolls, so it sticks on its own rather than dragging the
          editorial header along with it. */}
      <div className="sticky top-0 z-20 border-b border-luxury-ink/10 bg-luxury-ivory/95 backdrop-blur-md">
        <ProductFilterTabs
          stats={stats}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>

      <Container maxWidth="9xl" paddingX="md" paddingY="lg">
        {error ? (
          <div className="mb-8 flex gap-2.5 rounded-[2px] border border-blush-300 bg-blush-50 px-4 py-3.5">
            <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-blush-600" />
            <p className="text-xs leading-relaxed text-blush-800">
              {PRODUCT_MESSAGES.LOAD_ERROR}
            </p>
          </div>
        ) : null}

        {isLoading ? (
          <ProductLoadingState viewMode={viewMode} />
        ) : stats.all === 0 && totalItems === 0 ? (
          <div className={revealClass}>
            <EmptyProductState />
          </div>
        ) : products.length === 0 ? (
          <div
            className={cn(
              revealClass,
              "rounded-[2px] border border-dashed border-luxury-ink/15 bg-white px-6 py-20 text-center",
            )}
          >
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-[2px] border border-luxury-ink/10 bg-cream-50">
              <IconPackage className="h-6 w-6 text-luxury-ink" />
            </span>
            <h3
              className="font-droid-serif mt-7 text-xl tracking-tight text-luxury-ink"
            >
              Không có sản phẩm nào
            </h3>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-neutral-600">
              Không tìm thấy tin đăng nào trong trạng thái này. Thử chọn một mục
              khác.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div
              className={cn(
                revealClass,
                // Trang cũ vẫn hiển thị trong lúc trang mới đang về — làm mờ
                // nhẹ để người dùng biết dữ liệu đang được tải.
                isFetching ? "opacity-50" : "opacity-100",
                viewMode === "grid"
                  ? "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                  : "space-y-4",
              )}
              aria-busy={isFetching}
            >
              {products.map((product) => (
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

            <div className="flex flex-col items-center gap-6 border-t border-luxury-ink/6 pt-8">
              <p className={cn(microCaps, "tabular-nums text-neutral-500")}>
                Hiển thị{" "}
                <span className="text-luxury-ink">
                  {pageStart}–{pageEnd}
                </span>{" "}
                trong{" "}
                <span className="text-luxury-ink">{totalItems}</span> tin đăng
              </p>

              {totalPages > 1 ? (
                <Pagination
                  variant="luxury"
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              ) : null}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
