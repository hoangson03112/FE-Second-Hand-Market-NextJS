import { IconChevronDown, IconChevronUp, IconExternalLink, IconMapPin, IconPackage, IconTruck } from "@tabler/icons-react";
import { Fragment } from "react";
import { formatPrice } from "@/utils/format/price";
import { format } from "@/utils/format/date";
import type { AdminOrder } from "@/types/admin";
import { StatusBadge } from "@/components/ui/StatusBadge";

const GHN_TRACKING_URL = "https://tracking.ghn.dev/?order_code=";

function formatShippingAddress(addr: Record<string, unknown> | string | null | undefined): { fullName?: string; phone?: string; address?: string } | null {
  if (!addr || typeof addr === "string") return null;
  const a = addr as Record<string, unknown>;
  const fullName = typeof a.fullName === "string" ? a.fullName : undefined;
  const phone = typeof a.phoneNumber === "string" ? a.phoneNumber : undefined;
  const parts = [
    a.specificAddress,
    a.ward,
    a.district,
    a.province,
  ].filter((x): x is string => typeof x === "string" && x.length > 0);
  const address = parts.length > 0 ? parts.join(", ") : undefined;
  if (!fullName && !phone && !address) return null;
  return { fullName, phone, address };
}

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
                      <td colSpan={5} className="px-4 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          {/* Sản phẩm */}
                          <div className="p-3 rounded-xl bg-background border border-border">
                            <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                              <IconPackage className="w-3.5 h-3.5" /> Sản phẩm
                            </p>
                            <ul className="space-y-1">
                              {order.products?.map((p, i) => {
                                const productName =
                                  typeof p.productId === "object" &&
                                  p.productId !== null &&
                                  "name" in p.productId
                                    ? (p.productId as { name: string }).name
                                    : null;
                                return (
                                  <li key={`${order._id}-${i}`} className="text-foreground">
                                    {productName != null
                                      ? `${productName} × ${p.quantity}`
                                      : `Sản phẩm #${i + 1} × ${p.quantity}`}
                                  </li>
                                );
                              }) ?? <li className="text-muted-foreground">—</li>}
                            </ul>
                          </div>

                          {/* Địa chỉ giao hàng */}
                          <div className="p-3 rounded-xl bg-background border border-border">
                            <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                              <IconMapPin className="w-3.5 h-3.5" /> Địa chỉ giao hàng
                            </p>
                            {(() => {
                              const addr = formatShippingAddress(order.shippingAddress);
                              if (!addr) return <p className="text-muted-foreground text-sm">Chưa có địa chỉ</p>;
                              return (
                                <div className="text-foreground text-sm space-y-0.5">
                                  {(addr.fullName || addr.phone) && (
                                    <p className="font-medium">
                                      {[addr.fullName, addr.phone].filter(Boolean).join(" • ")}
                                    </p>
                                  )}
                                  {addr.address && (
                                    <p className="text-muted-foreground">{addr.address}</p>
                                  )}
                                </div>
                              );
                            })()}
                          </div>

                          {/* Mã vận đơn GHN */}
                          <div className="p-3 rounded-xl bg-background border border-border space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                              <IconTruck className="w-3.5 h-3.5" /> Vận đơn GHN
                            </p>
                            {order.ghnOrderCode ? (
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono text-foreground text-xs">{order.ghnOrderCode}</span>
                                <a
                                  href={`${GHN_TRACKING_URL}${order.ghnOrderCode}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-primary hover:underline text-xs"
                                >
                                  <IconExternalLink className="h-3 w-3" />
                                  Theo dõi
                                </a>
                              </div>
                            ) : (
                              <p className="text-muted-foreground text-xs">—</p>
                            )}
                            {order.ghnReturnOrderCode && (
                              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border">
                                <span className="text-muted-foreground text-xs">Hoàn trả:</span>
                                <span className="font-mono text-foreground text-xs">{order.ghnReturnOrderCode}</span>
                                <a
                                  href={`${GHN_TRACKING_URL}${order.ghnReturnOrderCode}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-blue-600 hover:underline text-xs"
                                >
                                  <IconExternalLink className="h-3 w-3" />
                                  Theo dõi
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Thông tin hoàn tiền (returned / refunded) */}
                        {(order.status === "returned" || order.status === "refunded") && (
                          <div className="mt-4 p-3 rounded-xl bg-background border border-border">
                            <p className="text-xs font-semibold text-muted-foreground mb-2">Thông tin ngân hàng hoàn tiền</p>
                            {order.refundBankInfo?.buyerAccountNumber ? (
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                                <p><span className="text-muted-foreground">Ngân hàng:</span> <span className="font-semibold text-foreground">{order.refundBankInfo.buyerBankName ?? "—"}</span></p>
                                <p><span className="text-muted-foreground">Số TK:</span> <span className="font-mono font-semibold text-foreground">{order.refundBankInfo.buyerAccountNumber}</span></p>
                                <p><span className="text-muted-foreground">Chủ TK:</span> <span className="font-semibold text-foreground">{order.refundBankInfo.buyerAccountHolder ?? "—"}</span></p>
                              </div>
                            ) : (
                              <p className="text-muted-foreground text-sm">Người mua chưa cung cấp STK</p>
                            )}
                            {order.status === "returned" && (
                              <button
                                type="button"
                                onClick={() => onCompleteRefund(order._id)}
                                disabled={isCompletingRefund}
                                className="mt-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                {isCompletingRefund ? "Đang xử lý..." : "Xử lý hoàn tiền"}
                              </button>
                            )}
                            {order.status === "refunded" && (
                              <span className="inline-block mt-2 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold">
                                Đã hoàn tiền
                              </span>
                            )}
                          </div>
                        )}
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


