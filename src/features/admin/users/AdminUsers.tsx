
"use client";

import { IconLoader2 } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useAdminUsers } from "./hooks/useAdminUsers";
import StatsCards from "./components/StatsCards";
import SearchBar from "./components/SearchBar";
import UsersTable from "./components/UsersTable";
import EmptyState from "./components/EmptyState";
import Pagination from "@/components/ui/Pagination";

export default function AdminUsers() {
  const { accounts, isLoading, error, search, setSearch, page, setPage, totalPages, totalItems } =
    useAdminUsers();
  const [recent7Days, setRecent7Days] = useState(0);

  // Tính số user mới 7 ngày gần đây từ các tài khoản trên trang hiện tại
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

      <StatsCards totalUsers={totalItems} recent7Days={recent7Days} />

      {hasNoAccounts ? (
        <EmptyState type="no-accounts" />
      ) : hasNoFiltered ? (
        <EmptyState type="no-results" />
      ) : (
        <>
          <UsersTable accounts={accounts} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            className="mt-4"
          />
        </>
      )}
    </div>
  );
}


