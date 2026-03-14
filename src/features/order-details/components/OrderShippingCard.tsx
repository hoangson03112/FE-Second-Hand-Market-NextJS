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
    <div className="bg-cream-50 border border-border rounded-2xl overflow-hidden">
      <div
        className={`px-5 py-3 flex items-center gap-2.5 border-b border-border ${
          isLP ? "bg-emerald-50 dark:bg-emerald-950/20" : "bg-blue-50 dark:bg-blue-950/20"
        }`}
      >
        {isLP ? (
          <IconUsers className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        ) : (
          <IconTruck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
        )}
        <span
          className={`text-sm font-semibold ${
            isLP ? "text-emerald-700 dark:text-emerald-400" : "text-blue-700 dark:text-blue-400"
          }`}
        >
          {formatShippingMethod(shippingMethod)}
        </span>
      </div>
      {!isLP && shippingAddress ? (
        <div className="px-5 py-4 flex items-start gap-3">
          <IconMapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{shippingAddress.fullName}</p>
            <p className="text-xs text-muted-foreground">{shippingAddress.phoneNumber}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
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
        <div className="px-5 py-4 flex items-start gap-3">
          <IconMapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            Người bán và người mua tự thỏa thuận địa điểm gặp mặt.
          </p>
        </div>
      ) : null}
    </div>
  );
}
