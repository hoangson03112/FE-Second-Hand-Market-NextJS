"use client";

import { Users, Loader2 } from "lucide-react";
import { format } from "@/utils/format/date";
import type { AdminAccount } from "@/services/admin.service";
import { useAdminUsers } from "./hooks/useAdminUsers";

export default function AdminUsers() {
  const { accounts, isLoading, error } = useAdminUsers();

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
      <div>
        <h1 className="text-lg font-bold text-foreground">Người dùng</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Danh sách tài khoản người mua (buyer)
        </p>
      </div>

      {accounts.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          <Users className="mx-auto mb-2 h-10 w-10 opacity-50" />
          Chưa có tài khoản nào.
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium text-foreground">
                    Họ tên
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
                {accounts.map((acc: AdminAccount) => (
                  <tr
                    key={acc._id}
                    className="border-b border-border last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {acc.fullName ?? "—"}
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

