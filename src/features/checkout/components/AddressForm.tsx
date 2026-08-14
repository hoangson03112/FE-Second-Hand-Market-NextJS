"use client";

import { IconAlertTriangle, IconChevronDown } from "@tabler/icons-react";
import { useProvinces, useDistricts, useWards } from "@/hooks/useGHNLocation";
import { useForm } from "@/hooks/useForm";
import { cn } from "@/lib/utils";
import type { CreateAddressRequest, Address } from "@/types/address";
import { Eyebrow } from "@/components/shared/Eyebrow";

interface AddressFormProps {
  initialData?: Address | null;
  onSuccess?: () => void;
  onCancel?: () => void;
  onSubmit: (data: CreateAddressRequest) => Promise<void>;
}

const fieldLabel =
  "block text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-600";

const fieldBase =
  "h-11 w-full rounded-[2px] border border-luxury-ink/15 bg-white px-3.5 text-sm text-luxury-ink transition-colors duration-200 placeholder:text-neutral-400 focus:border-luxury-ink focus:outline-none disabled:cursor-not-allowed disabled:bg-cream-100/60 disabled:text-neutral-400";

const selectBase = cn(fieldBase, "cursor-pointer appearance-none pr-9");

function Required() {
  return (
    <span aria-hidden className="text-accent">
      {" "}
      *
    </span>
  );
}

/** Native select wrapped with the champagne-free hairline chevron. */
function Select({
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select {...props} className={selectBase}>
        {children}
      </select>
      <IconChevronDown
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-3 my-auto h-4 w-4 text-neutral-500"
      />
    </div>
  );
}

export function AddressForm({
  initialData,
  onSuccess,
  onSubmit,
  onCancel,
}: AddressFormProps) {
  const isEditMode = !!initialData;

  const {
    values,
    handleChange,
    setMultipleValues,
    handleSubmit: submitForm,
    isSubmitting,
  } = useForm({
    initialValues: {
      fullName: initialData?.fullName || "",
      phoneNumber: initialData?.phoneNumber || "",
      specificAddress:
        initialData?.specificAddress || initialData?.address || "",
      provinceId: initialData?.provinceId || "",
      districtId: initialData?.districtId || "",
      wardCode: initialData?.wardCode || "",
      isDefault: initialData?.isDefault || false,
    },
    onSubmit: async (data) => {
      try {
        await onSubmit(data);
        onSuccess?.();
      } catch (error) {
        console.error(
          isEditMode
            ? "Failed to update address:"
            : "Failed to create address:",
          error,
        );
      }
    },
  });

  const {
    data: provinces = [],
    isLoading: provincesLoading,
    error: provincesError,
  } = useProvinces();

  const { data: districts = [], isLoading: districtsLoading } = useDistricts(
    values.provinceId,
  );

  const { data: wards = [], isLoading: wardsLoading } = useWards(
    values.districtId,
  );

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMultipleValues({
      provinceId: e.target.value,
      districtId: "",
      wardCode: "",
    });
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMultipleValues({
      districtId: e.target.value,
      wardCode: "",
    });
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMultipleValues({ wardCode: e.target.value });
  };

  return (
    <div className="rounded-[2px] border border-luxury-ink/10 bg-white px-5 py-6 sm:px-8 sm:py-8">
      {provincesError ? (
        <div className="mb-8 flex items-start gap-3 rounded-[2px] border border-blush-300 bg-blush-50 px-4 py-3.5">
          <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-blush-700" />
          <p className="text-xs leading-relaxed text-blush-800">
            Không thể tải dữ liệu Tỉnh/Thành phố. Vui lòng thử lại sau.
          </p>
        </div>
      ) : null}

      <form onSubmit={submitForm} className="space-y-10">
        {/* Recipient */}
        <fieldset>
          <Eyebrow>Thông tin người nhận</Eyebrow>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="fullName" className={fieldLabel}>
                Họ và tên
                <Required />
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                value={values.fullName}
                onChange={handleChange}
                placeholder="Ví dụ: Nguyễn Văn A"
                className={cn(fieldBase, "mt-2.5")}
                required
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className={fieldLabel}>
                Số điện thoại
                <Required />
              </label>
              <input
                id="phoneNumber"
                type="tel"
                name="phoneNumber"
                value={values.phoneNumber}
                onChange={handleChange}
                placeholder="Ví dụ: 0912345678"
                className={cn(fieldBase, "mt-2.5 tabular-nums")}
                pattern="0[0-9]{9}"
                title="Số điện thoại gồm 10 chữ số bắt đầu bằng số 0"
                minLength={10}
                maxLength={10}
                required
              />
            </div>
          </div>
        </fieldset>

        {/* Location */}
        <fieldset className="border-t border-luxury-ink/8 pt-8">
          <Eyebrow>Địa chỉ giao hàng</Eyebrow>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
              <label htmlFor="provinceId" className={fieldLabel}>
                Tỉnh / Thành phố
                <Required />
              </label>
              <div className="mt-2.5">
                <Select
                  id="provinceId"
                  name="provinceId"
                  value={values.provinceId}
                  onChange={handleProvinceChange}
                  disabled={provincesLoading}
                  required
                >
                  <option value="">
                    {provincesLoading ? "Đang tải…" : "— Chọn Tỉnh / Thành —"}
                  </option>
                  {provinces.map((province) => (
                    <option
                      key={province.ProvinceID}
                      value={province.ProvinceID}
                    >
                      {province.ProvinceName}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <label htmlFor="districtId" className={fieldLabel}>
                Quận / Huyện
                <Required />
              </label>
              <div className="mt-2.5">
                <Select
                  id="districtId"
                  name="districtId"
                  value={values.districtId}
                  onChange={handleDistrictChange}
                  disabled={!values.provinceId || districtsLoading}
                  required
                >
                  <option value="">
                    {districtsLoading
                      ? "Đang tải…"
                      : values.provinceId
                        ? "— Chọn Quận / Huyện —"
                        : "— Chọn Tỉnh trước —"}
                  </option>
                  {districts.map((district) => (
                    <option
                      key={district.DistrictID}
                      value={district.DistrictID}
                    >
                      {district.DistrictName}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <label htmlFor="wardCode" className={fieldLabel}>
                Phường / Xã
                <Required />
              </label>
              <div className="mt-2.5">
                <Select
                  id="wardCode"
                  name="wardCode"
                  value={values.wardCode}
                  onChange={handleWardChange}
                  disabled={!values.districtId || wardsLoading}
                  required
                >
                  <option value="">
                    {wardsLoading
                      ? "Đang tải…"
                      : values.districtId
                        ? "— Chọn Phường / Xã —"
                        : "— Chọn Huyện trước —"}
                  </option>
                  {wards.map((ward) => (
                    <option key={ward.WardCode} value={ward.WardCode}>
                      {ward.WardName}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="specificAddress" className={fieldLabel}>
              Địa chỉ cụ thể
              <Required />
            </label>
            <input
              id="specificAddress"
              type="text"
              name="specificAddress"
              value={values.specificAddress}
              onChange={handleChange}
              placeholder="Ví dụ: Số 12, Ngõ 34, Đường Nguyễn Trãi…"
              className={cn(fieldBase, "mt-2.5")}
              required
            />
          </div>

          <label className="mt-6 inline-flex cursor-pointer select-none items-center gap-3">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={values.isDefault}
              onChange={handleChange}
              className="h-4 w-4 cursor-pointer rounded-[2px] border border-luxury-ink/25 accent-luxury-ink"
            />
            <span className="text-sm text-neutral-700">
              Đặt làm địa chỉ mặc định
            </span>
          </label>
        </fieldset>

        {/* Actions */}
        <div className="flex flex-col-reverse items-stretch gap-3 border-t border-luxury-ink/8 pt-6 sm:flex-row sm:items-center sm:justify-end">
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="inline-flex h-11 items-center justify-center rounded-[2px] border border-luxury-ink/15 px-7 text-[10px] font-bold uppercase tracking-[0.22em] text-luxury-ink transition-all duration-300 hover:border-luxury-ink/40 disabled:opacity-40"
            >
              Hủy
            </button>
          ) : null}
          <button
            type="submit"
            disabled={!values.wardCode || isSubmitting}
            className="inline-flex h-11 items-center justify-center gap-3 rounded-[2px] bg-luxury-ink px-7 text-[10px] font-bold uppercase tracking-[0.22em] text-luxury-ivory transition-all duration-300 hover:bg-charcoal-800 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-luxury-ink"
          >
            {isSubmitting ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border border-luxury-ivory/30 border-t-luxury-ivory" />
                {isEditMode ? "Đang cập nhật" : "Đang lưu"}
              </>
            ) : isEditMode ? (
              "Cập nhật địa chỉ"
            ) : (
              "Lưu địa chỉ"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
