"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CancelOrderReasonDialog,
  microCaps,
} from "@/features/order/components";
import { ReturnInspectionModal } from "@/features/seller/components";
import {
  ConfirmWithReasonDialog,
  ListSkeleton,
  Pagination,
} from "@/components/ui";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";
import { PAGE_SIZE, useSellerOrders } from "./hooks/useSellerOrders";
import OrderTabs from "./components/OrderTabs";
import EmptyOrderState from "./components/EmptyOrderState";
import SellerOrdersHeader from "./components/SellerOrdersHeader";
import OrdersToolbar from "./components/OrdersToolbar";
import OrderRowList from "./components/OrderRowList";
import OrderDetailPanel from "./components/OrderDetailPanel";

/** Centered ivory state used while the session resolves. */
function SellerOrdersPlaceholder({
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
        <p className={cn(microCaps, "text-neutral-500")}>{title}</p>
        {subtitle ? (
          <p className="max-w-xs text-sm leading-relaxed text-neutral-600">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default function SellerOrders() {
  const router = useRouter();
  const {
    account,
    userLoading,
    isLoading,
    activeTab,
    setActiveTab,
    filteredOrders,
    paginatedOrders,
    page,
    totalPages,
    setPage,
    updatingId,
    stats,
    tabCounts,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    dateFilter,
    setDateFilter,
    imageErrorMap,
    handleImageError,
    handleUpdateStatus,
    handleApproveRefund,
    handleRejectRefund,
    handleConfirmReturnReceived,
  } = useSellerOrders();

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [rejectRefundOpen, setRejectRefundOpen] = useState(false);
  // Seller must inspect the returned parcel before the refund can proceed.
  const [inspectionOrderId, setInspectionOrderId] = useState<string | null>(
    null,
  );
  const [isRevealed, setIsRevealed] = useState(false);

  const pageStart =
    filteredOrders.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const pageEnd = Math.min(page * PAGE_SIZE, filteredOrders.length);

  const selectedOrder = useMemo(
    () =>
      (selectedOrderId
        ? paginatedOrders.find((o) => o._id === selectedOrderId)
        : null) ||
      paginatedOrders[0] ||
      null,
    [selectedOrderId, paginatedOrders],
  );

  useEffect(() => {
    if (!selectedOrderId && paginatedOrders[0]) {
      setSelectedOrderId(paginatedOrders[0]._id);
      return;
    }
    if (
      selectedOrderId &&
      paginatedOrders.length > 0 &&
      !paginatedOrders.some((o) => o._id === selectedOrderId)
    ) {
      setSelectedOrderId(paginatedOrders[0]._id);
    }
  }, [selectedOrderId, paginatedOrders]);

  useEffect(() => {
    if (isLoading) return;
    const frame = window.requestAnimationFrame(() => setIsRevealed(true));
    return () => window.cancelAnimationFrame(frame);
  }, [isLoading]);

  if (userLoading) {
    return <SellerOrdersPlaceholder title="Đang tải" spinner />;
  }

  if (!account) return null;

  const isSelectedUpdating = selectedOrder
    ? updatingId === selectedOrder._id
    : false;

  const revealClass = cn(
    "transition-all duration-700 ease-out",
    isRevealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
  );

  return (
    <>
      <div className="min-h-screen bg-luxury-ivory">
        <SellerOrdersHeader onBack={() => router.back()} stats={stats} />

        {/* The tab strip is the one control that must stay reachable while the
            queue scrolls, so it sticks on its own rather than dragging the
            editorial header along with it. */}
        <div className="sticky top-0 z-20 border-b border-luxury-ink/10 bg-luxury-ivory/95 backdrop-blur-md">
          <OrderTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabCounts={tabCounts}
          />
        </div>

        <Container maxWidth="9xl" paddingX="md" paddingY="lg">
          <OrdersToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            resultCount={filteredOrders.length}
          />

          {isLoading ? (
            <ListSkeleton className="py-6" rows={4} />
          ) : filteredOrders.length === 0 ? (
            <div className={revealClass}>
              <EmptyOrderState activeTab={activeTab} />
            </div>
          ) : (
            <div className="grid items-start gap-8 xl:grid-cols-[1.5fr_1fr]">
              <div className={cn("space-y-8", revealClass)}>
                <OrderRowList
                  orders={paginatedOrders}
                  selectedOrderId={selectedOrder?._id ?? null}
                  onSelect={setSelectedOrderId}
                />

                <div className="flex flex-col items-center gap-6 border-t border-luxury-ink/6 pt-8">
                  <p className={cn(microCaps, "tabular-nums text-neutral-500")}>
                    Hiển thị{" "}
                    <span className="text-luxury-ink">
                      {pageStart}–{pageEnd}
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
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                    />
                  ) : null}
                </div>
              </div>

              <div className={revealClass} style={{ transitionDelay: "80ms" }}>
                <OrderDetailPanel
                  order={selectedOrder}
                  isUpdating={isSelectedUpdating}
                  imageErrorMap={imageErrorMap}
                  onImageError={handleImageError}
                  onConfirmOrder={(orderId) =>
                    handleUpdateStatus(orderId, "confirmed")
                  }
                  onCancelOrder={() => setCancelOpen(true)}
                  onApproveRefund={handleApproveRefund}
                  onRejectRefund={() => setRejectRefundOpen(true)}
                  onConfirmReturn={setInspectionOrderId}
                />
              </div>
            </div>
          )}
        </Container>
      </div>

      {selectedOrder ? (
        <CancelOrderReasonDialog
          isOpen={cancelOpen}
          orderCode={selectedOrder._id.slice(-8).toUpperCase()}
          isLoading={isSelectedUpdating}
          onCancel={() => setCancelOpen(false)}
          onConfirm={(reason) => {
            setCancelOpen(false);
            handleUpdateStatus(selectedOrder._id, "cancelled", reason);
          }}
        />
      ) : null}

      {selectedOrder ? (
        <ConfirmWithReasonDialog
          isOpen={rejectRefundOpen}
          title="Từ chối yêu cầu hoàn tiền"
          description={`Đơn #${selectedOrder._id.slice(-8).toUpperCase()}`}
          reasonLabel="Lý do từ chối"
          reasonPlaceholder="Mô tả lý do từ chối để buyer nắm được."
          reasonHint="Buyer sẽ nhận nội dung lý do này."
          confirmText="Xác nhận từ chối"
          variant="danger"
          isLoading={isSelectedUpdating}
          onCancel={() => setRejectRefundOpen(false)}
          onConfirm={(reason) => {
            setRejectRefundOpen(false);
            handleRejectRefund(selectedOrder._id, reason);
          }}
        />
      ) : null}

      <ReturnInspectionModal
        isOpen={inspectionOrderId !== null}
        submitting={updatingId === inspectionOrderId}
        onClose={() => setInspectionOrderId(null)}
        onSubmit={async (payload) => {
          if (!inspectionOrderId) return;
          await handleConfirmReturnReceived(inspectionOrderId, payload);
          setInspectionOrderId(null);
        }}
      />
    </>
  );
}
