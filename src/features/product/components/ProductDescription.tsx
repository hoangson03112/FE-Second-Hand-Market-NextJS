"use client";

interface ProductDescriptionProps {
  description: string;
}

export default function ProductDescription({
  description,
}: ProductDescriptionProps) {
  return (
    <div className="pt-2">
      <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-luxury-ink mb-5">
        Mô tả sản phẩm
      </h2>
      <p className="text-sm text-neutral-500 leading-[1.8] whitespace-pre-line">
        {description || "Chưa có mô tả cho sản phẩm này."}
      </p>
    </div>
  );
}
