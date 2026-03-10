import { IconChevronDown, IconChevronUp, IconExternalLink } from "@tabler/icons-react";
import { Fragment } from "react";
import { formatPrice } from "@/utils/format/price";
import { format } from "@/utils/format/date";
import type { AdminOrder } from "@/types/admin";
import { StatusBadge } from "@/components/ui/StatusBadge";

const GHN_TRACKING_URL = "https://tracking.ghn.dev/?order_code=";

interface OrdersTableProps {
  orders: AdminOrder[];
  expandedId: string | null;
  onToggleExpanded: (orderId: string) => void;
  onCompleteRefund: (orderId: string) => Promise<{ message: string }>;
  isCompletingRefund: boolean;
}

export default function OrdersTable({
  orders,
  expandedId,
  onToggleExpanded,
  onCompleteRefund,
  isCompletingRefund,
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
                      <StatusBadge status={order.status} />
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
                              {JSON.stringify(order.shippingAddress).slice(0, 120)}...
                            </p>
                          ) : null}

                          {/* GHN tracking */}
                          {order.ghnOrderCode && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">Mã GHN:</span>
                              <span className="font-mono text-foreground">{order.ghnOrderCode}</span>
                              <a
                                href={`${GHN_TRACKING_URL}${order.ghnOrderCode}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-primary hover:underline"
                              >
                                <IconExternalLink className="h-3 w-3" />
                                Theo dõi
                              </a>
                            </div>
                          )}
                          {order.ghnReturnOrderCode && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">Mã hoàn trả:</span>
                              <span className="font-mono text-foreground">{order.ghnReturnOrderCode}</span>
                              <a
                                href={`${GHN_TRACKING_URL}${order.ghnReturnOrderCode}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                              >
                                <IconExternalLink className="h-3 w-3" />
                                Theo dõi
                              </a>
                            </div>
                          )}

                          {/* Refund bank info + process refund (returned status) */}
                          {(order.status === "returned" || order.status === "refunded") && (
                            <div className="mt-2 pt-2 border-t border-border">
                              <p className="font-medium text-foreground mb-1.5">Thông tin ngân hàng hoàn tiền</p>
                              {order.refundBankInfo?.buyerAccountNumber ? (
                                <div className="space-y-0.5 mb-2">
                                  <p>Ngân hàng: <span className="font-semibold text-foreground">{order.refundBankInfo.buyerBankName}</span></p>
                                  <p>Số TK: <span className="font-mono font-semibold text-foreground">{order.refundBankInfo.buyerAccountNumber}</span></p>
                                  <p>Chủ TK: <span className="font-semibold text-foreground">{order.refundBankInfo.buyerAccountHolder}</span></p>
                                </div>
                              ) : (
                                <p className="text-muted-foreground mb-2">Người mua chưa cung cấp STK</p>
                              )}
                              {order.status === "returned" && (
                                <button
                                  type="button"
                                  onClick={() => onCompleteRefund(order._id)}
                                  disabled={isCompletingRefund}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  {isCompletingRefund ? "Đang xử lý..." : "Xử lý hoàn tiền"}
                                </button>
                              )}
                              {order.status === "refunded" && (
                                <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold">
                                  Đã hoàn tiền
                                </span>
                              )}
                            </div>
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
  );
}


