import { Copy, Building2 } from "lucide-react";
import { formatPrice } from "@/utils/format/price";

export interface DisplayBankInfo {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  amount: number;
  content: string;
}

export interface PaymentBankInfoProps {
  bankInfoLoading: boolean;
  bankInfoError: string | null;
  displayBankInfo: DisplayBankInfo;
  onCopy: (text: string) => void;
}

export function PaymentBankInfo({
  bankInfoLoading,
  bankInfoError,
  displayBankInfo,
  onCopy,
}: PaymentBankInfoProps) {
  return (
    <div className="bg-white rounded-lg border border-border p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <Building2 className="h-5 w-5 text-blue-600" />
        </div>
        <h2 className="font-semibold text-foreground">
          Thông tin chuyển khoản
        </h2>
      </div>

      {bankInfoLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
        </div>
      ) : bankInfoError ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{bankInfoError}</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground">Ngân hàng:</span>
            <span className="font-medium">{displayBankInfo.bankName}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground">Số tài khoản:</span>
            <div className="flex items-center gap-2">
              <span className="font-medium font-mono">
                {displayBankInfo.accountNumber}
              </span>
              <button
                onClick={() => onCopy(displayBankInfo.accountNumber)}
                className="p-1 hover:bg-background rounded transition-colors"
                title="Sao chép"
              >
                <Copy className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground">Chủ tài khoản:</span>
            <span className="font-medium text-right max-w-[200px] truncate">
              {displayBankInfo.accountHolder}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground">Số tiền:</span>
            <span className="font-bold text-primary">
              {formatPrice(displayBankInfo.amount)}
            </span>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-sm text-muted-foreground">Nội dung:</span>
              <button
                onClick={() => onCopy(displayBankInfo.content)}
                className="p-1 hover:bg-background rounded transition-colors flex-shrink-0"
                title="Sao chép"
              >
                <Copy className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <p className="font-medium text-xs break-all">
              {displayBankInfo.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
