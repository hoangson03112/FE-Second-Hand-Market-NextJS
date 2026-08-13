import { IconCalendar, IconCircleCheck, IconCircleX, IconClockHour4, IconCreditCard } from "@tabler/icons-react";
import { format, formatDateOnly } from "@/utils/format/date";
import { formatPaymentMethod } from "@/utils/format";

interface OrderMetaCardProps {
  createdAt: string;
  expectedDeliveryTime?: string | null;
  paymentMethod: string;
  shippingMethod: string;
  statusPayment: boolean;
  isLocalPickup: boolean;
  hideExpectedDelivery?: boolean;
}

export function OrderMetaCard({
  createdAt,
  expectedDeliveryTime,
  paymentMethod,
  shippingMethod,
  statusPayment,
  isLocalPickup,
  hideExpectedDelivery = false,
}: OrderMetaCardProps) {
  return (
    <div className="overflow-hidden border border-luxury-ink/8 bg-white/60" style={{ borderRadius: "2px" }}>
      <div className="divide-y divide-luxury-ink/6">
        <div className="flex items-center gap-3 px-5 py-3.5">
          <IconCalendar className="h-4 w-4 shrink-0 text-luxury-champagne" strokeWidth={1.75} />
          <div className="flex-1">
            <p className="text-xs text-taupe-400">Thời gian đặt hàng</p>
            <p className="text-sm font-medium text-luxury-ink">{format(createdAt)}</p>
          </div>
        </div>
        {expectedDeliveryTime && !isLocalPickup && !hideExpectedDelivery && (
          <div className="flex items-center gap-3 px-5 py-3.5">
            <IconClockHour4 className="h-4 w-4 shrink-0 text-luxury-champagne" strokeWidth={1.75} />
            <div className="flex-1">
              <p className="text-xs text-taupe-400">Dự kiến giao</p>
              <p className="text-sm font-medium text-luxury-ink">
                {formatDateOnly(expectedDeliveryTime)}
              </p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-3 px-5 py-3.5">
          <IconCreditCard className="h-4 w-4 shrink-0 text-luxury-champagne" strokeWidth={1.75} />
          <div className="flex-1">
            <p className="text-xs text-taupe-400">Thanh toán</p>
            <p className="text-sm font-medium text-luxury-ink">
              {formatPaymentMethod(paymentMethod, { shippingMethod })}
            </p>
          </div>
          <span className={`flex shrink-0 items-center gap-1 text-xs font-medium ${statusPayment ? "text-luxury-ink" : "text-taupe-400"}`}>
            {statusPayment ? (
              <>
                <IconCircleCheck className="h-3.5 w-3.5 text-luxury-champagne" />
                Đã TT
              </>
            ) : (
              <>
                <IconCircleX className="h-3.5 w-3.5" />
                Chưa TT
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}