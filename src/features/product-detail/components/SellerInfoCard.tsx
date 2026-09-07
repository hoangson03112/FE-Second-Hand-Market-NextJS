"use client";

import {
  IconStar,
  IconTruck,
  IconMapPin,
  IconClock,
} from "@tabler/icons-react";
import { ISeller } from "@/types/product";
import { AvatarOrInitials } from "@/components/ui/AvatarOrInitials";
import { getProvinceName } from "@/utils";
import { getMonthYear } from "@/utils/format/date";

interface SellerInfoCardProps {
  seller: ISeller;
  onContactSeller: () => void;
  provinceId: string;
}

function SellerStat({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType;
  value: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 px-1.5 py-3 text-center">
      <div className="flex items-center gap-1 text-sm font-bold text-luxury-ink">
        <Icon className="h-3.5 w-3.5 shrink-0 text-charcoal-600" />
        <span className="truncate">{value}</span>
      </div>
      <span className="text-2xs font-medium uppercase tracking-[0.1em] text-charcoal-400">
        {label}
      </span>
    </div>
  );
}

export default function SellerInfoCard({
  seller,
  onContactSeller,
  provinceId,
}: SellerInfoCardProps) {
  const provinceDisplay = getProvinceName(provinceId);
  const joinedMonthYear = getMonthYear(seller?.createdAt);
  const totalActiveProducts = seller?.totalActiveProducts ?? 0;
  const totalReviews = seller?.totalReviews ?? 0;
  const hasRating = !!seller?.avgRating && totalReviews > 0;

  return (
    <div className="p-5 rounded-[2px] border border-luxury-ink/10 bg-taupe-50/50 mb-6">
      <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-charcoal-400 mb-4">
        Thông tin người bán
      </h3>

      <div className="flex items-center gap-3">
        <AvatarOrInitials
          avatar={seller.avatar as string | { url?: string } | null}
          fullName={seller.fullName ?? ""}
          size={48}
          className="border border-luxury-ink/10 rounded-[2px]"
        />
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-luxury-ink text-sm truncate">
            {seller.fullName}
          </h4>
          {provinceDisplay && (
            <div className="mt-1 flex items-center gap-1 text-xs text-charcoal-400">
              <IconMapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{provinceDisplay}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 divide-x divide-luxury-ink/10 rounded-[2px] border border-luxury-ink/10 bg-white">
        <SellerStat
          icon={IconStar}
          value={hasRating ? seller.avgRating!.toFixed(1) : "Mới"}
          label={hasRating ? `${totalReviews} đánh giá` : "Chưa có đánh giá"}
        />
        <SellerStat
          icon={IconTruck}
          value={totalActiveProducts}
          label="Đang bán"
        />
        <SellerStat icon={IconClock} value={joinedMonthYear} label="Tham gia" />
      </div>

      <button
        onClick={onContactSeller}
        className="w-full mt-5 border border-luxury-ink/20 bg-white text-luxury-ink py-3 rounded-[2px] text-xs uppercase tracking-[0.15em] font-bold hover:bg-luxury-ink hover:text-white transition-colors"
      >
        Chat với người bán
      </button>
    </div>
  );
}
