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
    className: "bg-cream-50 text-luxury-ink border border-luxury-ink/10",
  },
  approved: {
    label: "Đã duyệt",
    className: "bg-cream-50 text-accent border border-accent/30",
  },
  rejected: {
    label: "Từ chối",
    className: "bg-blush-50 text-blush-700 border border-blush-200",
  },
  banned: {
    label: "Bị khóa",
    className: "bg-neutral-100 text-neutral-500 border border-neutral-200",
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
    <div className="rounded-[2px] border border-luxury-ink/10 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-luxury-ink/10 bg-cream-50/70">
              <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                Seller
              </th>
              <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600 hidden sm:table-cell">
                Liên hệ
              </th>
              <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600 hidden lg:table-cell">
                Ngân hàng
              </th>
              <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                Trạng thái
              </th>
              <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600 hidden md:table-cell">
                Ngày đăng ký
              </th>
              <th className="text-right px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller: AdminSeller) => {
              const effectiveStatus =
                seller.accountId?.status === "banned"
                  ? "banned"
                  : seller.verificationStatus;

              const statusInfo =
                STATUS_BADGE[effectiveStatus] ?? {
                  label: seller.verificationStatus,
                  className: "bg-cream-50 text-neutral-600 border border-luxury-ink/10",
                };
              return (
                <tr
                  key={seller._id}
                  className="border-b border-luxury-ink/6 last:border-0 hover:bg-taupe-50/40 transition-colors"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      {seller.accountId?.avatar?.url ? (
                        <Image
                          src={seller.accountId.avatar.url}
                          alt={seller.accountId.fullName}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover border border-luxury-ink/10 shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-cream-50 text-luxury-ink border border-luxury-ink/10 flex items-center justify-center font-bold text-xs shrink-0">
                          {seller.accountId?.fullName?.[0]?.toUpperCase() ?? "?"}
                        </div>
                      )}
                      <span className="font-semibold text-luxury-ink text-xs">
                        {seller.accountId?.fullName ?? "—"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell text-neutral-500 text-xs">
                    <span className="block">{seller.accountId?.email ?? "—"}</span>
                    <span className="block text-neutral-400">{seller.accountId?.phoneNumber ?? "—"}</span>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell text-xs">
                    {seller.bankInfo ? (
                      <>
                        <span className="block font-semibold text-luxury-ink">{seller.bankInfo.bankName}</span>
                        <span className="block font-mono text-neutral-500">{seller.bankInfo.accountNumber}</span>
                        <span className="block text-neutral-400">{seller.bankInfo.accountHolder}</span>
                      </>
                    ) : (
                      <span className="text-neutral-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-[2px] text-2xs font-bold uppercase tracking-[0.1em] ${statusInfo.className}`}
                    >
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell text-neutral-500 text-xs">
                    {seller.createdAt ? format(seller.createdAt) : "—"}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onOpenDetail(seller)}
                        className="rounded-[2px] border border-luxury-ink/15 p-1.5 text-luxury-ink hover:bg-taupe-50 transition-colors"
                        title="Xem chi tiết"
                      >
                        <IconEye className="h-4 w-4" />
                      </button>
                      {seller.verificationStatus === "approved" && onOpenBan && (
                        <button
                          type="button"
                          onClick={() => onOpenBan(seller)}
                          disabled={isUpdating}
                          className="rounded-[2px] border border-blush-200 p-1.5 text-blush-700 hover:bg-blush-50 disabled:opacity-50 transition-colors"
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
                            className="rounded-[2px] bg-accent p-1.5 text-white hover:opacity-90 disabled:opacity-50 transition-all"
                            title="Duyệt"
                          >
                            <IconCircleCheck className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenDetail(seller)}
                            disabled={isUpdating}
                            className="rounded-[2px] border border-blush-200 p-1.5 text-blush-700 hover:bg-blush-50 disabled:opacity-50 transition-colors"
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


