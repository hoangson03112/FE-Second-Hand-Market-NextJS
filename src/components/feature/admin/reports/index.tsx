"use client";

import { Fragment } from "react";
import { Flag, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "@/utils/format/date";
import type { AdminReport } from "@/types/admin";
import { useAdminReports } from "./hooks/useAdminReports";

export default function AdminReports() {
  const { reports, isLoading, error, expandedId, toggleExpanded } =
    useAdminReports();

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
        <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          <Flag className="mx-auto mb-2 h-10 w-10 opacity-50" />
          Chưa có báo cáo nào.
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium text-foreground">
                    Loại
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-foreground hidden sm:table-cell">
                    Người báo cáo
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-foreground">
                    Trạng thái
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-foreground hidden md:table-cell">
                    Ngày tạo
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-foreground w-10">
                    Chi tiết
                  </th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report: AdminReport) => {
                  const isExpanded = expandedId === report._id;
                  const reporter =
                    report.reporterId &&
                    typeof report.reporterId === "object" &&
                    "fullName" in report.reporterId
                      ? (report.reporterId as {
                          fullName?: string;
                          email?: string;
                        })
                      : null;
                  return (
                    <Fragment key={report._id}>
                      <tr className="border-b border-border last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-3 font-medium text-foreground">
                          {report.type ?? "—"}
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                          {reporter?.fullName ?? "—"}
                          {reporter?.email && (
                            <span className="block text-xs">
                              {reporter.email}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex rounded px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground">
                            {report.status ?? "pending"}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">
                          {report.createdAt ? format(report.createdAt) : "—"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => toggleExpanded(report._id)}
                            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-muted/20">
                          <td colSpan={5} className="px-4 py-3">
                            <div className="space-y-2 text-xs">
                              {report.reason && (
                                <p>
                                  <span className="font-medium text-foreground">
                                    Lý do:
                                  </span>{" "}
                                  {report.reason}
                                </p>
                              )}
                              {report.description && (
                                <p>
                                  <span className="font-medium text-foreground">
                                    Mô tả:
                                  </span>{" "}
                                  {report.description}
                                </p>
                              )}
                              {report.images && report.images.length > 0 && (
                                <div>
                                  <span className="font-medium text-foreground">
                                    Ảnh đính kèm:
                                  </span>
                                  <div className="mt-1 flex gap-2 flex-wrap">
                                    {report.images.map((img, i) => (
                                      <a
                                        key={i}
                                        href={img.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary underline"
                                      >
                                        Ảnh {i + 1}
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

