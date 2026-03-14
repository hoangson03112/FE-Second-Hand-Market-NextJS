/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import DiscountForm from "./DiscountForm";
import { IconPaperclip, IconCheck, IconX } from "@tabler/icons-react";

interface SellerDiscountInlineProps {
  buyerId: string;
  buyerName?: string;
  sellerId: string;
  onCreated?: (discount: any) => void;
  onCancel?: () => void;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
}

async function fetchSellerProducts(sellerId: string): Promise<Product[]> {
  const res = await fetch(`/eco-market/seller/products?sellerId=${sellerId}`);
  const data = await res.json();
  return data.products || [];
}


// ─── Product Card for Popover ─────────────────────────────────────────────
function ProductCard({ product, selected, onSelect }: { product: Product; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex items-center gap-3 w-full p-2 rounded-lg border transition-all shadow-sm hover:border-violet-300 bg-white ${selected ? "border-violet-400 ring-2 ring-violet-200" : "border-slate-200"}`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {product.imageUrl ? (
        <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-lg object-cover border border-slate-100" />
      ) : (
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-300 font-bold text-lg">?</div>
      )}
      <div className="flex-1 min-w-0 text-left">
        <div className="font-medium text-slate-800 truncate">{product.name}</div>
        <div className="text-xs text-slate-400 truncate">{product.category}</div>
        <div className="text-violet-600 font-semibold text-sm">{product.price.toLocaleString("vi-VN")}₫</div>
      </div>
      {selected && <IconCheck className="w-4 h-4 text-violet-500" />}
    </button>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function SellerDiscountInline({ buyerId, buyerName, sellerId, onCreated, onCancel }: SellerDiscountInlineProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sellerId && open) {
      setLoading(true);
      fetchSellerProducts(sellerId).finally(() => setLoading(false)).then(setProducts);
    }
  }, [sellerId, open]);

  // Close popover when clicking outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleCreated = (discount: any) => {
    setCreated(true);
    setTimeout(() => {
      setCreated(false);
      setOpen(false);
      setSelectedProduct("");
      onCreated?.(discount);
    }, 1800);
  };

  const handleCancel = () => {
    setOpen(false);
    setSelectedProduct("");
    onCancel?.();
  };

  // ── Trigger icon button ──
  return (
    <div className="relative inline-block">
      <label className="cursor-pointer border-2 border-border px-4 py-3.5 rounded-xl hover:bg-muted/50 transition-all flex items-center justify-center" title={`Tạo ưu đãi riêng cho ${buyerName ?? "người mua này"}`}
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center justify-center"
        >
          <IconPaperclip className="w-5 h-5 text-violet-600" />
        </button>
      </label>

      {/* Popover Panel */}
      {open && (
        <div
          ref={popoverRef}
          className="absolute z-50 left-1/2 -translate-x-1/2 mt-2 min-w-[320px] max-w-[95vw] bg-white border border-violet-100 rounded-2xl shadow-2xl p-0 animate-in fade-in slide-in-from-top-2"
          style={{ fontFamily: "'DM Sans', sans-serif", width: 340 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-violet-100 bg-gradient-to-r from-violet-50 to-indigo-50">
            <div className="font-semibold text-slate-800 text-sm leading-tight">
              Tạo ưu đãi riêng {buyerName && <span className="text-violet-600">cho {buyerName}</span>}
            </div>
            <button
              type="button"
              onClick={handleCancel}
              className="w-7 h-7 rounded-full hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-400 hover:text-slate-600"
            >
              <IconX className="w-4 h-4" />
            </button>
          </div>

          {/* Success state */}
          {created ? (
            <div className="px-6 py-6 flex flex-col items-center justify-center gap-2 bg-emerald-50 border-b border-emerald-100">
              <span className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <IconCheck className="w-7 h-7 text-emerald-600" />
              </span>
              <div className="text-emerald-700 font-semibold text-base">Ưu đãi đã được tạo thành công!</div>
            </div>
          ) : (
            <div className="px-4 py-4">
              {/* Step 1: Product cards */}
              <div className="mb-3">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Chọn sản phẩm áp dụng</div>
                {loading ? (
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-400">
                    <span className="w-4 h-4 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin" />
                    Đang tải sản phẩm…
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-xs text-center text-slate-400 py-2">Bạn chưa có sản phẩm nào để tạo ưu đãi.</div>
                ) : (
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                    {products.map((p) => (
                      <ProductCard
                        key={p._id}
                        product={p}
                        selected={selectedProduct === p._id}
                        onSelect={() => setSelectedProduct(p._id)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Step 2: Discount form */}
              {selectedProduct && (
                <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Cấu hình ưu đãi</div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                    <DiscountForm
                      products={products.filter((p) => p._id === selectedProduct)}
                      buyerId={buyerId}
                      onCreated={handleCreated}
                      onCancel={handleCancel}
                    />
                  </div>
                </div>
              )}
              {!selectedProduct && products.length > 0 && (
                <p className="text-xs text-slate-400 text-center pb-1 mt-2">Chọn sản phẩm để tiếp tục cấu hình ưu đãi</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}