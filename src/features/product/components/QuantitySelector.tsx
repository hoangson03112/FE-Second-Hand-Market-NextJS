"use client";

interface QuantitySelectorProps {
  quantity: number;
  maxQuantity: number;
  onQuantityChange: (newQuantity: number) => void;
}

export default function QuantitySelector({ quantity, maxQuantity, onQuantityChange }: QuantitySelectorProps) {
  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-[2px] border border-luxury-ink/10 bg-taupe-50/50 mb-4">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-luxury-ink">Số lượng</span>
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-luxury-ink/10 rounded-[2px] overflow-hidden bg-white">
          <button
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="w-9 h-9 text-luxury-ink hover:bg-taupe-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-sm font-semibold"
          >
            −
          </button>
          <span className="w-10 flex items-center justify-center text-[11px] font-bold text-luxury-ink border-x border-luxury-ink/10 h-9">
            {quantity}
          </span>
          <button
            onClick={() => onQuantityChange(Math.min(maxQuantity, quantity + 1))}
            disabled={quantity >= maxQuantity}
            className="w-9 h-9 text-luxury-ink hover:bg-taupe-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-sm font-semibold"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}