import axiosClient from "@/lib/axios";
import type {
  GetPickupAddressResponse,
  UpsertPickupAddressPayload,
  UpsertPickupAddressResponse,
} from "@/types/pickupAddress";

/**
 * GET /pickup-address - Lấy địa chỉ lấy hàng của user (dùng cho user chưa verify seller).
 */
export const PickupAddressService = {
  get: async (): Promise<GetPickupAddressResponse> => {
    const response = await axiosClient.get("/pickup-address");
    return response as unknown as GetPickupAddressResponse;
  },

  upsert: async (
    payload: UpsertPickupAddressPayload
  ): Promise<UpsertPickupAddressResponse> => {
    const response = await axiosClient.put("/pickup-address", payload);
    return response as unknown as UpsertPickupAddressResponse;
  },
};
