import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Address } from "@/types/address";
import {
  AddressService,
  CreateAddressRequest,
} from "@/services/address.service";
import { queryKeys } from "@/lib/query-client";
import { serverStateConfig } from "@/lib/state";
import { useTokenStore } from "@/store/useTokenStore";
import { enrichAddresses } from "@/utils/addressTransform";

export function useAddress() {
  const accessToken = useTokenStore((state) => state.accessToken);
  const queryClient = useQueryClient();
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
    queryKey: queryKeys.addresses.list(),
    queryFn: async () => {
      if (!accessToken) {
        return [];
      }

      try {
        const rawAddresses = await AddressService.getAddresses();
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
    await AddressService.createAddress(address);
    await refetch(); // Đợi refetch hoàn thành
  };

  const handleUpdateAddress = async (
    id: string,
    address: CreateAddressRequest
  ) => {
    await AddressService.updateAddress(id, address);
    await refetch();
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
