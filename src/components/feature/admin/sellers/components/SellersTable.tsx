import {
  IconCircleCheck,
  IconCircleX,
  IconEye,
} from "@tabler/icons-react";
import type { AdminSeller } from "@/types/admin";
import { format } from "@/utils/format/date";

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Chờ duyệt",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  },
  approved: {
    label: "Đã duyệt",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
  },
  rejected: {
    label: "Từ chối",
    className: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
  },
  banned: {
    label: "Khóa",
    className:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
};

interface SellersTableProps {
  sellers: AdminSeller[];
  isUpdating: boolean;
  onApprove: (seller: AdminSeller) => void;
  onOpenDetail: (seller: AdminSeller) => void;
}

export default function SellersTable({
  sellers,
  isUpdating,
  onApprove,
  onOpenDetail,
}: SellersTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-foreground">
                Seller
              </th>
              <th className="text-left px-4 py-3 font-medium text-foreground hidden sm:table-cell">
                Liên hệ
              </th>
              <th className="text-left px-4 py-3 font-medium text-foreground">
                Trạng thái
              </th>
              <th className="text-left px-4 py-3 font-medium text-foreground hidden md:table-cell">
                Ngày đăng ký
              </th>
              <th className="text-right px-4 py-3 font-medium text-foreground">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller: AdminSeller) => {
              const statusInfo =
                STATUS_BADGE[seller.verificationStatus] ?? {
                  label: seller.verificationStatus,
                  className: "bg-muted text-muted-foreground",
                };
              return (
                <tr
                  key={seller._id}
                  className="border-b border-border last:border-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-foreground">
                      {seller.accountId?.fullName ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground text-xs">
                    {seller.accountId?.email ?? "—"}
                    <br />
                    {seller.accountId?.phoneNumber ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${statusInfo.className}`}
                    >
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">
                    {seller.createdAt ? format(seller.createdAt) : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onOpenDetail(seller)}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                        title="Xem chi tiết"
                      >
                        <IconEye className="h-4 w-4" />
                      </button>
                      {seller.verificationStatus === "pending" && (
                        <>
                          <button
                            type="button"
                            onClick={() => onApprove(seller)}
                            disabled={isUpdating}
                            className="rounded-lg p-2 text-green-600 hover:bg-green-500/10 disabled:opacity-50"
                            title="Duyệt"
                          >
                            <IconCircleCheck className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenDetail(seller)}
                            disabled={isUpdating}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-500/10 disabled:opacity-50"
                            title="Từ chối"
                          >
                            <IconCircleX className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
