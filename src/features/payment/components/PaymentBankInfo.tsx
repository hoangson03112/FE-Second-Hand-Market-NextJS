import { IconCopy, IconBuilding } from "@tabler/icons-react";
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
    <div className="bg-gradient-to-br from-cream-50 to-white rounded-2xl border-2 border-border p-6 shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <IconBuilding className="h-5 w-5 text-primary" />
        </div>
        <h2 className="font-semibold text-taupe-900 uppercase tracking-wide text-sm">
          Thông tin chuyển khoản
        </h2>
      </div>

      {bankInfoLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
        </div>
      ) : bankInfoError ? (
        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
          <p className="text-sm text-red-600">{bankInfoError}</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-taupe-50/60 rounded-xl">
            <span className="text-sm text-taupe-500">Ngân hàng:</span>
            <span className="font-medium text-taupe-900">{displayBankInfo.bankName}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-taupe-50/60 rounded-xl">
            <span className="text-sm text-taupe-500">Số tài khoản:</span>
            <div className="flex items-center gap-2">
              <span className="font-medium font-mono text-taupe-900">
                {displayBankInfo.accountNumber}
              </span>
              <button
                onClick={() => onCopy(displayBankInfo.accountNumber)}
                className="p-1 hover:bg-white rounded-full transition-colors"
                title="Sao chép"
              >
                <IconCopy className="h-4 w-4 text-taupe-500" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-taupe-50/60 rounded-xl">
            <span className="text-sm text-taupe-500">Chủ tài khoản:</span>
            <span className="font-medium text-taupe-900 text-right max-w-[200px] truncate">
              {displayBankInfo.accountHolder.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-taupe-50/60 rounded-xl">
            <span className="text-sm text-taupe-500">Số tiền:</span>
            <span className="font-bold text-primary">
              {formatPrice(displayBankInfo.amount)}
            </span>
          </div>
          <div className="p-3 bg-taupe-50/60 rounded-xl">
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-sm text-taupe-500">Nội dung:</span>
              <button
                onClick={() => onCopy(displayBankInfo.content)}
                className="p-1 hover:bg-white rounded-full transition-colors flex-shrink-0"
                title="Sao chép"
              >
                <IconCopy className="h-4 w-4 text-taupe-500" />
              </button>
            </div>
            <p className="font-medium text-xs text-taupe-900 break-all">
              {displayBankInfo.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}