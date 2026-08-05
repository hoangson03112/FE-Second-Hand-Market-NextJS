"use client";

import {
  IconStar,
  IconTruck,
  IconMapPin,
  IconClock,
} from "@tabler/icons-react";
import { ISeller } from "@/types/product";
import { AvatarOrInitials } from "@/components/shared/AvatarOrInitials";
import { getProvinceName } from "@/utils";
import { getMonthYear } from "@/utils/date";

interface SellerInfoCardProps {
  seller: ISeller;
  onContactSeller: () => void;
  location: string;
}

export default function SellerInfoCard({
  seller,
  onContactSeller,
  location,
}: SellerInfoCardProps) {
  const provinceDisplay = getProvinceName(location);
  const joinedMonthYear = getMonthYear(seller?.createdAt);
  const totalActiveProducts = seller?.totalActiveProducts ?? 0;

  return (
    <div className="p-5 rounded-[2px] border border-luxury-ink/10 bg-taupe-50/50 mb-6">
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-400 mb-4">
        Thông tin người bán
      </h3>
      <div className="flex items-start gap-4">
        <AvatarOrInitials
          avatar={seller.avatar as string | { url?: string } | null}
          fullName={seller.fullName ?? ""}
          size={48}
          className="border border-luxury-ink/10 rounded-[2px]"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-luxury-ink text-sm truncate mb-1.5">
            {seller.fullName}
          </h4>
          <div className="space-y-1.5 text-xs text-charcoal-400">
            {seller?.avgRating && (
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <IconStar
                      key={i}
                      className={`h-3.5 w-3.5 ${i < Math.floor(seller.avgRating!) ? "fill-luxury-ink text-luxury-ink" : "fill-charcoal-400 text-charcoal-400"}`}
                    />
                  ))}
                </div>
                <span className="font-bold text-luxury-ink text-xs">
                  {seller.avgRating}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <IconTruck className="h-3.5 w-3.5 text-charcoal-600 shrink-0" />
              <span>{totalActiveProducts} sản phẩm đang bán</span>
            </div>
            {provinceDisplay && (
              <div className="flex items-center gap-2">
                <IconMapPin className="h-3.5 w-3.5 text-charcoal-600 shrink-0" />
                <span>{provinceDisplay}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <IconClock className="h-3.5 w-3.5 text-charcoal-600 shrink-0" />
              <span>Tham gia {joinedMonthYear}</span>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={onContactSeller}
        className="w-full mt-5 border border-luxury-ink/20 bg-white text-luxury-ink py-3 rounded-[2px] text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-luxury-ink hover:text-white transition-colors"
      >
        Chat với người bán
      </button>
    </div>
  );
}
