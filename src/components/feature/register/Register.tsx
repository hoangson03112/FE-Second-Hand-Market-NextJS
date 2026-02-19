"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AuthLayout,
  BrandingSection,
  InputField,
  PasswordField,
  ErrorMessage,
  AuthButton,
  AuthFormContainer,
} from "@/components/feature/auth";
import { UserIcon, EmailIcon, PhoneIcon, ArrowRightIcon } from "@/components/ui";
import { useRegister } from "./hooks/useRegister";
import { registerFeatures } from "@/constants";
import { useUser } from "@/hooks/useUser";

export default function Register() {
  const router = useRouter();
  const { data: account } = useUser();
  const {
    formData,
    errors,
    error,
    isLoading,
    handleChange,
    handleConfirmPasswordChange,
    handleBlur,
    handleSubmit,
  } = useRegister();

  // Nếu đã đăng nhập thì redirect
  useEffect(() => {
    if (account) {
      router.replace("/my/listings");
    }
  }, [account, router]);

  if (account) {
    return null;
  }

  return (
    <AuthLayout>
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
        <BrandingSection
          title="Tham gia"
          titleHighlight="cộng đồng!"
          description="Đăng ký để bắt đầu mua bán đồ cũ thông minh và bảo vệ môi trường cùng chúng tôi."
          features={registerFeatures}
        />

        <AuthFormContainer
          title="Đăng ký"
          subtitle="Tạo tài khoản mới để bắt đầu"
          maxHeight="max-h-[calc(100vh-8rem)]"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <ErrorMessage message={error} />

            <div className="space-y-5">
              <InputField
                id="fullName"
                name="fullName"
                label="Họ và tên"
                value={formData.fullName || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="VD: Nguyễn Văn A"
                required
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
                placeholder="VD: nguyen_van_a"
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
                placeholder="VD: 0912345678"
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
                value={formData.confirmPassword}
                onChange={handleConfirmPasswordChange}
                onBlur={handleBlur}
                placeholder="Nhập lại mật khẩu"
                required
                error={errors.confirmPassword}
              />
            </div>

            <div className="pt-2">
              <AuthButton isLoading={isLoading}>
                <span>Đăng ký</span>
                <ArrowRightIcon className="w-5 h-5" />
              </AuthButton>
            </div>

            <p className="text-center text-[15px] text-taupe-600">
              Đã có tài khoản?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:text-primary/80 inline-flex items-center gap-1.5 transition-colors"
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
