"use client";

import { useEffect, useState } from "react";
import { IconSearch, IconUsers } from "@tabler/icons-react";

import { useToast, Pagination, Loading } from "@/components/ui";
import {
  ErrorState,
  NoData,
  PageHeader,
  SearchInput,
} from "@/features/admin/components";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAdminUsers } from "./hooks/useAdminUsers";
import StatsCards from "./components/StatsCards";
import AccountStatusTabs from "./components/AccountStatusTabs";
import RoleTabs from "./components/RoleTabs";
import UsersTable from "./components/UsersTable";
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

  const closeBan = () => {
    setBanModal(null);
    setBanReason("");
  };
  const handleConfirmBan = async () => {
    if (!banModal) return;
    try {
      await handleBan(banModal._id, banReason.trim() || undefined);
      toast.success("Đã khóa tài khoản.");
      closeBan();
    } catch {
      toast.error("Không thể khóa tài khoản.");
    }
  };
  const handleUnbanClick = async (acc: AdminAccount) => {
    try {
      await handleUnban(acc._id);
      toast.success("Đã mở khóa tài khoản.");
    } catch {
      toast.error("Không thể mở khóa tài khoản.");
    }
  };

  if (isLoading) {
    return <Loading fullscreen label="Đang tải danh sách người dùng..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Không tải được danh sách người dùng."
        description="Vui lòng thử lại sau."
      />
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Người dùng"
        description="Danh sách tài khoản (Account). Lọc theo vai trò bên dưới."
        actions={
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Tìm theo tên, email, SĐT..."
            containerClassName="w-full sm:w-64"
          />
        }
      />

      <StatsCards totalUsers={totalItems} recent7Days={recent7Days} />

      <RoleTabs activeRole={roleFilter} onRoleChange={setRoleFilter} />
      <AccountStatusTabs
        activeStatus={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {hasNoAccounts ? (
        <NoData icon={<IconUsers />} title="Chưa có tài khoản nào." size="sm" />
      ) : hasNoFiltered ? (
        <NoData
          icon={<IconSearch />}
          title="Không tìm thấy người dùng phù hợp."
          size="sm"
        />
      ) : (
        <>
          <UsersTable
            accounts={accounts}
            isUpdating={isUpdating}
            onBan={setBanModal}
            onUnban={handleUnbanClick}
          />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            className="mt-4"
          />
        </>
      )}

      <Dialog
        open={!!banModal}
        onOpenChange={(open) => {
          if (!open) closeBan();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Khóa tài khoản</DialogTitle>
            <DialogDescription>
              Tài khoản{" "}
              <strong className="text-foreground">
                {banModal?.fullName ?? banModal?.email}
              </strong>{" "}
              sẽ không thể đăng nhập.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label>
              Lý do{" "}
              <span className="text-xs text-muted-foreground">(tùy chọn)</span>
            </Label>
            <Textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              rows={3}
              placeholder="VD: Vi phạm chính sách cộng đồng"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeBan}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              disabled={isUpdating}
              onClick={handleConfirmBan}
            >
              {isUpdating && <Loader2 className="size-4 animate-spin mr-2" />}
              Khóa tài khoản
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

