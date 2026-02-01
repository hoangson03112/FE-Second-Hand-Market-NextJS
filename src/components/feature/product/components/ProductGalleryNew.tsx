"use client";

import { useState } from "react";
import { IImage } from "@/types/product";

interface ProductGalleryNewProps {
  images: IImage[];
  productName: string;
  condition?: string;
}

export default function ProductGalleryNew({
  images,
  productName,
  condition = "Đã sử dụng",
}: ProductGalleryNewProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const imageUrls = images?.length > 0 ? images.map((img) => img.url) : ["/placeholder.svg"];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative overflow-hidden bg-muted rounded-xl aspect-square group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrls[selectedImage]}
          alt={productName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-white/90 text-foreground px-3 py-1 rounded-full font-semibold text-sm backdrop-blur-sm">
          {condition}
        </div>
      </div>
      {imageUrls.length > 1 && (
        <div className="grid grid-cols-3 gap-3">
          {imageUrls.slice(0, 6).map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`relative overflow-hidden rounded-lg aspect-square border-2 transition ${
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
