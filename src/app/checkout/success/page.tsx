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
  { key: "pending", label: "Chá» xÃ¡c nháº­n", shortLabel: "Chá» xÃ¡c nháº­n" },
  { key: "confirmed", label: "ÄÃ£ xÃ¡c nháº­n", shortLabel: "ÄÃ£ xÃ¡c nháº­n" },
  { key: "picked_up", label: "ÄÃ£ láº¥y hÃ ng", shortLabel: "ÄÃ£ láº¥y" },
  { key: "shipping", label: "Äang váº­n chuyá»ƒn", shortLabel: "Váº­n chuyá»ƒn" },
  { key: "out_for_delivery", label: "Äang giao hÃ ng", shortLabel: "Äang giao" },
  { key: "delivered", label: "ÄÃ£ giao hÃ ng", shortLabel: "ÄÃ£ giao" },
  { key: "completed", label: "HoÃ n táº¥t", shortLabel: "HoÃ n táº¥t" },
];

const LOCAL_PICKUP_PROGRESS_STEPS = [
  { key: "pending", label: "Chá» xÃ¡c nháº­n", shortLabel: "Chá» xÃ¡c nháº­n" },
  { key: "confirmed", label: "ÄÃ£ xÃ¡c nháº­n", shortLabel: "ÄÃ£ xÃ¡c nháº­n" },
  { key: "delivered", label: "ÄÃ£ giao hÃ ng", shortLabel: "ÄÃ£ giao" },
  { key: "completed", label: "HoÃ n táº¥t", shortLabel: "HoÃ n táº¥t" },
];

const FAILED_STATUSES: Record<string, string> = {
  failed: "ÄÆ¡n hÃ ng giao tháº¥t báº¡i",
  returned: "ÄÆ¡n hÃ ng Ä‘Ã£ hoÃ n tráº£",
  cancelled: "ÄÆ¡n hÃ ng Ä‘Ã£ bá»‹ há»§y",
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
      <p className="text-muted-foreground">KhÃ´ng thá»ƒ táº£i thÃ´ng tin Ä‘Æ¡n hÃ ng.</p>
      <Link href="/orders" className="px-4 py-2 rounded-xl bg-foreground text-background text-sm">Xem táº¥t cáº£ Ä‘Æ¡n hÃ ng</Link>
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
      toast.success("ÄÃ£ xÃ¡c nháº­n nháº­n hÃ ng thÃ nh cÃ´ng.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "KhÃ´ng thá»ƒ xÃ¡c nháº­n nháº­n hÃ ng.");
    } finally {
      setIsConfirmingReceived(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-6 sm:py-8 px-3 sm:px-4">
      <div className="max-w-8xl mx-auto w-full space-y-4 sm:space-y-5">
        <div className="bg-cream-50 border border-border rounded-2xl p-4 sm:p-6 lg:p-7">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-secondary/60 border border-border flex items-center justify-center shrink-0">
                <IconCircleCheck className="w-6 h-6 sm:w-7 sm:h-7 text-primary" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-foreground leading-tight">Äáº·t hÃ ng thÃ nh cÃ´ng!</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  MÃ£ Ä‘Æ¡n: <span className="font-mono text-foreground font-medium select-all">#{order._id.slice(-10).toUpperCase()}</span>
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
                  {isConfirmingReceived ? "Äang xá»­ lÃ½..." : "ÄÃ£ nháº­n Ä‘Æ°á»£c hÃ ng"}
                </button>
              )}
              <Link
                href="/"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:bg-cream-50 transition-colors"
              >
                <IconHome className="w-4 h-4" />
                Trang chá»§
              </Link>
              <Link
                href={`/orders/${orderId}`}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-foreground text-sm font-medium text-background hover:bg-foreground/90 transition-colors"
              >
                Xem Ä‘Æ¡n hÃ ng
                <IconChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-cream-50 border border-border rounded-2xl p-4 sm:p-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Tiáº¿n trÃ¬nh Ä‘Æ¡n hÃ ng</p>
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
            Tráº¡ng thÃ¡i hiá»‡n táº¡i: <span className="font-semibold text-foreground">{progressSteps[effectiveStepIndex]?.label || "Äang xá»­ lÃ½"}</span>
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
                <span className="text-sm font-semibold text-foreground">Sáº£n pháº©m Ä‘Ã£ Ä‘áº·t</span>
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
                          alt={p?.name ?? "Sáº£n pháº©m"}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-medium text-foreground line-clamp-2 leading-snug">
                          {p?.name ?? "Sáº£n pháº©m"}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Sá»‘ lÆ°á»£ng: {item.quantity}</p>
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
                <span className="text-sm font-semibold text-foreground">Chi tiáº¿t thanh toÃ¡n</span>
                <span className="text-xs text-muted-foreground">{order.products?.length || 0} sáº£n pháº©m</span>
              </div>
              <div className="px-4 sm:px-5 py-4 space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tiá»n hÃ ng</span>
                  <span>{formatPrice(order.productAmount ?? 0)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>PhÃ­ váº­n chuyá»ƒn</span>
                  <span>{isLocalPickup ? "Miá»…n phÃ­" : formatPrice(order.shippingFee ?? 0)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-foreground pt-2 border-t border-border mt-2">
                  <span>Tá»•ng cá»™ng</span>
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
                      <p className="text-xs text-muted-foreground mb-0.5">NgÆ°á»i bÃ¡n</p>
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
                        {isLocalPickup ? "ThÃ´ng tin liÃªn há»‡" : "Giao Ä‘áº¿n"}
                      </p>
                      {isLocalPickup ? (
                        <p className="text-sm text-muted-foreground">
                          NgÆ°á»i bÃ¡n vÃ  ngÆ°á»i mua tá»± thá»a thuáº­n Ä‘á»‹a Ä‘iá»ƒm gáº·p máº·t
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
                    <p className="text-xs text-muted-foreground mb-0.5">Thanh toÃ¡n</p>
                    <p className="text-sm font-medium text-foreground">
                      {order.paymentMethod === "bank_transfer"
                        ? "Chuyá»ƒn khoáº£n ngÃ¢n hÃ ng"
                        : isLocalPickup
                          ? "Thanh toÃ¡n khi gáº·p máº·t"
                          : "Thanh toÃ¡n khi nháº­n hÃ ng (COD)"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 sm:p-5">
                  <IconCalendar className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Thá»i gian Ä‘áº·t hÃ ng</p>
                    <p className="text-sm font-medium text-foreground">{orderedAt}</p>
                  </div>
                </div>
                {expectedDelivery && (
                  <div className="flex items-center gap-3 p-4 sm:p-5">
                  <IconClockHour4 className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Dá»± kiáº¿n giao</p>
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
                  Xem chi tiáº¿t Ä‘Æ¡n hÃ ng
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
              {isConfirmingReceived ? "Äang xá»­ lÃ½..." : "ÄÃ£ nháº­n hÃ ng"}
            </button>
          )}
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:bg-cream-50 transition-colors"
          >
            <IconHome className="w-4 h-4" />
            Trang chá»§
          </Link>
          <Link
            href={`/orders/${orderId}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-foreground text-sm font-medium text-background hover:bg-foreground/90 transition-colors"
          >
            Xem Ä‘Æ¡n hÃ ng
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
