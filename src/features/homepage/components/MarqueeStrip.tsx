"use client";

const ITEMS = [
  "Tuyển chọn kỹ lưỡng",
  "Giao dịch an toàn",
  "Second-hand cao cấp",
  "Minh bạch 100%",
  "Bền vững",
  "Giá trị thực",
  "Cộng đồng tin cậy",
];

function MarqueeContent() {
  return (
    <>
      {ITEMS.map((item) => (
        <span
          key={item}
          className="mx-8 inline-flex items-center gap-8 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.32em] text-luxury-ivory/85"
        >
          {item}
          <span className="text-luxury-champagne" aria-hidden>
            ✦
          </span>
        </span>
      ))}
    </>
  );
}

export default function MarqueeStrip() {
  return (
    <div
      className="relative overflow-hidden border-y border-charcoal-800/10 bg-luxury-ink py-4"
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-luxury-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-luxury-ink to-transparent" />
      <div className="flex w-max animate-marquee-luxury">
        <MarqueeContent />
        <MarqueeContent />
      </div>
    </div>
  );
}
