"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "@/features/auth/AuthLayout";
import InputField from "@/features/auth/InputField";
import PasswordField from "@/features/auth/PasswordField";
import AuthFormContainer from "@/features/auth/AuthFormContainer";
import Divider from "@/features/auth/Divider";
import { UserIcon } from "@/components/shared";
import { ArrowRightIcon } from "@/components/shared";
import { useLogin } from "./hooks/useLogin";
import { loginFeatures } from "@/constants";
import { useUser } from "@/hooks/useUser";
import GoogleLoginButton from "./components/GoogleLoginButton";

export default function Login() {
  const router = useRouter();
  const { data: account } = useUser();
  const {
    formData,
    isLoading,
    rememberMe,
    handleChange,
    setRememberMe,
    handleSubmit,
    handleGoogleLogin,
  } = useLogin();

  const searchParams = useSearchParams();
  
  useEffect(() => {
    if (account) {
      const redirect = searchParams.get("redirect");
      const target =
        redirect && redirect.startsWith("/") && !redirect.startsWith("//")
          ? redirect
          : "/";
      router.replace(target);
    }
  }, [account, router, searchParams]);

  if (account) {
    return null;
  }

  return (
    <AuthLayout>
      <div 
        className="relative min-h-[85vh] w-full flex items-center justify-center overflow-hidden rounded-2xl p-6 lg:p-12 shadow-sm"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, #F8F9F7 0%, #F1F2F0 55%, var(--background) 100%)",
        }}
      >
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-24 items-center w-full max-w-6xl relative z-10">
          
          {/* PHẦN BÊN TRÁI: Thiết kế lại toàn bộ, đồng bộ Font & Typo từ Hero */}
          <div className="flex flex-col justify-center px-2 lg:px-0 pointer-events-none">
            <h1
              className="mb-8 text-foreground drop-shadow-sm"
              style={{
                fontFamily: "var(--font-droid-serif), serif",
                fontSize: "clamp(3.5rem, 6vw, 5.5rem)",
                fontWeight: 300,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
              }}
            >
              Chào mừng{" "}
              <br />
              <span style={{ letterSpacing: "-0.02em", fontStyle: "italic" }}>
                trở lại
              </span>
            </h1>
            
            <p className="text-lg md:text-xl leading-relaxed mb-12 max-w-md text-foreground/70 font-medium">
              Đăng nhập để tiếp tục tham gia mạng lưới mua sắm xanh, tiết kiệm và bền vững cùng chúng tôi.
            </p>

            {/* List tính năng thiết kế kiểu Minimalist Luxury */}
            <div className="space-y-6 hidden md:block">
              {loginFeatures.map((feature: { title: string; description?: string }, idx: number) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border border-foreground/20 flex items-center justify-center mt-0.5 text-foreground">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-foreground font-medium text-[15px]">{feature.title}</h3>
                    {feature.description && (
                      <p className="text-foreground/60 text-sm mt-1 leading-relaxed max-w-sm">{feature.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PHẦN FORM BÊN PHẢI: Chuyển toàn bộ màu sắc sang Foreground */}
          <AuthFormContainer
            title="Đăng nhập"
            subtitle="Nhập email hoặc tên đăng nhập và mật khẩu để tiếp tục"
          >
            <form className="space-y-7 mt-4" onSubmit={handleSubmit}>
              <div className="space-y-6">
                <InputField
                  id="email"
                  name="email"
                  label="Email hoặc tên đăng nhập"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="VD: nguyen_van_a hoặc user@example.com"
                  required={false}
                  icon={<UserIcon />}
                  className="border-foreground/20 focus:border-foreground focus:ring-foreground/10 transition-all text-foreground bg-transparent placeholder:text-foreground/40"
                />
                <PasswordField
                  id="password"
                  name="password"
                  label="Mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Tối thiểu 6 ký tự"
                  required={false}
                  className="border-foreground/20 focus:border-foreground focus:ring-foreground/10 transition-all text-foreground bg-transparent placeholder:text-foreground/40"
                />
              </div>

              <div className="flex items-center justify-between text-[14px]">
                <label className="flex items-center gap-2.5 cursor-pointer text-foreground/70 hover:text-foreground transition-colors group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    // Đồng bộ checkbox với text-foreground
                    className="w-4 h-4 border-2 border-foreground/30 text-foreground focus:ring-2 focus:ring-foreground/20 focus:ring-offset-0 cursor-pointer rounded-[2px] bg-transparent"
                  />
                  <span className="font-medium">Ghi nhớ đăng nhập</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="font-semibold text-foreground hover:text-foreground/70 transition-colors"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Nút Submit: Nền Foreground, Chữ Background (Đảo ngược tạo điểm nhấn) */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full items-center justify-center px-12 py-4 text-sm font-medium uppercase tracking-[0.25em] text-background bg-foreground transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
                style={{ borderRadius: "3px" }}
              >
                <div className="absolute inset-0 bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md rounded-lg" />
                <span className="relative z-10 flex items-center gap-2">
                  {isLoading ? "Đang xử lý..." : "Đăng nhập"}
                  {!isLoading && <ArrowRightIcon className="w-5 h-5" />}
                </span>
              </button>

              <Divider />

              <div className="hover:scale-[1.01] transition-transform duration-300">
                <GoogleLoginButton
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                />
              </div>

              <p className="text-center text-[15px] text-foreground/70">
                Chưa có tài khoản?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-foreground hover:text-foreground/70 inline-flex items-center gap-1.5 transition-colors"
                >
                  Đăng ký ngay
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </p>
            </form>
          </AuthFormContainer>
        </div>
      </div>
    </AuthLayout>
  );
}