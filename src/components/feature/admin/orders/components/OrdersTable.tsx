import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { Fragment } from "react";
import { formatPrice } from "@/utils/format/price";
import { format } from "@/utils/format/date";
import type { AdminOrder } from "@/types/admin";

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

interface OrdersTableProps {
  orders: AdminOrder[];
  expandedId: string | null;
  onToggleExpanded: (orderId: string) => void;
}

export default function OrdersTable({
  orders,
  expandedId,
  onToggleExpanded,
}: OrdersTableProps) {
  return (
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
                        onClick={() => onToggleExpanded(order._id)}
                        className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                        title="Xem chi tiết"
                      >
                        {isExpanded ? (
                          <IconChevronUp className="h-4 w-4" />
                        ) : (
                          <IconChevronDown className="h-4 w-4" />
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
                          {order.shippingAddress != null ? (
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
                          ) : null}
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
  );
}
