"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "@/features/auth/AuthLayout";
import BrandingSection from "@/features/auth/BrandingSection";
import InputField from "@/features/auth/InputField";
import PasswordField from "@/features/auth/PasswordField";
import ErrorMessage from "@/features/auth/ErrorMessage";
import AuthButton from "@/features/auth/AuthButton";
import AuthFormContainer from "@/features/auth/AuthFormContainer";
import Divider from "@/features/auth/Divider";
import { UserIcon } from "@/components/ui/icons/UserIcon";
import { ArrowRightIcon } from "@/components/ui/icons/ArrowRightIcon";
import { useLogin } from "./hooks/useLogin";
import { loginFeatures } from "@/constants";
import { GoogleLoginButton } from "./components";
import { useUser } from "@/hooks/useUser";

export default function Login() {
  const router = useRouter();
  const { data: account } = useUser();
  const { formData, errors, error, isLoading, handleChange, handleSubmit, handleGoogleLogin } =
    useLogin();

  // Nếu đã đăng nhập thì chuyển về trang trước đó (redirect) hoặc Home
  const searchParams = useSearchParams();
  useEffect(() => {
    if (account) {
      const redirect = searchParams.get("redirect");
      const target = redirect && redirect.startsWith("/") && !redirect.startsWith("//")
        ? redirect
        : "/";
      router.replace(target);
    }
  }, [account, router, searchParams]);

  if (account) {
    // Đang redirect, không render form login
    return null;
  }

  return (
    <AuthLayout>
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
        <BrandingSection
          title="Chào mừng"
          titleHighlight="trở lại!"
          description="Đăng nhập để tiếp tục mua sắm xanh và tiết kiệm cùng chúng tôi."
          features={loginFeatures}
        />

        <AuthFormContainer
          title="Đăng nhập"
          subtitle="Nhập email hoặc tên đăng nhập và mật khẩu để tiếp tục"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <ErrorMessage message={error} />

            <div className="space-y-5">
              <InputField
                id="email"
                name="email"
                label="Email hoặc tên đăng nhập"
                value={formData.email}
                onChange={handleChange}
                placeholder="VD: nguyen_van_a hoặc user@example.com"
                required={false}
                icon={<UserIcon />}
                error={errors.email}
              />
              <PasswordField
                id="password"
                name="password"
                label="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
                placeholder="Tối thiểu 6 ký tự"
                required={false}
                error={errors.password}
              />
            </div>

            <div className="flex items-center justify-between text-[14px]">
              <label className="flex items-center gap-2.5 cursor-pointer text-taupe-600 hover:text-taupe-900 transition-colors group">
                <input
                  type="checkbox"
                  className="w-4 h-4 border-2 border-taupe-300 text-primary focus:ring-2 focus:ring-primary/30 focus:ring-offset-0 cursor-pointer"
                />
                <span className="font-medium">Ghi nhớ đăng nhập</span>
              </label>
              <Link
                href="/forgot-password"
                className="font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <AuthButton isLoading={isLoading}>
              <span>Đăng nhập</span>
              <ArrowRightIcon className="w-5 h-5" />
            </AuthButton>

            <Divider />

            <GoogleLoginButton onClick={handleGoogleLogin} disabled={isLoading} />

            <p className="text-center text-[15px] text-taupe-600">
              Chưa có tài khoản?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary hover:text-primary/80 inline-flex items-center gap-1.5 transition-colors"
              >
                Đăng ký ngay
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </p>
          </form>
        </AuthFormContainer>
      </div>
    </AuthLayout>
  );
}