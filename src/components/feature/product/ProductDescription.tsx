"use client";

interface ProductDescriptionProps {
  description: string;
}

export default function ProductDescription({ description }: ProductDescriptionProps) {
  return (
 
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-border p-8">
      <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
        <span className="w-1 h-8 bg-primary rounded-full"></span>
        Mô Tả Sản Phẩm
      </h2>
      <div className="mb-8">
      <p className="text-foreground leading-relaxed whitespace-pre-line">
        {description || "Không có mô tả"}
      </p>
    </div>
    </div>

  );
}

