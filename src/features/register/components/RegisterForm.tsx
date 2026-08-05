import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  UserIcon,
  EmailIcon,
  PhoneIcon,
  ArrowRightIcon,
} from "@/components/shared";

interface RegisterFormProps {
  formData: any;
  isLoading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function RegisterForm({
  formData,
  isLoading,
  handleChange,
  handleConfirmPasswordChange,
  handleBlur,
  handleSubmit,
}: RegisterFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  return (
    <form className="space-y-7 mt-4" onSubmit={handleSubmit}>
      <div className="space-y-5">
        {/* Full Name Field */}
        <div className="space-y-2">
          <label
            htmlFor="fullName"
            className="block text-[14px] font-semibold text-taupe-900"
          >
            Họ và tên <span className="text-destructive ml-1">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <UserIcon />
            </div>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="VD: Nguyễn Văn A"
              required
              className="pl-12 pr-4 py-6 border-foreground/20 focus-visible:border-foreground focus-visible:ring-foreground/10 transition-all text-foreground bg-transparent placeholder:text-foreground/40 text-[15px] rounded-xl"
            />
          </div>
        </div>

        {/* Username Field */}
        <div className="space-y-2">
          <label
            htmlFor="username"
            className="block text-[14px] font-semibold text-taupe-900"
          >
            Tên đăng nhập <span className="text-destructive ml-1">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <UserIcon />
            </div>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="VD: nguyen_van_a"
              required
              className="pl-12 pr-4 py-6 border-foreground/20 focus-visible:border-foreground focus-visible:ring-foreground/10 transition-all text-foreground bg-transparent placeholder:text-foreground/40 text-[15px] rounded-xl"
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-[14px] font-semibold text-taupe-900"
          >
            Email <span className="text-destructive ml-1">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <EmailIcon />
            </div>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="VD: email@example.com"
              required
              className="pl-12 pr-4 py-6 border-foreground/20 focus-visible:border-foreground focus-visible:ring-foreground/10 transition-all text-foreground bg-transparent placeholder:text-foreground/40 text-[15px] rounded-xl"
            />
          </div>
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <label
            htmlFor="phoneNumber"
            className="block text-[14px] font-semibold text-taupe-900"
          >
            Số điện thoại <span className="text-destructive ml-1">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <PhoneIcon />
            </div>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="VD: 0912345678"
              required
              className="pl-12 pr-4 py-6 border-foreground/20 focus-visible:border-foreground focus-visible:ring-foreground/10 transition-all text-foreground bg-transparent placeholder:text-foreground/40 text-[15px] rounded-xl"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-[14px] font-semibold text-taupe-900"
          >
            Mật khẩu <span className="text-destructive ml-1">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-foreground">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Tối thiểu 6 ký tự"
              required
              className="pl-12 pr-12 py-6 border-foreground/20 focus-visible:border-foreground focus-visible:ring-foreground/10 transition-all text-foreground bg-transparent placeholder:text-foreground/40 text-[15px] rounded-xl"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-foreground hover:text-primary transition-colors"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0L3 12m3.29-5.71L12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="block text-[14px] font-semibold text-taupe-900"
          >
            Xác nhận mật khẩu <span className="text-destructive ml-1">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-foreground">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleConfirmPasswordChange}
              onBlur={handleBlur}
              placeholder="Nhập lại mật khẩu"
              required
              className="pl-12 pr-12 py-6 border-foreground/20 focus-visible:border-foreground focus-visible:ring-foreground/10 transition-all text-foreground bg-transparent placeholder:text-foreground/40 text-[15px] rounded-xl"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-foreground hover:text-primary transition-colors"
              aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showConfirmPassword ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0L3 12m3.29-5.71L12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="group relative flex w-full items-center justify-center px-12 py-4 text-sm font-medium uppercase tracking-[0.25em] text-background bg-foreground transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 mt-8"
        style={{ borderRadius: "3px" }}
      >
        <div className="absolute inset-0 bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md rounded-lg" />
        <span className="relative z-10 flex items-center gap-2">
          {isLoading ? "Đang xử lý..." : "Đăng ký"}
          {!isLoading && <ArrowRightIcon className="w-5 h-5" />}
        </span>
      </button>

      <p className="text-center text-[15px] text-foreground/70 mt-6">
        Đã có tài khoản?{" "}
        <Link
          href="/login"
          className="font-semibold text-foreground hover:text-foreground/70 inline-flex items-center gap-1.5 transition-colors"
        >
          Đăng nhập ngay
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </p>
    </form>
  );
}
