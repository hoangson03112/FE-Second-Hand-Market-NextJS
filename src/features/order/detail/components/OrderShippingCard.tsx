import { IconMapPin, IconTruck, IconUsers } from "@tabler/icons-react";
import { formatShippingMethod, getShippingMethodType } from "@/utils/format";
import { Panel } from "@/features/order/components";

interface ShippingAddress {
  fullName?: string;
  phoneNumber?: string;
  specificAddress?: string;
  ward?: string;
  district?: string;
  province?: string;
}

interface OrderShippingCardProps {
  shippingMethod: string;
  shippingAddress?: ShippingAddress | null;
}

export function OrderShippingCard({
  shippingMethod,
  shippingAddress,
}: OrderShippingCardProps) {
  const isLocalPickup = getShippingMethodType(shippingMethod) === "local_pickup";
  const Icon = isLocalPickup ? IconUsers : IconTruck;

  return (
    <Panel
      eyebrow="Giao đến"
      title="Vận chuyển"
      padding="flush"
      aside={
        <span className="inline-flex items-center gap-2 rounded-[2px] border border-luxury-ink/12 bg-cream-50 px-2.5 py-1 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-700">
          <Icon className="h-3.5 w-3.5 text-luxury-champagne" strokeWidth={1.75} />
          {formatShippingMethod(shippingMethod)}
        </span>
      }
    >
      <div className="flex items-start gap-3.5 px-5 py-5 sm:px-6">
        <IconMapPin
          className="mt-0.5 h-4 w-4 shrink-0 text-luxury-champagne"
          strokeWidth={1.75}
        />

        {!isLocalPickup && shippingAddress ? (
          <div className="min-w-0">
            <p className="text-sm font-medium text-luxury-ink">
              {shippingAddress.fullName}
            </p>
            <p className="mt-0.5 font-mono text-xs text-neutral-500">
              {shippingAddress.phoneNumber}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-neutral-600">
              {[
                shippingAddress.specificAddress,
                shippingAddress.ward,
                shippingAddress.district,
                shippingAddress.province,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        ) : (
          <p className="text-xs leading-relaxed text-neutral-600">
            Người bán và người mua tự thỏa thuận địa điểm gặp mặt.
          </p>
        )}
      </div>
    </Panel>
  );
}
