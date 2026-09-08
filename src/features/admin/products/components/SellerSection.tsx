"use client";

import Image from "next/image";
import { format } from "@/utils/format/date";
import type { ISeller } from "@/types/product";
import {
  IconStar,
  IconUser,
  IconMail,
  IconPhone,
  IconMapPin,
  IconBuildingStore,
  IconCalendar,
  IconShield,
} from "@tabler/icons-react";

const ROLE_BADGE: Record<string, { label: string; className: string }> = {
  seller: { label: "Người bán", className: "bg-cream-50 border-luxury-ink/15 text-luxury-ink" },
  admin: {
    label: "Quản trị viên",
    className: "bg-blush-50 border-blush-200 text-blush-700",
  },
  user: { label: "Người dùng", className: "bg-taupe-50 border-luxury-ink/10 text-neutral-600" },
};

type SellerSectionProps = {
  seller: ISeller;
  addressPhone?: string;
};

export function SellerSection({ seller, addressPhone }: SellerSectionProps) {
  const displayName =
    seller?.account?.fullName ?? seller?.fullName ?? "Người bán";
  const rating = seller?.avgRating ?? 0;
  const reviewCount = seller?.totalReviews ?? 0;
  const productCount = seller?.totalProducts ?? 0;
  const role = seller?.role?.toLowerCase();
  const roleBadge = role
    ? (ROLE_BADGE[role] ?? {
        label: role,
        className: "bg-cream-50 border-luxury-ink/10 text-neutral-600",
      })
    : null;
  const phone = seller?.phoneNumber ?? addressPhone;
  const email = seller?.account?.email;

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1 rounded-[2px] bg-cream-50 border border-luxury-ink/10">
          <IconUser className="w-3.5 h-3.5 text-luxury-ink" />
        </div>
        <h3 className="text-2xs font-bold text-luxury-ink uppercase tracking-[0.14em]">
          Thông tin người bán
        </h3>
      </div>

      <div className="rounded-[2px] border border-luxury-ink/10 bg-white overflow-hidden shadow-xs">
        <div className="flex items-center gap-3.5 px-4 py-4 border-b border-luxury-ink/10 bg-cream-50/40">
          <div className="w-10 h-10 rounded-[2px] bg-taupe-50 border border-luxury-ink/10 flex items-center justify-center shrink-0 overflow-hidden">
            {seller?.avatar ? (
              <Image
                src={seller.avatar}
                alt={displayName}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-bold text-luxury-ink uppercase">
                {displayName[0]}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-luxury-ink">
                {displayName}
              </span>
              {roleBadge && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] border text-2xs font-bold uppercase tracking-wider ${roleBadge.className}`}
                >
                  <IconShield className="w-3 h-3" />
                  {roleBadge.label}
                </span>
              )}
            </div>
            {seller?.createdAt && (
              <p className="text-2xs text-neutral-400 flex items-center gap-1 mt-0.5">
                <IconCalendar className="w-3 h-3" />
                Tham gia: <span className="font-mono">{format(seller.createdAt)}</span>
              </p>
            )}
          </div>

          {rating > 0 && (
            <div className="flex flex-col items-center shrink-0">
              <div className="flex items-center gap-0.5">
                <IconStar className="w-3.5 h-3.5 fill-luxury-champagne text-luxury-champagne" />
                <span className="text-xs font-bold text-luxury-ink font-mono">
                  {Number(rating).toFixed(1)}
                </span>
              </div>
              <span className="text-2xs text-neutral-400">
                {reviewCount} đánh giá
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 divide-x divide-luxury-ink/10 border-b border-luxury-ink/10 bg-cream-50/20">
          <div className="py-2.5 text-center">
            <p className="font-droid-serif text-sm font-bold text-luxury-ink">
              {productCount}
            </p>
            <p className="text-2xs uppercase tracking-wider text-neutral-400 mt-0.5">SP đang bán</p>
          </div>
          <div className="py-2.5 text-center">
            <p className="font-droid-serif text-sm font-bold text-luxury-ink">{reviewCount}</p>
            <p className="text-2xs uppercase tracking-wider text-neutral-400 mt-0.5">Đánh giá</p>
          </div>
          <div className="py-2.5 text-center">
            <p className="font-droid-serif text-sm font-bold text-luxury-ink font-mono">
              {rating > 0 ? Number(rating).toFixed(1) : "—"}
            </p>
            <p className="text-2xs uppercase tracking-wider text-neutral-400 mt-0.5">Điểm TB</p>
          </div>
        </div>

        <div className="px-4 py-3 space-y-1.5 bg-white">
          {email && (
            <div className="flex items-center gap-2 text-xs">
              <IconMail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span className="text-neutral-500">Email:</span>
              <span className="text-luxury-ink font-medium">{email}</span>
            </div>
          )}
          {phone && (
            <div className="flex items-center gap-2 text-xs">
              <IconPhone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span className="text-neutral-500">SĐT:</span>
              <span className="text-luxury-ink font-mono font-medium">{phone}</span>
            </div>
          )}
          {seller?.province && (
            <div className="flex items-center gap-2 text-xs">
              <IconMapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span className="text-neutral-500">Khu vực:</span>
              <span className="text-luxury-ink font-medium">
                {seller.province}
              </span>
            </div>
          )}
          {seller?.businessAddress && (
            <div className="flex items-start gap-2 text-xs">
              <IconBuildingStore className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
              <span className="text-neutral-500 shrink-0">
                Địa chỉ kho:
              </span>
              <span className="text-luxury-ink font-medium">
                {seller.businessAddress}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
