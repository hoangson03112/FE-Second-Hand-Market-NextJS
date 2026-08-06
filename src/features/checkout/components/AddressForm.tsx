"use client";

import { useProvinces, useDistricts, useWards } from "@/hooks/useGHNLocation";
import { useForm } from "@/hooks/useForm";
import { Button, Input } from "@/components/shared";
import type { CreateAddressRequest, Address } from "@/types/address";

interface AddressFormProps {
  initialData?: Address | null;
  onSuccess?: () => void;
  onCancel?: () => void;
  onSubmit: (data: CreateAddressRequest) => Promise<void>;
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
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl p-6 sm:p-8 shadow-md border-2 border-border">
      {/* Thông báo lỗi nếu không tải được tỉnh thành */}
      {provincesError && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2">
          <span>⚠️</span>
          <span>
            Không thể tải dữ liệu Tỉnh/Thành phố. Vui lòng thử lại sau.
          </span>
        </div>
      )}

      <form onSubmit={submitForm} className="space-y-6">
        {/* KHU VỰC 1: THÔNG TIN NGƯỜI NHẬN */}
        <div>
          <h3 className="text-base font-semibold text-taupe-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Thông tin người nhận
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-taupe-500 mb-1.5">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="fullName"
                value={values.fullName}
                onChange={handleChange}
                placeholder="Ví dụ: Nguyễn Văn A"
                className="bg-cream-50/50 focus:bg-white transition-all rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-taupe-500 mb-1.5">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <Input
                type="tel"
                name="phoneNumber"
                value={values.phoneNumber}
                onChange={handleChange}
                placeholder="Ví dụ: 0912345678"
                className="bg-cream-50/50 focus:bg-white transition-all rounded-lg"
                pattern="0[0-9]{9}"
                title="Số điện thoại gồm 10 chữ số bắt đầu bằng số 0"
                minLength={10}
                maxLength={10}
                required
              />
            </div>
          </div>
        </div>

        <hr className="border-border" />

        {/* KHU VỰC 2: ĐỊA CHỈ GIAO HÀNG */}
        <div>
          <h3 className="text-base font-semibold text-taupe-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Địa chỉ giao hàng
          </h3>

          {/* Grid 3 cột cho Tỉnh / Quận / Xã */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Tỉnh / Thành phố */}
            <div>
              <label className="block text-xs font-semibold uppercase text-taupe-500 mb-1.5">
                Tỉnh / Thành phố <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="provinceId"
                  value={values.provinceId}
                  onChange={handleProvinceChange}
                  disabled={provincesLoading}
                  className="w-full p-2.5 pr-8 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-taupe-100 disabled:cursor-not-allowed appearance-none bg-cream-50/50 transition-all cursor-pointer"
                  required
                >
                  <option value="">
                    {provincesLoading
                      ? "Đang tải..."
                      : "-- Chọn Tỉnh / Thành --"}
                  </option>
                  {provinces.map((province) => (
                    <option
                      key={province.ProvinceID}
                      value={province.ProvinceID}
                    >
                      {province.ProvinceName}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-taupe-500">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Quận / Huyện */}
            <div>
              <label className="block text-xs font-semibold uppercase text-taupe-500 mb-1.5">
                Quận / Huyện <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="districtId"
                  value={values.districtId}
                  onChange={handleDistrictChange}
                  disabled={!values.provinceId || districtsLoading}
                  className="w-full p-2.5 pr-8 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-taupe-100 disabled:cursor-not-allowed appearance-none bg-cream-50/50 transition-all cursor-pointer"
                  required
                >
                  <option value="">
                    {districtsLoading
                      ? "Đang tải..."
                      : values.provinceId
                        ? "-- Chọn Quận / Huyện --"
                        : "-- Chọn Tỉnh trước --"}
                  </option>
                  {districts.map((district) => (
                    <option
                      key={district.DistrictID}
                      value={district.DistrictID}
                    >
                      {district.DistrictName}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-taupe-500">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Phường / Xã */}
            <div>
              <label className="block text-xs font-semibold uppercase text-taupe-500 mb-1.5">
                Phường / Xã <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="wardCode"
                  value={values.wardCode}
                  onChange={handleWardChange}
                  disabled={!values.districtId || wardsLoading}
                  className="w-full p-2.5 pr-8 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-taupe-100 disabled:cursor-not-allowed appearance-none bg-cream-50/50 transition-all cursor-pointer"
                  required
                >
                  <option value="">
                    {wardsLoading
                      ? "Đang tải..."
                      : values.districtId
                        ? "-- Chọn Phường / Xã --"
                        : "-- Chọn Huyện trước --"}
                  </option>
                  {wards.map((ward) => (
                    <option key={ward.WardCode} value={ward.WardCode}>
                      {ward.WardName}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-taupe-500">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Địa chỉ cụ thể */}
          <div>
            <label className="block text-xs font-semibold uppercase text-taupe-500 mb-1.5">
              Địa chỉ cụ thể <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="specificAddress"
              value={values.specificAddress}
              onChange={handleChange}
              placeholder="Ví dụ: Số 12, Ngõ 34, Đường Nguyễn Trãi..."
              className="bg-cream-50/50 focus:bg-white transition-all rounded-lg"
              required
            />
          </div>
        </div>

        {/* CẤU HÌNH MẶC ĐỊNH */}
        <div className="pt-2">
          <label className="inline-flex items-center gap-2 cursor-pointer select-none group">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={values.isDefault}
              onChange={handleChange}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary/30 cursor-pointer accent-primary"
            />
            <span className="text-sm font-medium text-taupe-900 group-hover:text-primary transition-colors">
              Đặt làm địa chỉ mặc định
            </span>
          </label>
        </div>

        {/* NÚT THAO TÁC */}
        <div className="flex items-center gap-3 justify-end pt-4 border-t border-border">
          {onCancel && (
            <Button
              type="button"
              onClick={onCancel}
              variant="secondary"
              className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
              disabled={isSubmitting}
            >
              Hủy
            </Button>
          )}
          <Button
            type="submit"
            className="px-6 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-all"
            disabled={!values.wardCode || isSubmitting}
          >
            {isSubmitting
              ? isEditMode
                ? "Đang cập nhật..."
                : "Đang lưu..."
              : isEditMode
                ? "Cập nhật địa chỉ"
                : "Lưu địa chỉ"}
          </Button>
        </div>
      </form>
    </div>
  );
}
