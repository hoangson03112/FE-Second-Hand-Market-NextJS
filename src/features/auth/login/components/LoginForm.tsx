"use client";

import Link from "next/link";
import { IconLock, IconUser } from "@tabler/icons-react";

import {
  AuthAltAction,
  AuthDivider,
  AuthField,
  AuthSubmitButton,
} from "../../components";
import GoogleLoginButton from "./GoogleLoginButton";
import { useLogin } from "../hooks/useLogin";

export default function LoginForm() {
  const {
    formData,
    isLoading,
    rememberMe,
    handleChange,
    setRememberMe,
    handleSubmit,
    handleGoogleLogin,
  } = useLogin();

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-5">
        <AuthField
          label="Email hoặc tên đăng nhập"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="nguyen_van_a hoặc user@example.com"
          autoComplete="username"
          icon={<IconUser className="h-[18px] w-[18px]" />}
        />

        <AuthField
          label="Mật khẩu"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Tối thiểu 6 ký tự"
          autoComplete="current-password"
          reveal
          icon={<IconLock className="h-[18px] w-[18px]" />}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <label className="group flex cursor-pointer items-center gap-2.5 text-xs text-neutral-600 transition-colors hover:text-luxury-ink">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 cursor-pointer rounded-[2px] border border-luxury-ink/25 bg-white/70 accent-[var(--accent)] focus:ring-2 focus:ring-accent/20 focus:ring-offset-0"
          />
          <span>Ghi nhớ đăng nhập</span>
        </label>

        <Link
          href="/forgot-password"
          className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-600 transition-colors hover:text-accent"
        >
          Quên mật khẩu?
        </Link>
      </div>

      <AuthSubmitButton label="Đăng nhập" isLoading={isLoading} />

      <AuthDivider />

      <GoogleLoginButton onClick={handleGoogleLogin} disabled={isLoading} />

      <AuthAltAction
        question="Chưa có tài khoản Eco Market?"
        href="/register"
        label="Đăng ký ngay"
      />
    </form>
  );
}
