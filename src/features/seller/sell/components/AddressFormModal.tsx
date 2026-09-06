"use client";

import { IconX } from "@tabler/icons-react";
import type { Address, CreateAddressRequest } from "@/types/address";
import { AddressForm } from "@/features/order/checkout/components/AddressForm";
import { Eyebrow } from "@/features/order/components";

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

  const isEditMode = !!editingAddress;

  const handleSubmit = async (data: CreateAddressRequest) => {
    if (editingAddress) {
      await onUpdate(editingAddress._id, data);
    } else {
      await onCreate(data);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-luxury-ink/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-luxury-ivory shadow-[0_24px_64px_color-mix(in_srgb,var(--luxury-ink)_22%,transparent)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4 border-b border-luxury-ink/10 bg-white px-6 py-5">
            <div className="min-w-0">
              <Eyebrow>
                {isEditMode ? "Chỉnh sửa thông tin" : "Kho vận"}
              </Eyebrow>
              <h2 className="font-droid-serif mt-3 truncate text-xl tracking-tight text-luxury-ink">
                {isEditMode ? "Sửa địa chỉ lấy hàng" : "Thêm địa chỉ lấy hàng"}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="-mr-2 rounded-[2px] p-2 text-neutral-500 transition-colors hover:bg-taupe-50 hover:text-luxury-ink"
            >
              <IconX className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <AddressForm
              initialData={editingAddress}
              onSubmit={handleSubmit}
              onCancel={onClose}
            />
          </div>
        </div>
      </div>
    </>
  );
}
