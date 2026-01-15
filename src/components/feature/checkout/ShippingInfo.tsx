"use client";

import { Truck, Clock, Package, CheckCircle } from "lucide-react";
import { formatPrice } from "@/utils/format/price";

interface ShippingInfoProps {
  shippingFee?: number;
  estimatedDays?: number;
}

export default function ShippingInfo({ 
  shippingFee = 30000, 
  estimatedDays = 3 
}: ShippingInfoProps) {
  return (
    <div className="space-y-6">
      {/* Main Info - Clean Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Shipping Fee */}
        <div className="p-4 rounded-xl border border-border bg-background hover:bg-muted/30 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Truck className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Phí vận chuyển</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {formatPrice(shippingFee)}
          </p>
        </div>

        {/* Delivery Time */}
        <div className="p-4 rounded-xl border border-border bg-background hover:bg-muted/30 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Thời gian giao</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{estimatedDays} ngày</p>
          <p className="text-xs text-muted-foreground mt-1">
            Dự kiến: {getEstimatedDate(estimatedDays)}
          </p>
        </div>
      </div>

      {/* Benefits List */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
          <span className="text-muted-foreground">Giao hàng nhanh chóng, đúng hẹn</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
          <span className="text-muted-foreground">Kiểm tra hàng trước khi thanh toán</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
          <span className="text-muted-foreground">Đóng gói cẩn thận, chắc chắn</span>
        </div>
      </div>
    </div>
  );
}

// Helper function to calculate estimated delivery date
function getEstimatedDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  };
  
  return date.toLocaleDateString('vi-VN', options);
}
