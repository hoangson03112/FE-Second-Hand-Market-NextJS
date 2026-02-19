"use client";

import {
  AuthLayout,
  BrandingSection,
  AuthFormContainer,
  AuthButton,
  ErrorMessage,
} from "@/components/feature/auth";
import { ArrowRightIcon } from "@/components/ui";
import { useBecomeSeller, useBecomeSellerLocation } from "./hooks";
import { becomeSellerFeatures, UNVERIFIED_SELLER_PRODUCT_LIMIT } from "@/constants";
import {
  AddressSection,
  BankInfoSection,
  IdCardSection,
  TermsSection,
} from "./components";

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
    requestStatus,
    isCheckingStatus,
    hasRequest,
    productLimit,
    requiresVerification,
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
          {isCheckingStatus ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
            </div>
          ) : hasRequest && requestStatus === "pending" ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-amber-500/50 bg-amber-50/50 p-4 space-y-2">
                <h3 className="text-sm font-semibold text-amber-800">
                  Yêu cầu đang chờ phê duyệt
                </h3>
                <p className="text-xs text-amber-700">
                  Bạn đã gửi yêu cầu trở thành seller. Hồ sơ của bạn đang được đội ngũ Eco Market
                  kiểm duyệt trong vòng 24h. Vui lòng chờ thông báo qua email hoặc kiểm tra lại sau.
                </p>
              </div>
            </div>
          ) : hasRequest && requestStatus === "rejected" ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-red-500/50 bg-red-50/50 p-4 space-y-2">
                <h3 className="text-sm font-semibold text-red-800">
                  Yêu cầu đã bị từ chối
                </h3>
                <p className="text-xs text-red-700">
                  {apiError || "Yêu cầu của bạn đã bị từ chối. Vui lòng liên hệ hỗ trợ để được giải đáp."}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <ErrorMessage message={apiError} />

              {/* Product limit info banner */}
              {productLimit && requiresVerification && requestStatus !== "approved" && (
                <div className="rounded-xl border border-blue-500/50 bg-blue-50/50 p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-blue-800 mb-1">
                        Bạn đã đăng {productLimit.totalProducts}/{productLimit.limit} sản phẩm
                      </h4>
                      <p className="text-xs text-blue-700">
                        Để tiếp tục đăng sản phẩm không giới hạn, nhận thanh toán online và được
                        ưu tiên hiển thị, vui lòng xác minh tài khoản seller bằng cách điền form
                        bên dưới.
                      </p>
                    </div>
                  </div>
                </div>
              )}

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
                <AuthButton
                  isLoading={isLoading}
                  disabled={hasRequest && requestStatus === "pending"}
                >
                  <span>
                    {requiresVerification
                      ? "Xác minh tài khoản seller"
                      : "Bắt đầu bán hàng"}
                  </span>
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </AuthButton>
                <p className="text-center text-xs text-muted-foreground">
                  {requiresVerification ? (
                    <>
                      Xác minh tài khoản để mở khóa đăng sản phẩm không giới hạn và nhận thanh
                      toán online. Hồ sơ của bạn sẽ được đội ngũ Eco Market kiểm duyệt trong vòng
                      24h.
                    </>
                  ) : (
                    <>
                      Hồ sơ của bạn sẽ được đội ngũ Eco Market kiểm duyệt trong vòng 24h. Nếu cần
                      hỗ trợ gấp, vui lòng liên hệ kênh chăm sóc khách hàng.
                    </>
                  )}
                </p>
              </div>
            </form>
          )}
        </AuthFormContainer>
      </div>
    </AuthLayout>
  );
}
