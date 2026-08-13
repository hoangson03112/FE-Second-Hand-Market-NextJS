import { IconMapPin, IconTruck, IconUsers } from "@tabler/icons-react";
import { formatShippingMethod, getShippingMethodType } from "@/utils/format";

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

export function OrderShippingCard({ shippingMethod, shippingAddress }: OrderShippingCardProps) {
  const shippingType = getShippingMethodType(shippingMethod);
  const isLP = shippingType === "local_pickup";

  return (
    <div className="overflow-hidden border border-luxury-ink/8 bg-white/60" style={{ borderRadius: "2px" }}>
      <div className="flex items-center gap-2.5 border-b border-luxury-ink/8 bg-cream-50 px-5 py-3">
        {isLP ? (
          <IconUsers className="h-4 w-4 shrink-0 text-luxury-champagne" strokeWidth={1.75} />
        ) : (
          <IconTruck className="h-4 w-4 shrink-0 text-luxury-champagne" strokeWidth={1.75} />
        )}
        <span className="text-sm font-semibold text-luxury-ink">
          {formatShippingMethod(shippingMethod)}
        </span>
      </div>
      {!isLP && shippingAddress ? (
        <div className="flex items-start gap-3 px-5 py-4">
          <IconMapPin className="mt-0.5 h-4 w-4 shrink-0 text-taupe-400" strokeWidth={1.75} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-luxury-ink">{shippingAddress.fullName}</p>
            <p className="text-xs text-taupe-400">{shippingAddress.phoneNumber}</p>
            <p className="mt-0.5 text-xs text-neutral-500">
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
        </div>
      ) : isLP ? (
        <div className="flex items-start gap-3 px-5 py-4">
          <IconMapPin className="mt-0.5 h-4 w-4 shrink-0 text-taupe-400" strokeWidth={1.75} />
          <p className="text-sm text-neutral-500">
            Người bán và người mua tự thỏa thuận địa điểm gặp mặt.
          </p>
        </div>
      ) : null}
    </div>
  );
}