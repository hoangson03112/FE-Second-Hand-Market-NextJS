"use client";

import { Address } from "@/types/address";
import { CheckCircle2, Circle, Phone, User, Home, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useConfirm } from "@/components/ui";
import { useToast } from "@/components/ui";

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
        toast.success("Đã xóa địa chỉ thành công");
      } catch (error) {
        toast.error("Không thể xóa địa chỉ. Vui lòng thử lại");
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
      className={`p-5 rounded-xl cursor-pointer transition-all ${
        isSelected
          ? "bg-primary/10 border-2 border-primary"
          : "bg-muted border-2 border-transparent hover:border-border"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <span className="font-bold text-foreground">{address.fullName}</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              <span className="text-sm">{address.phoneNumber}</span>
            </div>
            {address.isDefault && (
              <span className="px-2.5 py-0.5 bg-accent/20 text-accent text-xs font-semibold rounded-full">
                Mặc định
              </span>
            )}
          </div>
          <div className="flex items-start gap-2">
            <Home className="h-4 w-4 text-muted-foreground mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">
              {formatAddress(address)}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3 flex-shrink-0">
          <div className="flex gap-1.5">
            <button
              onClick={handleEdit}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors whitespace-nowrap"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
