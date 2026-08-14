"use client";

import { IconPhone, IconEdit, IconTrash, IconCheck } from "@tabler/icons-react";
import { Address } from "@/types/address";
import { useState } from "react";
import { useConfirm } from "@/components/shared";
import { useToast } from "@/components/shared";
import { ADDRESS_MESSAGES } from "@/constants/messages";
import { cn } from "@/lib/utils";

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
      message:
        "Bạn có chắc muốn xóa địa chỉ này? Hành động này không thể hoàn tác.",
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
      className={cn(
        "cursor-pointer rounded-[2px] border bg-white px-5 py-5 transition-all duration-300",
        isSelected
          ? "border-luxury-ink shadow-[0_8px_24px_color-mix(in_srgb,var(--luxury-ink)_8%,transparent)]"
          : "border-luxury-ink/10 hover:border-luxury-ink/40",
      )}
    >
      <div className="flex items-start gap-4">
        <span
          aria-hidden
          className={cn(
            "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
            isSelected
              ? "border-luxury-ink bg-luxury-ink"
              : "border-luxury-ink/25",
          )}
        >
          {isSelected ? (
            <IconCheck className="h-2.5 w-2.5 text-luxury-ivory" />
          ) : null}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-bold text-luxury-ink">
              {address.fullName}
            </span>
            <span aria-hidden className="h-3 w-px bg-luxury-ink/15" />
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] tabular-nums text-neutral-600">
              <IconPhone className="h-3 w-3" />
              {address.phoneNumber}
            </span>
            {address.isDefault ? (
              <span className="rounded-[2px] border border-luxury-champagne/50 bg-cream-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-700">
                Mặc định
              </span>
            ) : null}
          </div>

          <p className="mt-2.5 text-sm leading-relaxed text-neutral-600">
            {formatAddress(address)}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={handleEdit}
            aria-label="Sửa địa chỉ"
            className="rounded-[2px] p-2 text-neutral-500 transition-colors hover:bg-cream-100 hover:text-luxury-ink"
          >
            <IconEdit className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            aria-label="Xóa địa chỉ"
            className="rounded-[2px] p-2 text-neutral-500 transition-colors hover:bg-blush-50 hover:text-blush-700 disabled:opacity-50"
          >
            <IconTrash className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
