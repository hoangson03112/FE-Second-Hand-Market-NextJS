"use client";

interface ProductSpecificationsProps {
  details: string[];
}

export default function ProductSpecifications({
  details,
}: ProductSpecificationsProps) {
  if (!details || details.length === 0) return null;
  return (
    <div className="py-2">
      <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-luxury-ink mb-5">
        Thông số kỹ thuật
      </h3>
      <div className="space-y-1">
        {details.map((detail, idx) => {
          const [label, value] = detail.split(":");
          return (
            <div
              key={idx}
              className="flex justify-between items-center text-[11px] py-3 border-b border-luxury-ink/10 last:border-0"
            >
              <span className="text-neutral-500 font-semibold uppercase tracking-wide">
                {label}
              </span>
              <span className="text-luxury-ink font-medium text-right text-sm">
                {value?.trim()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
