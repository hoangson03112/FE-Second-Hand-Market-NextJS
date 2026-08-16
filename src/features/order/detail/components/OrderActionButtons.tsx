import Link from "next/link";
import { IconCircleCheck, IconCircleX } from "@tabler/icons-react";
import { Panel } from "@/features/order/components";

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

/** Shared button language with checkout: 2px corners, uppercase micro-caps. */
const BUTTON_BASE =
  "flex w-full items-center justify-center gap-2 rounded-[2px] py-3.5 text-[11px] font-bold uppercase tracking-[0.22em] transition-all duration-300 disabled:opacity-50";

const PRIMARY = `${BUTTON_BASE} bg-luxury-ink text-luxury-ivory hover:bg-charcoal-800`;
const SECONDARY = `${BUTTON_BASE} border border-luxury-ink/15 text-neutral-700 hover:border-luxury-ink/30 hover:text-luxury-ink`;
const DANGER = `${BUTTON_BASE} border border-blush-300 text-blush-700 hover:bg-blush-50`;
const CHAMPAGNE = `${BUTTON_BASE} border border-luxury-champagne bg-cream-50 text-luxury-ink hover:bg-luxury-champagne/15`;

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
    <Panel
      eyebrow="Tiếp theo"
      title={status === "pending" ? "Bạn có thể" : "Xác nhận đơn hàng"}
      bodyClassName="space-y-3"
    >
      {status === "pending" && (
        <button
          type="button"
          onClick={onCancelOrder}
          disabled={isCancelling}
          className={DANGER}
        >
          <IconCircleX className="h-4 w-4" strokeWidth={1.75} />
          {isCancelling ? "Đang hủy…" : "Hủy đơn hàng"}
        </button>
      )}

      {status === "delivered" && (
        <>
          <button
            type="button"
            onClick={onConfirmReceived}
            disabled={isConfirmingReceived}
            className={PRIMARY}
          >
            <IconCircleCheck
              className="h-4 w-4 text-luxury-champagne"
              strokeWidth={1.75}
            />
            {isConfirmingReceived ? "Đang xử lý…" : "Xác nhận đã nhận hàng"}
          </button>

          {!isLocalPickup && (
            <button
              type="button"
              onClick={onOpenRefundModal}
              className={SECONDARY}
            >
              Yêu cầu hoàn tiền
            </button>
          )}
        </>
      )}

      {status === "delivered" && !statusPayment && !isLocalPickup && (
        <Link href={`/payment?orderId=${orderId}`} className={CHAMPAGNE}>
          Thanh toán ngay
        </Link>
      )}
    </Panel>
  );
}
