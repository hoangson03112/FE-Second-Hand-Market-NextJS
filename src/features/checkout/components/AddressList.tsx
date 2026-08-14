"use client";

import { IconMapPin } from "@tabler/icons-react";
import { Address } from "@/types/address";
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
  if (!addresses.length) {
    return (
      <div className="px-6 py-14 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-[2px] border border-luxury-ink/10 bg-white">
          <IconMapPin className="h-6 w-6 text-luxury-ink" />
        </span>
        <h3
          style={{ fontFamily: "var(--font-droid-serif), serif" }}
          className="mt-6 text-xl tracking-tight text-luxury-ink"
        >
          Chưa có địa chỉ nào
        </h3>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-neutral-600">
          Thêm địa chỉ giao hàng để tiếp tục đặt hàng.
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