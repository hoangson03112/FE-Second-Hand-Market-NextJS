"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";
import { BUYER_ORDER_TABS } from "@/constants/orderStatus";
import { useOrders, PAGE_SIZE } from "./hooks/useOrders";
import { OrdersHeader } from "./components/OrdersHeader";
import { OrdersTabs } from "./components/OrdersTabs";
import { OrdersEmpty } from "./components/OrdersEmpty";
import { OrdersSearch } from "./components/OrdersSearch";
import { OrderCard } from "./components/OrderCard";
import { microCaps } from "@/features/order/components";
import { CancelOrderReasonDialog } from "@/features/order/components";
import { RefundModal } from "@/features/order/components";
import { ListSkeleton, Pagination } from "@/components/ui";

/** Centered ivory state used for the auth / initial-load screens. */
function OrdersPlaceholder({
  title,
  subtitle,
  spinner = false,
}: {
  title: string;
  subtitle?: string;
  spinner?: boolean;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-luxury-ivory px-4">
      <div className="flex flex-col items-center gap-5 text-center">
        {spinner ? (
          <span className="h-4 w-4 animate-spin rounded-full border border-luxury-ink/20 border-t-luxury-ink" />
        ) : null}
        <p className="text-2xs font-bold uppercase tracking-[0.24em] text-neutral-500">
          {title}
        </p>
        {subtitle ? (
          <p className="max-w-xs text-sm leading-relaxed text-neutral-600">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default function Orders() {
  const router = useRouter();
  const {
    account,
    userLoading,
    isRedirectingAuth,
    orders,
    filteredOrders,
    paginatedOrders,
    currentPage,
    totalPages,
    setCurrentPage,
    isLoading,
    activeTab,
    setActiveTab,
    tabCounts,
    searchQuery,
    setSearchQuery,
    cancellingId,
    cancelTargetOrder,
    openCancelDialog,
    closeCancelDialog,
    confirmCancelOrder,
    confirmingId,
    handleConfirmReceived,
    refundTargetOrder,
    refundReason,
    refundDescription,
    refundImages,
    refundVideos,
    isSubmittingRefund,
    openRefundModal,
    closeRefundModal,
    handleSubmitRefund,
    setRefundReason,
    setRefundDescription,
    setRefundImages,
    setRefundVideos,
    bankName,
    setBankName,
    accountNumber,
    setAccountNumber,
    accountHolder,
    setAccountHolder,
  } = useOrders();

  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    const frame = window.requestAnimationFrame(() => setIsRevealed(true));
    return () => window.cancelAnimationFrame(frame);
  }, [isLoading]);

  if (userLoading) {
    return <OrdersPlaceholder title="Đang tải" spinner />;
  }

  if (isRedirectingAuth || !account) {
    return (
      <OrdersPlaceholder
        title="Cần đăng nhập"
        subtitle="Vui lòng đăng nhập để xem đơn hàng. Đang chuyển hướng tới trang đăng nhập…"
      />
    );
  }

  const revealClass = cn(
    "transition-all duration-700 ease-out",
    isRevealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
  );

  return (
    <>
      <div className="min-h-screen">
        <OrdersHeader
          onBack={() => router.back()}
          totalCount={orders.length}
          actionCount={tabCounts.action ?? 0}
        />

        {/* The tab strip is the one control that must stay reachable while the
            list scrolls, so it sticks on its own rather than dragging the
            editorial header along with it. */}
        <div className="sticky top-0 z-20 border-b border-luxury-ink/10 bg-luxury-ivory/95 backdrop-blur-md">
          <OrdersTabs
            tabs={BUYER_ORDER_TABS}
            counts={tabCounts}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        <Container maxWidth="9xl" paddingX="md" paddingY="lg">
          {orders.length > 0 ? (
            <OrdersSearch
              value={searchQuery}
              onChange={setSearchQuery}
              resultCount={filteredOrders.length}
            />
          ) : null}

          {isLoading ? (
            <ListSkeleton className="py-6" rows={4} />
          ) : filteredOrders.length === 0 ? (
            <div className={revealClass}>
              <OrdersEmpty
                activeTab={activeTab}
                tabs={BUYER_ORDER_TABS}
                searchQuery={searchQuery}
              />
            </div>
          ) : (
            <div className="space-y-5">
              {paginatedOrders.map((order, index) => (
                <div
                  key={order._id}
                  className={revealClass}
                  style={{ transitionDelay: `${Math.min(index, 6) * 60}ms` }}
                >
                  <OrderCard
                    order={order}
                    cancellingId={cancellingId}
                    onCancel={openCancelDialog}
                    confirmingId={confirmingId}
                    onConfirmReceived={handleConfirmReceived}
                    onOpenRefund={openRefundModal}
                  />
                </div>
              ))}

              {/* Pagination footer */}
              <div className="flex flex-col items-center gap-6 border-t border-luxury-ink/6 pt-8">
                <p className={cn(microCaps, "tabular-nums text-neutral-500")}>
                  Hiển thị{" "}
                  <span className="text-luxury-ink">
                    {(currentPage - 1) * PAGE_SIZE + 1}–
                    {Math.min(currentPage * PAGE_SIZE, filteredOrders.length)}
                  </span>{" "}
                  trong{" "}
                  <span className="text-luxury-ink">
                    {filteredOrders.length}
                  </span>{" "}
                  đơn hàng
                </p>

                {totalPages > 1 ? (
                  <Pagination
                    variant="luxury"
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                ) : null}
              </div>
            </div>
          )}
        </Container>
      </div>

      <CancelOrderReasonDialog
        isOpen={Boolean(cancelTargetOrder)}
        onConfirm={confirmCancelOrder}
        onCancel={closeCancelDialog}
        isLoading={Boolean(cancellingId)}
        orderCode={cancelTargetOrder?._id.slice(-8).toUpperCase()}
      />
      <RefundModal
        open={Boolean(refundTargetOrder)}
        reason={refundReason}
        description={refundDescription}
        images={refundImages}
        videos={refundVideos}
        isSubmitting={isSubmittingRefund}
        onReasonChange={setRefundReason}
        onDescriptionChange={setRefundDescription}
        onImagesChange={setRefundImages}
        onVideosChange={setRefundVideos}
        onSubmit={handleSubmitRefund}
        onClose={closeRefundModal}
        bankName={bankName}
        setBankName={setBankName}
        accountNumber={accountNumber}
        setAccountNumber={setAccountNumber}
        accountHolder={accountHolder}
        setAccountHolder={setAccountHolder}
      />
    </>
  );
}
