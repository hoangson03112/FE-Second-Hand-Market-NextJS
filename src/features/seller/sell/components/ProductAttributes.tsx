import { IconPlus, IconTrash } from "@tabler/icons-react";
import type { ProductAttribute } from "@/types/sell";

interface Props {
  attributes: ProductAttribute[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: "key" | "value", value: string) => void;
}

export function ProductAttributes({ attributes, onAdd, onRemove, onUpdate }: Props) {
  return (
    <div className="space-y-2">
      <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
        {attributes.map((attr, index) => (
          <div
            key={index}
            className="flex gap-1.5 items-center rounded-lg border border-border bg-taupe-50/60 p-1.5"
          >
            <input
              type="text"
              value={attr.key}
              onChange={(e) => onUpdate(index, "key", e.target.value)}
              placeholder="Tên"
              className="flex-1 min-w-0 rounded-md border border-border bg-white text-taupe-900 placeholder:text-taupe-400 px-2 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary"
            />
            <input
              type="text"
              value={attr.value}
              onChange={(e) => onUpdate(index, "value", e.target.value)}
              placeholder="Giá trị"
              className="flex-1 min-w-0 rounded-md border border-border bg-white text-taupe-900 placeholder:text-taupe-400 px-2 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary"
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="p-1.5 rounded-md text-taupe-400 hover:bg-red-50 hover:text-red-600 transition-colors"
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
        className="w-full flex items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-taupe-300 py-2 text-xs font-medium text-taupe-500 hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors"
      >
        <IconPlus className="w-3.5 h-3.5" />
        Thêm thuộc tính
      </button>
    </div>
  );
}