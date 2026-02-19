import { CheckCircle2 } from "lucide-react";

export interface PaymentProofUploadProps {
  proofPreviewUrl: string | null;
  isExpired: boolean;
  isConfirmingPayment: boolean;
  paymentError: string | null;
  paymentSuccess: string | null;
  onFileChange: (file: File | null) => void;
}

export function PaymentProofUpload({
  proofPreviewUrl,
  isExpired,
  isConfirmingPayment,
  paymentError,
  paymentSuccess,
  onFileChange,
}: PaymentProofUploadProps) {
  const disabled = isExpired || isConfirmingPayment;

  return (
    <div className="bg-cream-50 rounded-lg border border-border p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            className="h-5 w-5 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Xác nhận thanh toán</h3>
          <p className="text-xs text-muted-foreground">
            Upload ảnh chụp màn hình chuyển khoản
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <label
          className={`relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
            disabled
              ? "border-gray-200 bg-gray-50 cursor-not-allowed"
              : proofPreviewUrl
                ? "border-green-300 bg-green-50"
                : "border-gray-300 bg-gray-50 hover:border-primary hover:bg-primary/5"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFileChange(e.target.files?.[0] || null)}
            className="hidden"
            disabled={disabled}
          />
          {proofPreviewUrl ? (
            <div className="relative w-full h-full flex items-center justify-center p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={proofPreviewUrl}
                alt="Preview"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              {!disabled && (
                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    Click để thay đổi
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-10 h-10 mb-3 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Click để upload</span> hoặc kéo
                thả
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, WEBP (MAX. 10MB)
              </p>
            </div>
          )}
        </label>

        {paymentError && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <svg
              className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-red-600">{paymentError}</p>
          </div>
        )}
        {paymentSuccess && (
          <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-600">{paymentSuccess}</p>
          </div>
        )}
      </div>
    </div>
  );
}
