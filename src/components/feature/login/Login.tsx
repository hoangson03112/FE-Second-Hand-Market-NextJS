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
import { UserIcon, ArrowRightIcon } from "@/components/ui";
import { useLogin } from "./useLogin";
import { loginFeatures } from "./constants";

export default function Login() {
  const { formData, error, isLoading, handleChange, handleSubmit } = useLogin();

  return (
    <AuthLayout>
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <BrandingSection
          title="Chào mừng"
          titleHighlight="trở lại!"
          description="Đăng nhập để tiếp tục hành trình mua sắm xanh và tiết kiệm cùng chúng tôi"
          features={loginFeatures}
        />

        <AuthFormContainer title="Đăng nhập" subtitle="Nhập thông tin để tiếp tục">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <ErrorMessage message={error} />

            <div className="space-y-5">
              <InputField
                id="username"
                name="username"
                label="Tên đăng nhập"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nhập tên đăng nhập"
                required
                icon={<UserIcon />}
              />

              <PasswordField
                id="password"
                name="password"
                label="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2 cursor-pointer"
                />
                <span className="text-gray-600 group-hover:text-gray-900 transition-colors">Ghi nhớ đăng nhập</span>
              </label>
              <Link href="/forgot-password" className="font-semibold text-primary hover:text-primary-dark transition-colors">
                Quên mật khẩu?
              </Link>
            </div>

            <AuthButton isLoading={isLoading}>
              <span>Đăng nhập</span>
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </AuthButton>

            <Divider />

            <div className="text-center">
              <p className="text-gray-600">
                Chưa có tài khoản?{" "}
                <Link href="/register" className="font-semibold text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1">
                  Đăng ký ngay
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
