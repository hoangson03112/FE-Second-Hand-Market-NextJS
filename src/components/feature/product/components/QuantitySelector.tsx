"use client";

interface QuantitySelectorProps {
  quantity: number;
  maxQuantity: number;
  onQuantityChange: (newQuantity: number) => void;
}

export default function QuantitySelector({ quantity, maxQuantity, onQuantityChange }: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <span className="text-taupe-700 text-sm">Số lượng:</span>
      <div className="flex items-center border-2 border-taupe-200 overflow-hidden">
        <button
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
          className="w-8 h-8 text-taupe-600 hover:bg-taupe-50 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
        >
          −
        </button>
        <input
          type="text"
          value={quantity}
          readOnly
          className="w-12 h-8 text-center text-sm text-taupe-900 border-0 border-l border-r border-taupe-200 focus:outline-none bg-cream-50"
        />
        <button
          onClick={() => onQuantityChange(Math.min(maxQuantity, quantity + 1))}
          disabled={quantity >= maxQuantity}
          className="w-8 h-8 text-taupe-600 hover:bg-taupe-50 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
        >
          +
        </button>
      </div>
      <span className="text-xs text-gray-500">{maxQuantity} sản phẩm có sẵn</span>
    </div>
  );
}
