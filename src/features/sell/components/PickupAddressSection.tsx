import { IconMapPin } from "@tabler/icons-react";
import type { ChangeEvent } from "react";
import type { Province, District, Ward } from "@/types/address";
import type { PickupFormValues } from "@/types/sell";

interface PickupAddressSectionProps {
  values: PickupFormValues;
  errors: Partial<Record<keyof PickupFormValues, string>>;
  provinces: Province[];
  districts: District[];
  wards: Ward[];
  onProvinceChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onDistrictChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onWardChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onSpecificAddressChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onPhoneNumberChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const inputClass =
  "w-full rounded-lg border border-border bg-background px-2.5 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 disabled:bg-muted/50 disabled:cursor-not-allowed";
const labelClass = "block text-xs font-medium text-foreground mb-1";

export function PickupAddressSection({
  values,
  errors,
  provinces,
  districts,
  wards,
  onProvinceChange,
  onDistrictChange,
  onWardChange,
  onSpecificAddressChange,
  onPhoneNumberChange,
}: PickupAddressSectionProps) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-muted/50 border-b border-border shrink-0">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <IconMapPin className="w-3.5 h-3.5 text-primary" />
        </div>
        <h3 className="text-xs font-semibold text-foreground">Địa chỉ lấy hàng</h3>
        <span className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
          Tài khoản mua hàng
        </span>
      </div>

      <div className="p-3 space-y-3">
        {/* Tỉnh / Quận / Phường  1 col mobile, 3 col md+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          <div>
            <label className={labelClass}>
              Tỉnh / Thành phố <span className="text-destructive">*</span>
            </label>
            <select
              name="provinceId"
              value={values.provinceId ?? ""}
              onChange={onProvinceChange}
              className={inputClass}
            >
              <option value="">Chọn Tỉnh / Thành phố</option>
              {provinces.map((p) => (
                <option key={p.ProvinceID} value={String(p.ProvinceID)}>
                  {p.ProvinceName}
                </option>
              ))}
            </select>
            {errors.provinceId && (
              <p className="mt-0.5 text-xs text-destructive">{errors.provinceId}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>
              Quận / Huyện <span className="text-destructive">*</span>
            </label>
            <select
              name="districtId"
              value={values.districtId ?? ""}
              onChange={onDistrictChange}
              disabled={!values.provinceId}
              className={inputClass}
            >
              <option value="">
                {!values.provinceId ? "Chọn Tỉnh trước" : "Chọn Quận / Huyện"}
              </option>
              {districts.map((d) => (
                <option key={d.DistrictID} value={String(d.DistrictID)}>
                  {d.DistrictName}
                </option>
              ))}
            </select>
            {errors.districtId && (
              <p className="mt-0.5 text-xs text-destructive">{errors.districtId}</p>
            )}
          </div>

          <div className="sm:col-span-2 md:col-span-1">
            <label className={labelClass}>
              Phường / Xã <span className="text-destructive">*</span>
            </label>
            <select
              name="wardCode"
              value={values.wardCode ?? ""}
              onChange={onWardChange}
              disabled={!values.districtId}
              className={inputClass}
            >
              <option value="">
                {!values.districtId ? "Chọn Quận trước" : "Chọn Phường / Xã"}
              </option>
              {wards.map((w) => (
                <option key={w.WardCode} value={String(w.WardCode)}>
                  {w.WardName}
                </option>
              ))}
            </select>
            {errors.wardCode && (
              <p className="mt-0.5 text-xs text-destructive">{errors.wardCode}</p>
            )}
          </div>
        </div>

        {/* Địa chỉ + SĐT  1 col mobile, 2 col sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className={labelClass}>
              Địa chỉ cụ thể <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              name="specificAddress"
              value={values.specificAddress ?? ""}
              onChange={onSpecificAddressChange}
              placeholder="Số nhà, tên đường..."
              className={inputClass}
            />
            {errors.specificAddress && (
              <p className="mt-0.5 text-xs text-destructive">{errors.specificAddress}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>
              Số điện thoại <span className="text-destructive">*</span>
            </label>
            <input
              type="tel"
              name="phoneNumber"
              inputMode="numeric"
              value={values.phoneNumber ?? ""}
              onChange={onPhoneNumberChange}
              placeholder="VD: 0901234567"
              className={inputClass}
            />
            {errors.phoneNumber && (
              <p className="mt-0.5 text-xs text-destructive">{errors.phoneNumber}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}