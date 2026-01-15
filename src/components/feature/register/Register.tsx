"use client";
import React from "react";
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
                  icon={
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
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
                  icon={
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
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
                  icon={
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
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
                  icon={
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  }
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
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </AuthButton>

            <Divider />

            <div className="text-center">
              <p className="text-gray-600">
                Đã có tài khoản?{" "}
                <Link href="/login" className="font-semibold text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1">
                  Đăng nhập ngay
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </p>
            </div>
          </form>
        </AuthFormContainer>
      </div>
    </AuthLayout>
  );
}
