import { useQuery } from "@tanstack/react-query";
import { AddressService } from "@/services/address.service";
import type { Province, District, Ward } from "@/types/address";

/**
 * Cache GHN provinces data với React Query
 * Chỉ call API 1 lần, sau đó dùng cache
 */
export function useProvinces() {
  return useQuery({
    queryKey: ["ghn", "provinces"],
    queryFn: () => AddressService.getProvinces(),
    staleTime: Infinity, // Cache forever
    gcTime: Infinity, // Don't garbage collect
    retry: 3,
  });
}

/**
 * Cache GHN districts data theo provinceId
 * Mỗi province chỉ call 1 lần
 */
export function useDistricts(provinceId?: string | number) {
  return useQuery({
    queryKey: ["ghn", "districts", provinceId],
    queryFn: () => AddressService.getDistricts(Number(provinceId)),
    enabled: !!provinceId, // Chỉ fetch khi có provinceId
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 3,
  });
}

/**
 * Cache GHN wards data theo districtId
 * Mỗi district chỉ call 1 lần
 */
export function useWards(districtId?: string | number) {
  return useQuery({
    queryKey: ["ghn", "wards", districtId],
    queryFn: () => AddressService.getWards(Number(districtId)),
    enabled: !!districtId, // Chỉ fetch khi có districtId
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 3,
  });
}

/**
 * Prefetch districts để sẵn sàng khi user chọn province
 */
export function usePrefetchDistricts(provinceId?: string | number) {
  const queryClient = useQuery({
    queryKey: ["ghn", "districts", provinceId],
    queryFn: () => AddressService.getDistricts(Number(provinceId)),
    enabled: false, // Don't auto-fetch
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return queryClient;
}

/**
 * Helper: Get cached provinces hoặc fetch nếu chưa có
 */
export async function getCachedProvinces(queryClient: any): Promise<Province[]> {
  return await queryClient.ensureQueryData({
    queryKey: ["ghn", "provinces"],
    queryFn: () => AddressService.getProvinces(),
    staleTime: Infinity,
  });
}

/**
 * Helper: Get cached districts hoặc fetch nếu chưa có
 */
export async function getCachedDistricts(
  queryClient: any,
  provinceId: string | number
): Promise<District[]> {
  return await queryClient.ensureQueryData({
    queryKey: ["ghn", "districts", provinceId],
    queryFn: () => AddressService.getDistricts(Number(provinceId)),
    staleTime: Infinity,
  });
}

/**
 * Helper: Get cached wards hoặc fetch nếu chưa có
 */
export async function getCachedWards(
  queryClient: any,
  districtId: string | number
): Promise<Ward[]> {
  return await queryClient.ensureQueryData({
    queryKey: ["ghn", "wards", districtId],
    queryFn: () => AddressService.getWards(Number(districtId)),
    staleTime: Infinity,
  });
}
