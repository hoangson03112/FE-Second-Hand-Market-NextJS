"use client";

interface ProductDescriptionProps {
  description: string;
}

export default function ProductDescription({ description }: ProductDescriptionProps) {
  return (
    <div className="bg-gradient-to-br from-cream-50 to-white border-2 border-border rounded-2xl p-6 shadow-md">
      <h2 className="text-lg font-semibold text-taupe-900 mb-4 pb-3 border-b-2 border-border uppercase tracking-wider">
        Mô Tả Sản Phẩm
      </h2>
      <div>
        <p className="text-taupe-700 leading-relaxed whitespace-pre-line text-sm">{description || "Không có mô tả"}</p>
      </div>
    </div>
  );
}
