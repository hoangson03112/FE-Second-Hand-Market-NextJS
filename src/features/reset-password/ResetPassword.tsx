"use client";

import { useSearchParams } from "next/navigation";
import AuthLayout from "@/features/auth/AuthLayout";
import BrandingSection from "@/features/auth/BrandingSection";
import AuthFormContainer from "@/features/auth/AuthFormContainer";
import { useResetPassword } from "./hooks/useResetPassword";
import ResetPasswordForm from "./components/ResetPasswordForm";
import ResetPasswordSuccess from "./components/ResetPasswordSuccess";
import InvalidTokenError from "./components/InvalidTokenError";
import { resetPasswordFeatures } from "@/constants/auth.features";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    isLoading,
    isSuccess,
    isCheckingToken,
    isTokenInvalid,
    invalidTokenMessage,
    handleSubmit,
  } = useResetPassword({ token });

  // Invalid token state (missing / expired / malformed)
  if (!token || isTokenInvalid) {
    return (
      <AuthLayout>
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
          <BrandingSection
            title="Lỗi"
            titleHighlight="không hợp lệ"
            description="Link reset mật khẩu không đúng hoặc đã hết hạn."
            features={resetPasswordFeatures}
          />
          <AuthFormContainer
            title="Liên kết đặt lại đã hết hạn"
            subtitle="Bạn có thể yêu cầu một liên kết mới để tiếp tục đổi mật khẩu."
          >
            <InvalidTokenError message={invalidTokenMessage} />
          </AuthFormContainer>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
        <BrandingSection
          title={isSuccess ? "Thành" : "Đổi"}
          titleHighlight={isSuccess ? "công!" : "mật khẩu mới"}
          description={
            isSuccess
              ? "Mật khẩu của bạn đã được thay đổi thành công."
              : "Tạo mật khẩu mới và bảo mật tài khoản của bạn."
          }
          features={resetPasswordFeatures}
        />

        <AuthFormContainer
          title={isSuccess ? "Đổi mật khẩu thành công" : "Đặt mật khẩu mới"}
          subtitle={
            isSuccess
              ? "Bạn có thể đăng nhập với mật khẩu mới"
              : isCheckingToken
                ? "Đang kiểm tra tính hợp lệ của liên kết..."
                : "Nhập mật khẩu mới cho tài khoản của bạn"
          }
        >
          {isCheckingToken ? (
            <div className="py-8 text-center text-taupe-600">
              Đang xác thực liên kết đặt lại mật khẩu...
            </div>
          ) : isSuccess ? (
            <ResetPasswordSuccess />
          ) : (
            <ResetPasswordForm
              newPassword={newPassword}
              confirmPassword={confirmPassword}
              error={error}
              isLoading={isLoading}
              onNewPasswordChange={setNewPassword}
              onConfirmPasswordChange={setConfirmPassword}
              onSubmit={handleSubmit}
            />
          )}
        </AuthFormContainer>
      </div>
    </AuthLayout>
  );
}
