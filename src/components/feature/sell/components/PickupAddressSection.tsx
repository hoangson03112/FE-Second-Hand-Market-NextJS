"use client";

import React from "react";
import type { ChangeEvent } from "react";
import type { Province, District, Ward } from "@/types/address";
import type { PickupFormValues } from "@/types/sell";
import type { Address } from "@/types/address";
import { MapPin } from "lucide-react";

interface PickupAddressSectionProps {
  values: PickupFormValues;
  errors: Partial<Record<keyof PickupFormValues, string>>;
  provinces: Province[];
  districts: District[];
  wards: Ward[];
  savedPickup: Address | null;
  onProvinceChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onDistrictChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onWardChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onBusinessAddressChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onPhoneNumberChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const inputClass =
  "w-full rounded-lg border border-border bg-background px-2.5 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 disabled:bg-muted/50";
const labelClass = "block text-xs font-medium text-foreground mb-1";

export function PickupAddressSection({
  values,
  errors,
  provinces,
  districts,
  wards,
  savedPickup,
  onProvinceChange,
  onDistrictChange,
  onWardChange,
  onBusinessAddressChange,
  onPhoneNumberChange,
}: PickupAddressSectionProps) {
  const showSavedBanner =
    savedPickup && !values.provinceId && savedPickup.specificAddress?.trim();

  return (
    <section className="rounded-xl border border-amber-200/60 bg-amber-50/50 dark:border-amber-800/40 dark:bg-amber-950/20 overflow-hidden">
      {/* Header: rõ ràng dành cho buyer */}
      <div className="flex items-start gap-3 px-4 py-3 border-b border-amber-200/60 dark:border-amber-800/40">
        <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
          <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-sm font-semibold text-foreground">Địa chỉ lấy hàng</h2>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-200/80 dark:bg-amber-800/50 text-amber-800 dark:text-amber-200">
              Tài khoản mua hàng
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Bạn đang đăng với tài khoản mua hàng. Địa chỉ này dùng để <strong>tính phí ship</strong> và <strong>điểm gửi hàng</strong> khi có đơn.
          </p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {showSavedBanner && (
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
            <span>Đã lưu: {savedPickup.specificAddress}</span>
          </div>
        )}
 
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>
              Tỉnh/Thành phố <span className="text-red-500">*</span>
            </label>
            <select
              name="pickupProvinceId"
              value={values.provinceId ?? ""}
              onChange={onProvinceChange}
              className={inputClass}
            >
              <option value="">Chọn Tỉnh/Thành phố</option>
              {provinces.map((p) => (
                <option key={p.ProvinceID} value={String(p.ProvinceID)}>
                  {p.ProvinceName}
                </option>
              ))}
            </select>
            {errors.provinceId && (
              <p className="mt-0.5 text-xs text-red-500">{errors.provinceId}</p>
            )}
          </div>
          <div>
            <label className={labelClass}>
              Quận/Huyện <span className="text-red-500">*</span>
            </label>
            <select
              name="pickupDistrictId"
              value={values.districtId ?? ""}
              onChange={onDistrictChange}
              disabled={!values.provinceId}
              className={inputClass}
            >
              <option value="">
                {!values.provinceId ? "Chọn Tỉnh trước" : "Chọn Quận/Huyện"}
              </option>
              {districts.map((d) => (
                <option key={d.DistrictID} value={String(d.DistrictID)}>
                  {d.DistrictName}
                </option>
              ))}
            </select>
            {errors.districtId && (
              <p className="mt-0.5 text-xs text-red-500">{errors.districtId}</p>
            )}
          </div>
          <div>
            <label className={labelClass}>
              Phường/Xã <span className="text-red-500">*</span>
            </label>
            <select
              name="pickupWardCode"
              value={values.wardCode ?? ""}
              onChange={onWardChange}
              disabled={!values.districtId}
              className={inputClass}
            >
              <option value="">
                {!values.districtId ? "Chọn Quận trước" : "Chọn Phường/Xã"}
              </option>
              {wards.map((w) => (
                <option key={w.WardCode} value={String(w.WardCode)}>
                  {w.WardName}
                </option>
              ))}
            </select>
            {errors.wardCode && (
              <p className="mt-0.5 text-xs text-red-500">{errors.wardCode}</p>
            )}
          </div>
        </div>

        <div>
          <label className={labelClass}>
            Địa chỉ cụ thể (số nhà, đường) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="pickupBusinessAddress"
            value={values.businessAddress ?? ""}
            onChange={onBusinessAddressChange}
            placeholder="Ví dụ: 123 Nguyễn Trãi, phường 5..."
            className={inputClass}
          />
          {errors.businessAddress && (
            <p className="mt-0.5 text-xs text-red-500">{errors.businessAddress}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="pickupPhoneNumber"
            value={values.phoneNumber ?? ""}
            onChange={onPhoneNumberChange}
            placeholder="Ví dụ: 0901234567"
            className={inputClass}
          />
          {errors.phoneNumber && (
            <p className="mt-0.5 text-xs text-red-500">{errors.phoneNumber}</p>
          )}
        </div>
      </div>
    </section>
  );
}
