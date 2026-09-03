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
      <PageHeader
        eyebrow="Kiểm duyệt sàn"
        title="Kiểm duyệt sản phẩm"
        description="Thẩm định, duyệt hoặc từ chối sản phẩm người bán đăng tải trên hệ thống."
        badge={
          data?.total != null ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-[2px] text-2xs font-bold uppercase tracking-[0.16em] bg-cream-50 text-luxury-ink border border-luxury-ink/10">
              {data.total} sản phẩm
            </span>
          ) : null
        }
      />

      {/* Filter Tabs: Quiet Luxury Style */}
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
              className={`px-3.5 py-2 rounded-[2px] text-2xs font-bold uppercase tracking-[0.14em] transition-all whitespace-nowrap ${
                isActive
                  ? "bg-luxury-ink text-luxury-ivory shadow-none"
                  : "bg-white border border-luxury-ink/10 text-neutral-600 hover:bg-taupe-50 hover:text-luxury-ink"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {error && (
        <ErrorState
          title="Không tải được danh sách sản phẩm"
          description="Vui lòng kiểm tra quyền đăng nhập tài khoản admin."
        />
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <IconLoader2 className="w-9 h-9 animate-spin text-luxury-ink" />
            <p className="text-2xs font-bold uppercase tracking-[0.2em] text-neutral-500">
              Đang tải danh sách sản phẩm...
            </p>
          </div>
        </div>
      ) : data?.data?.length === 0 ? (
        <NoData
          icon={<IconPackage className="w-10 h-10 text-neutral-400" />}
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

      {selectedProduct && (
        <ProductDetailDrawer
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          isUpdating={isUpdating}
        />
      )}

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