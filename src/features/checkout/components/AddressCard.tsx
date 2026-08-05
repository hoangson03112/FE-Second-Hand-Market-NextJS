"use client";

import { IconPhone, IconUser, IconHome, IconEdit, IconTrash } from "@tabler/icons-react";
import { Address } from "@/types/address";
import { useState } from "react";
import { useConfirm } from "@/components/shared";
import { useToast } from "@/components/shared";
import { ADDRESS_MESSAGES } from "@/constants/messages";

interface AddressCardProps {
  address: Address;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => Promise<void>;
}

const formatAddress = (address: Address) => {
  const parts = [
    address.address,
    address.ward,
    address.district,
    address.province,
  ].filter(Boolean);
  return parts.join(", ");
};

export default function AddressCard({
  address,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: AddressCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { confirm } = useConfirm();
  const toast = useToast();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const confirmed = await confirm({
      title: "Xóa địa chỉ",
      message: "Bạn có chắc muốn xóa địa chỉ này? Hành động này không thể hoàn tác.",
      confirmText: "Xóa",
      cancelText: "Hủy",
      variant: "danger",
    });

    if (confirmed) {
      setIsDeleting(true);
      try {
        await onDelete();
        toast.success(ADDRESS_MESSAGES.DELETE_SUCCESS);
      } catch {
        toast.error(ADDRESS_MESSAGES.DELETE_ERROR);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  return (
    <div
      onClick={onSelect}
      className={`p-5 rounded-[2px] cursor-pointer transition-all border ${
        isSelected
          ? "bg-taupe-50/50 border-luxury-ink/30"
          : "bg-white border-luxury-ink/10 hover:border-luxury-ink/30"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[2px] bg-taupe-50 border border-luxury-ink/10 flex items-center justify-center">
                <IconUser className="h-4 w-4 text-luxury-ink" />
              </div>
              <span className="font-semibold text-luxury-ink">{address.fullName}</span>
            </div>
            <div className="h-3 w-px bg-luxury-ink/20" />
            <div className="flex items-center gap-1.5 text-taupe-500">
              <IconPhone className="h-3.5 w-3.5 text-taupe-400" />
              <span className="text-[11px] font-semibold uppercase tracking-wide">{address.phoneNumber}</span>
            </div>
            {address.isDefault && (
              <span className="px-2 py-0.5 bg-luxury-ink text-white text-[10px] uppercase tracking-wide font-semibold rounded-[2px]">
                Mặc định
              </span>
            )}
          </div>
          <div className="flex items-start gap-2.5">
            <IconHome className="h-4 w-4 text-taupe-400 mt-0.5" />
            <p className="text-sm text-taupe-600 leading-relaxed flex-1">
              {formatAddress(address)}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3 flex-shrink-0">
          <div className="flex gap-1.5">
            <button
              onClick={handleEdit}
              className="flex items-center gap-1.5 p-2 text-luxury-ink hover:bg-taupe-50 rounded-[2px] transition-colors"
            >
              <IconEdit className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-1.5 p-2 text-blush-600 hover:bg-blush-50 rounded-[2px] transition-colors disabled:opacity-50"
            >
              <IconTrash className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
