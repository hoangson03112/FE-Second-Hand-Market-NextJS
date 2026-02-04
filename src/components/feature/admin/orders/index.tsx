"use client";

import { Fragment } from "react";
import { ShoppingCart, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { formatPrice } from "@/utils/format/price";
import { format } from "@/utils/format/date";
import type { AdminOrder } from "@/services/admin.service";
import { useAdminOrders } from "./hooks/useAdminOrders";

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Chờ xử lý",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  },
  confirmed: {
    label: "Đã xác nhận",
    className:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  },
  shipping: {
    label: "Đang giao",
    className:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200",
  },
  delivered: {
    label: "Đã giao",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
  },
  cancelled: {
    label: "Đã hủy",
    className: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
  },
  refunded: {
    label: "Hoàn tiền",
    className:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
};

export default function AdminOrders() {
  const { orders, isLoading, error, expandedId, toggleExpanded } =
    useAdminOrders();

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
        Không tải được danh sách đơn hàng.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-foreground">Đơn hàng</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Xem toàn bộ đơn hàng trong hệ thống
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          <ShoppingCart className="mx-auto mb-2 h-10 w-10 opacity-50" />
          Chưa có đơn hàng nào.
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium text-foreground">
                    Mã / Ngày
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-foreground hidden sm:table-cell">
                    Người mua
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-foreground">
                    Tổng tiền
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-foreground">
                    Trạng thái
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-foreground w-10">
                    Chi tiết
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: AdminOrder) => {
                  const statusInfo =
                    STATUS_BADGE[order.status] ?? {
                      label: order.status,
                      className: "bg-muted text-muted-foreground",
                    };
                  const isExpanded = expandedId === order._id;
                  return (
                    <Fragment key={order._id}>
                      <tr className="border-b border-border last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs text-muted-foreground">
                            {order._id.slice(-8)}
                          </span>
                          <br />
                          <span className="text-xs text-muted-foreground">
                            {order.createdAt ? format(order.createdAt) : "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell text-foreground">
                          {order.buyerId?.fullName ?? "—"}
                          <br />
                          <span className="text-xs text-muted-foreground">
                            {order.buyerId?.email ?? ""}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground">
                          {formatPrice(order.totalAmount)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${statusInfo.className}`}
                          >
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => toggleExpanded(order._id)}
                            className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                            title="Xem chi tiết"
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-muted/20">
                          <td colSpan={5} className="px-4 py-3">
                            <div className="text-xs space-y-2">
                              <p>
                                <span className="font-medium text-foreground">
                                  Sản phẩm:
                                </span>{" "}
                                {order.products?.map((p, i) => {
                                  const productName =
                                    typeof p.productId === "object" &&
                                    p.productId !== null &&
                                    "name" in p.productId
                                      ? (p.productId as { name: string }).name
                                      : null;
                                  return (
                                    <span
                                      key={`${order._id}-${i}`}
                                      className="mr-2"
                                    >
                                      {productName != null
                                        ? `${productName} x${p.quantity}`
                                        : `#${p.quantity}`}
                                    </span>
                                  );
                                })}
                              </p>
                              {order.shippingAddress && (
                                <p>
                                  <span className="font-medium text-foreground">
                                    Địa chỉ giao:
                                  </span>{" "}
                                  {JSON.stringify(order.shippingAddress).slice(
                                    0,
                                    120
                                  )}
                                  ...
                                </p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

