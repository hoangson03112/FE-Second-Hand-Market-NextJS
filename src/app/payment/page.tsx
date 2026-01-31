"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { OrderService, type SellerBankInfo } from "@/services/order.service";
import { CheckCircle2 } from "lucide-react";
import axiosClient from "@/lib/axios";
import { formatPrice } from "@/utils/format/price";
import { Copy, ArrowLeft, QrCode, Building2, Clock } from "lucide-react";
import Link from "next/link";

const PAYMENT_WINDOW_MINUTES = 15;

type OrderLite = {
  _id: string;
  totalAmount: number;
  createdAt: string;
  paymentMethod?: string;
};

const BANK_CODE_MAP: Record<string, string> = {
  "Vietcombank": "VCB",
  "VietinBank": "CTG",
  "BIDV": "BID",
  "Agribank": "VBA",
  "Techcombank": "TCB",
  "MBBank": "MBB",
  "ACB": "ACB",
  "VPBank": "VPB",
  "TPBank": "TPB",
  "HDBank": "HDB",
  "VietABank": "VAB",
  "SHB": "SHB",
  "Eximbank": "EIB",
  "MSB": "MSB",
  "OCB": "OCB",
  "SCB": "SCB",
  "VIB": "VIB",
  "SeABank": "SEA",
  "PGBank": "PGB",
  "NamABank": "NAB",
  "BacABank": "BAB",
  "PVcomBank": "PVC",
  "GPBank": "GPB",
  "ABBank": "ABB",
  "VietBank": "VCC",
  "KienLongBank": "KLB",
  "PublicBank": "PBV",
  "NCB": "NCB",
  "OceanBank": "OCE",
  "LienVietPostBank": "LPB",
  "DongABank": "DAB",
  "NABank": "NASB",
  "SaigonBank": "SGB",
  "HongLeongBank": "HLB",
  "IndovinaBank": "IVB",
  "WooriBank": "WVB",
  "UnitedOverseasBank": "UOB",
  "StandardCharteredBank": "SCB",
  "HSBC": "HSB",
  "ANZBank": "ANZ",
  "ShinhanBank": "SHB",
};

function getBankCode(bankName: string): string {
  // Try exact match first
  if (BANK_CODE_MAP[bankName]) {
    return BANK_CODE_MAP[bankName];
  }
  // Try case-insensitive match
  const upperBankName = bankName.toUpperCase();
  for (const [key, value] of Object.entries(BANK_CODE_MAP)) {
    if (key.toUpperCase() === upperBankName) {
      return value;
    }
  }
  // Default fallback - return first 3 uppercase letters
  return bankName.substring(0, 3).toUpperCase();
}

function generateVietQRImageUrl(bankInfo: SellerBankInfo): string {
  const bankCode = getBankCode(bankInfo.bankName);
  const amount = Math.round(bankInfo.amount);
  const content = encodeURIComponent(bankInfo.content);
  
  // Remove spaces and special characters from account number
  const cleanAccountNumber = bankInfo.accountNumber.replace(/\s+/g, "");
  
  // VietQR API format: https://img.vietqr.io/image/{bankCode}-{accountNumber}-compact2.png?amount={amount}&addInfo={content}
  const url = `https://img.vietqr.io/image/${bankCode}-${cleanAccountNumber}-compact2.png?amount=${amount}&addInfo=${content}`;
  
  console.log("Generating VietQR URL:", {
    bankName: bankInfo.bankName,
    bankCode,
    accountNumber: cleanAccountNumber,
    amount,
    content,
    url,
  });
  
  return url;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function formatCountdown(secondsLeft: number | null) {
  if (secondsLeft === null) return "--:--";
  const mm = Math.floor(secondsLeft / 60);
  const ss = secondsLeft % 60;
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (!isRecord(error)) return fallback;

  const response = error.response;
  if (isRecord(response)) {
    const data = response.data;
    if (isRecord(data) && typeof data.message === "string" && data.message) {
      return data.message;
    }
  }

  if (typeof error.message === "string" && error.message) return error.message;
  return fallback;
}

function toOrderLite(value: unknown): OrderLite | null {
  if (!isRecord(value)) return null;

  const _id = value._id;
  const totalAmount = value.totalAmount;
  const createdAt = value.createdAt;
  const paymentMethod = value.paymentMethod;

  if (typeof createdAt !== "string" || !createdAt) return null;

  return {
    _id: typeof _id === "string" ? _id : String(_id ?? ""),
    totalAmount:
      typeof totalAmount === "number" ? totalAmount : Number(totalAmount ?? 0),
    createdAt,
    paymentMethod: typeof paymentMethod === "string" ? paymentMethod : undefined,
  };
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<OrderLite | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreviewUrl, setProofPreviewUrl] = useState<string | null>(null);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const [bankInfo, setBankInfo] = useState<SellerBankInfo | null>(null);
  const [bankInfoLoading, setBankInfoLoading] = useState(true);
  const [bankInfoError, setBankInfoError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await OrderService.getById(orderId);
        const normalized = toOrderLite(response.order);
        if (!normalized) {
          throw new Error("Dữ liệu đơn hàng không hợp lệ.");
        }
        setOrder(normalized);
      } catch (error) {
        console.error("Error fetching order:", error);
        alert(getErrorMessage(error, "Không thể tải thông tin đơn hàng"));
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchBankInfo = async () => {
      if (!orderId) return;
      setBankInfoLoading(true);
      setBankInfoError(null);
      try {
        const info = await OrderService.getSellerBankInfo(orderId);
        console.log("Fetched bank info:", info);
        setBankInfo(info);
      } catch (error) {
        console.error("Error fetching bank info:", error);
        setBankInfoError(
          getErrorMessage(error, "Không thể tải thông tin ngân hàng")
        );
      } finally {
        setBankInfoLoading(false);
      }
    };

    fetchOrder();
    fetchBankInfo();
  }, [orderId, router]);

  const expiresAt = useMemo(() => {
    if (!order?.createdAt) return null;
    const createdAt = new Date(order.createdAt).getTime();
    return createdAt + PAYMENT_WINDOW_MINUTES * 60 * 1000;
  }, [order?.createdAt]);

  useEffect(() => {
    if (!expiresAt) return;

    const tick = () => {
      const diffMs = expiresAt - Date.now();
      const seconds = Math.max(0, Math.floor(diffMs / 1000));
      setSecondsLeft(seconds);

      // Auto cancel order and redirect when expired (only once)
      if (seconds === 0 && orderId && order && !isCancelling) {
        setIsCancelling(true);
        const cancelOrder = async () => {
          try {
            await OrderService.updateStatus(
              orderId,
              "cancelled",
              "Đơn hàng bị hủy do hết thời gian thanh toán"
            );
          } catch (error) {
            console.error("Error cancelling expired order:", error);
          } finally {
            // Redirect to home after cancellation
            router.push("/");
          }
        };
        cancelOrder();
      }
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [expiresAt, orderId, order, router, isCancelling]);

  // Use fetched bankInfo or fallback
  const displayBankInfo = bankInfo || {
    bankName: "Đang tải...",
    accountNumber: "...",
    accountHolder: "...",
    amount: order?.totalAmount || 0,
    content: orderId ? `THANH TOAN DON HANG ${orderId}` : "",
    orderId: orderId || "",
  };

  const qrCodeImageUrl = useMemo(() => {
    if (!bankInfo) return "";
    const url = generateVietQRImageUrl(bankInfo);
    console.log("QR Code URL:", url);
    console.log("Bank Info:", bankInfo);
    return url;
  }, [bankInfo]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore (some browsers block clipboard without user gesture)
    }
  };

  const isExpired = secondsLeft !== null && secondsLeft <= 0;

  useEffect(() => {
    if (!proofFile) {
      setProofPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(proofFile);
    setProofPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [proofFile]);

  const handleConfirmPayment = async () => {
    if (!orderId) return;
    if (isExpired) {
      setPaymentError("Đã hết thời gian thanh toán cho đơn này.");
      return;
    }

    setIsConfirmingPayment(true);
    setPaymentError(null);
    setPaymentSuccess(null);

    try {
      // Nếu có ảnh, gửi ảnh trước (optional)
      if (proofFile && bankInfo) {
        try {
          const form = new FormData();
          form.append("orderId", orderId);
          form.append("bankName", bankInfo.bankName);
          form.append("accountNumber", bankInfo.accountNumber);
          form.append("accountHolder", bankInfo.accountHolder);
          form.append("proof", proofFile);

          await axiosClient.post("/bank-info/payment-proof", form);
        } catch (error) {
          // Nếu upload ảnh thất bại, vẫn tiếp tục confirm payment
          console.error("Error uploading proof:", error);
        }
      }

      // Xác nhận thanh toán
      await OrderService.confirmPayment(orderId);
      setPaymentSuccess(
        "Đã xác nhận thanh toán thành công. Đơn hàng của bạn đang được xử lý."
      );
      setProofFile(null);
      
      // Redirect sau 2 giây
      setTimeout(() => {
        router.push(`/orders/${orderId}`);
      }, 2000);
    } catch (error) {
      setPaymentError(
        getErrorMessage(error, "Không thể xác nhận thanh toán. Vui lòng thử lại.")
      );
    } finally {
      setIsConfirmingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Thanh toán đơn hàng
              </h1>
              <p className="text-sm text-muted-foreground">
                Mã đơn hàng: <span className="font-mono font-semibold text-foreground">{orderId}</span>
              </p>
            </div>

            {/* Timer - Redesigned */}
            <div className={`inline-flex items-center gap-3 rounded-xl px-5 py-4 border-2 transition-all ${
              isExpired 
                ? "bg-red-50 border-red-200 shadow-lg shadow-red-100" 
                : secondsLeft !== null && secondsLeft <= 300
                ? "bg-orange-50 border-orange-200 shadow-lg shadow-orange-100 animate-pulse"
                : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-md"
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isExpired 
                  ? "bg-red-100" 
                  : secondsLeft !== null && secondsLeft <= 300
                  ? "bg-orange-100"
                  : "bg-blue-100"
              }`}>
                <Clock className={`h-5 w-5 ${
                  isExpired 
                    ? "text-red-600" 
                    : secondsLeft !== null && secondsLeft <= 300
                    ? "text-orange-600"
                    : "text-blue-600"
                }`} />
              </div>
              <div>
                <p className={`text-xs font-medium ${
                  isExpired 
                    ? "text-red-600" 
                    : secondsLeft !== null && secondsLeft <= 300
                    ? "text-orange-600"
                    : "text-muted-foreground"
                }`}>
                  {isExpired ? "Đã hết hạn" : "Thời gian còn lại"}
                </p>
                <p className={`text-xl font-bold ${
                  isExpired 
                    ? "text-red-600" 
                    : secondsLeft !== null && secondsLeft <= 300
                    ? "text-orange-600"
                    : "text-blue-600"
                }`}>
                  {formatCountdown(secondsLeft)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - QR Code & Order Summary */}
          <div className="space-y-6">
            {/* QR Code */}
            <div className="bg-white rounded-lg border border-border p-6">
              <h2 className="font-semibold text-foreground mb-4 text-center">
                Quét QR để thanh toán
              </h2>
              <div className="flex justify-center mb-4">
                {bankInfoLoading ? (
                  <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                  </div>
                ) : bankInfoError ? (
                  <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border p-4">
                    <p className="text-sm text-red-600 text-center">
                      {bankInfoError}
                    </p>
                  </div>
                ) : bankInfo && qrCodeImageUrl ? (
                  <div className="w-94 bg-white rounded-lg flex items-center justify-center border-2 border-border">
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
                      onLoad={() => {
                        console.log("QR Code image loaded successfully:", qrCodeImageUrl);
                      }}
                    />
                  </div>
                ) : bankInfo ? (
                  <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border p-4">
                    <p className="text-sm text-muted-foreground text-center">
                      Đang tạo QR code...
                    </p>
                  </div>
                ) : (
                  <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                    <QrCode className="h-32 w-32 text-muted-foreground opacity-50" />
                  </div>
                )}
              </div>
              {qrCodeImageUrl && bankInfo && (
                <p className="text-xs text-center text-muted-foreground">
                  Quét mã QR để tự động điền thông tin chuyển khoản
                </p>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg border border-border p-6">
              <h2 className="font-semibold text-foreground mb-4">Thông tin đơn hàng</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tổng tiền hàng:</span>
                  <span className="font-medium">{formatPrice(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="text-lg font-semibold">Tổng thanh toán:</span>
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Bank Info & Actions */}
          <div className="space-y-6">
            {/* Bank Transfer Info */}
            <div className="bg-white rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="font-semibold text-foreground">
                  Thông tin chuyển khoản
                </h2>
              </div>

              {bankInfoLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                </div>
              ) : bankInfoError ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{bankInfoError}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm text-muted-foreground">Ngân hàng:</span>
                    <span className="font-medium">{displayBankInfo.bankName}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm text-muted-foreground">Số tài khoản:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium font-mono">
                        {displayBankInfo.accountNumber}
                      </span>
                      <button
                        onClick={() => handleCopy(displayBankInfo.accountNumber)}
                        className="p-1 hover:bg-background rounded transition-colors"
                        title="Sao chép"
                      >
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm text-muted-foreground">Chủ tài khoản:</span>
                    <span className="font-medium text-right max-w-[200px] truncate">
                      {displayBankInfo.accountHolder}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm text-muted-foreground">Số tiền:</span>
                    <span className="font-bold text-primary">
                      {formatPrice(displayBankInfo.amount)}
                    </span>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-sm text-muted-foreground">Nội dung:</span>
                      <button
                        onClick={() => handleCopy(displayBankInfo.content)}
                        className="p-1 hover:bg-background rounded transition-colors flex-shrink-0"
                        title="Sao chép"
                      >
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                    <p className="font-medium text-xs break-all">
                      {displayBankInfo.content}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Upload proof - Redesigned */}
            <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
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
                {/* File Input - Improved */}
                <label
                  className={`relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    isExpired || isConfirmingPayment
                      ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                      : proofFile
                      ? "border-green-300 bg-green-50"
                      : "border-gray-300 bg-gray-50 hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      setPaymentError(null);
                      setPaymentSuccess(null);
                      setProofFile(e.target.files?.[0] || null);
                    }}
                    className="hidden"
                    disabled={isExpired || isConfirmingPayment}
                  />
                  {proofPreviewUrl ? (
                    <div className="relative w-full h-full flex items-center justify-center p-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={proofPreviewUrl}
                        alt="Preview"
                        className="max-w-full max-h-full object-contain rounded-lg"
                      />
                      {!isExpired && !isConfirmingPayment && (
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
                        <span className="font-semibold">Click để upload</span> hoặc kéo thả
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, WEBP (MAX. 10MB)
                      </p>
                    </div>
                  )}
                </label>

                {/* Status Messages */}
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

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Lưu ý:</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Vui lòng chuyển khoản đúng số tiền và nội dung như trên</li>
                <li>Đơn hàng sẽ được xử lý sau khi nhận được thanh toán</li>
                <li>Thời gian xử lý: 1-2 giờ làm việc</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/"
                className="flex-1 btn btn-outline py-3 text-center"
              >
                Về trang chủ
              </Link>
              <button
                onClick={handleConfirmPayment}
                disabled={isExpired || isConfirmingPayment}
                className={`flex-1 btn py-3 transition-all ${
                  isExpired || isConfirmingPayment
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "btn-primary"
                }`}
              >
                {isConfirmingPayment ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Đã thanh toán
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
