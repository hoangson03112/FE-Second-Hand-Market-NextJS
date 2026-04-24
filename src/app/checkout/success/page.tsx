"use client";

import {
  IconCircleCheck,
  IconPackage,
  IconHome,
  IconTruck,
  IconCalendar,
  IconCreditCard,
  IconMapPin,
  IconChevronRight,
  IconClockHour4,
  IconUser,
} from "@tabler/icons-react";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { OrderService } from "@/services/order.service";
import { useToast } from "@/components/shared";
import type { Order } from "@/types/order";
import { formatPrice } from "@/utils/format/price";
import Link from "next/link";
import Image from "next/image";

const ORDER_PROGRESS_STEPS = [
  { key: "pending", label: "Chờ xác nhận", shortLabel: "Chờ xác nhận" },
  { key: "confirmed", label: "Đã xác nhận", shortLabel: "Đã xác nhận" },
  { key: "picked_up", label: "Đã lấy hàng", shortLabel: "Đã lấy" },
  { key: "shipping", label: "Đang vận chuyển", shortLabel: "Vận chuyển" },
  { key: "out_for_delivery", label: "Đang giao hàng", shortLabel: "Đang giao" },
  { key: "delivered", label: "Đã giao hàng", shortLabel: "Đã giao" },
  { key: "completed", label: "Hoàn tất", shortLabel: "Hoàn tất" },
];

const LOCAL_PICKUP_PROGRESS_STEPS = [
  { key: "pending", label: "Chờ xác nhận", shortLabel: "Chờ xác nhận" },
  { key: "confirmed", label: "Đã xác nhận", shortLabel: "Đã xác nhận" },
  { key: "delivered", label: "Đã giao hàng", shortLabel: "Đã giao" },
  { key: "completed", label: "Hoàn tất", shortLabel: "Hoàn tất" },
];

const FAILED_STATUSES: Record<string, string> = {
  failed: "Đơn hàng giao thất bại",
  returned: "Đơn hàng đã hoàn trả",
  cancelled: "Đơn hàng đã bị hủy",
};

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmingReceived, setIsConfirmingReceived] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!orderId) { router.push("/checkout"); return; }
    OrderService.getById(orderId)
      .then((r) => setOrder(r.order ?? null))
      .catch(() => setOrder(null))
      .finally(() => setIsLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }
  if (!order) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <p className="text-muted-foreground">Không thể tải thông tin đơn hàng.</p>
      <Link href="/orders" className="px-4 py-2 rounded-xl bg-foreground text-background text-sm">Xem tất cả đơn hàng</Link>
    </div>
  );

  const addr = order.shippingAddress;
  const fullAddress = [addr?.specificAddress, addr?.ward, addr?.district, addr?.province]
    .filter(Boolean)
    .join(", ");

  const isLocalPickup = order.shippingMethod === "local_pickup";
  const progressSteps = isLocalPickup ? LOCAL_PICKUP_PROGRESS_STEPS : ORDER_PROGRESS_STEPS;
  const currentStepIndex = progressSteps.findIndex(
    (step) => step.key === order.status
  );
  const effectiveStepIndex = currentStepIndex >= 0 ? currentStepIndex : 0;
  const isTerminalFailed = Object.keys(FAILED_STATUSES).includes(order.status);

  const orderedAt = new Date(order.createdAt).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const expectedDelivery = order.expectedDeliveryTime
    ? new Date(order.expectedDeliveryTime).toLocaleDateString("vi-VN", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
      })
    : null;

  const handleConfirmReceived = async () => {
    if (!order || order.status !== "delivered") return;
    setIsConfirmingReceived(true);
    try {
      await OrderService.confirmReceived(order._id);
      setOrder((prev) => (prev ? { ...prev, status: "completed" } : prev));
      toast.success("Đã xác nhận nhận hàng thành công.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể xác nhận nhận hàng.");
    } finally {
      setIsConfirmingReceived(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-6 sm:py-8 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto w-full space-y-4 sm:space-y-5">
        <div className="bg-cream-50 border border-border rounded-2xl p-4 sm:p-6 lg:p-7">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-secondary/60 border border-border flex items-center justify-center shrink-0">
                <IconCircleCheck className="w-6 h-6 sm:w-7 sm:h-7 text-primary" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-foreground leading-tight">Đặt hàng thành công!</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Mã đơn: <span className="font-mono text-foreground font-medium select-all">#{order._id.slice(-10).toUpperCase()}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {order.status === "delivered" && (
                <button
                  type="button"
                  onClick={handleConfirmReceived}
                  disabled={isConfirmingReceived}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {isConfirmingReceived ? "Đang xử lý..." : "Đã nhận được hàng"}
                </button>
              )}
              <Link
                href="/"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:bg-cream-50 transition-colors"
              >
                <IconHome className="w-4 h-4" />
                Trang chủ
              </Link>
              <Link
                href={`/orders/${orderId}`}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-foreground text-sm font-medium text-background hover:bg-foreground/90 transition-colors"
              >
                Xem đơn hàng
                <IconChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-cream-50 border border-border rounded-2xl p-4 sm:p-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Tiến trình đơn hàng</p>
          <div className="flex items-center overflow-x-auto pb-1">
            {progressSteps.map((step, i) => {
              const isDone = i < effectiveStepIndex;
              const isActive = i === effectiveStepIndex;
              return (
                <div key={step.key} className="flex items-center flex-1 last:flex-none min-w-[84px]">
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      isDone
                        ? "bg-primary border-primary"
                        : isActive
                          ? "bg-primary border-primary"
                          : "bg-card border-border"
                    }`}>
                      {isDone ? (
                        <IconCircleCheck className="w-4 h-4 text-white" strokeWidth={2} />
                      ) : isActive ? (
                        <IconTruck className="w-4 h-4 text-white" strokeWidth={2} />
                      ) : (
                        <IconPackage className="w-4 h-4 text-border" strokeWidth={2} />
                      )}
                    </div>
                    <span
                      className={`text-[10px] text-center leading-tight w-14 sm:w-16 ${
                        isDone
                          ? "text-primary font-medium"
                          : isActive
                            ? "text-primary font-medium"
                            : "text-neutral-400"
                      }`}
                    >
                      {step.shortLabel}
                    </span>
                  </div>
                  {i < progressSteps.length - 1 && (
                    <div className={`flex-1 h-0.5 mb-5 mx-1 ${i < effectiveStepIndex ? "bg-primary/50" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Trạng thái hiện tại: <span className="font-semibold text-foreground">{progressSteps[effectiveStepIndex]?.label || "Đang xử lý"}</span>
          </p>
          {isTerminalFailed && (
            <p className="mt-2 text-xs font-medium text-destructive">
              {FAILED_STATUSES[order.status]}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          <div className="lg:col-span-7 xl:col-span-8 space-y-4 sm:space-y-5">
            <div className="bg-cream-50 border border-border rounded-2xl overflow-hidden">
              <div className="px-4 sm:px-5 py-3 border-b border-border flex items-center gap-2">
                <IconPackage className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Sản phẩm đã đặt</span>
              </div>
              <div className="divide-y divide-border">
                {order.products?.map((item, i) => {
                  const p = item.productId;
                  const avatar = typeof p?.avatar === "string" ? p.avatar : p?.avatar?.url;
                  const imageUrl = avatar || p?.images?.[0]?.url || "/images/product-placeholder.svg";

                  return (
                    <div key={i} className="flex gap-3 sm:gap-4 p-4 sm:p-5">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-primary/8 shrink-0 border border-border">
                        <Image
                          src={imageUrl}
                          alt={p?.name ?? "Sản phẩm"}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-medium text-foreground line-clamp-2 leading-snug">
                          {p?.name ?? "Sản phẩm"}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Số lượng: {item.quantity}</p>
                        <p className="text-sm sm:text-base font-semibold text-primary mt-1.5">
                          {formatPrice(item.price ?? p?.price ?? 0)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-cream-50 border border-border rounded-2xl overflow-hidden">
              <div className="px-4 sm:px-5 py-3 border-b border-border flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Chi tiết thanh toán</span>
                <span className="text-xs text-muted-foreground">{order.products?.length || 0} sản phẩm</span>
              </div>
              <div className="px-4 sm:px-5 py-4 space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tiền hàng</span>
                  <span>{formatPrice(order.productAmount ?? 0)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Phí vận chuyển</span>
                  <span>{isLocalPickup ? "Miễn phí" : formatPrice(order.shippingFee ?? 0)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-foreground pt-2 border-t border-border mt-2">
                  <span>Tổng cộng</span>
                  <span className="text-primary text-lg">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-cream-50 border border-border rounded-2xl overflow-hidden lg:sticky lg:top-24">
              <div className="divide-y divide-border">
                {order.sellerId && (
                  <div className="flex items-start gap-3 p-4 sm:p-5">
                    <IconUser className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Người bán</p>
                      <Link
                        href={`/seller/${order.sellerId._id}`}
                        className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        {order.sellerId.fullName}
                      </Link>
                      {order.sellerId.phoneNumber && (
                        <p className="text-xs text-muted-foreground mt-0.5">{order.sellerId.phoneNumber}</p>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3 p-4 sm:p-5">
                  <IconMapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                      <p className="text-xs text-muted-foreground mb-0.5">
                        {isLocalPickup ? "Thông tin liên hệ" : "Giao đến"}
                      </p>
                      {isLocalPickup ? (
                        <p className="text-sm text-muted-foreground">
                          Người bán và người mua tự thỏa thuận địa điểm gặp mặt
                        </p>
                      ) : (
                        <>
                          <p className="text-sm font-semibold text-foreground">{addr?.fullName}</p>
                          <p className="text-sm text-muted-foreground">{addr?.phoneNumber}</p>
                          {fullAddress && <p className="text-xs text-muted-foreground mt-0.5">{fullAddress}</p>}
                        </>
                      )}
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 sm:p-5">
                  <IconCreditCard className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Thanh toán</p>
                    <p className="text-sm font-medium text-foreground">
                      {order.paymentMethod === "bank_transfer"
                        ? "Chuyển khoản ngân hàng"
                        : isLocalPickup
                          ? "Thanh toán khi gặp mặt"
                          : "Thanh toán khi nhận hàng (COD)"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 sm:p-5">
                  <IconCalendar className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Thời gian đặt hàng</p>
                    <p className="text-sm font-medium text-foreground">{orderedAt}</p>
                  </div>
                </div>
                {expectedDelivery && (
                  <div className="flex items-center gap-3 p-4 sm:p-5">
                  <IconClockHour4 className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Dự kiến giao</p>
                    <p className="text-sm font-medium text-foreground">{expectedDelivery}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-5 border-t border-border bg-cream-50">
                <Link
                  href={`/orders/${orderId}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-foreground text-sm font-medium text-background hover:bg-foreground/90 transition-colors"
                >
                  Xem chi tiết đơn hàng
                  <IconChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden flex gap-3 pb-4">
          {order.status === "delivered" && (
            <button
              type="button"
              onClick={handleConfirmReceived}
              disabled={isConfirmingReceived}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isConfirmingReceived ? "Đang xử lý..." : "Đã nhận hàng"}
            </button>
          )}
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:bg-cream-50 transition-colors"
          >
            <IconHome className="w-4 h-4" />
            Trang chủ
          </Link>
          <Link
            href={`/orders/${orderId}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-foreground text-sm font-medium text-background hover:bg-foreground/90 transition-colors"
          >
            Xem đơn hàng
            <IconChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
