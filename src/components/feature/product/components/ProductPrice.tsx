"use client";

interface ProductPriceProps {
  price: number;
  formattedPrice: string;
}

export default function ProductPrice({ formattedPrice }: ProductPriceProps) {
  return (
    <div className="bg-gradient-to-r from-taupe-50 to-cream-50 p-5 mb-3 border-2 border-border rounded-2xl shadow-md">
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-medium text-primary">{formattedPrice || "Liên hệ"}</span>
      </div>
    </div>
  );
}
