"use client";

import { useState } from "react";
import { useBannedStore } from "@/store/useBannedStore";
import { useTokenStore } from "@/store/useTokenStore";
import { AuthService } from "@/services/auth.service";

type Step = "main" | "form" | "success";

export function BannedOverlay() {
  const isBanned = useBannedStore((s) => s.isBanned);
  const setBanned = useBannedStore((s) => s.setBanned);
  const [step, setStep] = useState<Step>("main");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isBanned) return null;

  const handleGoToLogin = () => {
    useTokenStore.getState().clearAuth();
    setBanned(false);
    window.location.href = "/login";
  };

  const handleOpenAppealForm = () => {
    setStep("form");
    setError(null);
  };

  const handleBackFromForm = () => {
    setStep("main");
    setError(null);
    setEmail("");
    setFullName("");
    setMessage("");
  };

  const handleSubmitAppeal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimEmail = email.trim();
    const trimMessage = message.trim();
    if (!trimEmail) {
      setError("Vui lòng nhập email.");
      return;
    }
    if (!trimMessage) {
      setError("Vui lòng nhập nội dung khiếu nại.");
      return;
    }
    setLoading(true);
    try {
      await AuthService.submitAppeal({
        email: trimEmail,
        fullName: fullName.trim() || undefined,
        message: trimMessage,
      });
      setStep("success");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Gửi khiếu nại thất bại. Vui lòng thử lại.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="banned-title"
    >
      <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        {step === "main" && (
          <>
            <div className="mb-6 flex justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-4xl">
                🔒
              </span>
            </div>
            <h1
              id="banned-title"
              className="mb-2 text-center text-xl font-bold text-gray-900"
            >
              Tài khoản đã bị khóa
            </h1>
            <p className="mb-6 text-center text-gray-600">
              Tài khoản của bạn đã bị quản trị viên khóa. Bạn không thể thực hiện
              thao tác trên trang. Nếu cho rằng đây là nhầm lẫn, vui lòng gửi khiếu
              nại đến quản trị viên.
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleOpenAppealForm}
                className="inline-flex justify-center rounded-xl bg-amber-700 px-4 py-3 font-semibold text-white transition hover:bg-amber-800"
              >
                Gửi khiếu nại lên quản trị viên
              </button>
              <button
                type="button"
                onClick={handleGoToLogin}
                className="rounded-xl border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Về trang đăng nhập
              </button>
            </div>
          </>
        )}

        {step === "form" && (
          <>
            <h2 className="mb-4 text-center text-lg font-bold text-gray-900">
              Gửi khiếu nại
            </h2>
            <form onSubmit={handleSubmitAppeal} className="flex flex-col gap-4">
              <div>
                <label htmlFor="appeal-email" className="mb-1 block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="appeal-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="appeal-fullName" className="mb-1 block text-sm font-medium text-gray-700">
                  Họ tên
                </label>
                <input
                  id="appeal-fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div>
                <label htmlFor="appeal-message" className="mb-1 block text-sm font-medium text-gray-700">
                  Nội dung khiếu nại <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="appeal-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
                  placeholder="Mô tả lý do bạn cho rằng việc khóa tài khoản là nhầm lẫn..."
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleBackFromForm}
                  className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-xl bg-amber-700 px-4 py-3 font-semibold text-white hover:bg-amber-800 disabled:opacity-50"
                >
                  {loading ? "Đang gửi..." : "Gửi khiếu nại"}
                </button>
              </div>
            </form>
          </>
        )}

        {step === "success" && (
          <>
            <div className="mb-4 flex justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-4xl">
                ✓
              </span>
            </div>
            <h2 className="mb-2 text-center text-lg font-bold text-gray-900">
              Đã gửi khiếu nại
            </h2>
            <p className="mb-6 text-center text-gray-600">
              Chúng tôi đã nhận được khiếu nại của bạn và sẽ xem xét, liên hệ lại qua email trong thời gian sớm nhất.
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleBackFromForm}
                className="rounded-xl border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
              >
                Quay lại
              </button>
              <button
                type="button"
                onClick={handleGoToLogin}
                className="rounded-xl bg-amber-700 px-4 py-3 font-semibold text-white hover:bg-amber-800"
              >
                Về trang đăng nhập
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
