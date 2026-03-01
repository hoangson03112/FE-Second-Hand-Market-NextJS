"use client";

import { IconUser, IconStar, IconTruck, IconMapPin, IconClock } from "@tabler/icons-react";
import { ISeller } from "@/types/product";
import Image from "next/image";
import { getProvinceName } from "@/utils";

interface SellerInfoCardProps {
  seller: ISeller;
  onContactSeller: () => void;
}

export default function SellerInfoCard({
  seller,
  onContactSeller,
}: SellerInfoCardProps) {
  const provinceDisplay = getProvinceName(seller?.from_province_id);

  const joinedYear = seller?.createdAt
    ? new Date(seller.createdAt).getFullYear().toString()
    : "2023";
  return (
    <div className="bg-gradient-to-br from-cream-50 to-taupe-50/50 p-5 mb-3 border-2 border-border rounded-2xl shadow-md">
      <h3 className="font-medium text-taupe-900 mb-4 text-sm uppercase tracking-[0.1em]">
        Thông Tin Người Bán
      </h3>
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-taupe-100 to-taupe-200 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-border">
          {seller.avatar ? (
            <Image
              src={seller.avatar}
              alt={seller.fullName ?? "Seller"}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          ) : (
            <IconUser className="h-6 w-6 text-taupe-400" />
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-taupe-900 mb-2">
            {seller.fullName}
          </h4>
          <div className="space-y-1.5">
            {seller?.avgRating && (
              <div className="flex items-center gap-2 text-sm text-taupe-600">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <IconStar
                      key={i}
                      className={`h-3 w-3 ${i < Math.floor(seller.avgRating!) ? "fill-primary text-primary" : "fill-taupe-200 text-taupe-200"}`}
                    />
                  ))}
                </div>
                <span className="font-medium">{seller.avgRating} / 5</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-taupe-600">
              <IconTruck className="h-3.5 w-3.5" />
              <span>{seller?.totalProducts || 1} sản phẩm</span>
            </div>
            {provinceDisplay && (
              <div className="flex items-center gap-2 text-sm text-taupe-600">
                <IconMapPin className="h-3.5 w-3.5" />
                <span>{provinceDisplay}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-taupe-600">
              <IconClock className="h-3.5 w-3.5" />
              <span>Tham gia {joinedYear}</span>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={onContactSeller}
        className="w-full mt-4 border-2 border-primary text-primary py-3 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-primary hover:text-white hover:shadow-lg transition-all duration-300"
      >
        Chat với người bán
      </button>
    </div>
  );
}
