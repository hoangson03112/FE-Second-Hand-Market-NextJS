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
    <div className="bg-cream-50/50 rounded-2xl p-6 mb-6 border-2 border-neutral-200/60">
      <h3 className="font-semibold text-neutral-900 mb-4">
        Thông Tin Người Bán
      </h3>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {seller.avatar ? (
            <Image
              src={seller.avatar}
              alt={seller.fullName ?? "Seller"}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="h-6 w-6 text-primary" />
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-neutral-900 text-lg mb-2">
            {seller.fullName}
          </h4>
          <div className="space-y-2">
            {seller?.avgRating && (
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i < Math.floor(seller.avgRating!) ? "fill-accent text-accent" : "fill-neutral-300 text-neutral-300"}`}
                    />
                  ))}
                </div>
                <span className="font-medium">{seller.avgRating} / 5</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Truck className="h-4 w-4" />
              <span>{seller?.totalProducts || 1} sản phẩm đang bán</span>
            </div>
            {provinceDisplay && (
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <MapPin className="h-4 w-4" />
                <span>{provinceDisplay}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Clock className="h-4 w-4" />
              <span>Thành viên từ {joinedYear}</span>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={onContactSeller}
        className="w-full mt-4 border-2 border-primary text-primary py-2 rounded-lg font-semibold hover:bg-primary hover:text-white transition-all duration-300"
      >
        Liên Hệ Người Bán
      </button>
    </div>
  );
}
