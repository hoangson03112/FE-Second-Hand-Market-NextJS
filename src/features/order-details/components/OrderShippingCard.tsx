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
    <div className="bg-gradient-to-br from-cream-50 to-white border-2 border-border rounded-2xl overflow-hidden shadow-md">
      <div
        className={`px-5 py-3 flex items-center gap-2.5 border-b-2 border-border ${
          isLP ? "bg-emerald-50" : "bg-blue-50"
        }`}
      >
        {isLP ? (
          <IconUsers className="w-4 h-4 text-emerald-600 shrink-0" />
        ) : (
          <IconTruck className="w-4 h-4 text-blue-600 shrink-0" />
        )}
        <span
          className={`text-sm font-semibold ${
            isLP ? "text-emerald-700" : "text-blue-700"
          }`}
        >
          {formatShippingMethod(shippingMethod)}
        </span>
      </div>
      {!isLP && shippingAddress ? (
        <div className="px-5 py-4 flex items-start gap-3">
          <IconMapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-taupe-900">{shippingAddress.fullName}</p>
            <p className="text-xs text-taupe-500">{shippingAddress.phoneNumber}</p>
            <p className="text-xs text-taupe-500 mt-0.5">
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
          <p className="text-sm text-taupe-500">
            Người bán và người mua tự thỏa thuận địa điểm gặp mặt.
          </p>
        </div>
      ) : null}
    </div>
  );
}