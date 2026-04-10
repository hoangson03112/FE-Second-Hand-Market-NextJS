"use client";

import { IconLoader2 } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { useOrders, ORDER_TABS, PAGE_SIZE } from "./hooks/useOrders";
import { OrdersHeader } from "./components/OrdersHeader";
import { OrdersTabs } from "./components/OrdersTabs";
import { OrdersEmpty } from "./components/OrdersEmpty";
import { OrderCard } from "./components/OrderCard";
import { CancelOrderReasonDialog } from "@/components/ui/CancelOrderReasonDialog";
import { RefundModal } from "./components/RefundModal";
import Pagination from "@/components/ui/Pagination";

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
  } = useOrders();

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-cream-50/30 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-neutral-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (isRedirectingAuth || !account) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-cream-50/30 to-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-700 font-medium">Vui long dang nhap de xem don hang</p>
          <p className="text-sm text-neutral-500 mt-2">Dang chuyen huong toi trang dang nhap...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background via-cream-50/30 to-background">
        <OrdersHeader onBack={() => router.back()} />
        <OrdersTabs
          tabs={ORDER_TABS}
          orders={orders}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* Content */}
        <Container maxWidth="7xl" paddingX="md" paddingY="lg">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="text-center">
                <IconLoader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-neutral-600">Đang tải đơn hàng...</p>
              </div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <OrdersEmpty activeTab={activeTab} tabs={ORDER_TABS} />
          ) : (
            <div className="space-y-4">
              {paginatedOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  cancellingId={cancellingId}
                  onCancel={openCancelDialog}
                  confirmingId={confirmingId}
                  onConfirmReceived={handleConfirmReceived}
                  onOpenRefund={openRefundModal}
                />
              ))}

              {/* Pagination footer */}
              {filteredOrders.length > 0 && (
                <div className="flex flex-col items-center gap-4 pt-4 pb-2 border-t border-border/50">
                  {/* Page info */}
                  <p className="text-xs text-muted-foreground tabular-nums">
                    Hiển thị{" "}
                    <span className="font-medium text-foreground">
                      {(currentPage - 1) * PAGE_SIZE + 1}–
                      {Math.min(currentPage * PAGE_SIZE, filteredOrders.length)}
                    </span>{" "}
                    trong{" "}
                    <span className="font-medium text-foreground">
                      {filteredOrders.length}
                    </span>{" "}
                    đơn hàng
                  </p>

                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </div>
              )}
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
        show={Boolean(refundTargetOrder)}
        refundReason={refundReason}
        refundDescription={refundDescription}
        refundImages={refundImages}
        refundVideos={refundVideos}
        isSubmitting={isSubmittingRefund}
        onReasonChange={setRefundReason}
        onDescriptionChange={setRefundDescription}
        onImagesChange={setRefundImages}
        onVideosChange={setRefundVideos}
        onSubmit={handleSubmitRefund}
        onClose={closeRefundModal}
      />
    </>
  );
}
