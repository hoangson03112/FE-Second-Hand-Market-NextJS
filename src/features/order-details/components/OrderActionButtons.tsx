import Link from "next/link";
import { IconCircleCheck, IconCircleX } from "@tabler/icons-react";

interface OrderActionButtonsProps {
  status: string;
  orderId: string;
  statusPayment: boolean;
  isCancelling: boolean;
  isConfirmingReceived: boolean;
  onCancelOrder: () => void;
  onConfirmReceived: () => void;
  onOpenRefundModal: () => void;
}

export function OrderActionButtons({
  status,
  orderId,
  statusPayment,
  isCancelling,
  isConfirmingReceived,
  onCancelOrder,
  onConfirmReceived,
  onOpenRefundModal,
}: OrderActionButtonsProps) {
  const showActions = status === "pending" || status === "delivered";
  if (!showActions) return null;

  return (
    <div className="bg-cream-50 border border-border rounded-2xl p-4 space-y-2.5">
      {status === "pending" && (
        <button
          type="button"
          onClick={onCancelOrder}
          disabled={isCancelling}
          className="w-full py-2.5 bg-destructive text-destructive-foreground rounded-xl text-sm font-semibold hover:bg-destructive/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          <IconCircleX className="w-4 h-4" />
          {isCancelling ? "Đang hủy..." : "Hủy đơn hàng"}
        </button>
      )}
      {status === "delivered" && (
        <>
          <button
            type="button"
            onClick={onConfirmReceived}
            disabled={isConfirmingReceived}
            className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <IconCircleCheck className="w-4 h-4" />
            {isConfirmingReceived ? "Đang xử lý..." : "Xác nhận đã nhận hàng"}
          </button>
          <button
            type="button"
            onClick={onOpenRefundModal}
            className="w-full py-2.5 border border-orange-400 text-orange-600 rounded-xl text-sm font-semibold hover:bg-orange-50 transition-all"
          >
            Yêu cầu hoàn tiền
          </button>
        </>
      )}
      {status === "delivered" && !statusPayment && (
        <Link
          href={`/payment?orderId=${orderId}`}
          className="w-full py-2.5 bg-foreground text-background rounded-xl text-sm font-semibold text-center block hover:bg-foreground/90 transition-all"
        >
          Thanh toán ngay
        </Link>
      )}
    </div>
  );
}
