import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Address, CreateAddressRequest } from "@/types/address";
import { AddressService } from "@/services/address.service";
import { queryKeys } from "@/lib/query-client";
import { serverStateConfig } from "@/lib/state";
import { useTokenStore } from "@/store/useTokenStore";
import { enrichAddresses } from "@/utils/addressTransform";
import { useToast } from "@/components/ui/Toast";

export function useAddress() {
  const accessToken = useTokenStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  // Fetch addresses from API
  const {
    data: addresses = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Address[]>({
    queryKey: [...queryKeys.addresses.list(), "delivery"],
    queryFn: async () => {
      if (!accessToken) {
        return [];
      }

      try {
        const rawAddresses = await AddressService.getAddresses("delivery");
        const enrichedAddresses = await enrichAddresses(
          rawAddresses,
          queryClient
        );

        return enrichedAddresses;
      } catch (error) {
        console.error("Error fetching addresses:", error);
        return [];
      }
    },
    enabled: !!accessToken, // Only fetch if user is authenticated
    staleTime: serverStateConfig.staleTime.dynamic, // 1 minute
    gcTime: serverStateConfig.gcTime.dynamic, // 10 minutes
  });

  // Auto-select default address on mount or when addresses change
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddress =
        addresses.find((addr) => addr.isDefault) || addresses[0];
      setSelectedAddress(defaultAddress);
    }
  }, [addresses, selectedAddress]);

  const handleSelectAddress = (address: Address) => {
    setSelectedAddress(address);
  };

  const handleOpenModal = () => {
    setShowAddressModal(true);
  };

  const handleCloseModal = () => {
    setShowAddressModal(false);
    setShowNewAddressForm(false);
  };

  const handleToggleNewAddressForm = (show: boolean) => {
    setShowNewAddressForm(show);
  };

  const handleCreateAddress = async (address: CreateAddressRequest) => {
    try {
      await AddressService.createAddress(address);
      await queryClient.invalidateQueries({ queryKey: queryKeys.addresses.list() });
      await refetch();
      toast.success("Đã thêm địa chỉ thành công");
    } catch (err) {
      toast.error("Không thể thêm địa chỉ. Vui lòng kiểm tra và thử lại.");
      throw err;
    }
  };

  const handleUpdateAddress = async (
    id: string,
    address: CreateAddressRequest
  ) => {
    try {
      await AddressService.updateAddress(id, address);
      await queryClient.invalidateQueries({ queryKey: queryKeys.addresses.list() });
      await refetch();
      toast.success("Đã cập nhật địa chỉ thành công");
    } catch (err) {
      toast.error("Không thể cập nhật địa chỉ. Vui lòng thử lại.");
      throw err;
    }
  };

  const handleDeleteAddress = async (id: string) => {
    await AddressService.deleteAddress(id);
    await refetch();
    // If deleted address was selected, clear selection
    if (selectedAddress?._id === id) {
      setSelectedAddress(null);
    }
  };

  return {
    // State
    addresses,
    selectedAddress,
    showAddressModal,
    showNewAddressForm,
    isLoading,
    error,

    // Actions
    handleSelectAddress,
    handleOpenModal,
    handleCloseModal,
    handleToggleNewAddressForm,
    handleCreateAddress,
    handleUpdateAddress,
    handleDeleteAddress,
    refetch, // Expose refetch for manual refresh after create/update/delete
  };
}
