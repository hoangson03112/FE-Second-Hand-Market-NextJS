"use client";

import React from "react";
import { IconLock, IconMail, IconPhone, IconUser } from "@tabler/icons-react";

import type { RegisterInput } from "@/schemas/auth.schema";

import {
  AuthAltAction,
  AuthField,
  AuthSubmitButton,
} from "../../components";

interface RegisterFormProps {
  formData: RegisterInput;
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
  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <AuthField
          label="Họ và tên"
          id="fullName"
          name="fullName"
          value={formData.fullName || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Nguyễn Văn A"
          autoComplete="name"
          required
          requiredMark
          icon={<IconUser className="h-[18px] w-[18px]" />}
        />

        <AuthField
          label="Tên đăng nhập"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="nguyen_van_a"
          autoComplete="username"
          required
          requiredMark
          icon={<IconUser className="h-[18px] w-[18px]" />}
        />

        <AuthField
          label="Email"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="email@example.com"
          autoComplete="email"
          required
          requiredMark
          icon={<IconMail className="h-[18px] w-[18px]" />}
        />

        <AuthField
          label="Số điện thoại"
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="0912345678"
          autoComplete="tel"
          required
          requiredMark
          icon={<IconPhone className="h-[18px] w-[18px]" />}
        />

        <AuthField
          label="Mật khẩu"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Tối thiểu 6 ký tự"
          autoComplete="new-password"
          required
          requiredMark
          reveal
          icon={<IconLock className="h-[18px] w-[18px]" />}
        />

        <AuthField
          label="Xác nhận mật khẩu"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleConfirmPasswordChange}
          onBlur={handleBlur}
          placeholder="Nhập lại mật khẩu"
          autoComplete="new-password"
          required
          requiredMark
          reveal
          icon={<IconLock className="h-[18px] w-[18px]" />}
        />
      </div>

      <p className="text-[11px] leading-relaxed text-neutral-500">
        Bằng việc tạo tài khoản, bạn đồng ý với các điều khoản sử dụng và chính
        sách bảo mật của Eco Market.
      </p>

      <AuthSubmitButton label="Tạo tài khoản" isLoading={isLoading} />

      <AuthAltAction
        question="Đã có tài khoản Eco Market?"
        href="/login"
        label="Đăng nhập ngay"
      />
    </form>
  );
}
