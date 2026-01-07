"use client";

interface QuantitySelectorProps {
  quantity: number;
  maxQuantity: number;
  onQuantityChange: (newQuantity: number) => void;
}

export default function QuantitySelector({
  quantity,
  maxQuantity,
  onQuantityChange,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <span className="text-foreground font-medium">Số lượng:</span>
      <div className="flex items-center border border-border rounded-lg">
        <button
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
          className="px-4 py-2 text-foreground hover:bg-muted transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          −
        </button>
        <span className="px-4 py-2 font-semibold text-foreground border-l border-r border-border min-w-12 text-center">
          {quantity}
        </span>
        <button
          onClick={() => onQuantityChange(Math.min(maxQuantity, quantity + 1))}
          disabled={quantity >= maxQuantity}
          className="px-4 py-2 text-foreground hover:bg-muted transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>
      <span className="text-sm text-muted-foreground">
        ({maxQuantity} sản phẩm có sẵn)
      </span>
    </div>
  );
}

