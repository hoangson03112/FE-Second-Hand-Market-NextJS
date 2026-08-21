"use client";

import { IconPlus, IconX, IconArrowLeft } from "@tabler/icons-react";
import { Address } from "@/types/address";
import { AddressForm } from "./AddressForm";
import type { CreateAddressRequest } from "@/types/address";
import { useState } from "react";
import AddressList from "./AddressList";
import { Eyebrow } from "@/features/order/components";

interface AddressModalProps {
  show: boolean;
  onHide: () => void;
  addresses: Address[];
  selectedAddress: Address | null;
  onSelectAddress: (address: Address) => void;
  showNewAddressForm: boolean;
  onToggleNewAddressForm: (show: boolean) => void;
  onCreateAddress: (data: CreateAddressRequest) => Promise<void>;
  onUpdateAddress: (id: string, data: CreateAddressRequest) => Promise<void>;
  onDeleteAddress: (id: string) => Promise<void>;
}

export default function AddressModal({
  show,
  onHide,
  addresses,
  selectedAddress,
  onSelectAddress,
  showNewAddressForm,
  onToggleNewAddressForm,
  onCreateAddress,
  onUpdateAddress,
  onDeleteAddress,
}: AddressModalProps) {
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  if (!show) return null;

  const handleCreateSuccess = () => {
    onToggleNewAddressForm(false);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    onToggleNewAddressForm(true);
  };

  const handleUpdateSuccess = () => {
    setEditingAddress(null);
    onToggleNewAddressForm(false);
  };

  const handleCancelEdit = () => {
    setEditingAddress(null);
    onToggleNewAddressForm(false);
  };

  const handleFormSubmit = async (data: CreateAddressRequest) => {
    if (editingAddress) {
      await onUpdateAddress(editingAddress._id, data);
    } else {
      await onCreateAddress(data);
    }
  };

  const handleBack = () => {
    if (showNewAddressForm) {
      handleCancelEdit();
    }
  };

  const title = showNewAddressForm
    ? editingAddress
      ? "Chỉnh sửa địa chỉ"
      : "Thêm địa chỉ mới"
    : "Địa chỉ giao hàng";

  const eyebrow = showNewAddressForm
    ? "Thông tin nhận hàng"
    : `${addresses.length} địa chỉ đã lưu`;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-luxury-ink/50 backdrop-blur-sm transition-opacity"
        onClick={onHide}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-luxury-ivory shadow-[0_24px_64px_color-mix(in_srgb,var(--luxury-ink)_22%,transparent)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4 border-b border-luxury-ink/10 bg-white px-6 py-5">
            <div className="flex min-w-0 items-start gap-4">
              {showNewAddressForm ? (
                <button
                  type="button"
                  onClick={handleBack}
                  aria-label="Quay lại danh sách"
                  className="-ml-2 rounded-[2px] p-2 text-luxury-ink transition-colors hover:bg-taupe-50"
                >
                  <IconArrowLeft className="h-5 w-5" />
                </button>
              ) : null}
              <div className="min-w-0">
                <Eyebrow>{eyebrow}</Eyebrow>
                <h2 className="font-droid-serif mt-3 truncate text-xl tracking-tight text-luxury-ink">
                  {title}
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={onHide}
              aria-label="Đóng"
              className="-mr-2 rounded-[2px] p-2 text-neutral-500 transition-colors hover:bg-taupe-50 hover:text-luxury-ink"
            >
              <IconX className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            {!showNewAddressForm ? (
              <div className="space-y-3">
                <AddressList
                  addresses={addresses}
                  selectedAddress={selectedAddress}
                  onSelectAddress={onSelectAddress}
                  onEditAddress={handleEditAddress}
                  onDeleteAddress={onDeleteAddress}
                  onClose={onHide}
                />
                <button
                  type="button"
                  onClick={() => {
                    setEditingAddress(null);
                    onToggleNewAddressForm(true);
                  }}
                  className="group flex w-full items-center justify-center gap-3 rounded-[2px] border border-dashed border-luxury-ink/20 bg-white/60 px-4 py-5 transition-all duration-300 hover:border-luxury-ink/40 hover:bg-white"
                >
                  <IconPlus className="h-4 w-4 text-luxury-ink" />
                  <span className="text-2xs font-bold uppercase tracking-[0.22em] text-luxury-ink">
                    Thêm địa chỉ mới
                  </span>
                </button>
              </div>
            ) : (
              <AddressForm
                key={editingAddress?._id ?? "new"}
                initialData={editingAddress}
                onSubmit={handleFormSubmit}
                onSuccess={
                  editingAddress ? handleUpdateSuccess : handleCreateSuccess
                }
                onCancel={handleCancelEdit}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
