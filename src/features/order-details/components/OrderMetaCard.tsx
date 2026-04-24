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
    <div className="bg-cream-50 border border-border rounded-2xl overflow-hidden">
      <div className="divide-y divide-border">
        <div className="flex items-center gap-3 px-5 py-3.5">
          <IconCalendar className="w-4 h-4 text-primary shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Thời gian đặt hàng</p>
            <p className="text-sm font-medium text-foreground">{format(createdAt)}</p>
          </div>
        </div>
        {expectedDeliveryTime && !isLocalPickup && !hideExpectedDelivery && (
          <div className="flex items-center gap-3 px-5 py-3.5">
            <IconClockHour4 className="w-4 h-4 text-primary shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Dự kiến giao</p>
              <p className="text-sm font-medium text-foreground">
                {formatDateOnly(expectedDeliveryTime)}
              </p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-3 px-5 py-3.5">
          <IconCreditCard className="w-4 h-4 text-primary shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Thanh toán</p>
            <p className="text-sm font-medium text-foreground">
              {formatPaymentMethod(paymentMethod, { shippingMethod })}
            </p>
          </div>
          <span
            className={`flex items-center gap-1 text-xs font-medium shrink-0 ${
              statusPayment ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {statusPayment ? (
              <>
                <IconCircleCheck className="w-3.5 h-3.5" />
                Đã TT
              </>
            ) : (
              <>
                <IconCircleX className="w-3.5 h-3.5" />
                Chưa TT
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
