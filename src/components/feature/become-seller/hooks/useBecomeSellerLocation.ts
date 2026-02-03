import { useMemo, useCallback } from "react";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { useProvinces, useDistricts, useWards } from "@/hooks/useGHNLocation";
import type { Province, District, Ward } from "@/types/address";
import type { BecomeSellerFormValues } from "./useBecomeSeller";

export interface UseBecomeSellerLocationParams {
  values: BecomeSellerFormValues;
  setValues: Dispatch<SetStateAction<BecomeSellerFormValues>>;
}

export interface UseBecomeSellerLocationResult {
  provinces: Province[];
  districts: District[];
  wards: Ward[];
  provincesLoading: boolean;
  districtsLoading: boolean;
  wardsLoading: boolean;
  selectedProvince: Province | null;
  selectedDistrict: District | null;
  selectedWard: Ward | null;
  onProvinceChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onDistrictChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onWardChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export function useBecomeSellerLocation({
  values,
  setValues,
}: UseBecomeSellerLocationParams): UseBecomeSellerLocationResult {
  const { data: provinces = [], isLoading: provincesLoading } = useProvinces();
  const { data: districts = [], isLoading: districtsLoading } = useDistricts(
    values.provinceId ? Number(values.provinceId) : undefined
  );
  const { data: wards = [], isLoading: wardsLoading } = useWards(
    values.districtId ? Number(values.districtId) : undefined
  );

  const selectedProvince = useMemo(
    () => provinces.find((p) => String(p.ProvinceID) === values.provinceId) ?? null,
    [provinces, values.provinceId]
  );

  const selectedDistrict = useMemo(
    () => districts.find((d) => String(d.DistrictID) === values.districtId) ?? null,
    [districts, values.districtId]
  );

  const selectedWard = useMemo(
    () => wards.find((w) => w.WardCode === values.wardCode) ?? null,
    [wards, values.wardCode]
  );

  const onProvinceChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const provinceId = e.target.value;
      const province = provinces.find((p) => String(p.ProvinceID) === provinceId) ?? null;
      setValues((prev) => ({
        ...prev,
        provinceId,
        districtId: "",
        wardCode: "",
        province: province?.ProvinceName ?? "",
        district: "",
        ward: "",
      }));
    },
    [provinces, setValues]
  );

  const onDistrictChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const districtId = e.target.value;
      const district = districts.find((d) => String(d.DistrictID) === districtId) ?? null;
      setValues((prev) => ({
        ...prev,
        districtId,
        wardCode: "",
        district: district?.DistrictName ?? "",
        ward: "",
      }));
    },
    [districts, setValues]
  );

  const onWardChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const wardCode = e.target.value;
      const ward = wards.find((w) => w.WardCode === wardCode) ?? null;
      setValues((prev) => ({
        ...prev,
        wardCode,
        ward: ward?.WardName ?? "",
      }));
    },
    [wards, setValues]
  );

  return {
    provinces,
    districts,
    wards,
    provincesLoading,
    districtsLoading,
    wardsLoading,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    onProvinceChange,
    onDistrictChange,
    onWardChange,
  };
}

