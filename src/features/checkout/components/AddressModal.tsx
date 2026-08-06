"use client";

import {
  IconMapPin,
  IconPlus,
  IconX,
  IconArrowLeft,
} from "@tabler/icons-react";
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
        className="fixed inset-0 bg-taupe-900/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={onHide}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative bg-cream-50 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border-2 border-border"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between p-6 border-b-2 border-border bg-taupe-50/60">
            <div className="flex items-center gap-4">
              {showNewAddressForm && (
                <button
                  onClick={handleBack}
                  className="p-2 text-taupe-500 hover:bg-taupe-100 hover:text-taupe-900 rounded-full transition-colors"
                >
                  <IconArrowLeft className="h-5 w-5" />
                </button>
              )}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <IconMapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-taupe-900 mb-1">
                    {showNewAddressForm
                      ? editingAddress
                        ? "Chỉnh sửa địa chỉ"
                        : "Thêm địa chỉ mới"
                      : "Địa Chỉ Giao Hàng"}
                  </h2>
                  <p className="text-xs uppercase tracking-wide font-semibold text-taupe-500">
                    {showNewAddressForm
                      ? "Điền thông tin địa chỉ của bạn"
                      : `${addresses.length} Địa chỉ`}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={onHide}
              className="p-2 text-taupe-400 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
            >
              <IconX className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 bg-cream-50">
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
                  className="w-full p-4 border-2 border-dashed border-taupe-300 rounded-xl hover:border-primary/50 hover:bg-taupe-50/60 transition-colors"
                >
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <IconPlus className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-bold text-xs uppercase tracking-wide text-taupe-900">
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