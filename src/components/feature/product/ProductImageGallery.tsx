"use client";

import React, { useState, useCallback } from "react";
import { Inter } from "next/font/google";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { IImage } from "@/types/product";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-inter" });

interface ProductImageGalleryProps {
  images: IImage[];
  productName?: string;
}

export default function ProductImageGallery({
  images,
  productName = "Product image",
}: ProductImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  if (!images || images.length === 0) {
    return (
      <div className="relative bg-gray-100 rounded-2xl overflow-hidden min-h-[500px] flex items-center justify-center">
        <p className="text-gray-400 text-lg">Không có hình ảnh</p>
      </div>
    );
  }

  return (
    <div className={`${inter.variable} font-sans space-y-4`}>
      {/* Main Image */}
      <div className="relative group bg-gray-50 rounded-2xl overflow-hidden min-h-[500px] flex items-center justify-center">
        <div className="relative w-full h-full min-h-[500px] flex items-center justify-center">
          <Image
            src={images[currentImageIndex]?.url || images[0]?.url}
            alt={productName}
            width={800}
            height={800}
            className="object-contain w-full h-full transition-all duration-300"
            priority
          />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100 z-10"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100 z-10"
              aria-label="Ảnh sau"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={cn(
                "relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0",
                index === currentImageIndex
                  ? "border-primary shadow-md scale-105"
                  : "border-gray-200 hover:border-primary/50"
              )}
            >
              <Image
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                fill
                className={cn(
                  "object-cover transition-all duration-200",
                  index === currentImageIndex
                    ? "brightness-100"
                    : "brightness-90 hover:brightness-100"
                )}
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
