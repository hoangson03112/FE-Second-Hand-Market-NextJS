"use client";

import { IconTruck, IconShield, IconMessageCircle } from "@tabler/icons-react";

export default function ProductGuarantees() {
  const guarantees = [
    { icon: IconTruck, title: "Vận Chuyển Miễn Phí", description: "Toàn quốc" },
    { icon: IconShield, title: "Bảo Vệ Người Mua", description: "Hoàn tiền 100%" },
    { icon: IconMessageCircle, title: "Hỗ Trợ 24/7", description: "Phản hồi nhanh" },
  ];
  return (
    <div className="border-t border-luxury-ink/10 pt-5 mt-5">
      <div className="grid grid-cols-3 gap-3">
        {guarantees.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex flex-col items-center text-center gap-2 p-3 rounded-[2px] bg-taupe-50/50 border border-luxury-ink/10 hover:bg-taupe-50 hover:border-luxury-ink/30 transition-all duration-200"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-[2px] bg-taupe-50 border border-luxury-ink/10 flex items-center justify-center">
                <Icon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-luxury-ink leading-tight">
                  {item.title}
                </h4>
                <p className="text-[11px] text-taupe-500 mt-1">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}