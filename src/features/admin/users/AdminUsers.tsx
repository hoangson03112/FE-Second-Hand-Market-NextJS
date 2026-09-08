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
import UsersTable from "./components/UsersTable";
import type { AdminAccount } from "@/types/admin";

const selectClass =
  "px-3 py-2 text-2xs font-medium uppercase tracking-[0.1em] border border-luxury-ink/15 rounded-[2px] bg-white text-luxury-ink focus:outline-none focus:border-luxury-ink";

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
    <div className="space-y-6">
      <PageHeader
        eyebrow="Quản lý thành viên"
        title="Quản lý người dùng"
        description="Tra cứu danh sách tài khoản khách hàng, người bán và quản trị viên trong hệ sinh thái Eco Market."
        badge={
          totalItems > 0 ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-[2px] text-2xs font-bold uppercase tracking-[0.16em] bg-cream-50 text-luxury-ink border border-luxury-ink/10">
              {totalItems} tài khoản
            </span>
          ) : null
        }
        actions={
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Tìm theo tên, email, SĐT..."
            containerClassName="w-full sm:w-72"
          />
        }
      />

      <StatsCards totalUsers={totalItems} recent7Days={recent7Days} />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 rounded-[2px] border border-luxury-ink/10 bg-white px-4 py-2.5">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
          className={selectClass}
        >
          <option value="all">Vai trò: Tất cả</option>
          <option value="buyer">Người mua</option>
          <option value="seller">Người bán (Seller)</option>
          <option value="admin">Quản trị viên</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as typeof statusFilter)
          }
          className={selectClass}
        >
          <option value="">Trạng thái: Tất cả</option>
          <option value="active">Đang hoạt động</option>
          <option value="inactive">Chưa kích hoạt</option>
          <option value="banned">Đang bị khóa</option>
        </select>
      </div>

      {hasNoAccounts ? (
        <NoData
          icon={<IconUsers className="w-10 h-10 text-neutral-400" />}
          title="Chưa có tài khoản nào"
          description="Hệ thống chưa ghi nhận người dùng nào."
        />
      ) : hasNoFiltered ? (
        <NoData
          icon={<IconSearch className="w-10 h-10 text-neutral-400" />}
          title="Không tìm thấy người dùng phù hợp"
          description="Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh bộ lọc."
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
        <DialogContent className="rounded-[2px] border border-luxury-ink/10 bg-white">
          <DialogHeader>
            <DialogTitle className="font-droid-serif text-lg text-luxury-ink">
              Khóa tài khoản
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500">
              Tài khoản{" "}
              <strong className="text-luxury-ink font-semibold">
                {banModal?.fullName ?? banModal?.email}
              </strong>{" "}
              sẽ không thể đăng nhập.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
              Lý do{" "}
              <span className="text-neutral-400 lowercase font-normal">
                (tùy chọn)
              </span>
            </Label>
            <Textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              rows={3}
              className="rounded-[2px] border border-luxury-ink/15 bg-cream-50/50 text-xs text-luxury-ink focus:border-luxury-ink"
              placeholder="VD: Vi phạm chính sách cộng đồng"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={closeBan}
              className="rounded-[2px] border border-luxury-ink/15 text-2xs font-bold uppercase tracking-[0.12em] text-luxury-ink hover:bg-taupe-50"
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              disabled={isUpdating}
              onClick={handleConfirmBan}
              className="rounded-[2px] bg-blush-700 hover:bg-blush-800 text-2xs font-bold uppercase tracking-[0.12em]"
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
