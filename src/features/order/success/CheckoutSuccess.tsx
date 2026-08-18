"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IconArrowUpRight } from "@tabler/icons-react";
import { Container, PageContainer } from "@/components/layout/Container";
import { cn } from "@/lib/utils";
import {
  FAILED_STATUSES,
  useCheckoutSuccess,
} from "./hooks/useCheckoutSuccess";
import SuccessHero from "./components/SuccessHero";
import OrderProgressTrail from "./components/OrderProgressTrail";
import OrderItemsPanel from "./components/OrderItemsPanel";
import PaymentBreakdown from "./components/PaymentBreakdown";
import OrderMetaPanel from "./components/OrderMetaPanel";

export default function CheckoutSuccess() {
  const {
    orderId,
    order,
    isLoading,
    isConfirmingReceived,
    handleConfirmReceived,
    isLocalPickup,
    progressSteps,
    effectiveStepIndex,
    isTerminalFailed,
  } = useCheckoutSuccess();

  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    const frame = window.requestAnimationFrame(() => setIsRevealed(true));
    return () => window.cancelAnimationFrame(frame);
  }, [isLoading]);

  if (isLoading) {
    return (
      <PageContainer
        withBackground={false}
        className="flex min-h-screen items-center justify-center bg-luxury-ivory"
      >
        <div className="flex flex-col items-center gap-5">
          <span className="h-4 w-4 animate-spin rounded-full border border-luxury-ink/20 border-t-luxury-ink" />
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-neutral-500">
            Đang tải đơn hàng
          </p>
        </div>
      </PageContainer>
    );
  }

  if (!order) {
    return (
      <PageContainer
        withBackground={false}
        className="flex min-h-screen items-center justify-center bg-luxury-ivory px-4"
      >
        <div className="w-full max-w-md rounded-[2px] border border-dashed border-luxury-ink/15 bg-white px-8 py-14 text-center">
          <h1
            className="font-droid-serif text-xl tracking-tight text-luxury-ink"
          >
            Không tìm thấy đơn hàng
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">
            Đơn hàng này không tồn tại hoặc bạn không có quyền xem.
          </p>
          <Link
            href="/orders"
            className="group mt-8 inline-flex items-center gap-2 rounded-[2px] bg-luxury-ink px-7 py-3.5 text-[10px] font-bold uppercase tracking-[0.22em] text-luxury-ivory transition-all duration-300 hover:bg-charcoal-800"
          >
            Xem tất cả đơn hàng
            <IconArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </PageContainer>
    );
  }

  const revealClass = cn(
    "transition-all duration-700 ease-out",
    isRevealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
  );
  const delay = (ms: number) => ({ transitionDelay: `${ms}ms` });

  return (
    <PageContainer
      withBackground={false}
      className="min-h-screen bg-luxury-ivory"
    >
      <Container as="main" maxWidth="9xl" paddingX="md" paddingY="lg">
        <div className="space-y-6">
          <div style={delay(60)} className={revealClass}>
            <SuccessHero
              orderCode={order._id.slice(-10).toUpperCase()}
              orderId={orderId ?? order._id}
              showConfirmReceived={order.status === "delivered"}
              isConfirmingReceived={isConfirmingReceived}
              onConfirmReceived={handleConfirmReceived}
            />
          </div>

          <div style={delay(160)} className={revealClass}>
            <OrderProgressTrail
              steps={progressSteps}
              currentIndex={effectiveStepIndex}
              failedNotice={
                isTerminalFailed ? FAILED_STATUSES[order.status] : null
              }
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-7 xl:col-span-8">
              <div style={delay(240)} className={revealClass}>
                <OrderItemsPanel order={order} />
              </div>
              <div style={delay(320)} className={revealClass}>
                <PaymentBreakdown order={order} isLocalPickup={isLocalPickup} />
              </div>
            </div>

            <div className="lg:col-span-5 xl:col-span-4">
              <div
                style={delay(400)}
                className={cn(revealClass, "lg:sticky lg:top-8")}
              >
                <OrderMetaPanel
                  order={order}
                  orderId={orderId ?? order._id}
                  isLocalPickup={isLocalPickup}
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </PageContainer>
  );
}
