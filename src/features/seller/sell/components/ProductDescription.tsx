import type { ChangeEvent } from "react";
import { INPUT_CLASS } from "./fieldStyles";

interface ProductDescriptionProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export function ProductDescription({ value, onChange }: ProductDescriptionProps) {
  return (
    <textarea
      name="description"
      value={value}
      onChange={onChange}
      rows={5}
      placeholder="Mô tả sản phẩm: xuất xứ, chất liệu, tình trạng sử dụng..."
      className={`${INPUT_CLASS} resize-none`}
    />
  );
}