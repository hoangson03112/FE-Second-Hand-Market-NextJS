import React from "react";
import type { ChangeEvent } from "react";
import type { Province, District, Ward } from "@/types/address";
import type { BecomeSellerFormValues, BecomeSellerErrors } from "../hooks/useBecomeSeller";

interface AddressSectionProps {
  values: BecomeSellerFormValues;
  errors: BecomeSellerErrors;
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
  onAddressChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const AddressSection: React.FC<AddressSectionProps> = ({
  values,
  errors,
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
  onAddressChange,
}) => {
  return (
    <div className="rounded-xl border border-border bg-muted/40 p-3 lg:p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">Địa chỉ kinh doanh / lấy hàng</h3>
        <span className="text-[11px] font-medium text-primary">Bước 1</span>
      </div>
      {selectedProvince && selectedDistrict && selectedWard && (
        <p className="text-xs text-muted-foreground">
          {selectedWard.WardName}, {selectedDistrict.DistrictName}, {selectedProvince.ProvinceName}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-1">
          <label className="block text-xs font-medium mb-1">
            Tỉnh/Thành phố <span className="text-red-500">*</span>
          </label>
          <select
            name="provinceId"
            value={values.provinceId}
            onChange={onProvinceChange}
            disabled={provincesLoading}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:bg-muted"
          >
            <option value="">
              {provincesLoading ? "Đang tải..." : "Chọn Tỉnh/Thành phố"}
            </option>
            {provinces.map((p) => (
              <option key={p.ProvinceID} value={p.ProvinceID}>
                {p.ProvinceName}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-1">
          <label className="block text-xs font-medium mb-1">
            Quận/Huyện <span className="text-red-500">*</span>
          </label>
          <select
            name="districtId"
            value={values.districtId}
            onChange={onDistrictChange}
            disabled={!values.provinceId || districtsLoading}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:bg-muted"
          >
            <option value="">
              {!values.provinceId
                ? "Chọn Tỉnh trước"
                : districtsLoading
                ? "Đang tải..."
                : "Chọn Quận/Huyện"}
            </option>
            {districts.map((d) => (
              <option key={d.DistrictID} value={d.DistrictID}>
                {d.DistrictName}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-1">
          <label className="block text-xs font-medium mb-1">
            Phường/Xã <span className="text-red-500">*</span>
          </label>
          <select
            name="wardCode"
            value={values.wardCode}
            onChange={onWardChange}
            disabled={!values.districtId || wardsLoading}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:bg-muted"
          >
            <option value="">
              {!values.districtId
                ? "Chọn Quận trước"
                : wardsLoading
                ? "Đang tải..."
                : "Chọn Phường/Xã"}
            </option>
            {wards.map((w) => (
              <option key={w.WardCode} value={w.WardCode}>
                {w.WardName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">
          Địa chỉ cụ thể (số nhà, đường) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="address"
          value={values.address}
          onChange={onAddressChange}
          placeholder="Ví dụ: 123 Nguyễn Trãi, phường 5..."
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        {errors.address && (
          <p className="mt-1 text-xs text-red-500">{errors.address}</p>
        )}
      </div>
    </div>
  );
};

