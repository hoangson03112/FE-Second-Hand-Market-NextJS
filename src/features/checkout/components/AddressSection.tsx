"use client";

import { IconMapPin, IconEdit } from "@tabler/icons-react";
import { Address } from "@/types/address";

interface AddressSectionProps {
  selectedAddress?: Address | null;
  onChangeAddress: () => void;
}

const formatAddress = (address: Address | null) => {
  if (!address) return "";
  const parts = [
    address.specificAddress || address.address,
    address.ward,
    address.district,
    address.province,
  ].filter(Boolean);
  return parts.join(", ");
};

export default function AddressSection({
  selectedAddress = null,
  onChangeAddress,
}: AddressSectionProps) {
  if (!selectedAddress) {
    return (
      <div className="bg-taupe-50/60 p-5 border border-border rounded-xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white border border-border flex items-center justify-center rounded-xl">
              <IconMapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-taupe-900 text-sm">Chưa có địa chỉ giao hàng</p>
              <p className="text-xs text-taupe-500 mt-0.5">Vui lòng thêm địa chỉ để tiếp tục</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onChangeAddress}
            className="inline-flex items-center justify-center h-9 px-5 bg-primary text-primary-foreground uppercase tracking-wide text-xs font-bold rounded-xl hover:bg-primary/90 hover:shadow-md transition-all duration-200 active:scale-[0.98]"
          >
            Thêm địa chỉ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-taupe-50/60 p-5 border border-border rounded-xl">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2.5">
            <span className="font-semibold text-taupe-900">{selectedAddress.fullName}</span>
            <span className="h-3 w-px bg-taupe-300" />
            <span className="text-xs font-semibold uppercase tracking-wide text-taupe-600">{selectedAddress.phoneNumber}</span>
            {selectedAddress.isDefault && (
              <span className="px-2 py-0.5 bg-white border border-border text-taupe-900 text-[10px] uppercase tracking-wide font-semibold rounded-full">
                Mặc định
              </span>
            )}
          </div>
          <p className="text-sm text-taupe-600 leading-relaxed">{formatAddress(selectedAddress)}</p>
        </div>
        <button
          type="button"
          onClick={onChangeAddress}
          className="inline-flex items-center justify-center gap-1.5 h-9 px-4 bg-white border-2 border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/60 uppercase tracking-wide text-xs font-bold rounded-xl transition-all duration-200"
        >
          <IconEdit className="h-3.5 w-3.5" />
          Thay đổi
        </button>
      </div>
    </div>
  );
}