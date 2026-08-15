import type { ChangeEvent } from "react";
import { INPUT_CLASS, LABEL_CLASS } from "./fieldStyles";

interface Category {
  _id: string;
  name: string;
  subCategories?: Array<{ _id: string; name: string }>;
}

interface ProductCategoryProps {
  categoryId: string;
  subcategoryId: string;
  errors: Partial<Record<"categoryId" | "subcategoryId", string>>;
  categories: Category[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export function ProductCategory({
  categoryId,
  subcategoryId,
  errors,
  categories,
  onChange,
}: ProductCategoryProps) {
  const subCategories =
    categoryId
      ? (categories.find((c) => c._id === categoryId)?.subCategories ?? [])
      : [];

  return (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <label className={LABEL_CLASS}>
          Danh mục <span className="text-red-500">*</span>
        </label>
        <select
          name="categoryId"
          value={categoryId}
          onChange={onChange}
          className={INPUT_CLASS}
        >
          <option value="">Chọn</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="mt-0.5 text-xs text-red-600">{errors.categoryId}</p>
        )}
      </div>

      <div>
        <label className={LABEL_CLASS}>
          Danh mục con <span className="text-red-500">*</span>
        </label>
        <select
          name="subcategoryId"
          value={subcategoryId}
          onChange={onChange}
          disabled={!categoryId}
          className={`${INPUT_CLASS} disabled:bg-taupe-100 disabled:cursor-not-allowed`}
        >
          <option value="">Chọn</option>
          {subCategories.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
        {errors.subcategoryId && (
          <p className="mt-0.5 text-xs text-red-600">{errors.subcategoryId}</p>
        )}
      </div>
    </div>
  );
}