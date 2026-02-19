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
  Divider,
} from "@/components/feature/auth";
import { UserIcon, ArrowRightIcon } from "@/components/ui";
import { useLogin } from "./hooks/useLogin";
import { loginFeatures } from "@/constants";
import { GoogleLoginButton } from "./components";
import { useUser } from "@/hooks/useUser";

export default function Login() {
  const router = useRouter();
  const { data: account } = useUser();
  const { formData, errors, error, isLoading, handleChange, handleSubmit, handleGoogleLogin } =
    useLogin();

  // Nếu đã đăng nhập thì không cho vào màn login nữa → chuyển sang trang sản phẩm đã đăng
  useEffect(() => {
    if (account) {
      router.replace("/my/listings");
    }
  }, [account, router]);

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
          subtitle="Nhập tên đăng nhập và mật khẩu để tiếp tục"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <ErrorMessage message={error} />

            <div className="space-y-5">
              <InputField
                id="username"
                name="username"
                label="Tên đăng nhập"
                value={formData.username}
                onChange={handleChange}
                placeholder="VD: nguyen_van_a"
                required
                icon={<UserIcon />}
                error={errors.username}
              />
              <PasswordField
                id="password"
                name="password"
                label="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
                placeholder="Tối thiểu 6 ký tự"
                required
                error={errors.password}
              />
            </div>

            <div className="flex items-center justify-between text-[14px]">
              <label className="flex items-center gap-2.5 cursor-pointer text-taupe-600 hover:text-taupe-900 transition-colors group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded-md border-2 border-gray-300 text-primary focus:ring-2 focus:ring-primary/30 focus:ring-offset-0 cursor-pointer"
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
