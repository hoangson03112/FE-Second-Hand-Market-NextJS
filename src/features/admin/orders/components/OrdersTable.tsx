import { OrderStatusBadge } from "@/features/order/components";
import { RefundDetailCard } from "@/features/order/detail/components/RefundDetailCard";
import {
  IconBan,
  IconBuildingStore,
  IconChevronDown,
  IconChevronUp,
  IconCreditCard,
  IconExternalLink,
  IconHistory,
  IconMapPin,
  IconPackage,
  IconTruck,
  IconUser,
} from "@tabler/icons-react";
import { useConfirm } from "@/components/ui";
import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/format/price";
import { format } from "@/utils/format/date";
import { getOrderStatusLabel } from "@/constants/orderStatus";
import type { AdminOrder } from "@/types/admin";
import {} from "@/components/ui";
import { AvatarOrInitials } from "@/components/ui/AvatarOrInitials";

const GHN_TRACKING_URL = "https://tracking.ghn.dev/?order_code=";

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  cod: "COD (Thanh toán khi nhận)",
  bank_transfer: "Chuyển khoản",
};

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  pending: "Chưa thanh toán",
  paid: "Đã thanh toán",
  refunded: "Đã hoàn tiền",
};

const cardLabel =
  "text-2xs font-bold uppercase tracking-[0.15em] text-neutral-500 mb-2 flex items-center gap-1.5";

function formatShippingAddress(
  addr: Record<string, unknown> | string | null | undefined,
): { fullName?: string; phone?: string; address?: string } | null {
  if (!addr || typeof addr === "string") return null;
  const a = addr as Record<string, unknown>;
  const fullName = typeof a.fullName === "string" ? a.fullName : undefined;
  const phone = typeof a.phoneNumber === "string" ? a.phoneNumber : undefined;
  const parts = [a.specificAddress, a.ward, a.district, a.province].filter(
    (x): x is string => typeof x === "string" && x.length > 0,
  );
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
  const { confirm } = useConfirm();
  return (
    <div className="rounded-[2px] border border-luxury-ink/10 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-luxury-ink/10 bg-cream-50/70">
              <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                Mã / Ngày đặt
              </th>
              <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600 hidden sm:table-cell">
                Người mua
              </th>
              <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                Tổng tiền
              </th>
              <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                Trạng thái
              </th>
              <th className="text-right px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600 w-24">
                Chi tiết
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: AdminOrder) => {
              const isExpanded = expandedId === order._id;
              return (
                <Fragment key={order._id}>
                  <tr className="border-b border-luxury-ink/6 last:border-0 hover:bg-taupe-50/40 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-bold text-xs text-neutral-500">
                        {order._id.slice(-8)}
                      </span>
                      <br />
                      <span className="text-xs text-neutral-500">
                        {order.createdAt ? format(order.createdAt) : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <AvatarOrInitials
                          avatar={order.buyerId?.avatar}
                          fullName={order.buyerId?.fullName}
                          size={28}
                        />
                        <div>
                          <span className="text-luxury-ink">
                            {order.buyerId?.fullName ?? "—"}
                          </span>
                          <br />
                          <span className="text-xs text-neutral-500">
                            {order.buyerId?.email ?? ""}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-droid-serif font-bold text-luxury-ink tabular-nums text-sm">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onToggleExpanded(order._id)}
                        className="p-1.5 rounded-[2px] border border-luxury-ink/10 text-luxury-ink hover:bg-taupe-50"
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
                    <tr className="bg-cream-50/40">
                      <td colSpan={5} className="px-4 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                          <div className="p-3.5 rounded-[2px] bg-white border border-luxury-ink/10">
                            <p className={cardLabel}>
                              <IconPackage className="w-3.5 h-3.5" /> Sản phẩm
                            </p>
                            <ul className="space-y-1.5">
                              {order.products?.map((p, i) => {
                                const productName =
                                  typeof p.productId === "object" &&
                                  p.productId !== null &&
                                  "name" in p.productId
                                    ? (p.productId as { name: string }).name
                                    : null;
                                return (
                                  <li
                                    key={`${order._id}-${i}`}
                                    className="flex items-center justify-between gap-2 text-luxury-ink"
                                  >
                                    <span>
                                      {productName != null
                                        ? `${productName} × ${p.quantity}`
                                        : `Sản phẩm #${i + 1} × ${p.quantity}`}
                                    </span>
                                    {typeof p.price === "number" && (
                                      <span className="shrink-0 tabular-nums text-neutral-500">
                                        {formatPrice(p.price * p.quantity)}
                                      </span>
                                    )}
                                  </li>
                                );
                              }) ?? <li className="text-neutral-400">—</li>}
                            </ul>
                          </div>

                          <div className="p-3.5 rounded-[2px] bg-white border border-luxury-ink/10 space-y-1">
                            <p className={cardLabel}>
                              <IconUser className="w-3.5 h-3.5" /> Người mua
                            </p>
                            <p className="font-semibold text-luxury-ink">
                              {order.buyerId?.fullName ?? "—"}
                            </p>
                            <p className="text-neutral-500">
                              {order.buyerId?.email ?? "—"}
                            </p>
                            <p className="text-neutral-500">
                              {order.buyerId?.phoneNumber ?? "—"}
                            </p>
                          </div>

                          <div className="p-3.5 rounded-[2px] bg-white border border-luxury-ink/10 space-y-1">
                            <p className={cardLabel}>
                              <IconBuildingStore className="w-3.5 h-3.5" />{" "}
                              Người bán
                            </p>
                            <p className="font-semibold text-luxury-ink">
                              {order.sellerId?.fullName ?? "—"}
                            </p>
                            <p className="text-neutral-500">
                              {order.sellerId?.email ?? "—"}
                            </p>
                            <p className="text-neutral-500">
                              {order.sellerId?.phoneNumber ?? "—"}
                            </p>
                            {order.sellerId?.seller?.businessAddress && (
                              <p className="text-neutral-500">
                                {order.sellerId.seller.businessAddress}
                              </p>
                            )}
                            {order.sellerId?.seller?.verificationStatus && (
                              <span className="inline-block mt-1 px-2 py-0.5 bg-cream-50 border border-luxury-ink/10 rounded-[2px] text-2xs font-bold uppercase tracking-[0.1em] text-luxury-ink">
                                {order.sellerId.seller.verificationStatus}
                              </span>
                            )}
                          </div>

                          <div className="p-3.5 rounded-[2px] bg-white border border-luxury-ink/10">
                            <p className={cardLabel}>
                              <IconMapPin className="w-3.5 h-3.5" /> Địa chỉ
                              giao hàng
                            </p>
                            {(() => {
                              const addr = formatShippingAddress(
                                order.shippingAddress,
                              );
                              if (!addr)
                                return (
                                  <p className="text-neutral-400 text-xs">
                                    Chưa có địa chỉ
                                  </p>
                                );
                              return (
                                <div className="text-luxury-ink text-xs space-y-0.5">
                                  {(addr.fullName || addr.phone) && (
                                    <p className="font-semibold">
                                      {[addr.fullName, addr.phone]
                                        .filter(Boolean)
                                        .join(" • ")}
                                    </p>
                                  )}
                                  {addr.address && (
                                    <p className="text-neutral-500">
                                      {addr.address}
                                    </p>
                                  )}
                                </div>
                              );
                            })()}
                          </div>

                          <div className="p-3.5 rounded-[2px] bg-white border border-luxury-ink/10 space-y-2">
                            <p className={cn(cardLabel, "mb-0")}>
                              <IconTruck className="w-3.5 h-3.5" /> Vận chuyển
                              & GHN
                            </p>
                            <p className="text-neutral-500">
                              Phương thức:{" "}
                              <span className="font-semibold text-luxury-ink">
                                {order.shippingMethod ?? "—"}
                              </span>
                            </p>
                            {order.expectedDeliveryTime && (
                              <p className="text-neutral-500">
                                Dự kiến giao:{" "}
                                <span className="font-semibold text-luxury-ink">
                                  {format(order.expectedDeliveryTime)}
                                </span>
                              </p>
                            )}
                            {order.ghnOrderCode ? (
                              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-luxury-ink/8">
                                <span className="font-mono text-luxury-ink font-medium">
                                  {order.ghnOrderCode}
                                </span>
                                {order.ghnStatus && (
                                  <span className="text-neutral-500">
                                    ({order.ghnStatus})
                                  </span>
                                )}
                                <a
                                  href={`${GHN_TRACKING_URL}${order.ghnOrderCode}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-accent hover:underline font-semibold"
                                >
                                  <IconExternalLink className="h-3 w-3" />
                                  Theo dõi
                                </a>
                              </div>
                            ) : (
                              <p className="text-neutral-400 pt-2 border-t border-luxury-ink/8">
                                Chưa có vận đơn GHN
                              </p>
                            )}
                            {order.ghnReturnOrderCode && (
                              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-luxury-ink/8">
                                <span className="text-neutral-500">
                                  Hoàn trả:
                                </span>
                                <span className="font-mono text-luxury-ink font-medium">
                                  {order.ghnReturnOrderCode}
                                </span>
                                <a
                                  href={`${GHN_TRACKING_URL}${order.ghnReturnOrderCode}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-accent hover:underline font-semibold"
                                >
                                  <IconExternalLink className="h-3 w-3" />
                                  Theo dõi
                                </a>
                              </div>
                            )}
                          </div>

                          <div className="p-3.5 rounded-[2px] bg-white border border-luxury-ink/10 space-y-1">
                            <p className={cardLabel}>
                              <IconCreditCard className="w-3.5 h-3.5" /> Thanh
                              toán & Chi phí
                            </p>
                            <p className="text-neutral-500">
                              {PAYMENT_METHOD_LABEL[order.paymentMethod ?? ""] ??
                                order.paymentMethod ??
                                "—"}{" "}
                              ·{" "}
                              <span className="font-semibold text-luxury-ink">
                                {PAYMENT_STATUS_LABEL[
                                  order.paymentStatus ?? ""
                                ] ?? "—"}
                              </span>
                            </p>
                            <div className="pt-2 mt-1 border-t border-luxury-ink/8 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-neutral-500">
                                  Tiền hàng
                                </span>
                                <span className="tabular-nums text-luxury-ink">
                                  {formatPrice(order.productAmount ?? 0)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-neutral-500">
                                  Phí vận chuyển
                                </span>
                                <span className="tabular-nums text-luxury-ink">
                                  {formatPrice(order.shippingFee ?? 0)}
                                </span>
                              </div>
                              {(order.platformFee ?? 0) > 0 && (
                                <div className="flex items-center justify-between">
                                  <span className="text-neutral-500">
                                    Phí nền tảng
                                  </span>
                                  <span className="tabular-nums text-luxury-ink">
                                    {formatPrice(order.platformFee ?? 0)}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center justify-between pt-1 border-t border-luxury-ink/8 font-bold">
                                <span className="text-luxury-ink">
                                  Tổng cộng
                                </span>
                                <span className="tabular-nums text-luxury-ink">
                                  {formatPrice(order.totalAmount)}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-2 mt-1 border-t border-luxury-ink/8">
                              <span className="text-neutral-500">
                                Payout người bán
                              </span>
                              <span
                                className={cn(
                                  "font-bold",
                                  order.payoutStatus === "paid"
                                    ? "text-accent"
                                    : "text-neutral-500",
                                )}
                              >
                                {order.payoutStatus === "paid"
                                  ? "Đã giải ngân"
                                  : "Chưa giải ngân"}
                                {order.payoutAt &&
                                  ` · ${format(order.payoutAt)}`}
                              </span>
                            </div>
                          </div>
                        </div>

                        {order.statusHistory &&
                          order.statusHistory.length > 0 && (
                            <div className="mt-3.5 p-3.5 rounded-[2px] bg-white border border-luxury-ink/10">
                              <p className={cn(cardLabel, "mb-2.5")}>
                                <IconHistory className="w-3.5 h-3.5" /> Lịch sử
                                trạng thái
                              </p>
                              <ol className="flex flex-wrap gap-x-6 gap-y-2">
                                {order.statusHistory.map((h, i) => (
                                  <li
                                    key={i}
                                    className="flex items-center gap-2"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-luxury-ink/40 shrink-0" />
                                    <span className="font-semibold text-luxury-ink">
                                      {getOrderStatusLabel(h.status)}
                                    </span>
                                    <span className="text-neutral-400">
                                      {format(h.updatedAt)}
                                    </span>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          )}

                        {order.cancelReason &&
                          order.status === "cancelled" && (
                            <div className="mt-3.5 p-3.5 rounded-[2px] bg-blush-50 border border-blush-200">
                              <p className="text-2xs font-bold uppercase tracking-[0.15em] text-blush-700 flex items-center gap-1.5 mb-1">
                                <IconBan className="w-3.5 h-3.5" /> Lý do huỷ
                                đơn
                              </p>
                              <p className="text-blush-800">
                                {order.cancelReason}
                              </p>
                            </div>
                          )}

                        {order.refundRequestId && (
                          <div className="mt-3.5">
                            <RefundDetailCard refund={order.refundRequestId} />
                          </div>
                        )}

                        {(order.status === "returned" ||
                          order.status === "refunded") && (
                          <div className="mt-3.5 p-3.5 rounded-[2px] bg-white border border-luxury-ink/10">
                            <p className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-500 mb-2">
                              Thông tin ngân hàng hoàn tiền (người mua)
                            </p>
                            {order.refundBankInfo?.buyerAccountNumber ? (
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                                <p>
                                  <span className="text-neutral-500">
                                    Ngân hàng:
                                  </span>{" "}
                                  <span className="font-bold text-luxury-ink">
                                    {order.refundBankInfo.buyerBankName ?? "—"}
                                  </span>
                                </p>
                                <p>
                                  <span className="text-neutral-500">
                                    Số tài khoản:
                                  </span>{" "}
                                  <span className="font-mono font-bold text-luxury-ink">
                                    {order.refundBankInfo.buyerAccountNumber ??
                                      "—"}
                                  </span>
                                </p>
                                <p>
                                  <span className="text-neutral-500">
                                    Chủ tài khoản:
                                  </span>{" "}
                                  <span className="font-bold text-luxury-ink">
                                    {order.refundBankInfo.buyerAccountHolder ??
                                      "—"}
                                  </span>
                                </p>
                              </div>
                            ) : (
                              <p className="text-xs text-neutral-400">
                                Người mua chưa cung cấp thông tin tài khoản hoàn
                                tiền
                              </p>
                            )}
                            {order.status === "refunded" && (
                              <span className="inline-block mt-2 px-2 py-0.5 bg-cream-50 text-accent border border-accent/30 rounded-[2px] text-2xs font-bold uppercase tracking-[0.1em]">
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
