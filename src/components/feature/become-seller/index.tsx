"use client";

import {
  AuthLayout,
  BrandingSection,
  AuthFormContainer,
  AuthButton,
  ErrorMessage,
} from "@/components/feature/auth";
import { ArrowRightIcon } from "@/components/ui";
import { useBecomeSeller } from "./hooks/useBecomeSeller";
import { useBecomeSellerLocation } from "./hooks/useBecomeSellerLocation";
import { becomeSellerFeatures } from "./constants";
import { AddressSection } from "./components/AddressSection";
import { BankInfoSection } from "./components/BankInfoSection";
import { IdCardSection } from "./components/IdCardSection";
import { TermsSection } from "./components/TermsSection";

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
  const {
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
  } = useBecomeSellerLocation({ values, setValues });

  return (
    <AuthLayout>
      <div className="grid lg:grid-cols-[1.1fr,1.2fr] gap-8 lg:gap-12 items-stretch">
        <BrandingSection
          title="Đăng ký"
          titleHighlight="bán hàng"
          description="Trở thành seller đáng tin cậy trên Eco Market, mở gian hàng riêng để đăng sản phẩm, quản lý đơn và nhận thanh toán an toàn."
          features={becomeSellerFeatures}
        />

        <AuthFormContainer
          title="Đăng ký làm Seller"
          subtitle="Điền nhanh các thông tin cần thiết để bắt đầu bán hàng"
          maxHeight="max-h-[90vh]"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <ErrorMessage message={apiError} />

            <AddressSection
              values={values}
              errors={errors}
              provinces={provinces}
              districts={districts}
              wards={wards}
              provincesLoading={provincesLoading}
              districtsLoading={districtsLoading}
              wardsLoading={wardsLoading}
              selectedProvince={selectedProvince}
              selectedDistrict={selectedDistrict}
              selectedWard={selectedWard}
              onProvinceChange={onProvinceChange}
              onDistrictChange={onDistrictChange}
              onWardChange={onWardChange}
              onAddressChange={handleChange}
            />

            <BankInfoSection values={values} errors={errors} onChange={handleChange} />

            <IdCardSection
              idCardFront={idCardFront}
              idCardBack={idCardBack}
              errors={errors}
              onFileChange={handleFile}
            />

            <TermsSection values={values} errors={errors} onChange={handleChange} />

            <div className="space-y-3 pt-1">
              <AuthButton isLoading={isLoading}>
                <span>Bắt đầu bán hàng</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </AuthButton>
              <p className="text-center text-xs text-muted-foreground">
                Hồ sơ của bạn sẽ được đội ngũ Eco Market kiểm duyệt trong vòng 24h. Nếu cần hỗ trợ
                gấp, vui lòng liên hệ kênh chăm sóc khách hàng.
              </p>
            </div>
          </form>
        </AuthFormContainer>
      </div>
    </AuthLayout>
  );
}
