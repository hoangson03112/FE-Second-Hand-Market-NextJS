"use client";

import { IconLoader2 } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { useAdminUsers } from "./hooks/useAdminUsers";
import StatsCards from "./components/StatsCards";
import SearchBar from "./components/SearchBar";
import UsersTable from "./components/UsersTable";
import EmptyState from "./components/EmptyState";

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
            Danh sách tài khoản người mua (buyer)
          </p>
        </div>

        <SearchBar value={search} onChange={setSearch} />
      </div>

      <StatsCards totalUsers={totalUsers} recent7Days={recent7Days} />

      {hasNoAccounts ? (
        <EmptyState type="no-accounts" />
      ) : hasNoFiltered ? (
        <EmptyState type="no-results" />
      ) : (
        <UsersTable accounts={filteredAccounts} />
      )}
    </div>
  );
}


