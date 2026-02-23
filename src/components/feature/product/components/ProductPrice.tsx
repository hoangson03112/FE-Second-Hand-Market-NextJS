"use client";

interface ProductPriceProps {
  price: number;
  formattedPrice: string;
}

export default function ProductPrice({ formattedPrice }: ProductPriceProps) {
  return (
    <div className="bg-taupe-50 p-5 mb-3 border border-taupe-200">
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-medium text-primary">{formattedPrice || "Liên hệ"}</span>
      </div>
    </div>
  );
}
