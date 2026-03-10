"use client";

import AuthLayout from "@/features/auth/AuthLayout";
import BrandingSection from "@/features/auth/BrandingSection";
import AuthFormContainer from "@/features/auth/AuthFormContainer";
import { useForgotPassword } from "./hooks/useForgotPassword";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import ForgotPasswordSuccess from "./components/ForgotPasswordSuccess";
import { forgotPasswordFeatures } from "@/constants/auth.features";

export default function ForgotPassword() {
  const { email, setEmail, error, isLoading, isSuccess, handleSubmit, resetForm } = useForgotPassword();

  return (
    <AuthLayout>
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
        <BrandingSection
          title={isSuccess ? "KiỒm tra" : "Quên"}
          titleHighlight={isSuccess ? "email của bạn!" : "mật khẩu?"}
          description={
            isSuccess
              ? "Chúng tôi �ã gửi link reset mật khẩu �ến email của bạn."
              : "Đừng lo! Chúng tôi sẽ giúp bạn khôi phục lại tài khoản."
          }
          features={forgotPasswordFeatures}
        />

        <AuthFormContainer
          title={isSuccess ? "Email đã được gửi" : "Quên mật khẩu"}
          subtitle={isSuccess ? "Vui lòng kiểm tra hộp thư của bạn" : "Nhập email để nhận link đặt lại mật khẩu"}
        >
          {isSuccess ? (
            <ForgotPasswordSuccess email={email} onResend={resetForm} />
          ) : (
            <ForgotPasswordForm
              email={email}
              error={error}
              isLoading={isLoading}
              onEmailChange={setEmail}
              onSubmit={handleSubmit}
            />
          )}
        </AuthFormContainer>
      </div>
    </AuthLayout>
  );
}
