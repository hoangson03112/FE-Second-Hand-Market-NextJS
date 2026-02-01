"use client";

import { ShippingServiceOption } from "@/types/address";
import { formatPrice } from "@/utils/format/price";
import { Package, Clock, AlertCircle } from "lucide-react";

interface ShippingInfoProps {
  shippingInfo: ShippingServiceOption | null;
  isCalculating: boolean;
  error?: string | null;
}

export default function ShippingInfo({
  shippingInfo,
  isCalculating,
  error,
}: ShippingInfoProps) {
  if (isCalculating) {
    return (
      <div className="flex items-center gap-3 py-4">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
        <span className="text-sm text-muted-foreground">Đang tính phí vận chuyển...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-red-900 mb-1">Không thể tính phí vận chuyển</p>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!shippingInfo) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Vui lòng chọn địa chỉ giao hàng</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-foreground">{shippingInfo.short_name}</p>
          {shippingInfo.service_name && (
            <p className="text-sm text-muted-foreground mt-0.5">{shippingInfo.service_name}</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-foreground">{formatPrice(shippingInfo.fee)}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground pt-3 border-t">
        <Clock className="h-4 w-4" />
        <span>
          Dự kiến giao hàng trong <strong className="text-foreground">{shippingInfo.estimatedDays} ngày</strong>
          {shippingInfo.estimatedDate && <span className="ml-1">({shippingInfo.estimatedDate})</span>}
        </span>
      </div>
    </div>
  );
}
