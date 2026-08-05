"use client";

import { IconMapPin, IconPlus, IconX, IconArrowLeft } from "@tabler/icons-react";
import { Address } from "@/types/address";
import { AddressForm } from "./AddressForm";
import type { CreateAddressRequest } from "@/types/address";
import { useState } from "react";
import AddressList from "./AddressList";

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

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={onHide}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative bg-white rounded-[2px] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-luxury-ink/10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between p-6 border-b border-luxury-ink/10 bg-taupe-50/30">
            <div className="flex items-center gap-4">
              {showNewAddressForm && (
                <button
                  onClick={handleBack}
                  className="p-2 hover:bg-taupe-50 rounded-[2px] transition-colors"
                >
                  <IconArrowLeft className="h-5 w-5 text-taupe-500" />
                </button>
              )}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[2px] bg-white border border-luxury-ink/10 flex items-center justify-center">
                  <IconMapPin className="h-5 w-5 text-luxury-ink" />
                </div>
                <div>
                  <h2 className="text-2xl text-luxury-ink mb-1" style={{ fontFamily: "var(--font-droid-serif), serif" }}>
                    {showNewAddressForm
                      ? editingAddress
                        ? "Chỉnh sửa địa chỉ"
                        : "Thêm địa chỉ mới"
                      : "Địa Chỉ Giao Hàng"}
                  </h2>
                  <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-taupe-500">
                    {showNewAddressForm
                      ? "Điền thông tin địa chỉ của bạn"
                      : `${addresses.length} địa chỉ`}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={onHide}
              className="p-2 hover:bg-blush-50 rounded-[2px] transition-colors group"
            >
              <IconX className="h-5 w-5 text-taupe-400 group-hover:text-blush-600" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 bg-white">
            {!showNewAddressForm ? (
              <div className="space-y-4">
                <AddressList
                  addresses={addresses}
                  selectedAddress={selectedAddress}
                  onSelectAddress={onSelectAddress}
                  onEditAddress={handleEditAddress}
                  onDeleteAddress={onDeleteAddress}
                  onClose={onHide}
                />
                <button
                  onClick={() => {
                    setEditingAddress(null);
                    onToggleNewAddressForm(true);
                  }}
                  className="w-full p-4 border border-dashed border-luxury-ink/20 rounded-[2px] hover:border-luxury-ink/50 hover:bg-taupe-50/50 transition-colors"
                >
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-8 h-8 rounded-[2px] bg-taupe-50 border border-luxury-ink/10 flex items-center justify-center">
                      <IconPlus className="h-4 w-4 text-luxury-ink" />
                    </div>
                    <span className="font-semibold text-[11px] uppercase tracking-[0.2em] text-luxury-ink">
                      Thêm địa chỉ mới
                    </span>
                  </div>
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
