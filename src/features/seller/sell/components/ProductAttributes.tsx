import { IconPlus, IconTrash } from "@tabler/icons-react";
import type { ProductAttribute } from "@/types/sell";

interface ProductAttributesProps {
  attributes: ProductAttribute[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: "key" | "value", value: string) => void;
}

export function ProductAttributes({ attributes, onAdd, onRemove, onUpdate }: ProductAttributesProps) {
  return (
    <div className="space-y-2">
      <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
        {attributes.map((attr, index) => (
          <div
            key={index}
            className="flex gap-1.5 items-center rounded-[2px] border border-luxury-ink/10 bg-cream-50/70 p-1.5"
          >
            <input
              type="text"
              value={attr.key}
              onChange={(e) => onUpdate(index, "key", e.target.value)}
              placeholder="Tên"
              className="flex-1 min-w-0 rounded-[2px] border border-luxury-ink/10 bg-white text-luxury-ink placeholder:text-neutral-400 px-2 py-1.5 text-xs focus-visible:outline-none focus:border-luxury-ink"
            />
            <input
              type="text"
              value={attr.value}
              onChange={(e) => onUpdate(index, "value", e.target.value)}
              placeholder="Giá trị"
              className="flex-1 min-w-0 rounded-[2px] border border-luxury-ink/10 bg-white text-luxury-ink placeholder:text-neutral-400 px-2 py-1.5 text-xs focus-visible:outline-none focus:border-luxury-ink"
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="p-1.5 rounded-[2px] text-neutral-400 hover:bg-blush-50 hover:text-blush-700 transition-colors"
              aria-label="Xóa thuộc tính"
            >
              <IconTrash className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="w-full flex items-center justify-center gap-1.5 rounded-[2px] border border-dashed border-luxury-ink/20 py-2 text-xs font-medium text-neutral-500 hover:border-luxury-ink/40 hover:text-luxury-ink hover:bg-cream-50 transition-colors"
      >
        <IconPlus className="w-3.5 h-3.5" />
        Thêm thuộc tính
      </button>
    </div>
  );
}