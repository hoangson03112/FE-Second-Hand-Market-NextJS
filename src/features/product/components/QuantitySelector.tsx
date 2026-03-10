"use client";

interface QuantitySelectorProps {
  quantity: number;
  maxQuantity: number;
  onQuantityChange: (newQuantity: number) => void;
}

export default function QuantitySelector({ quantity, maxQuantity, onQuantityChange }: QuantitySelectorProps) {
  return (
    <div className="flex items-center justify-between mb-5 py-3 px-4 rounded-xl bg-taupe-50/60 border border-border/50">
      <span className="text-sm font-medium text-taupe-600">Số lượng</span>
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-border rounded-lg overflow-hidden bg-white">
          <button
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="w-8 h-8 text-taupe-500 hover:bg-taupe-50 hover:text-taupe-900 transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-base font-light"
          >
            −
          </button>
          <span className="w-10 h-8 flex items-center justify-center text-sm font-semibold text-taupe-900 border-x border-border">
            {quantity}
          </span>
          <button
            onClick={() => onQuantityChange(Math.min(maxQuantity, quantity + 1))}
            disabled={quantity >= maxQuantity}
            className="w-8 h-8 text-taupe-500 hover:bg-taupe-50 hover:text-taupe-900 transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-base font-light"
          >
            +
          </button>
        </div>
        <span className="text-xs text-taupe-400">{maxQuantity} có sẵn</span>
      </div>
    </div>
  );
}
