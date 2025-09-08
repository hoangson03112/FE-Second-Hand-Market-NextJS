"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Error Content */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Đã có lỗi xảy ra
          </h1>
          <p className="text-gray-600 mb-6">
            Xin lỗi, có lỗi bất ngờ đã xảy ra. Vui lòng thử lại hoặc liên hệ hỗ
            trợ nếu vấn đề vẫn tiếp tục.
          </p>

          {/* Error Details */}
          {process.env.NODE_ENV === "development" && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">
                Chi tiết lỗi:
              </h3>
              <p className="text-xs text-gray-600 font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-gray-500 mt-2">ID: {error.digest}</p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={reset}
              className="flex-1 bg-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200"
            >
              Thử lại
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200"
            >
              Về trang chủ
            </button>
          </div>

          {/* Support Link */}
          <p className="text-sm text-gray-500 mt-6">
            Cần hỗ trợ?{" "}
            <a
              href="/contact"
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Liên hệ với chúng tôi
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}


