"use client";

import { IconLoader2 } from "@tabler/icons-react";
import { useAdminReports } from "./hooks/useAdminReports";
import EmptyState from "./components/EmptyState";
import ReportsTable from "./components/ReportsTable";
import Pagination from "@/components/ui/Pagination";

export default function AdminReports() {
  const { reports, isLoading, error, expandedId, toggleExpanded, page, setPage, totalPages } =
    useAdminReports();

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
        Không tải được danh sách báo cáo.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-foreground">Báo cáo</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Xem và xử lý báo cáo từ người dùng
        </p>
      </div>

      {reports.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <ReportsTable
            reports={reports}
            expandedId={expandedId}
            onToggleExpanded={toggleExpanded}
          />
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

