"use client";

import { IconCheck } from "@tabler/icons-react";
import { Eyebrow } from "@/features/order/components";

const badges = [
  { text: "Đảm bảo hoàn tiền 100%" },
  { text: "Thanh toán an toàn & bảo mật" },
  { text: "Hỗ trợ 24/7" },
];

export default function TrustBadges() {
  return (
    <div className="rounded-[2px] border border-luxury-ink/10 bg-cream-50/60 px-5 py-5 sm:px-6">
      <Eyebrow>Cam kết</Eyebrow>
      <ul className="mt-4 space-y-3">
        {badges.map((badge) => (
          <li
            key={badge.text}
            className="flex items-start gap-3 text-xs leading-relaxed text-neutral-700"
          >
            <IconCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
            <span>{badge.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
