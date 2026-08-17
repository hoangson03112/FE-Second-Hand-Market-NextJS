import {
  IconCalendar,
  IconCircleCheck,
  IconCircleX,
  IconClockHour4,
  IconCreditCard,
} from "@tabler/icons-react";
import { format, formatDateOnly } from "@/utils/format/date";
import { formatPaymentMethod } from "@/utils/format";
import { Panel } from "@/features/order/components";
import { cn } from "@/lib/utils";

interface OrderMetaCardProps {
  createdAt: string;
  expectedDeliveryTime?: string | null;
  paymentMethod: string;
  shippingMethod: string;
  statusPayment: boolean;
  isLocalPickup: boolean;
  hideExpectedDelivery?: boolean;
}

function MetaRow({
  icon: Icon,
  label,
  value,
  aside,
}: {
  icon: typeof IconCalendar;
  label: string;
  value: string;
  aside?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3.5 px-5 py-4 sm:px-6">
      <Icon
        className="h-4 w-4 shrink-0 text-luxury-champagne"
        strokeWidth={1.75}
      />
      <div className="min-w-0 flex-1">
        <p className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-500">
          {label}
        </p>
        <p className="mt-1 truncate text-sm text-luxury-ink">{value}</p>
      </div>
      {aside}
    </div>
  );
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
    <Panel eyebrow="Thông tin" title="Đơn hàng" padding="flush">
      <div className="divide-y divide-luxury-ink/8">
        <MetaRow
          icon={IconCalendar}
          label="Thời gian đặt hàng"
          value={format(createdAt)}
        />

        {expectedDeliveryTime && !isLocalPickup && !hideExpectedDelivery && (
          <MetaRow
            icon={IconClockHour4}
            label="Dự kiến giao"
            value={formatDateOnly(expectedDeliveryTime)}
          />
        )}

        <MetaRow
          icon={IconCreditCard}
          label="Thanh toán"
          value={formatPaymentMethod(paymentMethod, { shippingMethod })}
          aside={
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-[2px] border px-2 py-1 text-2xs font-bold uppercase tracking-[0.15em]",
                statusPayment
                  ? "border-accent/35 bg-taupe-50 text-taupe-700"
                  : "border-luxury-ink/12 bg-cream-50 text-neutral-600",
              )}
            >
              {statusPayment ? (
                <IconCircleCheck className="h-3.5 w-3.5" strokeWidth={2} />
              ) : (
                <IconCircleX className="h-3.5 w-3.5" strokeWidth={2} />
              )}
              {statusPayment ? "Đã TT" : "Chưa TT"}
            </span>
          }
        />
      </div>
    </Panel>
  );
}
