"use client";

interface ProductDescriptionProps {
  description: string;
}

export default function ProductDescription({ description }: ProductDescriptionProps) {
  return (
    <div className="bg-cream-50/90 backdrop-blur-md rounded-3xl shadow-lg shadow-neutral-200/50 border-2 border-neutral-200/60 p-8">
      <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
        <span className="w-1 h-8 bg-primary rounded-full" />
        Mô Tả Sản Phẩm
      </h2>
      <div className="mb-8">
        <p className="text-neutral-800 leading-relaxed whitespace-pre-line">{description || "Không có mô tả"}</p>
      </div>
    </div>
  );
}
