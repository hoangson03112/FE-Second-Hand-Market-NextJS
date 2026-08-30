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

export function PayoutHistoryList({
  payouts,
  total,
  error,
}: PayoutHistoryListProps) {
  if (error) {
    return (
      <div className="rounded-[22px] border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (payouts.length === 0) {
    return (
      <div className="py-10 text-center">
        <IconReceipt2 className="mx-auto mb-3 h-10 w-10 text-charcoal-300" />
        <p className="text-sm text-charcoal-500">Chưa có giao dịch nào</p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-3 text-xs uppercase tracking-[0.12em] text-charcoal-400">
        {total} giao dịch — hiển thị {payouts.length} mới nhất
      </p>
      <div className="divide-y divide-taupe-200/70">
        {payouts.map((payout) => {
          const amount = payout.amount ?? payout.totalAmount ?? 0;
          const status = (payout.status ?? payout.payoutStatus ?? "pending") as
            | "pending"
            | "processing"
            | "completed"
            | "failed";
          const createdAt = payout.createdAt ?? new Date().toISOString();
          const bankName = payout.bankName ?? "";
          const accountNumber = payout.accountNumber ?? "";
          const note = payout.note ?? "";

          return (
            <div
              key={payout._id}
              className="flex items-center justify-between gap-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-bold text-luxury-ink">
                  {formatPrice(amount)}
                </p>
                <p className="mt-0.5 text-xs text-charcoal-500">
                  {format(createdAt)}
                  {bankName && ` · ${bankName}`}
                  {accountNumber && ` ****${accountNumber.slice(-4)}`}
                </p>
                {note && (
                  <p className="mt-0.5 line-clamp-1 text-xs text-charcoal-400">
                    {note}
                  </p>
                )}
              </div>
              <PayoutStatusBadge status={status} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
