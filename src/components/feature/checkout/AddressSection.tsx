"use client";

import { MapPin, Edit2 } from "lucide-react";
import { Address } from "@/types/address";

interface AddressSectionProps {
  selectedAddress?: Address | null;
  onChangeAddress: () => void;
}

const formatAddress = (address: Address | null) => {
  if (!address) return "";
  const parts = [
    address.address,
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
      <div className="bg-muted rounded-xl p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Chưa có địa chỉ giao hàng</p>
              <p className="text-sm text-muted-foreground">Vui lòng thêm địa chỉ để tiếp tục</p>
            </div>
          </div>
          <button
            onClick={onChangeAddress}
            className="btn btn-primary btn-sm rounded-lg"
          >
            Thêm địa chỉ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted rounded-xl p-5">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-foreground text-lg">
              {selectedAddress.fullName}
            </span>
            <span className="h-4 w-px bg-border" />
            <span className="text-muted-foreground">
              {selectedAddress.phoneNumber}
            </span>
            {selectedAddress.isDefault && (
              <span className="px-2.5 py-0.5 bg-accent/20 text-accent text-xs font-semibold rounded-full">
                Mặc định
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {formatAddress(selectedAddress)}
          </p>
        </div>
        <button
          onClick={onChangeAddress}
          className="btn btn-secondary btn-sm flex items-center gap-2 rounded-lg"
        >
          <Edit2 className="h-4 w-4" />
          Thay đổi
        </button>
      </div>
    </div>
  );
}
