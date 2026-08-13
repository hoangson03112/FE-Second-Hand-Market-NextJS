import { IconReceipt2 } from "@tabler/icons-react";
import { formatPrice } from "@/utils/format/price";
import { format } from "@/utils/format/date";
import { PayoutStatusBadge } from "./PayoutStatusBadge";
import type { SellerPayout } from "../hooks/useSellerWallet";

interface PayoutHistoryListProps {
  payouts: SellerPayout[];
  total: number;
  error: string | null;
}

export function PayoutHistoryList({ payouts, total, error }: PayoutHistoryListProps) {
  if (error) {
    return (
      <div className="rounded-xl bg-red-50 border-2 border-red-200 p-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (payouts.length === 0) {
    return (
      <div className="text-center py-10">
        <IconReceipt2 className="w-10 h-10 text-taupe-300 mx-auto mb-3" />
        <p className="text-sm text-taupe-500">Chưa có giao dịch nào</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs text-taupe-500 mb-3">
        {total} giao dịch — hiển thị {payouts.length} mới nhất
      </p>
      <div className="divide-y divide-border">
        {payouts.map((payout) => (
          <div key={payout._id} className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-taupe-900">
                {formatPrice(payout.amount)}
              </p>
              <p className="text-xs text-taupe-500 mt-0.5">
                {format(payout.createdAt)}
                {payout.bankName && ` · ${payout.bankName}`}
                {payout.accountNumber && ` ****${payout.accountNumber.slice(-4)}`}
              </p>
              {payout.note && (
                <p className="text-xs text-taupe-400 mt-0.5 line-clamp-1">{payout.note}</p>
              )}
            </div>
            <PayoutStatusBadge status={payout.status} />
          </div>
        ))}
      </div>
    </div>
  );
}