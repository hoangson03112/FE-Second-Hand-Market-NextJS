"use client";

import { Address } from "@/types/address";
import { MapPin, Plus, X, ArrowLeft } from "lucide-react";
import { AddressForm } from "./AddressForm";
import { CreateAddressRequest } from "@/services/address.service";
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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onHide}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative bg-background rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between p-6 border-b border-border">
            <div className="flex items-center gap-4">
              {showNewAddressForm && (
                <button
                  onClick={handleBack}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                </button>
              )}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {showNewAddressForm
                      ? editingAddress
                        ? "Chỉnh sửa địa chỉ"
                        : "Thêm địa chỉ mới"
                      : "Địa Chỉ Giao Hàng"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {showNewAddressForm
                      ? "Điền thông tin địa chỉ của bạn"
                      : `${addresses.length} địa chỉ`}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={onHide}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
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
                  className="w-full p-4 border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Plus className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-semibold text-foreground">
                      Thêm địa chỉ mới
                    </span>
                  </div>
                </button>
              </div>
            ) : (
              <AddressForm
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
