"use client";

import { Star, Truck, MapPin, Clock, User } from "lucide-react";
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
    <div className="bg-cream-50 p-5 mb-3 border border-taupe-200">
      <h3 className="font-medium text-taupe-900 mb-4 text-sm uppercase tracking-[0.1em]">
        Thông Tin Người Bán
      </h3>
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-taupe-100 flex items-center justify-center flex-shrink-0 overflow-hidden border border-taupe-200">
          {seller.avatar ? (
            <Image
              src={seller.avatar}
              alt={seller.fullName ?? "Seller"}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="h-6 w-6 text-taupe-400" />
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
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < Math.floor(seller.avgRating!) ? "fill-primary text-primary" : "fill-taupe-200 text-taupe-200"}`}
                    />
                  ))}
                </div>
                <span className="font-medium">{seller.avgRating} / 5</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-taupe-600">
              <Truck className="h-3.5 w-3.5" />
              <span>{seller?.totalProducts || 1} sản phẩm</span>
            </div>
            {provinceDisplay && (
              <div className="flex items-center gap-2 text-sm text-taupe-600">
                <MapPin className="h-3.5 w-3.5" />
                <span>{provinceDisplay}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-taupe-600">
              <Clock className="h-3.5 w-3.5" />
              <span>Tham gia {joinedYear}</span>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={onContactSeller}
        className="w-full mt-4 border-2 border-taupe-300 text-taupe-700 py-2.5 text-[13px] font-black uppercase tracking-[0.12em] hover:border-taupe-600 hover:text-taupe-900 transition-colors"
      >
        Chat với người bán
      </button>
    </div>
  );
}
