"use client";

import { useEffect, useMemo, useState } from "react";
import { Users, Loader2, Search } from "lucide-react";
import { format } from "@/utils/format/date";
import type { AdminAccount } from "@/types/admin";
import { useAdminUsers } from "./hooks/useAdminUsers";

const ROLE_LABELS: Record<string, string> = {
  admin: "Quản trị viên",
  seller: "Người bán",
  buyer: "Người mua",
};

const ROLE_BADGE_STYLES: Record<string, { className: string }> = {
  admin: {
    className:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200",
  },
  seller: {
    className:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  },
  buyer: {
    className:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  },
};

function getRoleLabel(role?: string) {
  if (!role) return "Người mua";
  return ROLE_LABELS[role] ?? role;
}

function getRoleBadgeClass(role?: string) {
  if (!role) return ROLE_BADGE_STYLES.buyer.className;
  return ROLE_BADGE_STYLES[role]?.className ?? "bg-muted text-muted-foreground";
}

export default function AdminUsers() {
  const { accounts, isLoading, error } = useAdminUsers();
  const [search, setSearch] = useState("");
  const [recent7Days, setRecent7Days] = useState(0);

  const totalUsers = accounts.length;

  // Tính số user mới 7 ngày gần đây chỉ trên client để tránh lệch SSR/CSR
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
      const created = new Date(acc.createdAt);
      return created >= sevenDaysAgo;
    }).length;
    setRecent7Days(count);
  }, [accounts]);

  const filteredAccounts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return accounts;
    return accounts.filter((acc) => {
      const fullName = acc.fullName?.toLowerCase() ?? "";
      const email = acc.email.toLowerCase();
      const phone = acc.phoneNumber ?? "";
      return (
        fullName.includes(query) ||
        email.includes(query) ||
        phone.includes(query)
      );
    });
  }, [accounts, search]);

  const hasNoAccounts = !accounts.length;
  const hasNoFiltered = !filteredAccounts.length && !!accounts.length;

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
            Danh sách tài khoản người mua (buyer)
          </p>
        </div>

        <div className="w-full sm:w-64 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, email, SĐT..."
            className="w-full rounded-lg border border-input bg-background px-8 py-2 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card px-4 py-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Tổng người dùng
          </p>
          <p className="mt-1 text-xl font-semibold text-foreground">
            {totalUsers.toLocaleString("vi-VN")}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card px-4 py-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Mới 7 ngày gần đây
          </p>
          <p className="mt-1 text-xl font-semibold text-foreground">
            {recent7Days.toLocaleString("vi-VN")}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card px-4 py-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Ghi chú
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Mặc định hiển thị tài khoản người mua. Vai trò được hiển thị bằng
            nhãn màu.
          </p>
        </div>
      </div>

      {hasNoAccounts ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          <Users className="mx-auto mb-2 h-10 w-10 opacity-50" />
          Chưa có tài khoản nào.
        </div>
      ) : hasNoFiltered ? (
        <div className="rounded-xl border border-dashed bg-muted/40 p-6 text-center text-sm text-muted-foreground">
          Không tìm thấy người dùng phù hợp với từ khóa đang tìm.
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium text-foreground">
                    Người dùng
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-foreground">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-foreground hidden sm:table-cell">
                    Số điện thoại
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-foreground hidden md:table-cell">
                    Ngày tạo
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((acc: AdminAccount) => (
                  <tr
                    key={acc._id}
                    className="border-b border-border last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full border border-border bg-muted overflow-hidden shrink-0">
                          {acc.avatar?.url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={acc.avatar.url}
                              alt={acc.fullName ?? acc.email}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[11px] font-semibold text-muted-foreground">
                              {(acc.fullName ?? acc.email)
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground truncate max-w-[160px] sm:max-w-[220px]">
                              {acc.fullName ?? "—"}
                            </span>
                            <span
                              className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${getRoleBadgeClass(
                                acc.role
                              )}`}
                            >
                              {getRoleLabel(acc.role)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate max-w-[220px]">
                            {acc.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {acc.email}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                      {acc.phoneNumber ?? "—"}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">
                      {acc.createdAt ? format(acc.createdAt) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

