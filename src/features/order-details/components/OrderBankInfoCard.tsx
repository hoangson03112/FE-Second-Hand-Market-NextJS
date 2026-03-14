import { IconBuildingBank } from "@tabler/icons-react";

interface RefundBankInfo {
  buyerBankName?: string;
  buyerAccountNumber?: string;
  buyerAccountHolder?: string;
}

interface OrderBankInfoCardProps {
  status: string;
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
  status,
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
  const isReturning = status === "returning";
  const isReturned = status === "returned";
  const hasBankInfo = refundBankInfo?.buyerAccountNumber;

  const fields = [
    {
      label: "Tên ngân hàng",
      value: bankName,
      setter: onBankNameChange,
      placeholder: "VD: Vietcombank, Techcombank...",
    },
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
        <span className="text-sm font-semibold text-foreground">
          {isReturning ? "Vận đơn hoàn trả" : "Thông tin ngân hàng nhận tiền"}
        </span>
      </div>
      <div className="p-5">
        {isReturning && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Vui lòng đến bưu cục GHN gần nhất để gửi hàng theo mã vận đơn hoàn trả.
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
        {isReturned && hasBankInfo && (
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3">
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
              Đã gửi — Chờ admin xử lý hoàn tiền
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
        {isReturned && !hasBankInfo && (
          <form onSubmit={onSubmitBankInfo} className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Hàng đã về người bán. Vui lòng cung cấp thông tin ngân hàng để nhận tiền hoàn.
            </p>
            {fields.map(({ label, value, setter, placeholder }) => (
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
              {isSubmittingBankInfo ? "Đang gửi..." : "Xác nhận thông tin ngân hàng"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
