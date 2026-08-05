"use client";

import { IconMapPin, IconEdit } from "@tabler/icons-react";
import { Button } from "@/components/shared";
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
      <div className="bg-taupe-50/50 p-5 border border-luxury-ink/10 rounded-[2px]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white border border-luxury-ink/10 flex items-center justify-center rounded-[2px]">
              <IconMapPin className="h-5 w-5 text-luxury-ink" />
            </div>
            <div>
              <p className="font-semibold text-luxury-ink text-sm">Chưa có địa chỉ giao hàng</p>
              <p className="text-[11px] text-taupe-500 mt-0.5">Vui lòng thêm địa chỉ để tiếp tục</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onChangeAddress}
            className="inline-flex items-center justify-center h-9 px-5 bg-luxury-ink text-white uppercase tracking-[0.2em] text-[11px] font-semibold rounded-[2px] hover:bg-luxury-ink/90 transition-colors"
          >
            Thêm địa chỉ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-taupe-50/50 p-5 border border-luxury-ink/10 rounded-[2px]">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2.5">
            <span className="font-semibold text-luxury-ink">{selectedAddress.fullName}</span>
            <span className="h-3 w-px bg-luxury-ink/20" />
            <span className="text-[11px] font-semibold uppercase tracking-wide text-taupe-500">{selectedAddress.phoneNumber}</span>
            {selectedAddress.isDefault && (
              <span className="px-2 py-0.5 bg-white border border-luxury-ink/10 text-luxury-ink text-[10px] uppercase tracking-wide font-semibold rounded-[2px]">
                Mặc định
              </span>
            )}
          </div>
          <p className="text-sm text-taupe-600 leading-relaxed">{formatAddress(selectedAddress)}</p>
        </div>
        <button
          type="button"
          onClick={onChangeAddress}
          className="inline-flex items-center justify-center gap-1.5 h-9 px-4 bg-white border border-luxury-ink/20 text-luxury-ink hover:bg-taupe-50 uppercase tracking-[0.2em] text-[11px] font-semibold rounded-[2px] transition-colors"
        >
          <IconEdit className="h-3.5 w-3.5" />
          Thay đổi
        </button>
      </div>
    </div>
  );
}
