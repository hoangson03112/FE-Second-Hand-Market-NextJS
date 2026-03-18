"use client";

import { IconLoader2 } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { useAdminUsers } from "./hooks/useAdminUsers";
import StatsCards from "./components/StatsCards";
import SearchBar from "./components/SearchBar";
import AccountStatusTabs from "./components/AccountStatusTabs";
import RoleTabs from "./components/RoleTabs";
import UsersTable from "./components/UsersTable";
import EmptyState from "./components/EmptyState";
import Pagination from "@/components/ui/Pagination";
import type { AdminAccount } from "@/types/admin";

export default function AdminUsers() {
  const {
    accounts,
    isLoading,
    error,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    totalItems,
    statusFilter,
    setStatusFilter,
    roleFilter,
    setRoleFilter,
    handleBan,
    handleUnban,
    isUpdating,
  } = useAdminUsers();
  const toast = useToast();
  const [recent7Days, setRecent7Days] = useState(0);
  const [banModal, setBanModal] = useState<AdminAccount | null>(null);
  const [banReason, setBanReason] = useState("");

  useEffect(() => {
    if (!accounts.length) {
      setRecent7Days(0);
      return;
    }
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    const count = accounts.filter((acc) => {
      if (!acc.createdAt) return false;
      return new Date(acc.createdAt) >= sevenDaysAgo;
    }).length;
    setRecent7Days(count);
  }, [accounts]);

  const hasNoAccounts = !totalItems && !isLoading;
  const hasNoFiltered = !accounts.length && !!search.trim();

  const onBanClick = (acc: AdminAccount) => setBanModal(acc);
  const onConfirmBan = async () => {
    if (!banModal) return;
    try {
      await handleBan(banModal._id, banReason.trim() || undefined);
      toast.success("Đã khóa tài khoản.");
      setBanModal(null);
      setBanReason("");
    } catch {
      toast.error("Không thể khóa tài khoản.");
    }
  };
  const onUnbanClick = async (acc: AdminAccount) => {
    try {
      await handleUnban(acc._id);
      toast.success("Đã mở khóa tài khoản.");
    } catch {
      toast.error("Không thể mở khóa tài khoản.");
    }
  };

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
        Không tải được danh sách người dùng.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Người dùng</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Danh sách tài khoản (Account). Lọc theo vai trò bên dưới.
          </p>
        </div>

        <SearchBar value={search} onChange={setSearch} />
      </div>

      <StatsCards totalUsers={totalItems} recent7Days={recent7Days} />

      <RoleTabs activeRole={roleFilter} onRoleChange={setRoleFilter} />
      <AccountStatusTabs
        activeStatus={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {hasNoAccounts ? (
        <EmptyState type="no-accounts" />
      ) : hasNoFiltered ? (
        <EmptyState type="no-results" />
      ) : (
        <>
          <UsersTable
            accounts={accounts}
            isUpdating={isUpdating}
            onBan={onBanClick}
            onUnban={onUnbanClick}
          />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            className="mt-4"
          />
        </>
      )}

      {banModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-base font-bold text-foreground mb-4">Khóa tài khoản</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Tài khoản <strong>{banModal.fullName ?? banModal.email}</strong> sẽ không thể đăng
              nhập.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Lý do <span className="text-muted-foreground text-xs">(tùy chọn)</span>
              </label>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-xl border border-border bg-muted/30 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm text-foreground resize-none"
                placeholder="VD: Vi phạm chính sách cộng đồng"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setBanModal(null);
                  setBanReason("");
                }}
                className="flex-1 py-2 px-4 border border-border text-foreground rounded-xl text-sm font-medium hover:bg-muted transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={onConfirmBan}
                disabled={isUpdating}
                className="flex-1 py-2 px-4 bg-destructive text-destructive-foreground rounded-xl text-sm font-semibold hover:bg-destructive/90 disabled:opacity-50 transition-colors"
              >
                {isUpdating ? (
                  <IconLoader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  "Khóa tài khoản"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


