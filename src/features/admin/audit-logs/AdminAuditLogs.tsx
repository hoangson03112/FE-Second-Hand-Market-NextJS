"use client";

import { IconLoader2 } from "@tabler/icons-react";
import { Pagination } from "@/components/shared";
import { format } from "@/utils/format/date";
import { useAdminAuditLogs } from "./hooks/useAdminAuditLogs";

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
  { value: "Account", label: "Account" },
  { value: "Seller", label: "Seller" },
  { value: "Refund", label: "Refund" },
  { value: "Order", label: "Order" },
];

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
      <div className="flex min-h-[40vh] items-center justify-center">
        <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        Không tải được audit logs.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-foreground">Audit Logs</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Nhật ký thao tác quản trị ({totalItems} bản ghi)
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
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
          className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {TARGET_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={startDate ?? ""}
          onChange={(e) => setDateRange(e.target.value || undefined, endDate)}
          className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <input
          type="date"
          value={endDate ?? ""}
          onChange={(e) => setDateRange(startDate, e.target.value || undefined)}
          className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {logs.length === 0 ? (
        <div className="rounded-xl border border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
          Không có dữ liệu phù hợp bộ lọc.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-left">
                  <th className="px-4 py-3 font-medium text-foreground">Thời gian</th>
                  <th className="px-4 py-3 font-medium text-foreground">Admin</th>
                  <th className="px-4 py-3 font-medium text-foreground">Hành động</th>
                  <th className="px-4 py-3 font-medium text-foreground">Đối tượng</th>
                  <th className="px-4 py-3 font-medium text-foreground">Chi tiết</th>
                  <th className="px-4 py-3 font-medium text-foreground">IP</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-3 text-muted-foreground">{format(log.createdAt)}</td>
                    <td className="px-4 py-3 text-foreground">
                      <div className="font-medium">{log.adminId?.fullName ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">{log.adminId?.email ?? ""}</div>
                    </td>
                    <td className="px-4 py-3 text-foreground">{log.action}</td>
                    <td className="px-4 py-3 text-foreground">
                      {log.targetType} · <span className="font-mono text-xs">{log.targetId}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {renderMetadata(log.metadata)}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{log.ip ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} className="mt-2" />
        </>
      )}
    </div>
  );
}

