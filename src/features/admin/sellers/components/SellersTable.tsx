import {
  IconCircleCheck,
  IconCircleX,
  IconEye,
  IconBan,
} from "@tabler/icons-react";
import Image from "next/image";
import type { AdminSeller } from "@/types/admin";
import { format } from "@/utils/format/date";

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Chờ duyệt",
    className: "bg-primary/10 text-primary dark:bg-primary/20",
  },
  approved: {
    label: "Đã duyệt",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  rejected: {
    label: "Từ chối",
    className: "bg-destructive/10 text-destructive dark:bg-destructive/20",
  },
  banned: {
    label: "Bị khóa",
    className: "bg-muted text-muted-foreground",
  },
};

interface SellersTableProps {
  sellers: AdminSeller[];
  isUpdating: boolean;
  onApprove: (seller: AdminSeller) => void;
  onOpenDetail: (seller: AdminSeller) => void;
  onOpenBan?: (seller: AdminSeller) => void;
}

export default function SellersTable({
  sellers,
  isUpdating,
  onApprove,
  onOpenDetail,
  onOpenBan,
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
              <th className="text-left px-4 py-3 font-medium text-foreground hidden lg:table-cell">
                Ngân hàng
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
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      {seller.accountId?.avatar?.url ? (
                        <Image
                          src={seller.accountId.avatar.url}
                          alt={seller.accountId.fullName}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover border border-border shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                          {seller.accountId?.fullName?.[0]?.toUpperCase() ?? "?"}
                        </div>
                      )}
                      <span className="font-medium text-foreground">
                        {seller.accountId?.fullName ?? "—"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground text-xs">
                    <span className="block">{seller.accountId?.email ?? "—"}</span>
                    <span className="block">{seller.accountId?.phoneNumber ?? "—"}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs">
                    {seller.bankInfo ? (
                      <>
                        <span className="block font-medium text-foreground">{seller.bankInfo.bankName}</span>
                        <span className="block text-muted-foreground">{seller.bankInfo.accountNumber}</span>
                        <span className="block text-muted-foreground">{seller.bankInfo.accountHolder}</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
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
                        className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        title="Xem chi tiết"
                      >
                        <IconEye className="h-4 w-4" />
                      </button>
                      {seller.verificationStatus === "approved" && onOpenBan && (
                        <button
                          type="button"
                          onClick={() => onOpenBan(seller)}
                          disabled={isUpdating}
                          className="rounded-lg p-2 text-destructive hover:bg-destructive/5 disabled:opacity-50 transition-colors"
                          title="Khóa tài khoản"
                        >
                          <IconBan className="h-4 w-4" />
                        </button>
                      )}
                      {seller.verificationStatus === "pending" && (
                        <>
                          <button
                            type="button"
                            onClick={() => onApprove(seller)}
                            disabled={isUpdating}
                            className="rounded-lg p-2 text-primary hover:bg-primary/10 disabled:opacity-50 transition-colors"
                            title="Duyệt"
                          >
                            <IconCircleCheck className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenDetail(seller)}
                            disabled={isUpdating}
                            className="rounded-lg p-2 text-destructive hover:bg-destructive/5 disabled:opacity-50 transition-colors"
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


