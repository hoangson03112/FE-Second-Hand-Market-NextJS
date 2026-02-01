"use client";

import Link from "next/link";
import {
  AuthLayout,
  BrandingSection,
  AuthFormContainer,
  AuthButton,
  ErrorMessage,
} from "@/components/feature/auth";
import { useBecomeSeller } from "./hooks/useBecomeSeller";
import { becomeSellerFeatures } from "./constants";
import { useProvinces, useDistricts, useWards } from "@/hooks/useGHNLocation";
import { useMemo } from "react";
import { ArrowRightIcon } from "@/components/ui";

export default function BecomeSeller() {
  const {
    values,
    setValues,
    errors,
    apiError,
    isLoading,
    idCardFront,
    idCardBack,
    handleChange,
    handleFile,
    handleSubmit,
  } = useBecomeSeller();

  const { data: provinces = [], isLoading: provincesLoading } = useProvinces();
  const { data: districts = [], isLoading: districtsLoading } = useDistricts(
    values.provinceId ? Number(values.provinceId) : undefined
  );
  const { data: wards = [], isLoading: wardsLoading } = useWards(
    values.districtId ? Number(values.districtId) : undefined
  );

  const selectedProvince = useMemo(
    () => provinces.find((p) => String(p.ProvinceID) === values.provinceId),
    [provinces, values.provinceId]
  );
  const selectedDistrict = useMemo(
    () => districts.find((d) => String(d.DistrictID) === values.districtId),
    [districts, values.districtId]
  );
  const selectedWard = useMemo(
    () => wards.find((w) => w.WardCode === values.wardCode),
    [wards, values.wardCode]
  );

  const onProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
      };

  const onDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = e.target.value;
    const district = districts.find((d) => String(d.DistrictID) === districtId) ?? null;
    setValues((prev) => ({
      ...prev,
      districtId,
      wardCode: "",
      district: district?.DistrictName ?? "",
      ward: "",
    }));
      };

  const onWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wardCode = e.target.value;
    const ward = wards.find((w) => w.WardCode === wardCode) ?? null;
    setValues((prev) => ({
      ...prev,
      wardCode,
      ward: ward?.WardName ?? "",
    }));
      };

  return (
    <AuthLayout>
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <BrandingSection
          title="Đăng ký"
          titleHighlight="bán hàng"
          description="Trở thành seller để đăng sản phẩm, quản lý đơn hàng và nhận thanh toán an toàn trên Eco Market."
          features={becomeSellerFeatures}
        />

        <AuthFormContainer
          title="Đăng ký làm Seller"
          subtitle="Điền thông tin và tải ảnh CCCD để xác minh"
          maxHeight="max-h-[90vh]"
        >
          <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto max-h-[70vh] pr-2">
            <ErrorMessage message={apiError} />

            {/* Địa chỉ kinh doanh */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground border-b border-default pb-1">
                Địa chỉ kinh doanh / lấy hàng
              </h3>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tỉnh/Thành phố <span className="text-red-500">*</span>
                </label>
                <select
                  name="provinceId"
                  value={values.provinceId}
                  onChange={onProvinceChange}
                  disabled={provincesLoading}
                  className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary disabled:bg-muted"
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
              <div>
                <label className="block text-sm font-medium mb-1">
                  Quận/Huyện <span className="text-red-500">*</span>
                </label>
                <select
                  name="districtId"
                  value={values.districtId}
                  onChange={onDistrictChange}
                  disabled={!values.provinceId || districtsLoading}
                  className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary disabled:bg-muted"
                >
                  <option value="">
                    {!values.provinceId ? "Chọn Tỉnh trước" : districtsLoading ? "Đang tải..." : "Chọn Quận/Huyện"}
                  </option>
                  {districts.map((d) => (
                    <option key={d.DistrictID} value={d.DistrictID}>
                      {d.DistrictName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phường/Xã <span className="text-red-500">*</span>
                </label>
                <select
                  name="wardCode"
                  value={values.wardCode}
                  onChange={onWardChange}
                  disabled={!values.districtId || wardsLoading}
                  className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary disabled:bg-muted"
                >
                  <option value="">
                    {!values.districtId ? "Chọn Quận trước" : wardsLoading ? "Đang tải..." : "Chọn Phường/Xã"}
                  </option>
                  {wards.map((w) => (
                    <option key={w.WardCode} value={w.WardCode}>
                      {w.WardName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Địa chỉ cụ thể (số nhà, đường) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={values.address}
                  onChange={handleChange}
                  placeholder="Số nhà, tên đường..."
                  className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                )}
              </div>
            </div>

            {/* Thông tin ngân hàng */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground border-b border-default pb-1">
                Thông tin ngân hàng nhận thanh toán
              </h3>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tên ngân hàng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={values.bankName}
                  onChange={handleChange}
                  placeholder="VD: Vietcombank"
                  className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                />
                {errors.bankName && (
                  <p className="mt-1 text-sm text-red-500">{errors.bankName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Số tài khoản <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={values.accountNumber}
                  onChange={handleChange}
                  placeholder="Chỉ nhập số"
                  className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                />
                {errors.accountNumber && (
                  <p className="mt-1 text-sm text-red-500">{errors.accountNumber}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Chủ tài khoản <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="accountHolder"
                  value={values.accountHolder}
                  onChange={handleChange}
                  placeholder="Họ tên in trên thẻ"
                  className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                />
                {errors.accountHolder && (
                  <p className="mt-1 text-sm text-red-500">{errors.accountHolder}</p>
                )}
              </div>
            </div>

            {/* Ảnh CCCD */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground border-b border-default pb-1">
                Ảnh CCCD/CMND <span className="text-red-500">*</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Mặt trước</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFile("idCardFront")}
                    className="w-full text-sm text-muted-foreground file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-primary file:text-white"
                  />
                  {idCardFront && (
                    <p className="mt-1 text-xs text-green-600">{idCardFront.name}</p>
                  )}
                  {errors.idCardFront && (
                    <p className="mt-1 text-sm text-red-500">{errors.idCardFront}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mặt sau</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFile("idCardBack")}
                    className="w-full text-sm text-muted-foreground file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-primary file:text-white"
                  />
                  {idCardBack && (
                    <p className="mt-1 text-xs text-green-600">{idCardBack.name}</p>
                  )}
                  {errors.idCardBack && (
                    <p className="mt-1 text-sm text-red-500">{errors.idCardBack}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ảnh đại diện (tùy chọn)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile("avatar")}
                  className="w-full text-sm text-muted-foreground file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-primary file:text-white"
                />
              </div>
            </div>

            {/* Điều khoản */}
            <div className="space-y-2">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={values.agreeTerms}
                  onChange={handleChange}
                  className="mt-1 rounded border-border"
                />
                <span className="text-sm">
                  Tôi đồng ý với <Link href="/terms" className="text-primary underline">điều khoản sử dụng</Link> của Eco Market
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="text-sm text-red-500">{errors.agreeTerms}</p>
              )}
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreePolicy"
                  checked={values.agreePolicy}
                  onChange={handleChange}
                  className="mt-1 rounded border-border"
                />
                <span className="text-sm">
                  Tôi đồng ý với <Link href="/privacy" className="text-primary underline">chính sách bảo mật</Link>
                </span>
              </label>
              {errors.agreePolicy && (
                <p className="text-sm text-red-500">{errors.agreePolicy}</p>
              )}
            </div>

            <AuthButton isLoading={isLoading}>
              <span>Gửi đăng ký</span>
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </AuthButton>

            <p className="text-center text-sm text-muted-foreground">
              Chúng tôi sẽ xem xét và phản hồi trong vòng 24h. Liên hệ hỗ trợ nếu cần.
            </p>
          </form>
        </AuthFormContainer>
      </div>
    </AuthLayout>
  );
}
