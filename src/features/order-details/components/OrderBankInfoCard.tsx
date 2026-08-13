import { IconBuildingBank } from "@tabler/icons-react";
import { BANK_CODE_MAP } from "@/constants";
import { REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER } from "@/constants/refund";

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

const inputClass =
  "w-full border border-luxury-ink/15 bg-white px-3 py-2 text-sm text-luxury-ink placeholder:text-taupe-400/70 outline-none transition-colors duration-300 hover:border-luxury-ink/25 focus:border-luxury-champagne";

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
  const rs = refundStatus ?? null;
  const showGhnSection =
    rs === "return_shipping" ||
    rs === "returning" ||
    orderStatus === "returning" ||
    orderStatus === "return_shipping";

  const hasBankInfo = Boolean(refundBankInfo?.buyerAccountNumber);
  const showBankSubmitted =
    hasBankInfo && (rs === "processing" || rs === "returned" || rs === "bank_info_required");
  const showBankForm =
    !hasBankInfo && (rs === "returned" || rs === "bank_info_required");

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
      placeholder: "Nhập số tài khoản...",
    },
    {
      label: "Tên chủ tài khoản",
      value: accountHolder,
      setter: onAccountHolderChange,
      placeholder: "Tên đầy đủ trên tài khoản...",
    },
  ];

  return (
    <div className="overflow-hidden border border-luxury-ink/8 bg-white/60" style={{ borderRadius: "2px" }}>
      <div className="flex items-center gap-2 border-b border-luxury-ink/8 px-5 py-3">
        <IconBuildingBank className="h-4 w-4 text-luxury-champagne" strokeWidth={1.75} />
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-600">{cardTitle}</span>
      </div>
      <div className="p-5">
        {showGhnSection && (
          <div className="space-y-3">
            <p className="border border-luxury-ink/8 bg-cream-50 px-3 py-2 text-xs leading-relaxed text-neutral-600" style={{ borderRadius: "2px" }}>
              {REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER}
            </p>
            <p className="text-sm text-neutral-500">
              Vui lòng đến bưu cục GHN gần nhất để gửi hàng theo mã vận đơn hoàn trả (nếu đơn dùng GHN).
            </p>
            {ghnReturnOrderCode && (
              <div className="border border-luxury-champagne/30 bg-luxury-champagne/8 p-3" style={{ borderRadius: "2px" }}>
                <p className="mb-1 text-xs text-neutral-500">Mã vận đơn hoàn trả</p>
                <p className="font-mono font-semibold text-luxury-ink">{ghnReturnOrderCode}</p>
                {ghnReturnTrackingUrl && (
                  <a
                    href={ghnReturnTrackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-xs text-luxury-ink underline decoration-luxury-champagne underline-offset-2 hover:text-accent"
                  >
                    Xem trên GHN →
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {showBankSubmitted && refundBankInfo && (
          <div
            className={`border border-emerald-200 bg-emerald-50 p-3 ${showGhnSection ? "mt-4" : ""}`}
            style={{ borderRadius: "2px" }}
          >
            <p className="mb-2 text-xs font-semibold text-emerald-700">
              {rs === "processing"
                ? "Đã gửi STK — Admin sẽ chuyển khoản hoàn tiền"
                : "Đã gửi — Chờ admin xử lý hoàn tiền"}
            </p>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-neutral-500">Ngân hàng:</span>{" "}
                <span className="font-semibold text-luxury-ink">{refundBankInfo.buyerBankName}</span>
              </p>
              <p>
                <span className="text-neutral-500">Số TK:</span>{" "}
                <span className="font-mono font-semibold text-luxury-ink">{refundBankInfo.buyerAccountNumber}</span>
              </p>
              <p>
                <span className="text-neutral-500">Chủ TK:</span>{" "}
                <span className="font-semibold text-luxury-ink">{refundBankInfo.buyerAccountHolder}</span>
              </p>
            </div>
          </div>
        )}

        {showBankForm && (
          <form
            onSubmit={onSubmitBankInfo}
            className={`space-y-3 ${showGhnSection ? "mt-4 border-t border-luxury-ink/8 pt-4" : ""}`}
          >
            <p className="text-sm text-neutral-500">
              Người bán đã xác nhận nhận hàng hoàn. Vui lòng nhập tài khoản ngân hàng của bạn để admin
              chuyển khoản hoàn tiền (tiền đang được giữ / đối soát theo quy trình sàn).
            </p>
            <div>
              <label className="mb-1 block text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">Tên ngân hàng</label>
              <div className="relative">
                <select
                  value={bankName}
                  onChange={(e) => onBankNameChange(e.target.value)}
                  required
                  className={`${inputClass} appearance-none pl-9 pr-3`}
                  style={{ borderRadius: "2px" }}
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
                <IconBuildingBank className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-taupe-400" strokeWidth={1.75} />
              </div>
            </div>
            {accountFields.map(({ label, value, setter, placeholder }) => (
              <div key={label}>
                <label className="mb-1 block text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">{label}</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  required
                  placeholder={placeholder}
                  className={inputClass}
                  style={{ borderRadius: "2px" }}
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
              className="w-full bg-luxury-ink py-2.5 text-sm font-semibold text-luxury-ivory transition-all duration-300 hover:bg-charcoal-800 disabled:opacity-50"
              style={{ borderRadius: "2px" }}
            >
              {isSubmittingBankInfo ? "Đang gửi..." : "Gửi thông tin nhận hoàn tiền"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}