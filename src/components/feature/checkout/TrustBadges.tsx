"use client";

const badges = [
  { text: "Đảm bảo hoàn tiền 100%" },
  { text: "Thanh toán an toàn & bảo mật" },
  { text: "Hỗ trợ 24/7" },
];

export default function TrustBadges() {
  return (
    <div className="bg-muted/50 rounded-xl p-4 space-y-2">
      {badges.map((badge, index) => (
        <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>{badge.text}</span>
        </div>
      ))}
    </div>
  );
}
