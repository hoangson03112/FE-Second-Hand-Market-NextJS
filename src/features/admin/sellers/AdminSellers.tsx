"use client";

import { IconBuildingStore, IconLoader2 } from "@tabler/icons-react";
import { Pagination } from "@/components/ui";
import { useAdminSellers } from "./hooks/useAdminSellers";
import StatsBadges from "./components/StatsBadges";
import StatusTabs from "./components/StatusTabs";
import SellersTable from "./components/SellersTable";
import SellerDetailModal from "./components/SellerDetailModal";
import { NoData, PageHeader, ErrorState } from "@/features/admin/components";

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
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <IconLoader2 className="h-9 w-9 animate-spin text-luxury-ink" />
          <p className="text-2xs font-bold uppercase tracking-[0.2em] text-neutral-500">
            Đang tải danh sách seller...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Không tải được danh sách seller"
        description="Vui lòng kiểm tra quyền đăng nhập tài khoản quản trị viên."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Thẩm định người bán"
        title="Quản lý Người bán (Seller)"
        description="Thẩm định thông tin CCCD, thông tin ngân hàng và phê duyệt quyền đăng bán sản phẩm."
        badge={
          statistics?.total != null ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-[2px] text-2xs font-bold uppercase tracking-[0.16em] bg-cream-50 text-luxury-ink border border-luxury-ink/10">
              {statistics.total} seller
            </span>
          ) : null
        }
      />

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
        <NoData
          icon={<IconBuildingStore className="w-10 h-10 text-neutral-400" />}
          title="Không có hồ sơ seller nào"
          description="Không tìm thấy người bán nào theo điều kiện lọc hiện tại."
        />
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

