import type { ChangeEvent } from "react";
import type { SellFormValues } from "@/types/sell";

const INPUT_CLASS =
  "w-full rounded-lg border border-border bg-background px-2.5 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0";
const LABEL_CLASS = "block text-xs font-medium text-foreground mb-1";

const CONDITION_OPTIONS: { value: SellFormValues["condition"]; label: string }[] = [
  { value: "new", label: "Mới" },
  { value: "like_new", label: "Như mới" },
  { value: "good", label: "Tốt" },
  { value: "fair", label: "Khá" },
  { value: "poor", label: "Đã dùng lâu" },
];

interface Props {
  values: Pick<SellFormValues, "name" | "price" | "stock" | "condition">;
  errors: Partial<Record<"name" | "price" | "stock", string>>;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function ProductBasicInfo({ values, errors, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div>
        <label className={LABEL_CLASS}>
          Tên sản phẩm <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={onChange}
          placeholder="VD: Áo thun nam cotton"
          className={INPUT_CLASS}
        />
        {errors.name && (
          <p className="mt-0.5 text-xs text-destructive">{errors.name}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={LABEL_CLASS}>
            Giá (VNĐ) <span className="text-destructive">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={values.price}
            onChange={onChange}
            min={0}
            placeholder="0"
            className={INPUT_CLASS}
          />
          {errors.price && (
            <p className="mt-0.5 text-xs text-destructive">{errors.price}</p>
          )}
        </div>
        <div>
          <label className={LABEL_CLASS}>
            Số lượng <span className="text-destructive">*</span>
          </label>
          <input
            type="number"
            name="stock"
            value={values.stock}
            onChange={onChange}
            min={0}
            step={1}
            placeholder="1"
            className={INPUT_CLASS}
          />
          {errors.stock && (
            <p className="mt-0.5 text-xs text-destructive">{errors.stock}</p>
          )}
        </div>
      </div>

      <div>
        <label className={LABEL_CLASS}>Tình trạng</label>
        <select
          name="condition"
          value={values.condition}
          onChange={onChange}
          className={INPUT_CLASS}
        >
          {CONDITION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}