"use client";

import {
  IconMapPin,
  IconPlus,
  IconEdit,
  IconTrash,
  IconCheck,
  IconPhone,
} from "@tabler/icons-react";
import type { Address } from "@/types/address";
import { useConfirm } from "@/components/ui";
import { SectionCard } from "./SectionCard";

interface PickupAddressSelectorProps {
  addresses: Address[];
  selectedId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

function formatAddress(address: Address): string {
  const parts = [
    address.specificAddress || address.address,
    address.ward,
    address.district,
    address.province,
  ].filter(Boolean);
  return parts.join(", ") || "Chưa có địa chỉ chi tiết";
}

function AddressCard({
  address,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: {
  address: Address;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => Promise<void>;
}) {
  const { confirm } = useConfirm();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await confirm({
      title: "Xóa địa chỉ",
      message: "Bạn có chắc muốn xóa địa chỉ này không?",
      confirmText: "Xóa",
      cancelText: "Hủy",
      variant: "danger",
    });
    if (ok) await onDelete();
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  return (
    <div
      onClick={onSelect}
      className={`relative rounded-[2px] border p-3 cursor-pointer transition-all duration-200 ${
        isSelected
          ? "border-luxury-ink bg-cream-50"
          : "border-luxury-ink/10 bg-white hover:border-luxury-ink/40 hover:bg-cream-50/70"
      }`}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-luxury-ink flex items-center justify-center">
          <IconCheck className="w-3 h-3 text-white" />
        </div>
      )}

      <div className="pr-8 space-y-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-luxury-ink">
            {address.fullName}
          </span>
          {address.isDefault && (
            <span className="text-2xs font-medium px-1.5 py-0.5 rounded-full bg-cream-100 text-luxury-ink border border-luxury-champagne/40">
              Mặc định
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs text-neutral-500">
          <IconPhone className="w-3 h-3 shrink-0" />
          <span>{address.phoneNumber}</span>
        </div>

        <div className="flex items-start gap-1 text-xs text-neutral-500">
          <IconMapPin className="w-3 h-3 shrink-0 mt-0.5" />
          <span className="line-clamp-2">{formatAddress(address)}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-luxury-ink/10">
        <button
          type="button"
          onClick={handleEdit}
          className="flex items-center gap-1 text-2xs font-medium text-neutral-500 hover:text-luxury-ink transition-colors px-1.5 py-1 rounded-[2px] hover:bg-cream-50"
        >
          <IconEdit className="w-3 h-3" />
          Sửa
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="flex items-center gap-1 text-2xs font-medium text-neutral-500 hover:text-blush-700 transition-colors px-1.5 py-1 rounded-[2px] hover:bg-red-50"
        >
          <IconTrash className="w-3 h-3" />
          Xóa
        </button>
      </div>
    </div>
  );
}

export function PickupAddressSelector({
  addresses,
  selectedId,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
  isLoading,
  error,
}: PickupAddressSelectorProps) {
  return (
    <SectionCard icon={IconMapPin} title="Địa chỉ lấy hàng">
      {isLoading ? (
        <div className="py-4 text-center">
          <div className="w-5 h-5 border border-luxury-ink/20 border-t-luxury-ink rounded-full animate-spin mx-auto mb-1.5" />
          <p className="text-xs text-neutral-500">Đang tải địa chỉ...</p>
        </div>
      ) : addresses.length === 0 ? (
        <div className="py-4 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center mx-auto">
            <IconMapPin className="w-5 h-5 text-primary" />
          </div>
          <p className="text-xs text-neutral-500">
            Bạn chưa có địa chỉ lấy hàng nào
          </p>
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-luxury-ink/80 transition-colors"
          >
            <IconPlus className="w-3.5 h-3.5" />
            Thêm địa chỉ lấy hàng
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {addresses.map((addr) => (
              <AddressCard
                key={addr._id}
                address={addr}
                isSelected={selectedId === addr._id}
                onSelect={() => onSelect(addr._id)}
                onEdit={() => onEdit(addr)}
                onDelete={() => onDelete(addr._id)}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={onAdd}
            className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-luxury-ink/80 transition-colors mt-1"
          >
            <IconPlus className="w-3.5 h-3.5" />
            Thêm địa chỉ mới
          </button>
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </SectionCard>
  );
}
