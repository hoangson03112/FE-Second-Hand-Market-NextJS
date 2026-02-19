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
      <div className="relative overflow-hidden bg-muted rounded-xl aspect-square group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrls[selectedImage]}
          alt={productName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full font-semibold text-sm backdrop-blur-sm border ${badgeColorClass}`}>
          {conditionLabel}
        </div>
      </div>
      {imageUrls.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {imageUrls.slice(0, 8).map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`relative shrink-0 w-14 h-14 overflow-hidden rounded-md border-2 transition ${
                selectedImage === idx ? "border-primary" : "border-border hover:border-primary"
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
