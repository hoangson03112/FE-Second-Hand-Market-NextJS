"use client";

import { useState } from "react";
import { IImage } from "@/types/product";
import { getConditionLabel } from "@/utils/format";

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
  const imageUrls =
    images?.length > 0 ? images.map((img) => img.url) : ["/placeholder.svg"];
  const conditionLabel = condition
    ? getConditionLabel(condition)
    : "Đã sử dụng";

  return (
    <div className="flex flex-col gap-3">
      {/* Ảnh chính */}
      <div className="relative overflow-hidden bg-taupe-50 rounded-[2px] aspect-square border border-luxury-ink/10 group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrls[selectedImage]}
          alt={productName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {conditionLabel && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-[2px] text-[10px] font-bold uppercase tracking-[0.2em] bg-white/90 backdrop-blur-sm border border-luxury-ink/10 text-luxury-ink">
            {conditionLabel}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {imageUrls.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
          {imageUrls.slice(0, 8).map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`relative shrink-0 w-16 h-16 overflow-hidden rounded-[2px] border transition-all duration-200 ${
                selectedImage === idx
                  ? "border-luxury-ink ring-1 ring-luxury-ink opacity-100"
                  : "border-luxury-ink/10 hover:border-luxury-ink/40 opacity-60 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`${productName} ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
