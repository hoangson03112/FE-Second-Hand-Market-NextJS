import Link from "next/link";
import { IconCircleCheck, IconCircleX } from "@tabler/icons-react";

interface OrderActionButtonsProps {
  status: string;
  orderId: string;
  statusPayment: boolean;
  isLocalPickup: boolean;
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
  isLocalPickup,
  isCancelling,
  isConfirmingReceived,
  onCancelOrder,
  onConfirmReceived,
  onOpenRefundModal,
}: OrderActionButtonsProps) {
  const showActions = status === "pending" || status === "delivered";
  if (!showActions) return null;

  return (
    <div
      className="space-y-2.5 border border-luxury-ink/8 bg-white/60 p-4"
      style={{ borderRadius: "2px" }}
    >
      {status === "pending" && (
        <button
          type="button"
          onClick={onCancelOrder}
          disabled={isCancelling}
          className="flex w-full items-center justify-center gap-2 border border-red-200 py-2.5 text-sm font-bold text-red-600 transition-all duration-300 hover:bg-red-50 disabled:opacity-50"
          style={{ borderRadius: "2px" }}
        >
          <IconCircleX className="h-4 w-4" strokeWidth={1.75} />
          {isCancelling ? "Đang hủy..." : "Hủy đơn hàng"}
        </button>
      )}
      {status === "delivered" && (
        <>
          <button
            type="button"
            onClick={onConfirmReceived}
            disabled={isConfirmingReceived}
            className="flex w-full items-center justify-center gap-2 bg-luxury-ink py-2.5 text-sm font-bold text-luxury-ivory transition-all duration-300 hover:bg-charcoal-800 disabled:opacity-50"
            style={{ borderRadius: "2px" }}
          >
            <IconCircleCheck
              className="h-4 w-4 text-luxury-champagne"
              strokeWidth={1.75}
            />
            {isConfirmingReceived ? "Đang xử lý..." : "Xác nhận đã nhận hàng"}
          </button>
          {!isLocalPickup && (
            <button
              type="button"
              onClick={onOpenRefundModal}
              className="w-full border border-luxury-ink/15 py-2.5 text-sm font-bold text-neutral-600 transition-all duration-300 hover:border-luxury-ink/30 hover:text-luxury-ink"
              style={{ borderRadius: "2px" }}
            >
              Yêu cầu hoàn tiền
            </button>
          )}
        </>
      )}
      {status === "delivered" && !statusPayment && !isLocalPickup && (
        <Link
          href={`/payment?orderId=${orderId}`}
          className="block w-full border border-luxury-champagne bg-cream-50 py-2.5 text-center text-sm font-bold text-luxury-ink transition-all duration-300 hover:bg-luxury-champagne/15"
          style={{ borderRadius: "2px" }}
        >
          Thanh toán ngay
        </Link>
      )}
    </div>
  );
}
