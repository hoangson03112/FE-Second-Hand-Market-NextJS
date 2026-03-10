"use client";

import Image from "next/image";
import { format } from "@/utils/format/date";
import type { ISeller } from "@/types/product";
import { IconStar, IconUser, IconMail, IconPhone, IconMapPin, IconBuildingStore, IconCalendar, IconShield } from "@tabler/icons-react";

const ROLE_BADGE: Record<string, { label: string; className: string }> = {
  seller: { label: "Người bán", className: "bg-secondary text-foreground/80" },
  admin: { label: "Quản trị viên", className: "bg-destructive/10 text-destructive dark:bg-destructive/20" },
  user: { label: "Người dùng", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
};

type Props = {
  seller: ISeller;
  addressPhone?: string;
};

export function SellerSection({ seller, addressPhone }: Props) {
  const displayName = seller?.account?.fullName ?? seller?.fullName ?? "Người bán";
  const rating = seller?.avgRating ?? 0;
  const reviewCount = seller?.totalReviews ?? 0;
  const productCount = seller?.totalProducts ?? 0;
  const role = seller?.role?.toLowerCase();
  const roleBadge = role ? (ROLE_BADGE[role] ?? { label: role, className: "bg-muted text-muted-foreground" }) : null;
  const phone = seller?.phoneNumber ?? addressPhone;
  const email = seller?.account?.email;

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-primary/10">
          <IconUser className="w-3.5 h-3.5 text-primary" />
        </div>
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
          Thông tin người bán
        </h3>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Avatar + name row */}
        <div className="flex items-center gap-3.5 px-4 py-4 border-b border-border/60">
          <div className="w-11 h-11 rounded-full bg-muted border border-border flex items-center justify-center shrink-0 overflow-hidden">
            {seller?.avatar ? (
              <Image
                src={seller.avatar}
                alt={displayName}
                width={44}
                height={44}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-bold text-muted-foreground uppercase">
                {displayName[0]}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-foreground">{displayName}</span>
              {roleBadge && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${roleBadge.className}`}>
                  <IconShield className="w-3 h-3" />
                  {roleBadge.label}
                </span>
              )}
            </div>
            {seller?.createdAt && (
              <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                <IconCalendar className="w-3 h-3" />
                Tham gia: {format(seller.createdAt)}
              </p>
            )}
          </div>

          {rating > 0 && (
            <div className="flex flex-col items-center shrink-0">
              <div className="flex items-center gap-0.5">
                <IconStar className="w-3.5 h-3.5 fill-primary/70 text-primary/70" />
                <span className="text-sm font-bold text-foreground">{Number(rating).toFixed(1)}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">{reviewCount} đánh giá</span>
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 divide-x divide-border/60">
          <div className="py-3 text-center">
            <p className="text-base font-bold text-foreground">{productCount}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">SP đang bán</p>
          </div>
          <div className="py-3 text-center">
            <p className="text-base font-bold text-foreground">{reviewCount}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Đánh giá</p>
          </div>
          <div className="py-3 text-center">
            <p className="text-base font-bold text-foreground">
              {rating > 0 ? Number(rating).toFixed(1) : "—"}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Điểm TB</p>
          </div>
        </div>

        {/* Contact + location info */}
        <div className="px-4 py-3 border-t border-border/60 space-y-2">
          {email && (
            <div className="flex items-center gap-2 text-xs">
              <IconMail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Email:</span>
              <span className="text-foreground font-medium">{email}</span>
            </div>
          )}
          {phone && (
            <div className="flex items-center gap-2 text-xs">
              <IconPhone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">SĐT:</span>
              <span className="text-foreground font-medium">{phone}</span>
            </div>
          )}
          {seller?.province && (
            <div className="flex items-center gap-2 text-xs">
              <IconMapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Tỉnh/TP:</span>
              <span className="text-foreground font-medium">{seller.province}</span>
            </div>
          )}
          {seller?.businessAddress && (
            <div className="flex items-start gap-2 text-xs">
              <IconBuildingStore className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
              <span className="text-muted-foreground shrink-0">Địa chỉ KD:</span>
              <span className="text-foreground font-medium">{seller.businessAddress}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
