"use client";

import { Star } from "lucide-react";

interface ProductHeaderProps {
  name: string;
  averageRating: number;
  totalReviews: number;
  sellerName: string;
}

export default function ProductHeader({
  name,
  averageRating,
  totalReviews,
  sellerName,
}: ProductHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{name}</h1>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(averageRating)
                    ? "fill-accent text-accent"
                    : "fill-border text-border"
                }`}
              />
            ))}
          </div>
          <span className="font-semibold text-foreground">{averageRating}</span>
          <span className="text-muted-foreground">({totalReviews} đánh giá)</span>
        </div>
      </div>

      <p className="text-muted-foreground">Từ {sellerName}</p>
    </div>
  );
}

