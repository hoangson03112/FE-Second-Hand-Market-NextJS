import {
  IconX,
  IconUser,
  IconCreditCard,
  IconId,
  IconPackage,
  IconShoppingCart,
  IconStar,
  IconMessageCircle,
  IconCircleCheck,
  IconCircleX,
  IconClock,
  IconBan,
} from "@tabler/icons-react";
import Image from "next/image";
import type { AdminSeller } from "@/types/admin";
import { format } from "@/utils/format/date";

const STATUS_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; className: string }
> = {
  pending: {
    label: "Chờ duyệt",
    icon: IconClock,
    className: "bg-cream-50 text-luxury-ink border border-luxury-ink/10",
  },
  approved: {
    label: "Đã duyệt",
    icon: IconCircleCheck,
    className: "bg-cream-50 text-accent border border-accent/30",
  },
  rejected: {
    label: "Từ chối",
    icon: IconCircleX,
    className: "bg-rose-50 text-rose-700 border border-rose-200",
  },
  banned: {
    label: "Bị khóa",
    icon: IconBan,
    className: "bg-neutral-100 text-neutral-500 border border-neutral-200",
  },
};

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[2px] border border-luxury-ink/10 bg-white p-5 space-y-3">
      <div className="flex items-center gap-2 border-b border-luxury-ink/8 pb-2">
        <Icon className="w-4 h-4 text-neutral-500 shrink-0" />
        <span className="text-2xs font-bold text-luxury-ink uppercase tracking-[0.15em]">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-xs">
      <span className="w-36 shrink-0 text-neutral-500">{label}</span>
      <span className="text-luxury-ink font-medium break-all">
        {value ?? "—"}
      </span>
    </div>
  );
}

interface SellerDetailModalProps {
  seller: AdminSeller;
  rejectReason: string;
  isUpdating: boolean;
  onRejectReasonChange: (value: string) => void;
  onApprove: () => void;
  onReject: () => void;
  onBan: () => void;
  onClose: () => void;
}

export default function SellerDetailModal({
  seller,
  rejectReason,
  isUpdating,
  onRejectReasonChange,
  onApprove,
  onReject,
  onBan,
  onClose,
}: SellerDetailModalProps) {
  const effectiveStatus =
    seller.accountId?.status === "banned"
      ? "banned"
      : seller.verificationStatus;
  const statusCfg = STATUS_CONFIG[effectiveStatus] ?? STATUS_CONFIG.pending;
  const StatusIcon = statusCfg.icon;
  const stats = seller.stats;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-luxury-ink/60 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl max-h-[92dvh] sm:max-h-[90vh] overflow-hidden rounded-t-[2px] sm:rounded-[2px] border border-luxury-ink/10 bg-white shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-luxury-ink/10 bg-cream-50/70 px-5 py-4 shrink-0">
          <div className="flex items-center gap-4">
            {seller.accountId?.avatar?.url ? (
              <Image
                src={seller.accountId.avatar.url}
                alt={seller.accountId.fullName}
                width={44}
                height={44}
                className="w-11 h-11 rounded-full object-cover border border-luxury-ink/10"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-cream-50 border border-luxury-ink/10 flex items-center justify-center text-luxury-ink font-bold text-base shrink-0">
                {seller.accountId?.fullName?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
            <div>
              <p className="font-droid-serif text-lg font-bold text-luxury-ink leading-tight">
                {seller.accountId?.fullName ?? "—"}
              </p>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[2px] text-2xs font-bold uppercase tracking-[0.1em] mt-1 border ${statusCfg.className}`}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                {statusCfg.label}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[2px] border border-luxury-ink/10 p-1.5 text-luxury-ink hover:bg-taupe-50 transition-colors"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-6 space-y-5 bg-luxury-ivory/40">
          <div className="rounded-[2px] border border-luxury-ink/10 bg-white p-5">
            <p className="text-2xs font-bold text-neutral-500 uppercase tracking-[0.2em] mb-4">
              Thống kê hoạt động
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col items-center rounded-[2px] bg-cream-50/50 border border-luxury-ink/8 py-4 px-3">
                <IconPackage className="w-5 h-5 text-luxury-ink mb-1.5" />
                <span className="font-droid-serif text-xl font-bold text-luxury-ink tabular-nums">
                  {stats?.totalProductsActive ?? 0}
                </span>
                <span className="text-2xs font-bold uppercase tracking-[0.1em] text-neutral-500 mt-1">
                  Đang bán
                </span>
              </div>
              <div className="flex flex-col items-center rounded-[2px] bg-cream-50/50 border border-luxury-ink/8 py-4 px-3">
                <IconShoppingCart className="w-5 h-5 text-luxury-ink mb-1.5" />
                <span className="font-droid-serif text-xl font-bold text-luxury-ink tabular-nums">
                  {stats?.totalSold ?? 0}
                </span>
                <span className="text-2xs font-bold uppercase tracking-[0.1em] text-neutral-500 mt-1">
                  Đã bán
                </span>
              </div>
              <div className="flex flex-col items-center rounded-[2px] bg-cream-50/50 border border-luxury-ink/8 py-4 px-3">
                <IconStar className="w-5 h-5 text-amber-600 mb-1.5" />
                <span className="font-droid-serif text-xl font-bold text-luxury-ink tabular-nums">
                  {(stats?.avgRating ?? 0) > 0
                    ? `${Number(stats!.avgRating).toFixed(1)} ★`
                    : "0"}
                </span>
                <span className="text-2xs font-bold uppercase tracking-[0.1em] text-neutral-500 mt-1">
                  Đánh giá TB
                </span>
              </div>
              <div className="flex flex-col items-center rounded-[2px] bg-cream-50/50 border border-luxury-ink/8 py-4 px-3">
                <IconMessageCircle className="w-5 h-5 text-luxury-ink mb-1.5" />
                <span className="font-droid-serif text-xl font-bold text-luxury-ink tabular-nums">
                  {stats?.totalReviews ?? 0}
                </span>
                <span className="text-2xs font-bold uppercase tracking-[0.1em] text-neutral-500 mt-1">
                  Lượt đánh giá
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-5 space-y-5">
              <Section icon={IconUser} title="Thông tin tài khoản">
                <div className="space-y-2">
                  <Row
                    label="Seller ID"
                    value={
                      <span className="font-mono text-xs">{seller._id}</span>
                    }
                  />
                  <Row label="Họ tên" value={seller.accountId?.fullName} />
                  <Row label="Email" value={seller.accountId?.email} />
                  <Row
                    label="Số điện thoại"
                    value={seller.accountId?.phoneNumber}
                  />
                  <Row
                    label="Ngày tạo TK"
                    value={
                      seller.accountId?.createdAt
                        ? format(seller.accountId.createdAt)
                        : undefined
                    }
                  />
                  <Row
                    label="Ngày đăng ký seller"
                    value={
                      seller.createdAt ? format(seller.createdAt) : undefined
                    }
                  />
                </div>
                <div className="pt-3 border-t border-luxury-ink/8 mt-3 space-y-2">
                  <Row
                    label="Đồng ý điều khoản"
                    value={
                      seller.agreeTerms !== undefined ? (
                        <span
                          className={
                            seller.agreeTerms
                              ? "text-accent font-semibold"
                              : "text-rose-700 font-semibold"
                          }
                        >
                          {seller.agreeTerms ? "Đã đồng ý" : "Chưa đồng ý"}
                        </span>
                      ) : undefined
                    }
                  />
                  <Row
                    label="Đồng ý chính sách"
                    value={
                      seller.agreePolicy !== undefined ? (
                        <span
                          className={
                            seller.agreePolicy
                              ? "text-accent font-semibold"
                              : "text-rose-700 font-semibold"
                          }
                        >
                          {seller.agreePolicy ? "Đã đồng ý" : "Chưa đồng ý"}
                        </span>
                      ) : undefined
                    }
                  />
                  {seller.approvedDate && (
                    <Row
                      label="Ngày duyệt"
                      value={format(seller.approvedDate)}
                    />
                  )}
                  {seller.approvedBy && (
                    <Row
                      label="Admin duyệt"
                      value={`${seller.approvedBy.fullName}`}
                    />
                  )}
                  {seller.rejectedReason && (
                    <Row
                      label="Lý do từ chối"
                      value={
                        <span className="text-rose-700">
                          {seller.rejectedReason}
                        </span>
                      }
                    />
                  )}
                </div>
              </Section>

              <Section icon={IconCreditCard} title="Thông tin ngân hàng">
                <Row label="Ngân hàng" value={seller.bankInfo?.bankName} />
                <Row
                  label="Số tài khoản"
                  value={
                    <span className="font-mono">{seller.bankInfo?.accountNumber}</span>
                  }
                />
                <Row
                  label="Chủ tài khoản"
                  value={seller.bankInfo?.accountHolder.toUpperCase()}
                />
              </Section>
            </div>

            <div className="lg:col-span-7">
              <Section icon={IconId} title="CCCD / CMND">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Mặt trước", file: seller.idCardFront },
                    { label: "Mặt sau", file: seller.idCardBack },
                  ].map(({ label, file }) => (
                    <div key={label}>
                      <p className="text-2xs font-bold uppercase tracking-[0.12em] text-neutral-500 mb-2">
                        {label}
                      </p>
                      {file?.url ? (
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block rounded-[2px] border border-luxury-ink/10 overflow-hidden bg-cream-50/50 hover:opacity-95 transition-opacity"
                        >
                          <Image
                            src={file.url}
                            alt={`CCCD ${label}`}
                            width={400}
                            height={250}
                            className="w-full h-auto object-contain max-h-[280px]"
                          />
                        </a>
                      ) : (
                        <div className="w-full h-32 rounded-[2px] border border-luxury-ink/10 bg-cream-50/50 flex items-center justify-center text-xs text-neutral-400">
                          Chưa có ảnh
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          </div>

          {(seller.verificationStatus === "pending" ||
            seller.verificationStatus === "approved") && (
            <div className="rounded-[2px] border border-luxury-ink/10 bg-white p-5">
              <label className="block text-2xs font-bold text-neutral-600 uppercase tracking-[0.15em] mb-2">
                {seller.verificationStatus === "pending"
                  ? "Lý do từ chối (nếu từ chối)"
                  : "Lý do khóa (bắt buộc khi khóa)"}
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => onRejectReasonChange(e.target.value)}
                className="w-full rounded-[2px] border border-luxury-ink/15 bg-white px-3.5 py-2.5 text-xs text-luxury-ink placeholder:text-neutral-400 focus:outline-none focus:border-luxury-ink resize-none"
                rows={2}
                placeholder={
                  seller.verificationStatus === "pending"
                    ? "Nhập lý do từ chối..."
                    : "Nhập lý do khóa tài khoản..."
                }
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end border-t border-luxury-ink/10 bg-cream-50/50 px-5 py-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[2px] border border-luxury-ink/15 bg-white px-5 py-2 text-2xs font-bold uppercase tracking-[0.12em] text-luxury-ink hover:bg-taupe-50 transition-colors"
          >
            Đóng
          </button>
          {seller.verificationStatus === "pending" && (
            <>
              <button
                type="button"
                onClick={onReject}
                disabled={isUpdating}
                className="rounded-[2px] border border-rose-200 bg-white px-5 py-2 text-2xs font-bold uppercase tracking-[0.12em] text-rose-700 hover:bg-rose-50 disabled:opacity-50 transition-colors"
              >
                Từ chối
              </button>
              <button
                type="button"
                onClick={onApprove}
                disabled={isUpdating}
                className="rounded-[2px] bg-accent px-5 py-2 text-2xs font-bold uppercase tracking-[0.12em] text-white hover:opacity-90 disabled:opacity-50 transition-all"
              >
                Duyệt seller
              </button>
            </>
          )}
          {seller.verificationStatus === "approved" && (
            <button
              type="button"
              onClick={onBan}
              disabled={isUpdating || !rejectReason.trim()}
              className="rounded-[2px] border border-rose-200 bg-white px-5 py-2 text-2xs font-bold uppercase tracking-[0.12em] text-rose-700 hover:bg-rose-50 disabled:opacity-50 transition-colors"
            >
              Khóa tài khoản
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
