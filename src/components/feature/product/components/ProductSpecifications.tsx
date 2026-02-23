"use client";

interface ProductSpecificationsProps {
  details: string[];
}

export default function ProductSpecifications({ details }: ProductSpecificationsProps) {
  if (!details || details.length === 0) return null;
  return (
    <div className="bg-cream-50 p-5 mb-3 border border-taupe-200">
      <h3 className="font-medium text-taupe-900 mb-4 text-sm uppercase tracking-[0.08em]">Thông Số Kỹ Thuật</h3>
      <div className="space-y-2.5">
        {details.map((detail, idx) => {
          const [label, value] = detail.split(":");
          return (
            <div key={idx} className="flex justify-between items-start text-sm py-1.5 border-b border-taupe-100 last:border-0">
              <span className="text-taupe-600">{label}</span>
              <span className="text-taupe-900 text-right">{value?.trim()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
