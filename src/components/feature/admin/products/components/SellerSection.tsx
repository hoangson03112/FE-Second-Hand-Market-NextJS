"use client";

import Image from "next/image";
import type { ISeller } from "@/types/product";
import { IconStar, IconPackage, IconUser } from "@tabler/icons-react";

type Props = {
  seller: ISeller;
  addressPhone?: string;
};

export function SellerSection({ seller, addressPhone }: Props) {
  const displayName =
    seller?.account?.fullName ?? seller?.fullName ?? "Người bán";
  const rating = seller?.avgRating ?? seller?.avgRating ?? 0;
  const reviewCount = seller?.totalReviews ?? seller?.totalReviews ?? 0;
  const productCount = seller?.totalProducts ?? 0;

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-md bg-primary/10">
          <IconUser className="w-3.5 h-3.5 text-primary" />
        </div>
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
          Người bán
        </h3>
      </div>

      <div className="rounded-xl border border-border bg-muted/20 px-4 py-4 space-y-3">
        {/* Avatar + name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center shrink-0 overflow-hidden">
            {seller?.avatar ? (
              <Image
                src={seller.avatar}
                alt={displayName}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-bold text-muted-foreground uppercase">
                {displayName[0]}
              </span>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {displayName}
            </p>
            {seller?.account?.username && (
              <p className="text-xs text-muted-foreground">
                @{seller.account.username}
              </p>
            )}
          </div>
          {rating > 0 && (
            <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
              <IconStar className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <strong className="text-foreground">{rating.toFixed(1)}</strong>
              <span>({reviewCount})</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-muted/40 rounded-lg py-2">
            <p className="text-sm font-bold text-foreground">{productCount}</p>
            <p className="text-[10px] text-muted-foreground">SP đang bán</p>
          </div>
          <div className="bg-muted/40 rounded-lg py-2">
            <p className="text-sm font-bold text-foreground">{reviewCount}</p>
            <p className="text-[10px] text-muted-foreground">Đánh giá</p>
          </div>
          <div className="bg-muted/40 rounded-lg py-2">
            <p className="text-sm font-bold text-foreground">
              {rating > 0 ? rating.toFixed(1) : "—"}
            </p>
            <p className="text-[10px] text-muted-foreground">Điểm TB</p>
          </div>
        </div>

        {/* Info rows */}
        <div className="space-y-1 text-xs text-muted-foreground">
          {seller?.account?.email && (
            <p>
              Email:{" "}
              <span className="text-foreground">{seller.account.email}</span>
            </p>
          )}
          {(seller?.phoneNumber || addressPhone) && (
            <p>
              SĐT:{" "}
              <span className="text-foreground">
                {seller?.phoneNumber ?? addressPhone}
              </span>
            </p>
          )}
          {seller?.province && (
            <p>
              Tỉnh/TP:{" "}
              <span className="text-foreground">{seller.province}</span>
            </p>
          )}
          {seller?.businessAddress && (
            <p>
              Địa chỉ KD:{" "}
              <span className="text-foreground">{seller.businessAddress}</span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
