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
import { useRegister } from "./useRegister";
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
          description="Tạo tài khoản ngay để bắt đầu hành trình mua sắm xanh và tiết kiệm"
          features={registerFeatures}
        />

        <AuthFormContainer title="Tạo tài khoản" subtitle="Điền thông tin để bắt đầu" maxHeight="max-h-[90vh]">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <ErrorMessage message={error} />

            <div className="space-y-4">
              <div>
                <InputField
                  id="fullName"
                  name="fullName"
                  label="Họ và tên"
                  value={formData.fullName || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Nhập họ và tên"
                  icon={<UserIcon />}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                )}
              </div>

              <div>
                <InputField
                  id="username"
                  name="username"
                  label="Tên đăng nhập"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Nhập tên đăng nhập"
                  required
                  icon={<UserIcon />}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                )}
              </div>

              <div>
                <InputField
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Nhập email"
                  required
                  icon={<EmailIcon />}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <InputField
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  label="Số điện thoại"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Nhập số điện thoại"
                  required
                  icon={<PhoneIcon />}
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
                )}
              </div>

              <div>
                <PasswordField
                  id="password"
                  name="password"
                  label="Mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Tối thiểu 6 ký tự"
                  required
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div>
                <PasswordField
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Xác nhận mật khẩu"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  onBlur={handleBlur}
                  placeholder="Nhập lại mật khẩu"
                  required
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <AuthButton isLoading={isLoading}>
              <span>Tạo tài khoản</span>
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </AuthButton>

            <Divider />

            <div className="text-center">
              <p className="text-gray-600">
                Đã có tài khoản?{" "}
                <Link href="/login" className="font-semibold text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1">
                  Đăng nhập ngay
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </p>
            </div>
          </form>
        </AuthFormContainer>
      </div>
    </AuthLayout>
  );
}
