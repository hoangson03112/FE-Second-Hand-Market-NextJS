"use client";

import { useSearchParams } from "next/navigation";
import { useResetPassword } from "./hooks/useResetPassword";
import ResetPasswordForm from "./components/ResetPasswordForm";
import ResetPasswordSuccess from "./components/ResetPasswordSuccess";
import InvalidTokenError from "./components/InvalidTokenError";
import { resetPasswordFeatures } from "@/constants/auth.features";
import { Background } from "@/features/auth/components";
import Image from "next/image";
import Link from "next/link";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    isSuccess,
    isCheckingToken,
    isTokenInvalid,
    invalidTokenMessage,
    handleSubmit,
  } = useResetPassword({ token });

  if (!token || isTokenInvalid) {
    return (
      <Background>
        <div className="flex-1 flex items-center justify-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-8xl mx-auto">
            <div className="relative min-h-[85vh] w-full flex items-center justify-center overflow-hidden">
              <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-24 items-center w-full max-w-6xl relative z-10">
                <div className="flex flex-col justify-center px-2 lg:px-0 pointer-events-none">
                  <h1
                    className="mb-8 text-luxury-ink drop-shadow-sm"
                    style={{ fontFamily: "var(--font-droid-serif), serif", fontSize: "clamp(3rem, 6vw, 5.5rem)", fontWeight: 300, lineHeight: 1.05, letterSpacing: "-0.03em" }}
                  >
                    Lỗi <br /> <span className="text-accent" style={{ letterSpacing: "-0.02em", fontStyle: "italic" }}>không hợp lệ</span>
                  </h1>
                  <p className="text-lg md:text-xl mb-12 max-w-md text-foreground/70 font-medium">
                    Link reset mật khẩu không đúng hoặc đã hết hạn.
                  </p>
                </div>
                <div className="w-full">
                  <div className="bg-white/90 backdrop-blur-md border border-gray-100 rounded-3xl shadow-2xl shadow-taupe-900/10 p-8 sm:p-10 lg:p-12 space-y-8">
                    <div className="space-y-1 text-center">
                      <h2 style={{ fontFamily: "var(--font-droid-serif), serif", fontWeight: 300, lineHeight: 1.05, letterSpacing: "-0.03em" }} className="text-4xl mb-8 text-luxury-ink">Liên kết đặt lại đã hết hạn</h2>
                      <p className="text-taupe-600">Bạn có thể yêu cầu một liên kết mới để tiếp tục đổi mật khẩu.</p>
                    </div>
                    <InvalidTokenError message={invalidTokenMessage} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Background>
    );
  }

  return (
    <Background>
      <div className="flex-1 flex items-center justify-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-8xl mx-auto">
          <div className="relative min-h-[85vh] w-full flex items-center justify-center overflow-hidden">
            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-24 items-center w-full max-w-6xl relative z-10">
              
              <div className="flex flex-col justify-center px-2 lg:px-0 pointer-events-none">
                <h1
                  className="mb-8 text-luxury-ink drop-shadow-sm"
                  style={{ fontFamily: "var(--font-droid-serif), serif", fontSize: "clamp(3rem, 6vw, 5.5rem)", fontWeight: 300, lineHeight: 1.05, letterSpacing: "-0.03em" }}
                >
                  {isSuccess ? "Thành" : "Đổi"} <br />
                  <span className="text-accent" style={{ letterSpacing: "-0.02em", fontStyle: "italic" }}>
                    {isSuccess ? "công!" : "mật khẩu mới"}
                  </span>
                </h1>

                <p className="text-lg md:text-xl mb-12 max-w-md text-foreground/70 font-medium">
                  {isSuccess
                    ? "Mật khẩu của bạn đã được thay đổi thành công."
                    : "Tạo mật khẩu mới và bảo mật tài khoản của bạn."}
                </p>

                <div className="space-y-6 hidden md:block">
                  {resetPasswordFeatures.map((feature: any, idx: number) => (
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

              <div className="w-full">
                <div className="lg:hidden flex justify-center mb-8">
                  <Link href="/" className="inline-block">
                    <Image src="https://res.cloudinary.com/dqvtj4uxo/image/upload/v1755696284/logi_ov2gbl.png" alt="Eco Market" width={100} height={100} className="h-16 w-auto" priority />
                  </Link>
                </div>
                <div className="bg-white/90 backdrop-blur-md border border-gray-100 rounded-3xl shadow-2xl shadow-taupe-900/10 p-8 sm:p-10 lg:p-12 space-y-8">
                  <div className="space-y-1 text-center">
                    <h2 style={{ fontFamily: "var(--font-droid-serif), serif", fontWeight: 300, lineHeight: 1.05, letterSpacing: "-0.03em" }} className="text-4xl mb-8 text-luxury-ink">
                      {isSuccess ? "Đổi mật khẩu thành công" : "Đặt mật khẩu mới"}
                    </h2>
                    <p className="text-taupe-600">
                      {isSuccess
                        ? "Bạn có thể đăng nhập với mật khẩu mới"
                        : isCheckingToken
                          ? "Đang kiểm tra tính hợp lệ của liên kết..."
                          : "Nhập mật khẩu mới cho tài khoản của bạn"}
                    </p>
                  </div>
                  
                  {isCheckingToken ? (
                    <div className="py-8 text-center text-taupe-600">
                      Đang xác thực liên kết đặt lại mật khẩu...
                    </div>
                  ) : isSuccess ? (
                    <ResetPasswordSuccess />
                  ) : (
                    <ResetPasswordForm
                      newPassword={newPassword}
                      confirmPassword={confirmPassword}
                      isLoading={isLoading}
                      onNewPasswordChange={setNewPassword}
                      onConfirmPasswordChange={setConfirmPassword}
                      onSubmit={handleSubmit}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Background>
  );
}
