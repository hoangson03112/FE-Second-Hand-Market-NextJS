"use client";

interface ProductPriceProps {
  price: number;
  formattedPrice: string;
}

export default function ProductPrice({ formattedPrice }: ProductPriceProps) {
  return (
    <div className="bg-muted rounded-xl p-6 mb-6">
              <p className="text-sm text-tertiary">Giá hiện tại</p>
      <div className="mb-2">
        <span className="text-4xl font-bold text-secondary">
          {formattedPrice || "Liên hệ"}
        </span>
      </div>
    </div>
  );
}

