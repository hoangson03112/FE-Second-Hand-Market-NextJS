import { IconQrcode } from "@tabler/icons-react";

export interface PaymentQrSectionProps {
  bankInfoLoading: boolean;
  bankInfoError: string | null;
  bankInfo: { bankName: string } | null;
  qrCodeImageUrl: string;
}

export function PaymentQrSection({
  bankInfoLoading,
  bankInfoError,
  bankInfo,
  qrCodeImageUrl,
}: PaymentQrSectionProps) {
  return (
    <div className="bg-gradient-to-br from-cream-50 to-white rounded-2xl border-2 border-border p-6 shadow-md">
      <h2 className="font-semibold text-taupe-900 mb-4 text-center uppercase tracking-wide text-sm">
        Quét QR để thanh toán
      </h2>
      <div className="flex justify-center mb-4">
        {bankInfoLoading ? (
          <div className="w-64 h-64 bg-taupe-100 rounded-xl flex items-center justify-center border-2 border-dashed border-border">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
          </div>
        ) : bankInfoError ? (
          <div className="w-64 h-64 bg-taupe-100 rounded-xl flex items-center justify-center border-2 border-dashed border-border p-4">
            <p className="text-sm text-red-600 text-center">{bankInfoError}</p>
          </div>
        ) : bankInfo && qrCodeImageUrl ? (
          <div className="w-94 bg-white rounded-xl flex items-center justify-center border-2 border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrCodeImageUrl}
              alt="QR Code thanh toán"
              className="w-full h-full object-contain"
              crossOrigin="anonymous"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML =
                    '<div class="w-full h-full flex items-center justify-center p-4"><p class="text-sm text-red-600 text-center">Không thể tải QR code. Vui lòng kiểm tra lại thông tin ngân hàng.</p></div>';
                }
              }}
            />
          </div>
        ) : bankInfo ? (
          <div className="w-64 h-64 bg-taupe-100 rounded-xl flex items-center justify-center border-2 border-dashed border-border p-4">
            <p className="text-sm text-taupe-500 text-center">
              Đang tạo QR code...
            </p>
          </div>
        ) : (
          <div className="w-64 h-64 bg-taupe-100 rounded-xl flex items-center justify-center border-2 border-dashed border-border">
            <IconQrcode className="h-32 w-32 text-taupe-300" />
          </div>
        )}
      </div>
      {qrCodeImageUrl && bankInfo && (
        <p className="text-xs text-center text-taupe-500">
          Quét mã QR để tự động điền thông tin chuyển khoản
        </p>
      )}
    </div>
  );
}
