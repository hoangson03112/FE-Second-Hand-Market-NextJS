"use client";

import { Truck, Shield, MessageCircle } from "lucide-react";

export default function ProductGuarantees() {
  const guarantees = [
    { icon: Truck, title: "Vận Chuyển Miễn Phí", description: "Toàn quốc" },
    { icon: Shield, title: "Bảo Vệ Người Mua", description: "Hoàn tiền 100%" },
    { icon: MessageCircle, title: "Hỗ Trợ 24/7", description: "Phản hồi nhanh" },
  ];
  return (
    <div className="border-t border-border pt-5 mt-5">
      <div className="grid grid-cols-3 gap-3">
        {guarantees.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex flex-col items-center text-center gap-2 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground leading-tight">{item.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
