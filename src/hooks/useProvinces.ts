import { useQuery } from "@tanstack/react-query";
import { AddressService } from "@/services/address.service";
import type { Province, District, Ward } from "@/types/address";
import { queryKeys } from "@/lib/query-client";
import { serverStateConfig } from "@/lib/state";


export function useProvinces() {
  return useQuery<Province[], Error>({
    queryKey: queryKeys.addresses.provinces(),
    queryFn: async () => {
      const provinces = await AddressService.getProvinces();
   
      return provinces;
    },
    staleTime: serverStateConfig.staleTime.static, 
    gcTime: 7 * 24 * 60 * 60 * 1000, 
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
}


export function useDistricts(provinceId: number | null) {
  return useQuery<District[], Error>({
    queryKey: queryKeys.addresses.districts(provinceId),
    queryFn: async () => {
      if (!provinceId) return [];
      const districts = await AddressService.getDistricts(provinceId);
      return districts;
    },
    enabled: !!provinceId, // Only fetch when province is selected
    staleTime: serverStateConfig.staleTime.static, // 24 hours
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}


export function useWards(districtId: number | null) {
  return useQuery<Ward[], Error>({
    queryKey: queryKeys.addresses.wards(districtId),
    queryFn: async () => {
      if (!districtId) return [];
      const wards = await AddressService.getWards(districtId);
      return wards;
    },
    enabled: !!districtId, // Only fetch when district is selected
    staleTime: serverStateConfig.staleTime.static, // 24 hours
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

export function useProvinceSearch(query: string) {
  return useQuery<Province[], Error>({
    queryKey: queryKeys.addresses.searchProvinces(query),
    queryFn: async () => {
      const results = await AddressService.searchProvinces(query);
      return results;
    },
    enabled: query.length >= 2, // Only search when query has 2+ characters
    staleTime: 5 * 60 * 1000, // 5 minutes (search results can be cached shorter)
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
