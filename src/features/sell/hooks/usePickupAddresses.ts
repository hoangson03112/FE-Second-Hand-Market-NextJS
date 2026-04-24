"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Address, CreateAddressRequest } from "@/types/address";
import { AddressService } from "@/services/address.service";
import { enrichAddresses } from "@/utils/addressTransform";
import { useTokenStore } from "@/store/useTokenStore";
import { useToast } from "@/components/shared";

const PICKUP_QUERY_KEY = ["addresses", "list", "pickup"] as const;

export function usePickupAddresses() {
  const accessToken = useTokenStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const toast = useToast();

  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showModal, setShowModal] = useState(false);

  const {
    data: addresses = [],
    isLoading,
    refetch,
  } = useQuery<Address[]>({
    queryKey: PICKUP_QUERY_KEY,
    queryFn: async () => {
      if (!accessToken) return [];
      const raw = await AddressService.getAddresses("pickup");
      return enrichAddresses(raw, queryClient);
    },
    enabled: !!accessToken,
    staleTime: 60_000,
    gcTime: 10 * 60_000,
  });

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setShowModal(true);
  };

  const handleOpenEdit = (address: Address) => {
    setEditingAddress(address);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAddress(null);
  };

  const handleCreate = async (data: CreateAddressRequest) => {
    await AddressService.createAddress({ ...data, type: "pickup" });
    await refetch();
    toast.success("Đã thêm địa chỉ lấy hàng");
    handleCloseModal();
  };

  const handleUpdate = async (id: string, data: CreateAddressRequest) => {
    await AddressService.updateAddress(id, { ...data, type: "pickup" });
    await refetch();
    toast.success("Đã cập nhật địa chỉ");
    handleCloseModal();
  };

  const handleDelete = async (id: string) => {
    try {
      await AddressService.deleteAddress(id);
      await refetch();
      toast.success("Đã xóa địa chỉ");
    } catch {
      toast.error("Không thể xóa địa chỉ. Vui lòng thử lại.");
    }
  };

  return {
    addresses,
    isLoading,
    editingAddress,
    showModal,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseModal,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}
