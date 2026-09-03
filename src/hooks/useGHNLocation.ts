import { useQuery, type QueryClient } from "@tanstack/react-query";
import { AddressService } from "@/services/address.service";
import type { Province, District, Ward } from "@/types/address";
import { queryKeys } from "@/lib/query-client";


type LocationId = string | number | null | undefined;


function toId(value: LocationId): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

const STATIC_QUERY = {
  staleTime: Infinity,
  gcTime: Infinity,
  retry: 2,
  retryDelay: (attemptIndex: number) =>
    Math.min(1000 * 2 ** attemptIndex, 10000),
  refetchOnWindowFocus: false,
  refetchOnMount: false,
} as const;

export function useProvinces() {
  return useQuery<Province[], Error>({
    queryKey: queryKeys.addresses.provinces(),
    queryFn: () => AddressService.getProvinces(),
    ...STATIC_QUERY,
  });
}

export function useDistricts(provinceId?: LocationId) {
  const id = toId(provinceId);
  return useQuery<District[], Error>({
    queryKey: queryKeys.addresses.districts(id),
    queryFn: () => (id === null ? [] : AddressService.getDistricts(id)),
    enabled: id !== null,
    ...STATIC_QUERY,
  });
}

export function useWards(districtId?: LocationId) {
  const id = toId(districtId);
  return useQuery<Ward[], Error>({
    queryKey: queryKeys.addresses.wards(id),
    queryFn: () => (id === null ? [] : AddressService.getWards(id)),
    enabled: id !== null,
    ...STATIC_QUERY,
  });
}


export function useProvinceSearch(query: string) {
  return useQuery<Province[], Error>({
    queryKey: queryKeys.addresses.searchProvinces(query),
    queryFn: () => AddressService.searchProvinces(query),
    enabled: query.length >= 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}


export async function getCachedProvinces(
  queryClient: QueryClient,
): Promise<Province[]> {
  return queryClient.ensureQueryData({
    queryKey: queryKeys.addresses.provinces(),
    queryFn: () => AddressService.getProvinces(),
    staleTime: Infinity,
  });
}

export async function getCachedDistricts(
  queryClient: QueryClient,
  provinceId: string | number,
): Promise<District[]> {
  const id = toId(provinceId);
  return queryClient.ensureQueryData({
    queryKey: queryKeys.addresses.districts(id),
    queryFn: () => (id === null ? [] : AddressService.getDistricts(id)),
    staleTime: Infinity,
  });
}

export async function getCachedWards(
  queryClient: QueryClient,
  districtId: string | number,
): Promise<Ward[]> {
  const id = toId(districtId);
  return queryClient.ensureQueryData({
    queryKey: queryKeys.addresses.wards(id),
    queryFn: () => (id === null ? [] : AddressService.getWards(id)),
    staleTime: Infinity,
  });
}
