import React from "react";
import type { ChangeEvent } from "react";
import type { Province, District, Ward } from "@/types/address";
import { IconMapPin } from "@tabler/icons-react";

interface AddressValues {
  provinceId: string;
  districtId: string;
  wardCode: string;
  address: string;
  phoneNumber: string;
  [key: string]: unknown;
}

interface AddressErrors {
  address?: string;
  phoneNumber?: string;
  [key: string]: string | undefined;
}

interface AddressSectionProps {
  values: AddressValues;
  errors: AddressErrors;
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
    <div className="rounded-[2px] border border-luxury-ink/10 bg-cream-50/50 p-5 space-y-4">
      <div className="flex items-center justify-between gap-2 border-b border-luxury-ink/10 pb-3">
        <h3 className="font-droid-serif text-sm font-bold text-luxury-ink flex items-center gap-1.5">
          <IconMapPin className="w-4 h-4 text-luxury-ink" />
          Địa chỉ kho / Lấy hàng GHN
        </h3>
        <span className="text-2xs font-bold text-neutral-500 uppercase tracking-[0.15em]">
          Bước 1
        </span>
      </div>

      {selectedProvince && selectedDistrict && selectedWard && (
        <p className="text-xs text-neutral-600 bg-white p-2.5 rounded-[2px] border border-luxury-ink/8">
          {selectedWard.WardName}, {selectedDistrict.DistrictName},{" "}
          {selectedProvince.ProvinceName}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-1">
          <label className="block text-2xs uppercase tracking-wider font-bold text-luxury-ink mb-1.5">
            Tỉnh / Thành phố <span className="text-blush-600">*</span>
          </label>
          <select
            name="provinceId"
            value={values.provinceId}
            onChange={onProvinceChange}
            disabled={provincesLoading}
            className="w-full h-10 rounded-[2px] border border-luxury-ink/20 bg-white text-luxury-ink px-3 text-xs outline-none focus:border-luxury-ink disabled:bg-taupe-100/50"
          >
            <option value="">
              {provincesLoading ? "Đang tải..." : "Chọn Tỉnh / Thành"}
            </option>
            {provinces.map((p) => (
              <option key={p.ProvinceID} value={p.ProvinceID}>
                {p.ProvinceName}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-1">
          <label className="block text-2xs uppercase tracking-wider font-bold text-luxury-ink mb-1.5">
            Quận / Huyện <span className="text-blush-600">*</span>
          </label>
          <select
            name="districtId"
            value={values.districtId}
            onChange={onDistrictChange}
            disabled={!values.provinceId || districtsLoading}
            className="w-full h-10 rounded-[2px] border border-luxury-ink/20 bg-white text-luxury-ink px-3 text-xs outline-none focus:border-luxury-ink disabled:bg-taupe-100/50"
          >
            <option value="">
              {!values.provinceId
                ? "Chọn Tỉnh trước"
                : districtsLoading
                  ? "Đang tải..."
                  : "Chọn Quận / Huyện"}
            </option>
            {districts.map((d) => (
              <option key={d.DistrictID} value={d.DistrictID}>
                {d.DistrictName}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-1">
          <label className="block text-2xs uppercase tracking-wider font-bold text-luxury-ink mb-1.5">
            Phường / Xã <span className="text-blush-600">*</span>
          </label>
          <select
            name="wardCode"
            value={values.wardCode}
            onChange={onWardChange}
            disabled={!values.districtId || wardsLoading}
            className="w-full h-10 rounded-[2px] border border-luxury-ink/20 bg-white text-luxury-ink px-3 text-xs outline-none focus:border-luxury-ink disabled:bg-taupe-100/50"
          >
            <option value="">
              {!values.districtId
                ? "Chọn Huyện trước"
                : wardsLoading
                  ? "Đang tải..."
                  : "Chọn Phường / Xã"}
            </option>
            {wards.map((w) => (
              <option key={w.WardCode} value={w.WardCode}>
                {w.WardName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-2xs uppercase tracking-wider font-bold text-luxury-ink mb-1.5">
            Địa chỉ cụ thể (Số nhà, đường){" "}
            <span className="text-blush-600">*</span>
          </label>
          <input
            type="text"
            name="address"
            value={values.address}
            onChange={onAddressChange}
            placeholder="Ví dụ: 123 Nguyễn Huệ, Phường Bến Nghé..."
            className="w-full h-10 rounded-[2px] border border-luxury-ink/20 bg-white text-luxury-ink placeholder:text-neutral-400 px-3 text-xs outline-none focus:border-luxury-ink"
          />
          {errors.address && (
            <p className="mt-1 text-2xs text-blush-600">{errors.address}</p>
          )}
        </div>

        <div>
          <label className="block text-2xs uppercase tracking-wider font-bold text-luxury-ink mb-1.5">
            Số điện thoại liên hệ <span className="text-blush-600">*</span>
          </label>
          <input
            type="tel"
            name="phoneNumber"
            inputMode="numeric"
            value={values.phoneNumber}
            onChange={onAddressChange}
            placeholder="VD: 0901234567"
            className="w-full h-10 rounded-[2px] border border-luxury-ink/20 bg-white text-luxury-ink placeholder:text-neutral-400 px-3 text-xs outline-none focus:border-luxury-ink font-mono"
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-2xs text-blush-600">{errors.phoneNumber}</p>
          )}
        </div>
      </div>
    </div>
  );
};
