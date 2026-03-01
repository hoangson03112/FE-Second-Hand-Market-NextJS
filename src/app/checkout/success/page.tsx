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
} from "@tabler/icons-react";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { OrderService } from "@/services/order.service";
import type { Order } from "@/types/order";
import { formatPrice } from "@/utils/format/price";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/components/ui/Toast";

const ORDER_PROGRESS_STEPS = [
  { key: "pending", label: "Chờ xác nhận", shortLabel: "Chờ xác nhận" },
  { key: "confirmed", label: "Đã xác nhận", shortLabel: "Đã xác nhận" },
  { key: "picked_up", label: "Đã lấy hàng", shortLabel: "Đã lấy" },
  { key: "shipping", label: "Đang vận chuyển", shortLabel: "Vận chuyển" },
  { key: "out_for_delivery", label: "Đang giao hàng", shortLabel: "Đang giao" },
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
  const toast = useToast();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orderId) { router.push("/checkout"); return; }
    OrderService.getById(orderId)
      .then((r) => setOrder(r.order))
      .catch(() => { toast.error("Không thể tải thông tin đơn hàng"); router.push("/checkout"); })
      .finally(() => setIsLoading(false));
  }, [orderId, router, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }
  if (!order) return null;

  const addr = order.shippingAddress;
  const fullAddress = [addr?.specificAddress, addr?.ward, addr?.district, addr?.province]
    .filter(Boolean)
    .join(", ");

  const currentStepIndex = ORDER_PROGRESS_STEPS.findIndex(
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

  return (
    <div className="min-h-screen bg-[#FDFAF6] py-6 sm:py-8 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-5">
        <div className="bg-white border border-[#EDE0D4] rounded-2xl p-4 sm:p-6 lg:p-7">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center shrink-0">
                <IconCircleCheck className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-[#1A1714] leading-tight">Đặt hàng thành công!</h1>
                <p className="text-sm text-[#7A6755] mt-0.5">
                  Mã đơn: <span className="font-mono text-[#1A1714] font-medium select-all">#{order._id.slice(-10).toUpperCase()}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#D5C4B5] bg-white text-sm font-medium text-[#7A6755] hover:bg-[#FDFAF6] transition-colors"
              >
                <IconHome className="w-4 h-4" />
                Trang chủ
              </Link>
              <Link
                href={`/orders/${orderId}`}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1A1714] text-sm font-medium text-white hover:bg-[#2a221b] transition-colors"
              >
                Xem đơn hàng
                <IconChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#EDE0D4] rounded-2xl p-4 sm:p-5">
          <p className="text-xs font-semibold text-[#7A6755] uppercase tracking-wider mb-4">Tiến trình đơn hàng</p>
          <div className="flex items-center overflow-x-auto pb-1">
            {ORDER_PROGRESS_STEPS.map((step, i) => {
              const isDone = i < effectiveStepIndex;
              const isActive = i === effectiveStepIndex;
              return (
                <div key={step.key} className="flex items-center flex-1 last:flex-none min-w-[84px]">
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      isDone
                        ? "bg-green-500 border-green-500"
                        : isActive
                          ? "bg-[#C47B5A] border-[#C47B5A]"
                          : "bg-white border-[#D5C4B5]"
                    }`}>
                      {isDone ? (
                        <IconCircleCheck className="w-4 h-4 text-white" strokeWidth={2} />
                      ) : isActive ? (
                        <IconTruck className="w-4 h-4 text-white" strokeWidth={2} />
                      ) : (
                        <IconPackage className="w-4 h-4 text-[#D5C4B5]" strokeWidth={2} />
                      )}
                    </div>
                    <span
                      className={`text-[10px] text-center leading-tight w-14 sm:w-16 ${
                        isDone
                          ? "text-green-600 font-medium"
                          : isActive
                            ? "text-[#C47B5A] font-medium"
                            : "text-[#B0A090]"
                      }`}
                    >
                      {step.shortLabel}
                    </span>
                  </div>
                  {i < ORDER_PROGRESS_STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mb-5 mx-1 ${i < effectiveStepIndex ? "bg-green-300" : "bg-[#EDE0D4]"}`} />
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-[#7A6755]">
            Trạng thái hiện tại: <span className="font-semibold text-[#1A1714]">{ORDER_PROGRESS_STEPS[effectiveStepIndex]?.label || "Đang xử lý"}</span>
          </p>
          {isTerminalFailed && (
            <p className="mt-2 text-xs font-medium text-red-600">
              {FAILED_STATUSES[order.status]}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          <div className="lg:col-span-7 xl:col-span-8 space-y-4 sm:space-y-5">
            <div className="bg-white border border-[#EDE0D4] rounded-2xl overflow-hidden">
              <div className="px-4 sm:px-5 py-3 border-b border-[#EDE0D4] flex items-center gap-2">
                <IconPackage className="w-4 h-4 text-[#C47B5A]" />
                <span className="text-sm font-semibold text-[#1A1714]">Sản phẩm đã đặt</span>
              </div>
              <div className="divide-y divide-[#F5E6D8]">
                {order.products?.map((item, i) => {
                  const p = item.productId;
                  const avatar = typeof p?.avatar === "string" ? p.avatar : p?.avatar?.url;
                  const imageUrl = avatar || p?.images?.[0]?.url || "/images/product-placeholder.svg";

                  return (
                    <div key={i} className="flex gap-3 sm:gap-4 p-4 sm:p-5">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-[#F5E6D8] shrink-0 border border-[#EDE0D4]">
                        <Image
                          src={imageUrl}
                          alt={p?.name ?? "Sản phẩm"}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-medium text-[#1A1714] line-clamp-2 leading-snug">
                          {p?.name ?? "Sản phẩm"}
                        </p>
                        <p className="text-xs sm:text-sm text-[#7A6755] mt-1">Số lượng: {item.quantity}</p>
                        <p className="text-sm sm:text-base font-semibold text-[#C47B5A] mt-1.5">
                          {formatPrice(item.price ?? p?.price ?? 0)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white border border-[#EDE0D4] rounded-2xl overflow-hidden">
              <div className="px-4 sm:px-5 py-3 border-b border-[#EDE0D4] flex items-center justify-between">
                <span className="text-sm font-semibold text-[#1A1714]">Chi tiết thanh toán</span>
                <span className="text-xs text-[#7A6755]">{order.products?.length || 0} sản phẩm</span>
              </div>
              <div className="px-4 sm:px-5 py-4 space-y-2">
                <div className="flex justify-between text-sm text-[#7A6755]">
                  <span>Tiền hàng</span>
                  <span>{formatPrice(order.productAmount ?? 0)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#7A6755]">
                  <span>Phí vận chuyển</span>
                  <span>{formatPrice(order.shippingFee ?? 0)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-[#1A1714] pt-2 border-t border-[#EDE0D4] mt-2">
                  <span>Tổng cộng</span>
                  <span className="text-[#C47B5A] text-lg">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white border border-[#EDE0D4] rounded-2xl overflow-hidden lg:sticky lg:top-24">
              <div className="divide-y divide-[#F5E6D8]">
                <div className="flex items-start gap-3 p-4 sm:p-5">
                  <IconMapPin className="w-4 h-4 text-[#C47B5A] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-[#7A6755] mb-0.5">Giao đến</p>
                    <p className="text-sm font-semibold text-[#1A1714]">{addr?.fullName}</p>
                    <p className="text-sm text-[#7A6755]">{addr?.phoneNumber}</p>
                    {fullAddress && <p className="text-xs text-[#7A6755] mt-0.5">{fullAddress}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 sm:p-5">
                  <IconCreditCard className="w-4 h-4 text-[#C47B5A] shrink-0" />
                  <div>
                    <p className="text-xs text-[#7A6755] mb-0.5">Thanh toán</p>
                    <p className="text-sm font-medium text-[#1A1714]">
                      {order.paymentMethod === "cod" ? "Thanh toán khi nhận hàng (COD)" : "Chuyển khoản ngân hàng"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 sm:p-5">
                  <IconCalendar className="w-4 h-4 text-[#C47B5A] shrink-0" />
                  <div>
                    <p className="text-xs text-[#7A6755] mb-0.5">Thời gian đặt hàng</p>
                    <p className="text-sm font-medium text-[#1A1714]">{orderedAt}</p>
                  </div>
                </div>
                {expectedDelivery && (
                  <div className="flex items-center gap-3 p-4 sm:p-5">
                    <IconClockHour4 className="w-4 h-4 text-[#C47B5A] shrink-0" />
                    <div>
                      <p className="text-xs text-[#7A6755] mb-0.5">Dự kiến giao</p>
                      <p className="text-sm font-medium text-[#1A1714]">{expectedDelivery}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-5 border-t border-[#EDE0D4] bg-white">
                <Link
                  href={`/orders/${orderId}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#1A1714] text-sm font-medium text-white hover:bg-[#2a221b] transition-colors"
                >
                  Xem chi tiết đơn hàng
                  <IconChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden flex gap-3 pb-4">
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#D5C4B5] bg-white text-sm font-medium text-[#7A6755] hover:bg-[#FDFAF6] transition-colors"
          >
            <IconHome className="w-4 h-4" />
            Trang chủ
          </Link>
          <Link
            href={`/orders/${orderId}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#1A1714] text-sm font-medium text-white hover:bg-[#2a221b] transition-colors"
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
