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
            className="flex gap-1.5 items-center rounded-md border border-border bg-muted/30 p-1.5"
          >
            <input
              type="text"
              value={attr.key}
              onChange={(e) => onUpdate(index, "key", e.target.value)}
              placeholder="Tên"
              className="flex-1 min-w-0 rounded border border-border bg-background px-2 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
            <input
              type="text"
              value={attr.value}
              onChange={(e) => onUpdate(index, "value", e.target.value)}
              placeholder="Giá trị"
              className="flex-1 min-w-0 rounded border border-border bg-background px-2 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="p-1.5 rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
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
        className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors"
      >
        <IconPlus className="w-3.5 h-3.5" />
        Thêm thuộc tính
      </button>
    </div>
  );
}
