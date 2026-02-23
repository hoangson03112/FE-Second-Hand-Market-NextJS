"use client";

interface ProductDescriptionProps {
  description: string;
}

export default function ProductDescription({ description }: ProductDescriptionProps) {
  return (
    <div className="bg-cream-50 border border-taupe-200 p-5">
      <h2 className="text-lg font-medium text-taupe-900 mb-4 pb-3 border-b border-taupe-200 uppercase tracking-[0.08em]">
        Mô Tả Sản Phẩm
      </h2>
      <div>
        <p className="text-taupe-700 leading-relaxed whitespace-pre-line text-sm">{description || "Không có mô tả"}</p>
      </div>
    </div>
  );
}
