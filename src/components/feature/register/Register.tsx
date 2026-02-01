"use client";

import Link from "next/link";
import {
  AuthLayout,
  BrandingSection,
  InputField,
  PasswordField,
  ErrorMessage,
  AuthButton,
  AuthFormContainer,
  Divider,
} from "@/components/feature/auth";
import { UserIcon, EmailIcon, PhoneIcon, ArrowRightIcon } from "@/components/ui";
import { useRegister } from "./hooks/useRegister";
import { registerFeatures } from "./constants";

export default function Register() {
  const {
    formData,
    confirmPassword,
    errors,
    error,
    isLoading,
    handleChange,
    handleConfirmPasswordChange,
    handleBlur,
    handleSubmit,
  } = useRegister();

  return (
    <AuthLayout>
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <BrandingSection
          title="Tham gia"
          titleHighlight="cùng chúng tôi!"
          description="Tạo tài khoản để bắt đầu mua sắm xanh và tiết kiệm."
          features={registerFeatures}
        />

        <AuthFormContainer
          title="Tạo tài khoản"
          subtitle="Điền thông tin theo đúng định dạng"
        >
          <form className="space-y-4" onSubmit={handleSubmit}>
            <ErrorMessage message={error} />

            <div className="space-y-4">
              <InputField
                id="fullName"
                name="fullName"
                label="Họ và tên"
                value={formData.fullName || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="VD: Nguyễn Văn A"
                icon={<UserIcon />}
                error={errors.fullName}
              />
              <InputField
                id="username"
                name="username"
                label="Tên đăng nhập"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Chữ, số, dấu chấm hoặc gạch dưới (3–30 ký tự)"
                required
                icon={<UserIcon />}
                error={errors.username}
              />
              <InputField
                id="email"
                name="email"
                type="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="VD: email@example.com"
                required
                icon={<EmailIcon />}
                error={errors.email}
              />
              <InputField
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                label="Số điện thoại"
                value={formData.phoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="VD: 0912345678 hoặc 84912345678"
                required
                icon={<PhoneIcon />}
                error={errors.phoneNumber}
              />
              <PasswordField
                id="password"
                name="password"
                label="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Tối thiểu 6 ký tự"
                required
                error={errors.password}
              />
              <PasswordField
                id="confirmPassword"
                name="confirmPassword"
                label="Xác nhận mật khẩu"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                onBlur={handleBlur}
                placeholder="Nhập lại mật khẩu"
                required
                error={errors.confirmPassword}
              />
            </div>

            <AuthButton isLoading={isLoading}>
              <span>Tạo tài khoản</span>
              <ArrowRightIcon className="w-5 h-5" />
            </AuthButton>

            <Divider />

            <p className="text-center text-sm text-muted-foreground">
              Đã có tài khoản?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                Đăng nhập ngay
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </p>
          </form>
        </AuthFormContainer>
      </div>
    </AuthLayout>
  );
}
