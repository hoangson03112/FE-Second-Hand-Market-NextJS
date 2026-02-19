import axiosClient from "@/lib/axios";
import { rateLimitedRequest } from "@/lib/external-axios";
import type {
  Address,
  CreateAddressRequest,
  Province,
  District,
  Ward,
  GHNResponse,
} from "@/types/address";
import { logger } from "@/infrastructure/monitoring/logger";

/**
 * Address Service - Manages user addresses and GHN location data
 */
export const AddressService = {
  // ========== USER ADDRESSES (Internal API) ==========

  /**
   * Get all addresses of the current user
   */
  getAddresses: async (): Promise<Address[]> => {
    try {
      const response = await axiosClient.get("/addresses");
      return Array.isArray(response) ? response : [];
    } catch (error) {
      logger.error("Failed to fetch addresses", error as Error);
      return [];
    }
  },

  /**
   * Create a new address
   */
  createAddress: async (data: CreateAddressRequest): Promise<Address> => {
    return axiosClient.post("/addresses/create", data);
  },

  /**
   * Update an address
   */
  updateAddress: async (
    id: string,
    data: CreateAddressRequest
  ): Promise<Address> => {
    return axiosClient.put(`/addresses/${id}`, data);
  },

  deleteAddress: async (id: string): Promise<void> => {
    return axiosClient.delete(`/addresses/${id}`);
  },

  getProvinces: async (): Promise<Province[]> => {
    try {
      const response = await rateLimitedRequest<GHNResponse<Province[]>>(
        "/master-data/province"
      );
      if (response.code === 200 && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch {
      return [];
    }
  },
  getDistricts: async (provinceId: number): Promise<District[]> => {
    try {
      const response = await rateLimitedRequest<GHNResponse<District[]>>(
        `/master-data/district?province_id=${provinceId}`
      );

      if (response.code === 200 && Array.isArray(response.data)) {
        logger.info("Successfully fetched districts from GHN", {
          provinceId,
          count: response.data.length,
        });
        return response.data;
      }

      logger.warn("Invalid districts response from GHN", { response });
      return [];
    } catch (error) {
      logger.error("Failed to fetch districts from GHN", error as Error, {
        provinceId,
      });
      return [];
    }
  },

  getWards: async (districtId: number): Promise<Ward[]> => {
    try {
      const response = await rateLimitedRequest<GHNResponse<Ward[]>>(
        `/master-data/ward?district_id=${districtId}`
      );

      if (response.code === 200 && Array.isArray(response.data)) {
        logger.info("Successfully fetched wards from GHN", {
          districtId,
          count: response.data.length,
        });
        return response.data;
      }

      logger.warn("Invalid wards response from GHN", { response });
      return [];
    } catch (error) {
      logger.error("Failed to fetch wards from GHN", error as Error, {
        districtId,
      });
      return [];
    }
  },

  searchProvinces: async (query: string): Promise<Province[]> => {
    try {
      const provinces = await AddressService.getProvinces();

      if (!query || query.trim() === "") {
        return provinces;
      }

      const normalizedQuery = query
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); // Remove Vietnamese accents

      return provinces.filter((province) => {
        const normalizedName = province.ProvinceName.toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");

        return normalizedName.includes(normalizedQuery);
      });
    } catch (error) {
      logger.error("Failed to search provinces", error as Error, { query });
      return [];
    }
  },
};
