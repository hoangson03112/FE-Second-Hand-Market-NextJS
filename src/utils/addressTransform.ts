import { Address, District, Ward } from "@/types/address";
import { QueryClient } from "@tanstack/react-query";
import {
  getCachedProvinces,
  getCachedDistricts,
  getCachedWards,
} from "@/hooks/useGHNLocation";

/**
 * Transform address IDs/codes to readable names using cached GHN data
 * Sử dụng React Query cache để tránh call API nhiều lần
 */
export async function enrichAddressWithNames(
  address: Address,
  queryClient: QueryClient
): Promise<Address> {
  try {
    const enrichedAddress = { ...address };

    // Nếu đã có tên rồi thì không cần fetch
    if (address.province && address.district && address.ward) {
      return enrichedAddress;
    }

    // Get provinces từ cache
    if (address.provinceId && !address.province) {
      const provinces = await getCachedProvinces(queryClient);
      const province = provinces.find(
        (p) => p.ProvinceID.toString() === address.provinceId?.toString()
      );
      if (province) {
        enrichedAddress.province = province.ProvinceName;
      }
    }

    // Get districts từ cache
    if (address.districtId && !address.district && address.provinceId) {
      const districts = await getCachedDistricts(
        queryClient,
        address.provinceId
      );
      const district = districts.find(
        (d) => d.DistrictID.toString() === address.districtId?.toString()
      );
      if (district) {
        enrichedAddress.district = district.DistrictName;
      }
    }

    // Get wards từ cache
    if (address.wardCode && !address.ward && address.districtId) {
      const wards = await getCachedWards(queryClient, address.districtId);
      const ward = wards.find((w) => w.WardCode === address.wardCode);
      if (ward) {
        enrichedAddress.ward = ward.WardName;
      }
    }

    // Set address field nếu chưa có
    if (!enrichedAddress.address && enrichedAddress.specificAddress) {
      enrichedAddress.address = enrichedAddress.specificAddress;
    }

    return enrichedAddress;
  } catch (error) {
    console.error("Error enriching address:", error);
    return address; // Return original if error
  }
}

/**
 * Enrich multiple addresses in parallel using cached data
 * Tất cả data đều lấy từ React Query cache
 */
export async function enrichAddresses(
  addresses: Address[],
  queryClient: QueryClient
): Promise<Address[]> {
  try {
    // Get provinces từ cache (chỉ call API 1 lần duy nhất)
    const provinces = await getCachedProvinces(queryClient);

    // Collect unique province và district IDs để prefetch
    const uniqueProvinceIds = new Set<string>();
    const uniqueDistrictIds = new Set<string>();

    addresses.forEach((address) => {
      if (address.provinceId) uniqueProvinceIds.add(address.provinceId);
      if (address.districtId) uniqueDistrictIds.add(address.districtId);
    });

    // Prefetch tất cả districts và wards cần thiết song song
    const districtPromises = Array.from(uniqueProvinceIds).map((provinceId) =>
      getCachedDistricts(queryClient, provinceId)
    );

    const wardPromises = Array.from(uniqueDistrictIds).map((districtId) =>
      getCachedWards(queryClient, districtId)
    );

    // Chờ tất cả prefetch xong
    const allDistricts = await Promise.all(districtPromises);
    const allWards = await Promise.all(wardPromises);

    // Map để lookup nhanh
    const districtsMap = new Map<string, District[]>();
    const wardsMap = new Map<string, Ward[]>();

    Array.from(uniqueProvinceIds).forEach((provinceId, index) => {
      districtsMap.set(provinceId, allDistricts[index] || []);
    });

    Array.from(uniqueDistrictIds).forEach((districtId, index) => {
      wardsMap.set(districtId, allWards[index] || []);
    });

    // Transform addresses (không cần call API thêm nữa)
    const enrichedAddresses = addresses.map((address) => {
      const enriched = { ...address };

      // Get province name
      if (address.provinceId && !address.province) {
        const province = provinces.find(
          (p) => p.ProvinceID.toString() === address.provinceId?.toString()
        );
        if (province) {
          enriched.province = province.ProvinceName;
        }
      }

      // Get district name
      if (address.districtId && !address.district && address.provinceId) {
        const districts = districtsMap.get(address.provinceId) || [];
        const district = districts.find(
          (d) => d.DistrictID.toString() === address.districtId?.toString()
        );
        if (district) {
          enriched.district = district.DistrictName;
        }
      }

      // Get ward name
      if (address.wardCode && !address.ward && address.districtId) {
        const wards = wardsMap.get(address.districtId) || [];
        const ward = wards.find((w) => w.WardCode === address.wardCode);
        if (ward) {
          enriched.ward = ward.WardName;
        }
      }

      // Set address field
      if (!enriched.address && enriched.specificAddress) {
        enriched.address = enriched.specificAddress;
      }

      return enriched;
    });

    return enrichedAddresses;
  } catch (error) {
    console.error("Error enriching addresses:", error);
    return addresses; // Return original if error
  }
}
