"use client";

import { useVerify } from "./hooks/useVerify";
import { EmailVerifyIcon } from "@/components/shared";
import VerifyForm from "./components/VerifyForm";

export default function Verify() {
  const {
    accountID,
    code,
    setCode,
    error,
    setError,
    isLoading,
    resendLoading,
    resendSuccess,
    handleSubmit,
    handleResend,
  } = useVerify();

  if (!accountID) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-50 via-white to-cream-50 p-4 lg:p-8">
      <div className="w-full max-w-md">
        <div className="bg-cream-50/95 backdrop-blur-xl rounded-3xl shadow-xl border-2 border-border p-8 lg:p-10">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary flex items-center justify-center">
              <EmailVerifyIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-taupe-900 mb-2">
              Xác thực email
            </h2>
            <p className="text-taupe-500">
              Chúng tôi đã gửi mã xác thực 6 số đến email của bạn
            </p>
          </div>

          <VerifyForm
            code={code}
            onCodeChange={setCode}
            error={error}
            onClearError={() => setError("")}
            isLoading={isLoading}
            resendSuccess={resendSuccess}
            resendLoading={resendLoading}
            onSubmit={handleSubmit}
            onResend={handleResend}
          />
        </div>
      </div>
    </div>
  );
}