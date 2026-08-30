"use client";

import { IconFlag, IconLoader2 } from "@tabler/icons-react";
import { useAdminReports } from "./hooks/useAdminReports";
import { NoData, PageHeader, ErrorState } from "@/features/admin/components";
import ReportsTable from "./components/ReportsTable";
import { Pagination } from "@/components/ui";

export default function AdminReports() {
  const { reports, isLoading, error, expandedId, toggleExpanded, page, setPage, totalPages } =
    useAdminReports();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <IconLoader2 className="h-9 w-9 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">
            Đang tải danh sách báo cáo vi phạm...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Không tải được danh sách báo cáo"
        description="Vui lòng kiểm tra quyền đăng nhập tài khoản quản trị viên."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Báo cáo & Khiếu nại vi phạm"
        description="Tiếp nhận và xử lý các báo cáo vi phạm tài khoản, gian lận hoặc khiếu nại khóa nick."
        badge={
          reports.length > 0 ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              {reports.length} báo cáo
            </span>
          ) : null
        }
      />

      {reports.length === 0 ? (
        <NoData
          icon={<IconFlag className="w-10 h-10 text-muted-foreground" />}
          title="Chưa có báo cáo nào"
          description="Hệ thống hiện không ghi nhận phản ánh hay khiếu nại nào từ người dùng."
        />
      ) : (
        <>
          <ReportsTable
            reports={reports}
            expandedId={expandedId}
            onToggleExpanded={toggleExpanded}
          />
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              className="mt-4"
            />
          )}
        </>
      )}
    </div>
  );
}


