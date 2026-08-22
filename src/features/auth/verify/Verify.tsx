"use client";

import { AuthEditorialPanel, AuthFormHeader, AuthShell } from "../components";
import { VERIFY_HIGHLIGHTS } from "../constants";
import { useVerify } from "./hooks/useVerify";
import VerifyForm from "./components/VerifyForm";

export default function Verify() {
  const {
    verificationToken,
    maskedEmail,
    code,
    setCode,
    error,
    setError,
    isLoading,
    resendLoading,
    resendSuccess,
    resendMessage,
    cooldown,
    handleSubmit,
    handleResend,
  } = useVerify();

  if (!verificationToken) {
    return null;
  }

  return (
    <AuthShell
      panel={
        <AuthEditorialPanel
          eyebrow="Bước cuối cùng"
          title={
            <>
              Xác nhận rằng
              <span className="block text-accent">đó là bạn.</span>
            </>
          }
          description="Một mã gồm sáu chữ số vừa được gửi tới hộp thư của bạn. Nhập mã để mở khóa tài khoản và bắt đầu hành trình second-hand."
          highlights={VERIFY_HIGHLIGHTS}
        />
      }
    >
      <AuthFormHeader
        eyebrow="Xác thực"
        title={
          <>
            Kiểm tra
            <span className="text-accent"> hộp thư</span>
          </>
        }
        description={
          maskedEmail
            ? `Chúng tôi đã gửi mã xác thực gồm 6 chữ số đến ${maskedEmail}.`
            : "Chúng tôi đã gửi mã xác thực gồm 6 chữ số đến email bạn đã đăng ký."
        }
      />

      <VerifyForm
        code={code}
        onCodeChange={setCode}
        error={error}
        onClearError={() => setError("")}
        isLoading={isLoading}
        resendSuccess={resendSuccess}
        resendMessage={resendMessage || undefined}
        resendLoading={resendLoading}
        cooldown={cooldown}
        onSubmit={handleSubmit}
        onResend={handleResend}
      />
    </AuthShell>
  );
}
