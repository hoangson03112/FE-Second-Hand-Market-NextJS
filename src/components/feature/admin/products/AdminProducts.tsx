"use client";

import { IconLoader2, IconPackage } from "@tabler/icons-react";
import type { ProductStatusFilter } from "@/types/product";
import Pagination from "@/components/ui/Pagination";
import { useAdminProducts } from "./hooks/useAdminProducts";
import { ProductDetailDrawer } from "./ProductDetailDrawer";
import { ProductTable } from "./components/ProductTable";
import { STATUS_TABS } from "./constants";
import { RejectReasonDialog } from "@/components/ui/RejectReasonDialog";

export default function AdminProducts() {
  const {
    data,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    totalPages,
    selectedProduct,
    setSelectedProduct,
    isUpdating,
    handleApprove,
    handleReject,
    rejectProduct,
    setRejectProduct,
    handleRejectConfirm,
  } = useAdminProducts();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-foreground">Kiểm duyệt sản phẩm</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Duyệt hoặc từ chối sản phẩm đăng bán</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-border pb-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value || "all"}
            type="button"
            onClick={() => {
              setStatusFilter(tab.value as ProductStatusFilter | "");
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === tab.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Không tải được danh sách. Kiểm tra đăng nhập với tài khoản admin.
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <IconLoader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : data?.data?.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          <IconPackage className="w-10 h-10 mx-auto mb-2 opacity-50" />
          Không có sản phẩm nào.
        </div>
      ) : (
        <>
          <ProductTable
            products={data?.data ?? []}
            isUpdating={isUpdating}
            onView={setSelectedProduct}
            onApprove={handleApprove}
            onReject={handleReject}
          />

          {totalPages > 1 && (
            <div className="flex justify-center pt-2">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}

      {/* Product detail drawer */}
      {selectedProduct && (
        <ProductDetailDrawer
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          isUpdating={isUpdating}
        />
      )}

      {/* Reject reason dialog */}
      <RejectReasonDialog
        isOpen={!!rejectProduct}
        productName={rejectProduct?.name || ""}
        onConfirm={handleRejectConfirm}
        onCancel={() => setRejectProduct(null)}
        isLoading={isUpdating}
      />
    </div>
  );
}