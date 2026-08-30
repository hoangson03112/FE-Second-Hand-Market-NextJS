"use client";

import { IconLoader2, IconPackage } from "@tabler/icons-react";
import type { ProductStatusFilter } from "@/types/product";
import { Pagination } from "@/components/ui";
import { useAdminProducts } from "./hooks/useAdminProducts";
import { ProductDetailDrawer } from "./components/ProductDetailDrawer";
import { ProductTable } from "./components/ProductTable";
import { STATUS_TABS } from "./constants";
import { RejectReasonDialog } from "./components";
import { PageHeader, NoData, ErrorState } from "@/features/admin/components";

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
    handleToggleVisibility,
  } = useAdminProducts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Kiểm duyệt sản phẩm"
        description="Thẩm định, duyệt hoặc từ chối sản phẩm người bán đăng tải trên hệ thống."
        badge={
          data?.total != null ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
              {data.total} sản phẩm
            </span>
          ) : null
        }
      />

      {/* Status filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {STATUS_TABS.map((tab) => {
          const isActive = statusFilter === tab.value;
          return (
            <button
              key={tab.value || "all"}
              type="button"
              onClick={() => {
                setStatusFilter(tab.value as ProductStatusFilter | "");
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs shadow-primary/20"
                  : "bg-card border border-border/80 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <ErrorState
          title="Không tải được danh sách sản phẩm"
          description="Vui lòng kiểm tra quyền đăng nhập tài khoản admin."
        />
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <IconLoader2 className="w-9 h-9 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground">
              Đang tải danh sách sản phẩm...
            </p>
          </div>
        </div>
      ) : data?.data?.length === 0 ? (
        <NoData
          icon={<IconPackage className="w-10 h-10 text-muted-foreground" />}
          title="Không có sản phẩm nào"
          description="Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại."
        />
      ) : (
        <>
          <ProductTable
            products={data?.data ?? []}
            isUpdating={isUpdating}
            onView={setSelectedProduct}
            onApprove={handleApprove}
            onReject={handleReject}
            onToggleVisibility={handleToggleVisibility}
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