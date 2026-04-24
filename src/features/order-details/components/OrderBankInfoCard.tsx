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
  /** Trạng thái đơn hàng (Order.status) — chỉ dùng fallback khi không có refundStatus */
  status: string;
  /** Trạng thái Refund — nguồn đúng cho form STK / vận đơn hoàn khi order vẫn là "refund" */
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
    <div className="bg-cream-50 border border-border rounded-2xl overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center gap-2">
        <IconBuildingBank className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">{cardTitle}</span>
      </div>
      <div className="p-5">
        {showGhnSection && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed border border-border/80 rounded-lg px-3 py-2 bg-muted/20">
              {REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER}
            </p>
            <p className="text-sm text-muted-foreground">
              Vui lòng đến bưu cục GHN gần nhất để gửi hàng theo mã vận đơn hoàn trả (nếu đơn dùng GHN).
            </p>
            {ghnReturnOrderCode && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
                <p className="text-xs text-muted-foreground mb-1">Mã vận đơn hoàn trả</p>
                <p className="font-mono font-semibold text-primary">{ghnReturnOrderCode}</p>
                {ghnReturnTrackingUrl && (
                  <a
                    href={ghnReturnTrackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline mt-1 block"
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
            className={`bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 ${
              showGhnSection ? "mt-4" : ""
            }`}
          >
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
              {rs === "processing"
                ? "Đã gửi STK — Admin sẽ chuyển khoản hoàn tiền"
                : "Đã gửi — Chờ admin xử lý hoàn tiền"}
            </p>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">Ngân hàng:</span>{" "}
                <span className="font-semibold">{refundBankInfo.buyerBankName}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Số TK:</span>{" "}
                <span className="font-mono font-semibold">{refundBankInfo.buyerAccountNumber}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Chủ TK:</span>{" "}
                <span className="font-semibold">{refundBankInfo.buyerAccountHolder}</span>
              </p>
            </div>
          </div>
        )}

        {showBankForm && (
          <form
            onSubmit={onSubmitBankInfo}
            className={`space-y-3 ${showGhnSection ? "mt-4 pt-4 border-t border-border" : ""}`}
          >
            <p className="text-sm text-muted-foreground">
              Người bán đã xác nhận nhận hàng hoàn. Vui lòng nhập tài khoản ngân hàng của bạn để admin
              chuyển khoản hoàn tiền (tiền đang được giữ / đối soát theo quy trình sàn).
            </p>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Tên ngân hàng</label>
              <div className="relative">
                <select
                  value={bankName}
                  onChange={(e) => onBankNameChange(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
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
                <IconBuildingBank className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            {accountFields.map(({ label, value, setter, placeholder }) => (
              <div key={label}>
                <label className="block text-xs font-medium text-foreground mb-1">{label}</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  required
                  placeholder={placeholder}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              {isSubmittingBankInfo ? "Đang gửi..." : "Gửi thông tin nhận hoàn tiền"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
