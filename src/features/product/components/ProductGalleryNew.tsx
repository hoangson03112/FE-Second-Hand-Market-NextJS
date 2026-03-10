"use client";

import { useState } from "react";
import { IImage } from "@/types/product";
import { getConditionLabel, getConditionBadgeColor } from "@/utils/format";

interface ProductGalleryNewProps {
  images: IImage[];
  productName: string;
  condition?: string;
}

export default function ProductGalleryNew({
  images,
  productName,
  condition,
}: ProductGalleryNewProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const imageUrls = images?.length > 0 ? images.map((img) => img.url) : ["/placeholder.svg"];

  const conditionLabel = condition ? getConditionLabel(condition) : "Đã sử dụng";
  const badgeColorClass = condition ? getConditionBadgeColor(condition) : "bg-neutral-50 text-neutral-700 border-neutral-200";

  return (
    <div className="flex flex-col gap-4">
      <div className="relative overflow-hidden bg-gradient-to-br from-taupe-50 to-cream-50 rounded-2xl aspect-square group border-2 border-border shadow-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrls[selectedImage]}
          alt={productName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-xl font-semibold text-sm backdrop-blur-md border-2 shadow-md ${badgeColorClass}`}>
          {conditionLabel}
        </div>
      </div>
      {imageUrls.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {imageUrls.slice(0, 8).map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`relative shrink-0 w-14 h-14 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                selectedImage === idx ? "border-primary shadow-md scale-105" : "border-border hover:border-primary hover:shadow-sm"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={`${productName} ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
