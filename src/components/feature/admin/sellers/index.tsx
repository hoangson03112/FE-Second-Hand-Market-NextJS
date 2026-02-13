"use client";

import Pagination from "@/components/ui/Pagination";
import type { AdminSeller } from "@/types/admin";
import { format } from "@/utils/format/date";
import {
  Store,
  Loader2,
  CheckCircle2,
  XCircle,
  Eye,
  X,
} from "lucide-react";
import { useAdminSellers } from "./hooks/useAdminSellers";

const STATUS_TABS = [
  { value: "", label: "Tất cả" },
  { value: "pending", label: "Chờ duyệt" },
  { value: "approved", label: "Đã duyệt" },
  { value: "rejected", label: "Từ chối" },
] as const;

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Chờ duyệt",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
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
  banned: {
    label: "Khóa",
    className:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
};

export default function AdminSellers() {
  const {
    sellers,
    statistics,
    totalPages,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    selectedSeller,
    rejectReason,
    setRejectReason,
    isUpdating,
    handleApprove,
    handleReject,
    openSeller,
    closeSeller,
  } = useAdminSellers();

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        Không tải được danh sách seller.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-foreground">Seller</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Duyệt và quản lý tài khoản seller
        </p>
      </div>

      {statistics && (
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="rounded-lg bg-muted px-2 py-1 text-muted-foreground">
            Tổng: {statistics.total}
          </span>
          <span className="rounded-lg bg-amber-100 px-2 py-1 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
            Chờ duyệt: {statistics.pending}
          </span>
          <span className="rounded-lg bg-green-100 px-2 py-1 text-green-800 dark:bg-green-900/40 dark:text-green-200">
            Đã duyệt: {statistics.approved}
          </span>
          <span className="rounded-lg bg-red-100 px-2 py-1 text-red-800 dark:bg-red-900/40 dark:text-red-200">
            Từ chối: {statistics.rejected}
          </span>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 border-b border-border pb-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value || "all"}
            type="button"
            onClick={() => {
              setStatusFilter(tab.value);
              setPage(1);
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              statusFilter === tab.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {sellers.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          <Store className="mx-auto mb-2 h-10 w-10 opacity-50" />
          Không có seller nào.
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-4 py-3 font-medium text-foreground">
                      Seller
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-foreground hidden sm:table-cell">
                      Liên hệ
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-foreground">
                      Trạng thái
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-foreground hidden md:table-cell">
                      Ngày đăng ký
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-foreground">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sellers.map((seller: AdminSeller) => {
                    const statusInfo =
                      STATUS_BADGE[seller.verificationStatus] ?? {
                        label: seller.verificationStatus,
                        className: "bg-muted text-muted-foreground",
                      };
                    return (
                      <tr
                        key={seller._id}
                        className="border-b border-border last:border-0 hover:bg-muted/30"
                      >
                        <td className="px-4 py-3">
                          <span className="font-medium text-foreground">
                            {seller.accountId?.fullName ?? "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground text-xs">
                          {seller.accountId?.email ?? "—"}
                          <br />
                          {seller.accountId?.phoneNumber ?? "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${statusInfo.className}`}
                          >
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">
                          {seller.createdAt ? format(seller.createdAt) : "—"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => openSeller(seller)}
                              className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                              title="Xem chi tiết"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {seller.verificationStatus === "pending" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleApprove(seller)}
                                  disabled={isUpdating}
                                  className="rounded-lg p-2 text-green-600 hover:bg-green-500/10 disabled:opacity-50"
                                  title="Duyệt"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openSeller(seller)}
                                  disabled={isUpdating}
                                  className="rounded-lg p-2 text-red-600 hover:bg-red-500/10 disabled:opacity-50"
                                  title="Từ chối"
                                >
                                  <XCircle className="h-4 w-4" />
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

      {selectedSeller && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeSeller}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3 shrink-0">
              <h2 className="font-semibold text-foreground">Chi tiết seller</h2>
              <button
                type="button"
                onClick={closeSeller}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3 overflow-y-auto p-4">
              <p>
                <span className="text-muted-foreground">Họ tên:</span>{" "}
                {selectedSeller.accountId?.fullName ?? "—"}
              </p>
              <p>
                <span className="text-muted-foreground">Email:</span>{" "}
                {selectedSeller.accountId?.email ?? "—"}
              </p>
              <p>
                <span className="text-muted-foreground">SĐT:</span>{" "}
                {selectedSeller.accountId?.phoneNumber ?? "—"}
              </p>
              <p>
                <span className="text-muted-foreground">Địa chỉ kinh doanh:</span>{" "}
                {selectedSeller.businessAddress ?? "—"}
              </p>
              <p>
                <span className="text-muted-foreground">Tỉnh/Quận/Xã:</span>{" "}
                {[
                  selectedSeller.province,
                  selectedSeller.district,
                  selectedSeller.ward,
                ]
                  .filter(Boolean)
                  .join(", ") || "—"}
              </p>
              {selectedSeller.verificationStatus === "pending" && (
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Lý do từ chối (nếu từ chối)
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    rows={2}
                    placeholder="Nhập lý do..."
                  />
                </div>
              )}
            </div>
            <div className="flex gap-2 justify-end border-t border-border px-4 py-3 shrink-0">
              <button
                type="button"
                onClick={closeSeller}
                className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                Đóng
              </button>
              {selectedSeller.verificationStatus === "pending" && (
                <>
                  <button
                    type="button"
                    onClick={() => handleReject(selectedSeller)}
                    disabled={isUpdating}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:bg-red-900/20"
                  >
                    Từ chối
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApprove(selectedSeller)}
                    disabled={isUpdating}
                    className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    Duyệt
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

