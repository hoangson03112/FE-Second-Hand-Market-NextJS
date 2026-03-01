"use client";

import { IconPackage, IconClock, IconAlertCircle } from "@tabler/icons-react";
import { ShippingServiceOption } from "@/types/address";
import { formatPrice } from "@/utils/format/price";

interface SellerShippingItem {
  sellerName: string;
  fee: number;
  estimatedDays?: number;
  estimatedDate?: string;
  short_name?: string;
}

interface ShippingInfoProps {
  shippingInfo: ShippingServiceOption | null;
  isCalculating: boolean;
  error?: string | null;
  /** Phí ship theo từng seller - hiển thị khi có nhiều seller */
  perSellerShipping?: SellerShippingItem[];
  /** Gọi khi user bấm "Thêm/Chọn địa chỉ" trong trạng thái chưa có địa chỉ */
  onAddAddress?: () => void;
}

export default function ShippingInfo({
  shippingInfo,
  isCalculating,
  error,
  perSellerShipping = [],
  onAddAddress,
}: ShippingInfoProps) {
  if (isCalculating) {
    return (
      <div className="flex items-center gap-3 py-4">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
        <span className="text-sm text-taupe-600">Đang tính phí vận chuyển...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-3 p-4 bg-red-50/80 border-2 border-red-200 rounded-xl">
        <div className="flex items-start gap-3">
          <IconAlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900 mb-1">Không thể tính phí vận chuyển</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
        {onAddAddress && (
          <button type="button" onClick={onAddAddress} className="btn btn-secondary btn-sm w-fit">
            Chọn lại địa chỉ
          </button>
        )}
      </div>
    );
  }

  if (!shippingInfo) {
    return (
      <div className="text-center py-6 text-taupe-600">
        <IconPackage className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm mb-3">Vui lòng chọn địa chỉ giao hàng ở trên để xem phí vận chuyển</p>
        {onAddAddress && (
          <button type="button" onClick={onAddAddress} className="btn btn-secondary btn-sm">
            Thêm / Chọn địa chỉ
          </button>
        )}
      </div>
    );
  }

  const showPerSeller = perSellerShipping.length > 1;

  return (
    <div className="space-y-4">
      {showPerSeller ? (
        <>
          <p className="text-sm font-medium text-taupe-900">Phí vận chuyển theo từng đơn:</p>
          <div className="space-y-3">
            {perSellerShipping.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2 px-3 bg-taupe-50 rounded-lg border border-default"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-taupe-900 truncate">{item.sellerName}</p>
                  {item.short_name && (
                    <p className="text-xs text-taupe-500">{item.short_name}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className="text-sm font-semibold text-taupe-900">{formatPrice(item.fee)}</p>
                  {item.estimatedDays != null && (
                    <p className="text-xs text-taupe-500">~{item.estimatedDays} ngày</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-default">
            <span className="text-sm font-medium text-taupe-900">Tổng phí ship</span>
            <span className="text-base font-semibold text-primary">{formatPrice(shippingInfo.fee)}</span>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-taupe-900">{shippingInfo.short_name}</p>
              {shippingInfo.service_name && (
                <p className="text-sm text-taupe-600 mt-0.5">{shippingInfo.service_name}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-taupe-900">{formatPrice(shippingInfo.fee)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-taupe-600 pt-3 border-t border-default">
            <IconClock className="h-4 w-4" />
            <span>
              Dự kiến giao hàng trong <strong className="text-taupe-900">{shippingInfo.estimatedDays} ngày</strong>
              {shippingInfo.estimatedDate && <span className="ml-1">({shippingInfo.estimatedDate})</span>}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
