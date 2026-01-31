/* eslint-disable @typescript-eslint/no-explicit-any */
import { rateLimitedRequest } from "@/lib/external-axios";
import type {
  GHNResponse,
  CalculateShippingFeeRequest,
  ShippingFeeData,
  CalculateExpectedDeliveryTimeRequest,
  ExpectedDeliveryTimeData,
  ShippingServiceOption,
} from "@/types/address";
import { logger } from "@/infrastructure/monitoring/logger";

/**
 * GHN Shipping Service - Calculate shipping fee and delivery time
 */
export const ShippingService = {
  /**
   * Calculate shipping fee from GHN API
   * @param request - Shipping calculation request
   * @returns Shipping fee data
   */
  calculateShippingFee: async (
    request: CalculateShippingFeeRequest
  ): Promise<ShippingFeeData | null> => {
    try {
      const response = await rateLimitedRequest<GHNResponse<ShippingFeeData>>(
        "/v2/shipping-order/fee",
        {
          method: "POST",
          data: {
            ...request,
            // Default values if not provided
            service_type_id: request.service_type_id || 2, // 2 = Express
            weight: request.weight || 500, // Default 500g
          },
        }
      );

      if (response.code === 200 && response.data) {
        logger.info("Successfully calculated shipping fee from GHN", {
          fee: response.data.total,
          from_district: request.from_district_id,
          to_district: request.to_district_id,
        });
        return response.data;
      }

      const errorMsg = `GHN API returned invalid response: ${response.code} - ${response.message || 'Unknown error'}`;
      logger.error("Invalid shipping fee response from GHN", undefined, { response, errorMsg });
      throw new Error(errorMsg);
    } catch (error) {
      logger.error(
        "Failed to calculate shipping fee from GHN",
        error as Error,
        {
          request,
        }
      );
      throw error;
    }
  },

  calculateExpectedDeliveryTime: async (
    request: CalculateExpectedDeliveryTimeRequest
  ): Promise<ExpectedDeliveryTimeData | null> => {
    try {
      const response = await rateLimitedRequest<
        GHNResponse<ExpectedDeliveryTimeData>
      >("/v2/shipping-order/leadtime", {
        method: "POST",
        data: request,
      });

      if (response.code === 200 && response.data) {
        logger.info("Successfully calculated delivery time from GHN", {
          leadtime: response.data.leadtime,
          from_district: request.from_district_id,
          to_district: request.to_district_id,
        });
        return response.data;
      }

      const errorMsg = `GHN API returned invalid response: ${response.code} - ${response.message || 'Unknown error'}`;
      logger.error("Invalid delivery time response from GHN", undefined, { response, errorMsg });
      throw new Error(errorMsg);
    } catch (error) {
      logger.error(
        "Failed to calculate delivery time from GHN",
        error as Error,
        {
          request,
        }
      );
      throw error;
    }
  },

  /**
   * Get available shipping services for a route
   * @param from_district_id - Source district ID
   * @param to_district_id - Destination district ID
   * @returns List of available services
   */
  getAvailableServices: async (
    from_district_id: number,
    to_district_id: number
  ): Promise<any[]> => {
    try {
      const response = await rateLimitedRequest<GHNResponse<any[]>>(
        "/v2/shipping-order/available-services",
        {
          method: "POST",
          data: {
            shop_id: parseInt(process.env.NEXT_PUBLIC_GHN_SHOP_ID || "0"),
            from_district: from_district_id,
            to_district: to_district_id,
          },
        }
      );

      if (response.code === 200 && Array.isArray(response.data)) {
        logger.info("Successfully fetched available services from GHN", {
          count: response.data.length,
        });
        return response.data;
      }

      const errorMsg = `GHN API returned invalid response: ${response.code} - ${response.message || 'Unknown error'}`;
      logger.error("Invalid available services response from GHN", undefined, { response, errorMsg });
      throw new Error(errorMsg);
    } catch (error) {
      logger.error(
        "Failed to fetch available services from GHN",
        error as Error,
        {
          from_district_id,
          to_district_id,
        }
      );
      throw error;
    }
  },

  /**
   * Calculate shipping info using the first available service
   * This automatically selects the first service and calculates fee + delivery time
   *
   * @param params - Shipping parameters
   * @returns Shipping service option with fee and delivery time
   */
  calculateShippingInfo: async (params: {
    from_district_id: number;
    from_ward_code: string; // Required for leadtime API
    to_district_id: number;
    to_ward_code: string;
    weight?: number;
    service_type_id?: number;
  }): Promise<ShippingServiceOption> => {
    try {
      // Get available services first to get the service_id
      const services = await ShippingService.getAvailableServices(
        params.from_district_id,
        params.to_district_id
      );

      if (!services || services.length === 0) {
        logger.error(
          "No available services found",
          undefined,
          {
            from_district: params.from_district_id,
            to_district: params.to_district_id,
          }
        );
        throw new Error(
          "Không tìm thấy phương thức vận chuyển nào khả dụng. " +
          "Vui lòng kiểm tra lại địa chỉ."
        );
      }

      // Use the first available service or the specified service type
      const service = params.service_type_id
        ? services.find((s) => s.service_type_id === params.service_type_id)
        : services[0];

      if (!service) {
        logger.error(
          "No matching service found",
          undefined,
          {
            service_type_id: params.service_type_id,
          }
        );
        throw new Error("Không tìm thấy phương thức vận chuyển phù hợp.");
      }

      // Calculate shipping fee and delivery time in parallel
      const [feeData, timeData] = await Promise.all([
        ShippingService.calculateShippingFee({
          from_district_id: params.from_district_id,
          to_district_id: params.to_district_id,
          to_ward_code: params.to_ward_code,
          weight: params.weight || 500,
          service_type_id: service.service_type_id,
        }),
        ShippingService.calculateExpectedDeliveryTime({
          from_district_id: params.from_district_id,
          from_ward_code: params.from_ward_code,
          to_district_id: params.to_district_id,
          to_ward_code: params.to_ward_code,
          service_id: service.service_id,
        }),
      ]);

      if (!feeData || !timeData) {
        logger.error(
          "Failed to get complete shipping info",
          undefined,
          {
            hasFee: !!feeData,
            hasTime: !!timeData,
          }
        );
        throw new Error("Không thể tính phí vận chuyển. Vui lòng thử lại.");
      }

      // GHN leadtime is a UNIX timestamp (seconds) for expected delivery date
      // Convert it to Date and then to number of days from today
      const expectedDeliveryDate = new Date(timeData.leadtime * 1000);
      const now = new Date();
      const diffMs = expectedDeliveryDate.getTime() - now.getTime();
      const estimatedDays = Math.max(
        1,
        Math.ceil(diffMs / (1000 * 60 * 60 * 24))
      );

      const shippingOption: ShippingServiceOption = {
        service_id: service.service_id,
        service_type_id: service.service_type_id,
        short_name: service.short_name || "Giao hàng",
        service_name: service.service_name,
        fee: feeData.total,
        shippingFee: feeData.service_fee,
        insuranceFee: feeData.insurance_fee,
        codFee: feeData.cod_fee,
        totalShippingFee: feeData.total,
        expectedDeliveryTime: expectedDeliveryDate.toISOString(),
        estimatedDays,
        estimatedDate: expectedDeliveryDate.toLocaleDateString("vi-VN", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
      };

      return shippingOption;
    } catch (error) {
      logger.error("Failed to calculate shipping info", error as Error, {
        params,
      });
      throw error;
    }
  },
};
