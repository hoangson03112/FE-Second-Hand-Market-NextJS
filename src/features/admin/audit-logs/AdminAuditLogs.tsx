"use client";

import { IconFileText, IconLoader2, IconCalendar, IconFilter } from "@tabler/icons-react";
import { Pagination } from "@/components/ui";
import { format } from "@/utils/format/date";
import { useAdminAuditLogs } from "./hooks/useAdminAuditLogs";
import { PageHeader, NoData, ErrorState } from "@/features/admin/components";

const ACTION_OPTIONS = [
  { value: "all", label: "Tất cả hành động" },
  { value: "ACCOUNT_BANNED", label: "Khóa tài khoản" },
  { value: "ACCOUNT_UNBANNED", label: "Mở khóa tài khoản" },
  { value: "SELLER_APPROVED", label: "Duyệt seller" },
  { value: "SELLER_REJECTED", label: "Từ chối seller" },
  { value: "SELLER_BANNED", label: "Khóa seller" },
  { value: "REFUND_COMPLETED", label: "Hoàn tiền thành công" },
  { value: "PAYOUT_TRIGGERED", label: "Kích hoạt payout" },
];

const TARGET_OPTIONS = [
  { value: "all", label: "Tất cả đối tượng" },
  { value: "Account", label: "Tài khoản (Account)" },
  { value: "Seller", label: "Người bán (Seller)" },
  { value: "Refund", label: "Yêu cầu hoàn tiền (Refund)" },
  { value: "Order", label: "Đơn hàng (Order)" },
];

function getActionBadgeStyle(action: string) {
  if (action.includes("BANNED") || action.includes("REJECTED")) {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }
  if (action.includes("APPROVED") || action.includes("UNBANNED")) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (action.includes("REFUND") || action.includes("PAYOUT")) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }
  return "bg-muted text-muted-foreground border-border";
}

function renderMetadata(metadata: Record<string, unknown> | undefined) {
  if (!metadata || Object.keys(metadata).length === 0) return "—";
  const entries = Object.entries(metadata)
    .filter(([, value]) => value !== null && value !== undefined && value !== "")
    .slice(0, 3)
    .map(([key, value]) => `${key}: ${String(value)}`);
  return entries.length > 0 ? entries.join(" | ") : "—";
}

export default function AdminAuditLogs() {
  const {
    logs,
    isLoading,
    error,
    page,
    setPage,
    totalPages,
    totalItems,
    action,
    setAction,
    targetType,
    setTargetType,
    startDate,
    endDate,
    setDateRange,
  } = useAdminAuditLogs();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <IconLoader2 className="h-9 w-9 animate-spin text-luxury-ink" />
          <p className="text-2xs font-bold uppercase tracking-[0.2em] text-neutral-500">
            Đang tải nhật ký thao tác...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Không tải được audit logs"
        description="Vui lòng kiểm tra quyền đăng nhập tài khoản quản trị viên."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Kiểm soát bảo mật"
        title="Nhật ký thao tác (Audit Logs)"
        description="Theo dõi toàn bộ lịch sử can thiệp, khóa/mở tài khoản, duyệt hồ sơ và duyệt hoàn tiền của ban quản trị."
        badge={
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-[2px] text-2xs font-bold uppercase tracking-[0.16em] bg-cream-50 text-luxury-ink border border-luxury-ink/10">
            {totalItems} bản ghi
          </span>
        }
      />

      <div className="rounded-[2px] border border-luxury-ink/10 bg-white p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="rounded-[2px] border border-luxury-ink/15 bg-white px-3 py-2 text-2xs font-bold uppercase tracking-[0.1em] text-luxury-ink focus:outline-none focus:border-luxury-ink"
          >
            {ACTION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <select
            value={targetType}
            onChange={(e) => setTargetType(e.target.value)}
            className="rounded-[2px] border border-luxury-ink/15 bg-white px-3 py-2 text-2xs font-bold uppercase tracking-[0.1em] text-luxury-ink focus:outline-none focus:border-luxury-ink"
          >
            {TARGET_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-500 sm:ml-auto">
            <IconCalendar className="w-3.5 h-3.5 text-neutral-500" />
            <input
              type="date"
              value={startDate ?? ""}
              onChange={(e) => setDateRange(e.target.value || undefined, endDate)}
              className="rounded-[2px] border border-luxury-ink/15 bg-white px-2.5 py-1.5 text-xs text-luxury-ink focus:outline-none focus:border-luxury-ink"
            />
            <span className="lowercase font-normal">đến</span>
            <input
              type="date"
              value={endDate ?? ""}
              onChange={(e) => setDateRange(startDate, e.target.value || undefined)}
              className="rounded-[2px] border border-luxury-ink/15 bg-white px-2.5 py-1.5 text-xs text-luxury-ink focus:outline-none focus:border-luxury-ink"
            />
          </div>
        </div>
      </div>

      {logs.length === 0 ? (
        <NoData
          icon={<IconFileText className="w-10 h-10 text-neutral-400" />}
          title="Không có bản ghi nào phù hợp"
          description="Thử thay đổi loại hành động hoặc khoảng ngày tra cứu."
        />
      ) : (
        <>
          <div className="rounded-[2px] border border-luxury-ink/10 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-luxury-ink/10 bg-cream-50/70 text-left">
                    <th className="px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                      Thời gian
                    </th>
                    <th className="px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                      Admin thực hiện
                    </th>
                    <th className="px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                      Hành động
                    </th>
                    <th className="px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                      Đối tượng
                    </th>
                    <th className="px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                      Chi tiết metadata
                    </th>
                    <th className="px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                      Địa chỉ IP
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr
                      key={log._id}
                      className="border-b border-luxury-ink/6 last:border-0 hover:bg-taupe-50/40 transition-colors"
                    >
                      <td className="px-4 py-3.5 text-xs text-neutral-500 whitespace-nowrap">
                        {format(log.createdAt)}
                      </td>
                      <td className="px-4 py-3.5 text-luxury-ink">
                        <div className="font-semibold text-xs text-luxury-ink">
                          {log.adminId?.fullName ?? "—"}
                        </div>
                        <div className="text-[11px] text-neutral-400">
                          {log.adminId?.email ?? ""}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-[2px] text-2xs font-bold uppercase tracking-[0.1em] border ${getActionBadgeStyle(
                            log.action
                          )}`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-luxury-ink text-xs">
                        <span className="font-semibold">{log.targetType}</span> ·{" "}
                        <span className="font-mono text-neutral-500 text-[11px]">
                          {log.targetId}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-neutral-500 max-w-xs truncate">
                        {renderMetadata(log.metadata)}
                      </td>
                      <td className="px-4 py-3.5 text-xs font-mono text-neutral-500">
                        {log.ip ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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

