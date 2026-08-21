"use client";

import { useEffect, useState } from "react";
import { IconAlertTriangle, IconQrcode } from "@tabler/icons-react";
import { Eyebrow } from "@/features/order/components";

export interface PaymentQrSectionProps {
  bankInfoLoading: boolean;
  bankInfoError: string | null;
  bankInfo: { bankName: string } | null;
  qrCodeImageUrl: string;
}

/** Fixed square frame so the QR never collapses or overflows its panel. */
const frame =
  "flex aspect-square w-full max-w-[300px] items-center justify-center rounded-[2px] border p-4";

export function PaymentQrSection({
  bankInfoLoading,
  bankInfoError,
  bankInfo,
  qrCodeImageUrl,
}: PaymentQrSectionProps) {
  // The previous version wrote `parent.innerHTML` from the img onError handler,
  // mutating DOM that React owns. Track the failure in state instead.
  const [hasImageError, setHasImageError] = useState(false);

  useEffect(() => {
    setHasImageError(false);
  }, [qrCodeImageUrl]);

  const renderBody = () => {
    if (bankInfoLoading) {
      return (
        <div
          className={`${frame} border-dashed border-luxury-ink/15 bg-cream-50`}
        >
          <span className="h-4 w-4 animate-spin rounded-full border border-luxury-ink/20 border-t-luxury-ink" />
        </div>
      );
    }

    if (bankInfoError) {
      return (
        <div className={`${frame} border-blush-300 bg-blush-50`}>
          <div className="text-center">
            <IconAlertTriangle className="mx-auto h-5 w-5 text-blush-700" />
            <p className="mt-3 text-xs leading-relaxed text-blush-800">
              {bankInfoError}
            </p>
          </div>
        </div>
      );
    }

    if (bankInfo && qrCodeImageUrl && !hasImageError) {
      return (
        <div className={`${frame} border-luxury-ink/10 bg-white`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrCodeImageUrl}
            alt="Mã QR thanh toán"
            className="h-full w-full object-contain"
            crossOrigin="anonymous"
            onError={() => setHasImageError(true)}
          />
        </div>
      );
    }

    if (bankInfo && hasImageError) {
      return (
        <div className={`${frame} border-blush-300 bg-blush-50`}>
          <div className="text-center">
            <IconAlertTriangle className="mx-auto h-5 w-5 text-blush-700" />
            <p className="mt-3 text-xs leading-relaxed text-blush-800">
              Không thể tải mã QR. Vui lòng chuyển khoản thủ công theo thông tin
              bên dưới.
            </p>
          </div>
        </div>
      );
    }

    if (bankInfo) {
      return (
        <div
          className={`${frame} border-dashed border-luxury-ink/15 bg-cream-50`}
        >
          <p className="text-2xs font-bold uppercase tracking-[0.22em] text-neutral-500">
            Đang tạo mã QR
          </p>
        </div>
      );
    }

    return (
      <div
        className={`${frame} border-dashed border-luxury-ink/15 bg-cream-50`}
      >
        <IconQrcode className="h-20 w-20 text-luxury-ink/15" strokeWidth={1} />
      </div>
    );
  };

  const showHint = Boolean(bankInfo && qrCodeImageUrl && !hasImageError);

  return (
    <section className="rounded-[2px] border border-luxury-ink/10 bg-white px-5 py-6 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Cách nhanh nhất</Eyebrow>
          <h2 className="font-droid-serif mt-3 text-lg tracking-tight text-luxury-ink">
            Quét mã để chuyển khoản
          </h2>
        </div>
        {bankInfo?.bankName ? (
          <span className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-500">
            {bankInfo.bankName}
          </span>
        ) : null}
      </div>

      <div className="mt-7 flex justify-center">{renderBody()}</div>

      {showHint ? (
        <p className="mt-6 text-center text-xs leading-relaxed text-neutral-600">
          Mở ứng dụng ngân hàng, quét mã và toàn bộ thông tin chuyển khoản sẽ
          được điền tự động.
        </p>
      ) : null}
    </section>
  );
}
