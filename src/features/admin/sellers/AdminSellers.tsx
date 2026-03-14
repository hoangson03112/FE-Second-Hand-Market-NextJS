"use client";

import { IconLoader2 } from "@tabler/icons-react";
import Pagination from "@/components/ui/Pagination";
import { useAdminSellers } from "./hooks/useAdminSellers";
import StatsBadges from "./components/StatsBadges";
import StatusTabs from "./components/StatusTabs";
import SellersTable from "./components/SellersTable";
import SellerDetailModal from "./components/SellerDetailModal";
import EmptyState from "./components/EmptyState";

export default function AdminSellers() {
  const {
    sellers,
    statistics,
    totalPages,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    selectedSeller,
    rejectReason,
    setRejectReason,
    isUpdating,
    handleApprove,
    handleReject,
    handleBan,
    openSeller,
    closeSeller,
  } = useAdminSellers();

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        Không tải được danh sách seller.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-foreground">Seller</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Duyệt và quản lý tài khoản seller
        </p>
      </div>

      {statistics && (
        <StatsBadges
          total={statistics.total}
          pending={statistics.pending}
          approved={statistics.approved}
          rejected={statistics.rejected}
          banned={statistics.banned}
        />
      )}

      <StatusTabs
        activeStatus={statusFilter}
        onStatusChange={(status) => {
          setStatusFilter(status);
          setPage(1);
        }}
      />

      {sellers.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <SellersTable
            sellers={sellers}
            isUpdating={isUpdating}
            onApprove={handleApprove}
            onOpenDetail={openSeller}
            onOpenBan={openSeller}
          />

          {totalPages > 1 && (
            <div className="flex justify-center pt-2">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}

      {selectedSeller && (
        <SellerDetailModal
          seller={selectedSeller}
          rejectReason={rejectReason}
          isUpdating={isUpdating}
          onRejectReasonChange={setRejectReason}
          onApprove={() => handleApprove(selectedSeller)}
          onReject={() => handleReject(selectedSeller)}
          onBan={() => handleBan(selectedSeller)}
          onClose={closeSeller}
        />
      )}
    </div>
  );
}


