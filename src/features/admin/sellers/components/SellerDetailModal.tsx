import {
  IconX,
  IconUser,
  IconMapPin,
  IconCreditCard,
  IconId,
  IconChartBar,
  IconCircleCheck,
  IconCircleX,
  IconClock,
  IconBan,
} from "@tabler/icons-react";
import Image from "next/image";
import type { AdminSeller } from "@/types/admin";
import { format } from "@/utils/format/date";

const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  pending:  { label: "Chờ duyệt", icon: IconClock,        className: "bg-primary/10 text-primary dark:bg-primary/20" },
  approved: { label: "Đã duyệt",  icon: IconCircleCheck,  className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  rejected: { label: "Từ chối",   icon: IconCircleX,      className: "bg-destructive/10 text-destructive" },
  banned:   { label: "Bị khóa",   icon: IconBan,          className: "bg-muted text-muted-foreground" },
};

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{title}</span>
      </div>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="w-36 shrink-0 text-muted-foreground">{label}</span>
      <span className="text-foreground font-medium break-all">{value ?? "—"}</span>
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
  const statusCfg = STATUS_CONFIG[seller.verificationStatus] ?? STATUS_CONFIG.pending;
  const StatusIcon = statusCfg.icon;
  const fullAddress = [seller.ward, seller.district, seller.province].filter(Boolean).join(", ");

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-2xl max-h-[92dvh] sm:max-h-[90vh] overflow-hidden rounded-t-2xl sm:rounded-2xl border border-border bg-card shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3 shrink-0">
          <div className="flex items-center gap-3">
            {seller.accountId?.avatar?.url ? (
              <Image
                src={seller.accountId.avatar.url}
                alt={seller.accountId.fullName}
                width={36}
                height={36}
                className="w-9 h-9 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                {seller.accountId?.fullName?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-foreground leading-tight">
                {seller.accountId?.fullName ?? "—"}
              </p>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium mt-0.5 ${statusCfg.className}`}>
                <StatusIcon className="w-3 h-3" />
                {statusCfg.label}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <IconX className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-4 space-y-3">
          {/* Account Info */}
          <Section icon={IconUser} title="Thông tin tài khoản">
            <Row label="Seller ID" value={<span className="font-mono text-xs">{seller._id}</span>} />
            <Row label="Họ tên" value={seller.accountId?.fullName} />
            <Row label="Email" value={seller.accountId?.email} />
            <Row label="Số điện thoại" value={seller.accountId?.phoneNumber} />
            <Row label="Ngày tạo tài khoản" value={seller.accountId?.createdAt ? format(seller.accountId.createdAt) : undefined} />
            <Row label="Ngày đăng ký seller" value={seller.createdAt ? format(seller.createdAt) : undefined} />
            <Row label="Cập nhật lần cuối" value={seller.updatedAt ? format(seller.updatedAt) : undefined} />
            <Row
              label="Đồng ý điều khoản"
              value={
                seller.agreeTerms !== undefined ? (
                  <span className={seller.agreeTerms ? "text-emerald-600" : "text-destructive"}>
                    {seller.agreeTerms ? "Đã đồng ý" : "Chưa đồng ý"}
                  </span>
                ) : undefined
              }
            />
            <Row
              label="Đồng ý chính sách"
              value={
                seller.agreePolicy !== undefined ? (
                  <span className={seller.agreePolicy ? "text-emerald-600" : "text-destructive"}>
                    {seller.agreePolicy ? "Đã đồng ý" : "Chưa đồng ý"}
                  </span>
                ) : undefined
              }
            />
            {seller.approvedDate && (
              <Row label="Ngày duyệt" value={format(seller.approvedDate)} />
            )}
            {seller.approvedBy && (
              <Row label="Admin duyệt" value={`${seller.approvedBy.fullName} (${seller.approvedBy.email})`} />
            )}
            {seller.rejectedReason && (
              <Row label="Lý do từ chối" value={<span className="text-destructive">{seller.rejectedReason}</span>} />
            )}
          </Section>

          {/* Address */}
          <Section icon={IconMapPin} title="Địa chỉ kinh doanh">
            <Row label="Tỉnh/Thành phố" value={seller.province} />
            <Row label="Quận/Huyện" value={seller.district} />
            <Row label="Xã/Phường" value={seller.ward} />
            <Row label="Địa chỉ chi tiết" value={seller.businessAddress} />
            {fullAddress && <Row label="Địa chỉ đầy đủ" value={fullAddress} />}
          </Section>

          {/* Bank Info */}
          <Section icon={IconCreditCard} title="Thông tin ngân hàng">
            <Row label="Ngân hàng" value={seller.bankInfo?.bankName} />
            <Row label="Số tài khoản" value={seller.bankInfo?.accountNumber} />
            <Row label="Chủ tài khoản" value={seller.bankInfo?.accountHolder} />
            <Row label="Mã BIN" value={seller.bankInfo?.bankBin} />
          </Section>

          {/* Stats */}
          <Section icon={IconChartBar} title="Thống kê hoạt động">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Đang bán",      value: seller.stats?.totalProductsActive ?? 0 },
                { label: "Đã bán",        value: seller.stats?.totalSold ?? 0 },
                { label: "Đánh giá TB",   value: (seller.stats?.avgRating ?? 0) > 0 ? (seller.stats!.avgRating.toFixed(1) + " ★") : "—" },
                { label: "Lượt đánh giá", value: seller.stats?.totalReviews ?? 0 },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg border border-border bg-muted/40 p-3 text-center">
                  <p className="text-base font-bold text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* ID Cards */}
          <Section icon={IconId} title="CCCD / CMND">
            <div className="grid grid-cols-2 gap-3">
              {[{ label: "Mặt trước", file: seller.idCardFront }, { label: "Mặt sau", file: seller.idCardBack }].map(({ label, file }) => (
                <div key={label}>
                  <p className="text-xs text-muted-foreground mb-1.5">{label}</p>
                  {file?.url ? (
                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                      <Image
                        src={file.url}
                        alt={`CCCD ${label}`}
                        width={300}
                        height={190}
                        className="w-full rounded-lg border border-border object-cover hover:opacity-90 transition-opacity cursor-zoom-in"
                      />
                    </a>
                  ) : (
                    <div className="w-full h-24 rounded-lg border border-border bg-muted/40 flex items-center justify-center text-xs text-muted-foreground">
                      Chưa có ảnh
                    </div>
                  )}
                  {file?.originalName && <p className="text-xs text-muted-foreground mt-1 truncate">{file.originalName}</p>}
                  {file?.size && <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>}
                  {file?.uploadedAt && <p className="text-xs text-muted-foreground">{format(file.uploadedAt)}</p>}
                </div>
              ))}
            </div>
          </Section>

          {/* Reject/Ban reason input */}
          {(seller.verificationStatus === "pending" || seller.verificationStatus === "approved") && (
            <div className="rounded-xl border border-border bg-background p-4">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                {seller.verificationStatus === "pending"
                  ? "Lý do từ chối (nếu từ chối)"
                  : "Lý do khóa (bắt buộc khi khóa)"}
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => onRejectReasonChange(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
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

        {/* Footer */}
        <div className="flex gap-2 justify-end border-t border-border px-4 py-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Đóng
          </button>
          {seller.verificationStatus === "pending" && (
            <>
              <button
                type="button"
                onClick={onReject}
                disabled={isUpdating}
                className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 dark:bg-destructive/10 disabled:opacity-50 transition-colors"
              >
                Từ chối
              </button>
              <button
                type="button"
                onClick={onApprove}
                disabled={isUpdating}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
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
              className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50 transition-colors"
            >
              Khóa tài khoản
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
