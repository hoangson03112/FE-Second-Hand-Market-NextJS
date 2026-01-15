"use client";

import { Address } from "@/types/address";
import { MapPin } from "lucide-react";
import AddressCard from "./AddressCard";

interface AddressListProps {
  addresses: Address[];
  selectedAddress: Address | null;
  onSelectAddress: (address: Address) => void;
  onEditAddress: (address: Address) => void;
  onDeleteAddress: (id: string) => Promise<void>;
  onClose: () => void;
}

export default function AddressList({
  addresses,
  selectedAddress,
  onSelectAddress,
  onEditAddress,
  onDeleteAddress,
  onClose,
}: AddressListProps) {
  // Empty state
  if (!addresses.length) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
          <MapPin className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">
          Chưa có địa chỉ nào
        </h3>
        <p className="text-muted-foreground text-sm">
          Thêm địa chỉ giao hàng để tiếp tục đặt hàng
        </p>
      </div>
    );
  }

  const handleSelectAddress = (address: Address) => {
    onSelectAddress(address);
    onClose();
  };

  return (
    <div className="space-y-3">
      {addresses.map((address) => (
        <AddressCard
          key={address._id}
          address={address}
          isSelected={selectedAddress?._id === address._id}
          onSelect={() => handleSelectAddress(address)}
          onEdit={() => onEditAddress(address)}
          onDelete={() => onDeleteAddress(address._id)}
        />
      ))}
    </div>
  );
}
