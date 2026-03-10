"use client";

import { IconX } from "@tabler/icons-react";
import type { Address, CreateAddressRequest } from "@/types/address";
import { AddressForm } from "@/features/checkout/components/AddressForm";

interface AddressFormModalProps {
  isOpen: boolean;
  editingAddress: Address | null;
  onClose: () => void;
  onCreate: (data: CreateAddressRequest) => Promise<void>;
  onUpdate: (id: string, data: CreateAddressRequest) => Promise<void>;
}

export function AddressFormModal({
  isOpen,
  editingAddress,
  onClose,
  onCreate,
  onUpdate,
}: AddressFormModalProps) {
  if (!isOpen) return null;

  const handleSubmit = async (data: CreateAddressRequest) => {
    if (editingAddress) {
      await onUpdate(editingAddress._id, data);
    } else {
      await onCreate(data);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Panel */}
      <div
        className="relative z-10 w-full sm:max-w-lg bg-card rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-4 py-3 border-b border-border bg-card rounded-t-2xl sm:rounded-t-2xl z-10">
          <h2 className="text-sm font-semibold text-foreground">
            {editingAddress ? "Sửa địa chỉ lấy hàng" : "Thêm địa chỉ lấy hàng"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <IconX className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="p-4">
          <AddressForm
            initialData={editingAddress}
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}
