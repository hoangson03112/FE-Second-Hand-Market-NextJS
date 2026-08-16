import { IconBuildingBank, IconExternalLink } from "@tabler/icons-react";
import { BANK_CODE_MAP } from "@/constants";
import { REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER } from "@/constants/refund";
import { Panel } from "@/features/order/components";
import { cn } from "@/lib/utils";

const BANK_OPTIONS = Object.keys(BANK_CODE_MAP);

interface RefundBankInfo {
  buyerBankName?: string;
  buyerAccountNumber?: string;
  buyerAccountHolder?: string;
}

interface OrderBankInfoCardProps {
  status: string;
  refundStatus?: string | null;
  ghnReturnOrderCode?: string | null;
  ghnReturnTrackingUrl?: string | null;
  refundBankInfo?: RefundBankInfo | null;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  isSubmittingBankInfo: boolean;
  onBankNameChange: (v: string) => void;
  onAccountNumberChange: (v: string) => void;
  onAccountHolderChange: (v: string) => void;
  onSubmitBankInfo: (e: React.FormEvent) => void;
}

const INPUT_CLASS =
  "w-full rounded-[2px] border border-luxury-ink/15 bg-white px-3.5 py-2.5 text-sm text-luxury-ink outline-none transition-colors duration-300 placeholder:text-neutral-400 hover:border-luxury-ink/25 focus:border-luxury-champagne";

const FIELD_LABEL =
  "mb-2 block text-2xs font-bold uppercase tracking-[0.2em] text-neutral-500";

export function OrderBankInfoCard({
  status: orderStatus,
  refundStatus,
  ghnReturnOrderCode,
  ghnReturnTrackingUrl,
  refundBankInfo,
  bankName,
  accountNumber,
  accountHolder,
  isSubmittingBankInfo,
  onBankNameChange,
  onAccountNumberChange,
  onAccountHolderChange,
  onSubmitBankInfo,
}: OrderBankInfoCardProps) {
  const showGhnSection =
    refundStatus === "return_shipping" ||
    refundStatus === "returning" ||
    orderStatus === "returning" ||
    orderStatus === "return_shipping";

  const hasBankInfo = Boolean(refundBankInfo?.buyerAccountNumber);
  const showBankSubmitted =
    hasBankInfo &&
    (refundStatus === "processing" ||
      refundStatus === "returned" ||
      refundStatus === "bank_info_required");
  const showBankForm =
    !hasBankInfo &&
    (refundStatus === "returned" || refundStatus === "bank_info_required");

  const cardTitle =
    showGhnSection && !showBankForm && !showBankSubmitted
      ? "Vận đơn hoàn trả"
      : "Thông tin ngân hàng nhận tiền";

  const legacyBankName =
    bankName.trim() && !BANK_OPTIONS.includes(bankName) ? bankName.trim() : null;

  const accountFields = [
    {
      label: "Số tài khoản",
      value: accountNumber,
      setter: onAccountNumberChange,
      placeholder: "Nhập số tài khoản…",
    },
    {
      label: "Tên chủ tài khoản",
      value: accountHolder,
      setter: onAccountHolderChange,
      placeholder: "Tên đầy đủ trên tài khoản…",
    },
  ];

  return (
    <Panel eyebrow="Hoàn tiền" title={cardTitle} bodyClassName="space-y-5">
      {showGhnSection && (
        <div className="space-y-4">
          <p className="rounded-[2px] border border-luxury-ink/10 bg-cream-50 px-4 py-3 text-xs leading-relaxed text-neutral-600">
            {REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER}
          </p>
          <p className="text-sm leading-relaxed text-neutral-600">
            Vui lòng đến bưu cục GHN gần nhất để gửi hàng theo mã vận đơn hoàn
            trả (nếu đơn dùng GHN).
          </p>

          {ghnReturnOrderCode && (
            <div className="rounded-[2px] border border-luxury-champagne/40 bg-luxury-champagne/8 px-4 py-3.5">
              <p className="text-2xs font-bold uppercase tracking-[0.2em] text-neutral-600">
                Mã vận đơn hoàn trả
              </p>
              <p className="mt-1.5 font-mono text-sm font-bold text-luxury-ink">
                {ghnReturnOrderCode}
              </p>
              {ghnReturnTrackingUrl && (
                <a
                  href={ghnReturnTrackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-2.5 inline-flex items-center gap-1.5 text-2xs font-bold uppercase tracking-[0.2em] text-luxury-ink underline decoration-luxury-champagne underline-offset-4 transition-colors hover:text-accent"
                >
                  Xem trên GHN
                  <IconExternalLink className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {showBankSubmitted && refundBankInfo && (
        <div
          className={cn(
            "rounded-[2px] border border-accent/35 bg-taupe-50 px-4 py-4",
            showGhnSection && "border-t",
          )}
        >
          <p className="text-2xs font-bold uppercase tracking-[0.2em] text-taupe-700">
            {refundStatus === "processing"
              ? "Đã gửi STK — admin sẽ chuyển khoản"
              : "Đã gửi — chờ admin xử lý hoàn tiền"}
          </p>
          <dl className="mt-3 space-y-1.5 text-sm">
            <div className="flex gap-2">
              <dt className="text-neutral-500">Ngân hàng:</dt>
              <dd className="font-medium text-luxury-ink">
                {refundBankInfo.buyerBankName}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-neutral-500">Số TK:</dt>
              <dd className="font-mono font-medium text-luxury-ink">
                {refundBankInfo.buyerAccountNumber}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-neutral-500">Chủ TK:</dt>
              <dd className="font-medium text-luxury-ink">
                {refundBankInfo.buyerAccountHolder}
              </dd>
            </div>
          </dl>
        </div>
      )}

      {showBankForm && (
        <form
          onSubmit={onSubmitBankInfo}
          className={cn(
            "space-y-5",
            showGhnSection && "border-t border-luxury-ink/10 pt-5",
          )}
        >
          <p className="text-sm leading-relaxed text-neutral-600">
            Người bán đã xác nhận nhận hàng hoàn. Vui lòng nhập tài khoản ngân
            hàng của bạn để admin chuyển khoản hoàn tiền (tiền đang được giữ /
            đối soát theo quy trình sàn).
          </p>

          <div>
            <label htmlFor="refund-bank-name" className={FIELD_LABEL}>
              Tên ngân hàng
            </label>
            <div className="relative">
              <select
                id="refund-bank-name"
                value={bankName}
                onChange={(e) => onBankNameChange(e.target.value)}
                required
                className={cn(INPUT_CLASS, "appearance-none pl-10")}
              >
                <option value="">Chọn ngân hàng</option>
                {legacyBankName && (
                  <option value={legacyBankName}>{legacyBankName}</option>
                )}
                {BANK_OPTIONS.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <IconBuildingBank
                aria-hidden
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-luxury-champagne"
                strokeWidth={1.75}
              />
            </div>
          </div>

          {accountFields.map(({ label, value, setter, placeholder }) => (
            <div key={label}>
              <label htmlFor={`refund-${label}`} className={FIELD_LABEL}>
                {label}
              </label>
              <input
                id={`refund-${label}`}
                type="text"
                value={value}
                onChange={(e) => setter(e.target.value)}
                required
                placeholder={placeholder}
                className={INPUT_CLASS}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={
              isSubmittingBankInfo ||
              !bankName.trim() ||
              !accountNumber.trim() ||
              !accountHolder.trim()
            }
            className="w-full rounded-[2px] bg-luxury-ink py-3.5 text-[11px] font-bold uppercase tracking-[0.22em] text-luxury-ivory transition-all duration-300 hover:bg-charcoal-800 disabled:opacity-50"
          >
            {isSubmittingBankInfo ? "Đang gửi…" : "Gửi thông tin nhận hoàn tiền"}
          </button>
        </form>
      )}
    </Panel>
  );
}
