import type { ChangeEvent } from "react";

const INPUT_CLASS =
  "w-full rounded-lg border border-border bg-background px-2.5 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0";

interface Props {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export function ProductDescription({ value, onChange }: Props) {
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
