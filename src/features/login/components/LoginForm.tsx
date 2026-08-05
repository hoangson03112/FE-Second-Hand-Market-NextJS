import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { UserIcon, ArrowRightIcon } from "@/components/shared";
import GoogleLoginButton from "./GoogleLoginButton";

interface LoginFormProps {
  formData: any;
  isLoading: boolean;
  rememberMe: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setRememberMe: (value: boolean) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleGoogleLogin: () => void;
}

export default function LoginForm({
  formData,
  isLoading,
  rememberMe,
  handleChange,
  setRememberMe,
  handleSubmit,
  handleGoogleLogin,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <form className="space-y-7 mt-4" onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-[14px] font-semibold text-taupe-900">
            Email hoặc tên đăng nhập
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <UserIcon />
            </div>
            <Input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="VD: nguyen_van_a hoặc user@example.com"
              className="pl-12 pr-4 py-6 border-foreground/20 focus-visible:border-foreground focus-visible:ring-foreground/10 transition-all text-foreground bg-transparent placeholder:text-foreground/40 text-[15px] rounded-xl"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-[14px] font-semibold text-taupe-900">
            Mật khẩu
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-foreground">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Tối thiểu 6 ký tự"
              className="pl-12 pr-12 py-6 border-foreground/20 focus-visible:border-foreground focus-visible:ring-foreground/10 transition-all text-foreground bg-transparent placeholder:text-foreground/40 text-[15px] rounded-xl"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-foreground hover:text-primary transition-colors"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0L3 12m3.29-5.71L12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[14px]">
        <label className="flex items-center gap-2.5 cursor-pointer text-foreground/70 hover:text-foreground transition-colors group">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 border-2 border-foreground/30 text-foreground focus:ring-2 focus:ring-foreground/20 focus:ring-offset-0 cursor-pointer rounded-[2px] bg-transparent"
          />
          <span className="font-medium">Ghi nhớ đăng nhập</span>
        </label>
        <Link href="/forgot-password" className="font-semibold text-foreground hover:text-foreground/70 transition-colors">
          Quên mật khẩu?
        </Link>
      </div>

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

      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-foreground/10" />
        <span className="text-foreground/40 text-sm font-medium uppercase tracking-wider">
          Hoặc
        </span>
        <div className="flex-1 h-px bg-foreground/10" />
      </div>

      <div className="hover:scale-[1.01] transition-transform duration-300">
        <GoogleLoginButton onClick={handleGoogleLogin} disabled={isLoading} />
      </div>

      <p className="text-center text-[15px] text-foreground/70">
        Chưa có tài khoản?{" "}
        <Link href="/register" className="font-semibold text-foreground hover:text-foreground/70 inline-flex items-center gap-1.5 transition-colors">
          Đăng ký ngay
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </p>
    </form>
  );
}
