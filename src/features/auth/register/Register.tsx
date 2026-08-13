"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useUser } from "@/features/auth/hooks/useUser";

import {
  AuthEditorialPanel,
  AuthFormHeader,
  AuthShell,
} from "../components";
import { REGISTER_HIGHLIGHTS } from "../constants";
import { useRegister } from "./hooks/useRegister";
import RegisterForm from "./components/RegisterForm";

export default function Register() {
  const router = useRouter();
  const { data: account } = useUser();
  const {
    formData,
    isLoading,
    handleChange,
    handleConfirmPasswordChange,
    handleBlur,
    handleSubmit,
  } = useRegister();

  // Nếu đã đăng nhập thì redirect về trang Home
  useEffect(() => {
    if (account) {
      router.replace("/");
    }
  }, [account, router]);

  if (account) {
    return null;
  }

  return (
    <AuthShell
      size="wide"
      panel={
        <AuthEditorialPanel
          eyebrow="Tham gia cộng đồng"
          title={
            <>
              Mỗi món đồ cũ xứng đáng
              <span className="block text-accent">một hành trình mới.</span>
            </>
          }
          description="Tạo tài khoản để mua bán second-hand một cách minh bạch, an toàn và bền vững cùng Eco Market."
          highlights={REGISTER_HIGHLIGHTS}
        />
      }
    >
      <AuthFormHeader
        eyebrow="Đăng ký"
        title={
          <>
            Bắt đầu cùng <span className="text-accent">Eco Market</span>
          </>
        }
        description="Điền thông tin bên dưới để tạo tài khoản của bạn."
      />
      <RegisterForm
        formData={formData}
        isLoading={isLoading}
        handleChange={handleChange}
        handleConfirmPasswordChange={handleConfirmPasswordChange}
        handleBlur={handleBlur}
        handleSubmit={handleSubmit}
      />
    </AuthShell>
  );
}
