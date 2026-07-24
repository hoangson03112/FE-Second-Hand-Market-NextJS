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

const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  pending:  { label: "Chá» duyá»‡t", icon: IconClock,        className: "bg-primary/10 text-primary" },
  approved: { label: "ÄÃ£ duyá»‡t",  icon: IconCircleCheck,  className: "bg-emerald-500/10 text-emerald-600" },
  rejected: { label: "Tá»« chá»‘i",   icon: IconCircleX,      className: "bg-destructive/10 text-destructive" },
  banned:   { label: "Bá»‹ khÃ³a",   icon: IconBan,          className: "bg-muted text-muted-foreground" },
};

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-background p-5 space-y-3">
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
      <span className="text-foreground font-medium break-all">{value ?? "â€”"}</span>
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
    seller.accountId?.status === "banned" ? "banned" : seller.verificationStatus;
  const statusCfg = STATUS_CONFIG[effectiveStatus] ?? STATUS_CONFIG.pending;
  const StatusIcon = statusCfg.icon;
  const stats = seller.stats;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-8xl max-h-[92dvh] sm:max-h-[90vh] overflow-hidden rounded-t-2xl sm:rounded-2xl border border-border bg-card shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4 shrink-0">
          <div className="flex items-center gap-4">
            {seller.accountId?.avatar?.url ? (
              <Image
                src={seller.accountId.avatar.url}
                alt={seller.accountId.fullName}
                width={44}
                height={44}
                className="w-11 h-11 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-base shrink-0">
                {seller.accountId?.fullName?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
            <div>
              <p className="text-base font-semibold text-foreground leading-tight">
                {seller.accountId?.fullName ?? "â€”"}
              </p>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium mt-1 ${statusCfg.className}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                {statusCfg.label}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Thá»‘ng kÃª - full width */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Thá»‘ng kÃª hoáº¡t Ä‘á»™ng</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col items-center rounded-xl bg-background border border-border py-4 px-3">
                <IconPackage className="w-6 h-6 text-primary mb-1.5" />
                <span className="text-xl font-bold text-foreground">{stats?.totalProductsActive ?? 0}</span>
                <span className="text-xs text-muted-foreground mt-0.5">Äang bÃ¡n</span>
              </div>
              <div className="flex flex-col items-center rounded-xl bg-background border border-border py-4 px-3">
                <IconShoppingCart className="w-6 h-6 text-primary mb-1.5" />
                <span className="text-xl font-bold text-foreground">{stats?.totalSold ?? 0}</span>
                <span className="text-xs text-muted-foreground mt-0.5">ÄÃ£ bÃ¡n</span>
              </div>
              <div className="flex flex-col items-center rounded-xl bg-background border border-border py-4 px-3">
                <IconStar className="w-6 h-6 text-amber-500 mb-1.5" />
                <span className="text-xl font-bold text-foreground">
                  {(stats?.avgRating ?? 0) > 0 ? `${Number(stats!.avgRating).toFixed(1)} â˜…` : "0"}
                </span>
                <span className="text-xs text-muted-foreground mt-0.5">ÄÃ¡nh giÃ¡ TB</span>
              </div>
              <div className="flex flex-col items-center rounded-xl bg-background border border-border py-4 px-3">
                <IconMessageCircle className="w-6 h-6 text-primary mb-1.5" />
                <span className="text-xl font-bold text-foreground">{stats?.totalReviews ?? 0}</span>
                <span className="text-xs text-muted-foreground mt-0.5">LÆ°á»£t Ä‘Ã¡nh giÃ¡</span>
              </div>
            </div>
          </div>

          {/* 2 cá»™t: TrÃ¡i = TÃ i khoáº£n + NgÃ¢n hÃ ng, Pháº£i = CCCD */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-5 space-y-5">
              <Section icon={IconUser} title="ThÃ´ng tin tÃ i khoáº£n">
                <div className="space-y-2">
                  <Row label="Seller ID" value={<span className="font-mono text-xs">{seller._id}</span>} />
                  <Row label="Há» tÃªn" value={seller.accountId?.fullName} />
                  <Row label="Email" value={seller.accountId?.email} />
                  <Row label="Sá»‘ Ä‘iá»‡n thoáº¡i" value={seller.accountId?.phoneNumber} />
                  <Row label="NgÃ y táº¡o TK" value={seller.accountId?.createdAt ? format(seller.accountId.createdAt) : undefined} />
                  <Row label="NgÃ y Ä‘Äƒng kÃ½ seller" value={seller.createdAt ? format(seller.createdAt) : undefined} />
                </div>
                <div className="pt-3 border-t border-border mt-3 space-y-2">
                  <Row
                    label="Äá»“ng Ã½ Ä‘iá»u khoáº£n"
                    value={
                      seller.agreeTerms !== undefined ? (
                        <span className={seller.agreeTerms ? "text-emerald-600" : "text-destructive"}>
                          {seller.agreeTerms ? "ÄÃ£ Ä‘á»“ng Ã½" : "ChÆ°a Ä‘á»“ng Ã½"}
                        </span>
                      ) : undefined
                    }
                  />
                  <Row
                    label="Äá»“ng Ã½ chÃ­nh sÃ¡ch"
                    value={
                      seller.agreePolicy !== undefined ? (
                        <span className={seller.agreePolicy ? "text-emerald-600" : "text-destructive"}>
                          {seller.agreePolicy ? "ÄÃ£ Ä‘á»“ng Ã½" : "ChÆ°a Ä‘á»“ng Ã½"}
                        </span>
                      ) : undefined
                    }
                  />
                  {seller.approvedDate && <Row label="NgÃ y duyá»‡t" value={format(seller.approvedDate)} />}
                  {seller.approvedBy && <Row label="Admin duyá»‡t" value={`${seller.approvedBy.fullName}`} />}
                  {seller.rejectedReason && (
                    <Row label="LÃ½ do tá»« chá»‘i" value={<span className="text-destructive">{seller.rejectedReason}</span>} />
                  )}
                </div>
              </Section>

              <Section icon={IconCreditCard} title="ThÃ´ng tin ngÃ¢n hÃ ng">
                <Row label="NgÃ¢n hÃ ng" value={seller.bankInfo?.bankName} />
                <Row label="Sá»‘ tÃ i khoáº£n" value={seller.bankInfo?.accountNumber} />
                <Row label="Chá»§ tÃ i khoáº£n" value={seller.bankInfo?.accountHolder.toUpperCase()} />
              </Section>
            </div>

            <div className="lg:col-span-7">
              <Section icon={IconId} title="CCCD / CMND">
                <div className="grid grid-cols-2 gap-4">
                  {[{ label: "Máº·t trÆ°á»›c", file: seller.idCardFront }, { label: "Máº·t sau", file: seller.idCardBack }].map(({ label, file }) => (
                    <div key={label}>
                      <p className="text-xs font-medium text-muted-foreground mb-2">{label}</p>
                      {file?.url ? (
                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-border overflow-hidden bg-muted/30 hover:opacity-95 transition-opacity">
                          <Image
                            src={file.url}
                            alt={`CCCD ${label}`}
                            width={400}
                            height={250}
                            className="w-full h-auto object-contain max-h-[280px]"
                          />
                        </a>
                      ) : (
                        <div className="w-full h-32 rounded-xl border border-border bg-muted/40 flex items-center justify-center text-sm text-muted-foreground">
                          ChÆ°a cÃ³ áº£nh
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          </div>

          {/* LÃ½ do tá»« chá»‘i / khÃ³a - full width */}
          {(seller.verificationStatus === "pending" || seller.verificationStatus === "approved") && (
            <div className="rounded-xl border border-border bg-background p-5">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                {seller.verificationStatus === "pending"
                  ? "LÃ½ do tá»« chá»‘i (náº¿u tá»« chá»‘i)"
                  : "LÃ½ do khÃ³a (báº¯t buá»™c khi khÃ³a)"}
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => onRejectReasonChange(e.target.value)}
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                rows={2}
                placeholder={
                  seller.verificationStatus === "pending"
                    ? "Nháº­p lÃ½ do tá»« chá»‘i..."
                    : "Nháº­p lÃ½ do khÃ³a tÃ i khoáº£n..."
                }
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end border-t border-border px-5 py-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            ÄÃ³ng
          </button>
          {seller.verificationStatus === "pending" && (
            <>
              <button
                type="button"
                onClick={onReject}
                disabled={isUpdating}
                className="rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50 transition-colors"
              >
                Tá»« chá»‘i
              </button>
              <button
                type="button"
                onClick={onApprove}
                disabled={isUpdating}
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                Duyá»‡t seller
              </button>
            </>
          )}
          {seller.verificationStatus === "approved" && (
            <button
              type="button"
              onClick={onBan}
              disabled={isUpdating || !rejectReason.trim()}
              className="rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50 transition-colors"
            >
              KhÃ³a tÃ i khoáº£n
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
