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
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
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
          <form className="space-y-5" onSubmit={handleSubmit}>
            <ErrorMessage message={error} />

            <div className="space-y-4">
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground transition">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
                />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <Link
                href="/forgot-password"
                className="font-medium text-primary hover:underline"
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

            <p className="text-center text-sm text-muted-foreground">
              Chưa có tài khoản?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
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
