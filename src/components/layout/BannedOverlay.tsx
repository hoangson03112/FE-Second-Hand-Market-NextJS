"use client";

import { useState } from "react";
import { useBannedStore } from "@/store/useBannedStore";
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
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gửi khiếu nại thất bại. Vui lòng thử lại.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-luxury-ink/60 backdrop-blur-sm"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="banned-title"
    >
      <div className="mx-4 w-full max-w-md rounded-[2px] border border-luxury-ink/10 bg-white p-6 sm:p-8 shadow-2xl">
        {step === "main" && (
          <>
            <div className="mb-6 flex justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-[2px] border border-luxury-ink/10 bg-cream-50 text-2xl">
                🔒
              </span>
            </div>
            <div className="text-center mb-6 space-y-2">
              <div className="inline-flex items-center gap-2">
                <span className="h-px w-6 bg-luxury-champagne/80" />
                <span className="text-2xs font-bold uppercase tracking-[0.2em] text-neutral-500">
                  Cảnh báo an ninh
                </span>
                <span className="h-px w-6 bg-luxury-champagne/80" />
              </div>
              <h1
                id="banned-title"
                className="font-droid-serif text-xl sm:text-2xl font-bold text-luxury-ink"
              >
                Tài khoản đã bị tạm khóa
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Tài khoản của bạn đã bị quản trị viên khóa do phát hiện vi phạm quy chế hoặc yêu cầu kiểm tra an toàn. Nếu cho rằng đây là nhầm lẫn, vui lòng gửi khiếu nại tới ban quản trị.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleOpenAppealForm}
                className="inline-flex justify-center items-center rounded-[2px] bg-luxury-ink px-4 py-3 text-2xs font-bold uppercase tracking-[0.14em] text-luxury-ivory hover:bg-charcoal-800 transition-all"
              >
                Gửi khiếu nại lên ban quản trị
              </button>
              <button
                type="button"
                onClick={handleGoToLogin}
                className="inline-flex justify-center items-center rounded-[2px] border border-luxury-ink/15 bg-white px-4 py-3 text-2xs font-bold uppercase tracking-[0.14em] text-luxury-ink hover:bg-taupe-50 transition-all"
              >
                Về trang đăng nhập
              </button>
            </div>
          </>
        )}

        {step === "form" && (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 mb-1">
                <span className="h-px w-6 bg-luxury-champagne/80" />
                <span className="text-2xs font-bold uppercase tracking-[0.2em] text-neutral-500">
                  Giải quyết khiếu nại
                </span>
                <span className="h-px w-6 bg-luxury-champagne/80" />
              </div>
              <h2 className="font-droid-serif text-xl font-bold text-luxury-ink">
                Gửi Đơn Khiếu Nại
              </h2>
            </div>
            <form onSubmit={handleSubmitAppeal} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="appeal-email"
                  className="mb-1 block text-2xs font-bold uppercase tracking-[0.14em] text-neutral-600"
                >
                  Email đăng ký <span className="text-blush-600">*</span>
                </label>
                <input
                  id="appeal-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-[2px] border border-luxury-ink/15 bg-white px-3.5 py-2 text-xs text-luxury-ink focus:border-luxury-ink focus:outline-none"
                  placeholder="email@vidu.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="appeal-fullName"
                  className="mb-1 block text-2xs font-bold uppercase tracking-[0.14em] text-neutral-600"
                >
                  Họ và tên
                </label>
                <input
                  id="appeal-fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-[2px] border border-luxury-ink/15 bg-white px-3.5 py-2 text-xs text-luxury-ink focus:border-luxury-ink focus:outline-none"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div>
                <label
                  htmlFor="appeal-message"
                  className="mb-1 block text-2xs font-bold uppercase tracking-[0.14em] text-neutral-600"
                >
                  Nội dung giải trình <span className="text-blush-600">*</span>
                </label>
                <textarea
                  id="appeal-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-[2px] border border-luxury-ink/15 bg-white px-3.5 py-2 text-xs text-luxury-ink focus:border-luxury-ink focus:outline-none"
                  placeholder="Mô tả lý do bạn cho rằng việc khóa tài khoản là nhầm lẫn..."
                  required
                />
              </div>
              {error && (
                <p className="text-xs font-semibold text-blush-700 bg-blush-50 p-2.5 rounded-[2px] border border-blush-200">
                  {error}
                </p>
              )}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleBackFromForm}
                  className="flex-1 rounded-[2px] border border-luxury-ink/15 bg-white px-4 py-2.5 text-2xs font-bold uppercase tracking-[0.14em] text-luxury-ink hover:bg-taupe-50"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-[2px] bg-luxury-ink px-4 py-2.5 text-2xs font-bold uppercase tracking-[0.14em] text-luxury-ivory hover:bg-charcoal-800 disabled:opacity-50"
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
              <span className="flex h-14 w-14 items-center justify-center rounded-[2px] bg-cream-50 border border-luxury-ink/10 text-accent text-2xl font-bold">
                ✓
              </span>
            </div>
            <div className="text-center mb-6 space-y-2">
              <h2 className="font-droid-serif text-xl font-bold text-luxury-ink">
                Đã Gửi Đơn Khiếu Nại
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Ban Quản Trị đã nhận được đơn của bạn và sẽ tiến hành kiểm tra lại lịch sử hoạt động, phản hồi qua email trong vòng 24 giờ.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleBackFromForm}
                className="rounded-[2px] border border-luxury-ink/15 bg-white px-4 py-3 text-2xs font-bold uppercase tracking-[0.14em] text-luxury-ink hover:bg-taupe-50"
              >
                Gửi thêm giải trình
              </button>
              <button
                type="button"
                onClick={handleGoToLogin}
                className="rounded-[2px] bg-luxury-ink px-4 py-3 text-2xs font-bold uppercase tracking-[0.14em] text-luxury-ivory hover:bg-charcoal-800"
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
