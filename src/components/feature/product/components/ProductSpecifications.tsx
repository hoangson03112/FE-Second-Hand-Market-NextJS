"use client";

interface ProductSpecificationsProps {
  details: string[];
}

export default function ProductSpecifications({ details }: ProductSpecificationsProps) {
  if (!details || details.length === 0) return null;
  return (
    <div className="bg-cream-50/50 rounded-2xl p-6 mb-6 border-2 border-neutral-200/60">
      <h3 className="font-semibold text-neutral-900 mb-4">Thông Số Kỹ Thuật</h3>
      <div className="space-y-3">
        {details.map((detail, idx) => {
          const [label, value] = detail.split(":");
          return (
            <div key={idx} className="flex justify-between items-start">
              <span className="text-neutral-600">{label}</span>
              <span className="font-medium text-neutral-900 text-right">{value?.trim()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
