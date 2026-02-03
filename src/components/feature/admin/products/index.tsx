"use client";

import {
  Package,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  Loader2,
} from "lucide-react";
import type { IProduct, ProductStatusFilter } from "@/types/product";
import { formatPrice } from "@/utils/format/price";
import { format } from "@/utils/format/date";
import Pagination from "@/components/ui/Pagination";
import { useAdminProducts } from "./hooks/useAdminProducts";

const STATUS_TABS: { value: ProductStatusFilter | ""; label: string }[] = [
  { value: "", label: "Tất cả" },
  { value: "pending", label: "Chờ duyệt" },
  { value: "under_review", label: "Đang xem xét" },
  { value: "approved", label: "Đã duyệt" },
  { value: "rejected", label: "Từ chối" },
];

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Chờ duyệt",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  },
  under_review: {
    label: "Đang xem xét",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  },
  approved: {
    label: "Đã duyệt",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
  },
  rejected: {
    label: "Từ chối",
    className: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
  },
  active: {
    label: "Đang bán",
    className:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  },
  inactive: { label: "Ẩn", className: "bg-muted text-muted-foreground" },
  sold: {
    label: "Đã bán",
    className:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
};

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
  } = useAdminProducts();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-foreground">Kiểm duyệt sản phẩm</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Duyệt hoặc từ chối sản phẩm đăng bán
          </p>
        </div>
      </div>

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

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Không tải được danh sách. Kiểm tra đăng nhập với tài khoản admin.
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : data?.data?.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          <Package className="w-10 h-10 mx-auto mb-2 opacity-50" />
          Không có sản phẩm nào.
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-4 py-3 font-medium text-foreground">
                      Sản phẩm
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-foreground hidden sm:table-cell">
                      Giá
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-foreground hidden md:table-cell">
                      Người đăng
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-foreground">
                      Trạng thái
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-foreground hidden lg:table-cell">
                      Ngày tạo
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-foreground">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data?.map((product: IProduct) => {
                    const statusInfo =
                      STATUS_BADGE[product.status] || {
                        label: product.status,
                        className: "bg-muted text-muted-foreground",
                      };
                    return (
                      <tr
                        key={product._id}
                        className="border-b border-border last:border-0 hover:bg-muted/30"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg border border-border bg-muted overflow-hidden shrink-0">
                              {product.avatar?.url ? (
                                <img
                                  src={product.avatar.url}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-5 h-5 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <span className="font-medium text-foreground line-clamp-2">
                              {product.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                          {formatPrice(product.price)}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                          {product.seller?.account?.fullName ?? "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${statusInfo.className}`}
                          >
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">
                          {product.createdAt ? format(product.createdAt) : "—"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => setSelectedProduct(product)}
                              className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {(product.status === "pending" ||
                              product.status === "under_review") && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleApprove(product)}
                                  disabled={isUpdating}
                                  className="p-2 rounded-lg text-green-600 hover:bg-green-500/10 disabled:opacity-50"
                                  title="Duyệt"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleReject(product)}
                                  disabled={isUpdating}
                                  className="p-2 rounded-lg text-red-600 hover:bg-red-500/10 disabled:opacity-50"
                                  title="Từ chối"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-card rounded-xl border border-border shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
              <h2 className="font-semibold text-foreground">Chi tiết sản phẩm</h2>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto space-y-4">
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-lg border border-border bg-muted overflow-hidden shrink-0">
                  {selectedProduct.avatar?.url ? (
                    <img
                      src={selectedProduct.avatar.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-foreground">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {formatPrice(selectedProduct.price)} · SL:{" "}
                    {selectedProduct.stock}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedProduct.category?.name} /{" "}
                    {selectedProduct.subcategory?.name}
                  </p>
                </div>
              </div>

              {selectedProduct.description && (
                <div>
                  <p className="text-xs font-medium text-foreground mb-1">Mô tả</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {selectedProduct.description}
                  </p>
                </div>
              )}

              {selectedProduct.images?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-foreground mb-2">
                    Ảnh ({selectedProduct.images.length})
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {selectedProduct.images.map((img, i) => (
                      <img
                        key={i}
                        src={img.url}
                        alt=""
                        className="w-20 h-20 rounded-lg border border-border object-cover shrink-0"
                      />
                    ))}
                  </div>
                </div>
              )}

              {selectedProduct.attributes?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-foreground mb-1">
                    Thuộc tính
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.attributes.map((attr) => (
                      <span
                        key={attr._id}
                        className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground"
                      >
                        {attr.key}: {attr.value}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-border flex gap-2 justify-end shrink-0">
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted"
              >
                Đóng
              </button>
              {(selectedProduct.status === "pending" ||
                selectedProduct.status === "under_review") && (
                <>
                  <button
                    type="button"
                    onClick={() => handleReject(selectedProduct)}
                    disabled={isUpdating}
                    className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/20"
                  >
                    Từ chối
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApprove(selectedProduct)}
                    disabled={isUpdating}
                    className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Duyệt"
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

