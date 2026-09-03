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
    <div className="rounded-[2px] border border-luxury-ink/10 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-luxury-ink/10 bg-cream-50/70">
              <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                Loại báo cáo
              </th>
              <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600 hidden sm:table-cell">
                Người báo cáo
              </th>
              <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                Trạng thái
              </th>
              <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600 hidden md:table-cell">
                Ngày tạo
              </th>
              <th className="text-right px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600 w-12">
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
                  <tr className="border-b border-luxury-ink/6 last:border-0 hover:bg-taupe-50/40 transition-colors">
                    <td className="px-4 py-3 font-medium text-luxury-ink text-xs">
                      {typeLabel}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-neutral-500 text-xs">
                      <span className="font-semibold text-luxury-ink block">{reporterDisplay}</span>
                      {reporterSub && (
                        <span className="block text-[11px] text-neutral-400">
                          {reporterSub}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-[2px] px-2 py-0.5 text-2xs font-bold uppercase tracking-[0.1em] bg-cream-50 text-luxury-ink border border-luxury-ink/10">
                        {report.status ?? "pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-neutral-500 text-xs">
                      {report.createdAt ? format(report.createdAt) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onToggleExpanded(report._id)}
                        className="rounded-[2px] border border-luxury-ink/10 p-1.5 text-luxury-ink hover:bg-taupe-50 transition-colors"
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
                    <tr className="bg-cream-50/40">
                      <td colSpan={5} className="px-4 py-3.5">
                        <div className="space-y-2 text-xs">
                          {report.reason && (
                            <p>
                              <span className="font-bold text-luxury-ink">
                                Lý do:
                              </span>{" "}
                              <span className="text-neutral-600">{report.reason}</span>
                            </p>
                          )}
                          {report.description && (
                            <p>
                              <span className="font-bold text-luxury-ink">
                                Mô tả:
                              </span>{" "}
                              <span className="text-neutral-600">{report.description}</span>
                            </p>
                          )}
                          {report.images && report.images.length > 0 && (
                            <div>
                              <span className="font-bold text-luxury-ink">
                                Ảnh đính kèm:
                              </span>
                              <div className="mt-1.5 flex gap-2 flex-wrap">
                                {report.images.map((img, i) => (
                                  <a
                                    key={i}
                                    href={img.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-2xs font-bold uppercase tracking-[0.1em] text-accent hover:underline rounded-[2px] border border-luxury-ink/10 bg-white px-2 py-1"
                                  >
                                    Ảnh {i + 1} ↗
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
