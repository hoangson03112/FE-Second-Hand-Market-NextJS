"use client";

interface ProductSpecificationsProps {
  details: string[];
}

export default function ProductSpecifications({ details }: ProductSpecificationsProps) {
  if (!details || details.length === 0) return null;
  return (
    <div className="bg-muted rounded-xl p-6 mb-6">
      <h3 className="font-semibold text-foreground mb-4">Thông Số Kỹ Thuật</h3>
      <div className="space-y-3">
        {details.map((detail, idx) => {
          const [label, value] = detail.split(":");
          return (
            <div key={idx} className="flex justify-between items-start">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium text-foreground text-right">{value?.trim()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
