import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { Fragment } from "react";
import { format } from "@/utils/format/date";
import type { AdminReport } from "@/types/admin";

interface ReportsTableProps {
  reports: AdminReport[];
  expandedId: string | null;
  onToggleExpanded: (reportId: string) => void;
}

export default function ReportsTable({
  reports,
  expandedId,
  onToggleExpanded,
}: ReportsTableProps) {
  return (
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
              const typeLabel =
                report.type === "account_appeal"
                  ? "Khiếu nại (TK khóa)"
                  : report.type ?? "—";
              const reporterDisplay = reporter
                ? reporter.fullName ?? "—"
                : report.reporterFullName || report.reporterEmail || "—";
              const reporterSub = reporter?.email ?? (reporter ? null : report.reporterEmail);
              return (
                <Fragment key={report._id}>
                  <tr className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {typeLabel}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                      {reporterDisplay}
                      {reporterSub && (
                        <span className="block text-xs">
                          {reporterSub}
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
                        onClick={() => onToggleExpanded(report._id)}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        {isExpanded ? (
                          <IconChevronUp className="h-4 w-4" />
                        ) : (
                          <IconChevronDown className="h-4 w-4" />
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
  );
}
