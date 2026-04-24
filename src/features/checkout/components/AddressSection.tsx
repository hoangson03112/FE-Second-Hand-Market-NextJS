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
      <div className="bg-taupe-50 p-4 border border-taupe-200">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 flex items-center justify-center">
              <IconMapPin className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-taupe-900 text-sm">Chưa có địa chỉ giao hàng</p>
              <p className="text-xs text-taupe-600">Vui lòng thêm địa chỉ để tiếp tục</p>
            </div>
          </div>
          <Button
            type="button"
            onClick={onChangeAddress}
            size="sm"
            className="text-sm px-4 py-2"
          >
            Thêm địa chỉ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-taupe-50 p-4 border border-taupe-200">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-taupe-900">{selectedAddress.fullName}</span>
            <span className="h-3 w-px bg-taupe-200" />
            <span className="text-sm text-taupe-600">{selectedAddress.phoneNumber}</span>
            {selectedAddress.isDefault && (
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium">
                Mặc định
              </span>
            )}
          </div>
          <p className="text-sm text-taupe-600">{formatAddress(selectedAddress)}</p>
        </div>
        <Button
          type="button"
          onClick={onChangeAddress}
          variant="secondary"
          size="sm"
          className="text-sm px-3 py-1.5"
        >
          <IconEdit className="h-3.5 w-3.5" />
          Thay đổi
        </Button>
      </div>
    </div>
  );
}
