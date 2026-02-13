"use client";

import {
  Package,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  Loader2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import type { IProduct, ProductStatusFilter } from "@/types/product";
import { formatPrice } from "@/utils/format/price";
import { format } from "@/utils/format/date";
import Pagination from "@/components/ui/Pagination";
import { useAdminProducts } from "./hooks/useAdminProducts";
import { RejectReasonDialog } from "./RejectReasonDialog";

const CONDITION_LABEL: Record<string, string> = {
  new: "Mới",
  like_new: "Như mới",
  good: "Tốt",
  fair: "Khá",
  poor: "Kém",
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-muted-foreground shrink-0">{label}:</span>
      <span className="text-foreground break-all">{value}</span>
    </div>
  );
}

const STATUS_TABS: { value: ProductStatusFilter | ""; label: string }[] = [
  { value: "", label: "Tất cả" },
  { value: "pending", label: "Chờ duyệt" },
  { value: "under_review", label: "Đang xem xét" },
  { value: "approved", label: "Đã duyệt" },
  { value: "rejected", label: "Từ chối" },
];

/** Nhãn tiếng Việt cho mọi trạng thái, không hiển thị mã tiếng Anh */
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
  pending_review: {
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

function getStatusLabel(status: string): string {
  return STATUS_BADGE[status]?.label ?? "Khác";
}

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
                      Danh mục
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-foreground hidden md:table-cell">
                      SL
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-foreground hidden lg:table-cell">
                      Tình trạng
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
                        <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">
                          {product.category?.name ?? "—"}
                          {product.subcategory?.name ? ` / ${product.subcategory.name}` : ""}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-muted-foreground tabular-nums">
                          {product.stock}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">
                          {product.condition
                            ? CONDITION_LABEL[product.condition] ?? product.condition
                            : "—"}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">
                          {product.seller?.account?.fullName ?? product.seller?.fullName ?? "—"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${statusInfo.className}`}
                            >
                              {statusInfo.label}
                            </span>
                            {product.aiModerationResult?.humanReviewRequested && (
                              <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200">
                                👤 User yêu cầu duyệt lại
                              </span>
                            )}
                          </div>
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
            className="bg-card rounded-xl border border-border shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
              <h2 className="font-semibold text-foreground">Chi tiết sản phẩm</h2>
              <div className="flex items-center gap-2">
                <Link
                  href={`/products/${selectedProduct._id}/${selectedProduct.slug ?? ""}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  Xem trang SP <ExternalLink className="w-3 h-3" />
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto space-y-5 text-sm">
              {/* Thông tin cơ bản */}
              <section>
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">
                  Thông tin cơ bản
                </h3>
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
                  <div className="min-w-0 flex-1 grid grid-cols-2 gap-x-4 gap-y-1">
                    <Row label="ID" value={selectedProduct._id} />
                    <Row label="Tên" value={selectedProduct.name} />
                    <Row label="Slug" value={selectedProduct.slug || "—"} />
                    <Row label="Giá" value={formatPrice(selectedProduct.price)} />
                    <Row label="Tồn kho" value={String(selectedProduct.stock)} />
                    <Row
                      label="Tình trạng"
                      value={
                        selectedProduct.condition
                          ? CONDITION_LABEL[selectedProduct.condition] ?? selectedProduct.condition
                          : "—"
                      }
                    />
                    <Row
                      label="Trạng thái"
                      value={
                        STATUS_BADGE[selectedProduct.status]?.label ?? selectedProduct.status
                      }
                    />
                    <Row
                      label="Danh mục"
                      value={
                        [selectedProduct.category?.name, selectedProduct.subcategory?.name]
                          .filter(Boolean)
                          .join(" / ") || "—"
                      }
                    />
                    <Row label="Vị trí" value={selectedProduct.location || "—"} />
                    <Row label="Lượt xem" value={selectedProduct.views != null ? String(selectedProduct.views) : "—"} />
                    <Row label="Lượt thích" value={selectedProduct.likes != null ? String(selectedProduct.likes) : "—"} />
                    <Row
                      label="Ngày tạo"
                      value={selectedProduct.createdAt ? format(selectedProduct.createdAt) : "—"}
                    />
                    <Row
                      label="Cập nhật"
                      value={selectedProduct.updatedAt ? format(selectedProduct.updatedAt) : "—"}
                    />
                  </div>
                </div>
              </section>

              {/* Cân nặng ước tính (AI) */}
              {selectedProduct.estimatedWeight && (
                <section>
                  <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">
                    Cân nặng ước tính (AI)
                  </h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <Row
                      label="Giá trị (kg)"
                      value={String(selectedProduct.estimatedWeight.value)}
                    />
                    <Row
                      label="Độ tin cậy"
                      value={String(selectedProduct.estimatedWeight.confidence)}
                    />
                  </div>
                </section>
              )}

              {/* Mô tả */}
              <section>
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">
                  Mô tả
                </h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {selectedProduct.description?.trim() || "—"}
                </p>
              </section>

              {/* Ảnh sản phẩm */}
              <section>
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">
                  Ảnh ({selectedProduct.images?.length ?? 0})
                </h3>
                <div className="flex gap-2 overflow-x-auto pb-2 flex-wrap">
                  {selectedProduct.images?.length
                    ? selectedProduct.images.map((img, i) => (
                        <div
                          key={img.publicId ?? i}
                          className="shrink-0 rounded-lg border border-border overflow-hidden bg-muted"
                        >
                          <img
                            src={img.url}
                            alt={img.originalName || ""}
                            className="w-20 h-20 object-cover"
                          />
                          {(img.originalName || img.size) && (
                            <p className="px-2 py-0.5 text-[10px] text-muted-foreground truncate max-w-[120px]">
                              {img.originalName || `${(img.size / 1024).toFixed(1)} KB`}
                            </p>
                          )}
                        </div>
                      ))
                    : "—"}
                </div>
              </section>

              {/* Thuộc tính */}
              <section>
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">
                  Thuộc tính
                </h3>
                {selectedProduct.attributes?.length ? (
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
                ) : (
                  <p className="text-muted-foreground">—</p>
                )}
              </section>

              {/* Người bán */}
              <section>
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">
                  Người bán
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <Row label="Seller ID" value={selectedProduct.seller?._id ?? "—"} />
                  <Row
                    label="Họ tên"
                    value={
                      selectedProduct.seller?.account?.fullName ??
                      selectedProduct.seller?.fullName ??
                      "—"
                    }
                  />
                  <Row
                    label="Username"
                    value={selectedProduct.seller?.account?.username ?? "—"}
                  />
                  <Row
                    label="Email"
                    value={selectedProduct.seller?.account?.email ?? "—"}
                  />
                  <Row
                    label="Số điện thoại"
                    value={selectedProduct.seller?.phoneNumber ?? "—"}
                  />
                  <Row
                    label="Tỉnh/TP"
                    value={selectedProduct.seller?.province ?? "—"}
                  />
                  <Row
                    label="Địa chỉ kinh doanh"
                    value={selectedProduct.seller?.businessAddress ?? "—"}
                  />
                  <Row
                    label="Mã quận (GHN)"
                    value={selectedProduct.seller?.from_district_id ?? "—"}
                  />
                  <Row
                    label="Mã phường (GHN)"
                    value={selectedProduct.seller?.from_ward_code ?? "—"}
                  />
                  <Row
                    label="Ngày tạo seller"
                    value={
                      selectedProduct.seller?.createdAt
                        ? format(selectedProduct.seller.createdAt)
                        : "—"
                    }
                  />
                  <Row
                    label="Đánh giá TB"
                    value={
                      selectedProduct.seller?.avgRating != null
                        ? String(selectedProduct.seller.avgRating)
                        : "—"
                    }
                  />
                  <Row
                    label="Số đánh giá"
                    value={
                      selectedProduct.seller?.totalReviews != null
                        ? String(selectedProduct.seller.totalReviews)
                        : "—"
                    }
                  />
                  <Row
                    label="Tổng sản phẩm"
                    value={
                      selectedProduct.seller?.totalProducts != null
                        ? String(selectedProduct.seller.totalProducts)
                        : "—"
                    }
                  />
                </div>
              </section>
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

      {/* Modal nhập lý do từ chối */}
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

